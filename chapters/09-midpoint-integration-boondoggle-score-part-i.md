# Chapter 9 — Midpoint Integration: Boondoggle Score Part I
*When the Pieces That Looked Finished Have to Work Together.*

---

Every submission since Chapter 3 looked small enough to survive on its own. A method prompt here. A repository there. A view that displayed the right data during the demo. Taken one at a time, they were convincing.

Now I want you to put them all on one table.

The method prompt assumes a class that does not exist yet. The view prompt mutates fields the model declared private. The dependency graph places the view before the repository. The pieces that looked finished, placed side by side, reveal that they were built against slightly different pictures of the same system — pictures that agreed on the rough shape but disagreed on the specifics that matter at integration time.

This is not a failure of effort. It is a failure of a particular cognitive task: the task of checking whether the parts agree with each other, rather than whether each part looks reasonable on its own. Those are different operations. You can pass the second while failing the first, and in a multi-component system, failing the first is what causes the system to break.

Chapter 9 is about the first operation.

<!-- → [TABLE: The three opening failures laid out — columns: Component pair, What the author assumed, What the written spec actually said, Failure type. Row 1: Method prompt + model class / Class exists with expected shape / Class not yet specified / Missing prerequisite. Row 2: View prompt + model class / Model fields are mutable / Fields declared private / Visibility violation. Row 3: Dependency graph / View built after repository / View placed before repository in graph / Dependency order wrong. Caption: "Three failures. Each invisible while the components were reviewed alone."] -->

---

## Two Different Things That Both Look Like Checking

There is a distinction worth naming carefully before anything else, because confusing the two is exactly how integration failures survive until the worst possible moment.

*Part verification* is the work of confirming that a single component satisfies its own handoff condition. The `ReadingAssignment` class has the right fields and types. The `ReadingRepository` method is named what the prompt said it would be named. The view compiles and displays what the worked example showed. Each of these is a binary check against a stated condition, and the condition belongs entirely to the component being checked.

*Integration verification* is the work of confirming that the components agree with each other. It asks a different question: not "does this component satisfy its own specification?" but "do the specifications themselves form a consistent system?" A repository that defines `add(Task t)` and a controller prompt that calls `repository.save(task)` can both pass part verification. The repository satisfies its handoff condition. The controller prompt is internally coherent. The mismatch lives between them, in the gap that neither individual check was designed to find.

This is the gap that the Boondoggle Score Part I is designed to close. Not by adding more checks to each component, but by requiring that all the specifications be read together, against each other, before the next build phase begins.

<!-- → [TABLE: Part verification vs. integration verification — columns: Dimension, Part verification, Integration verification. Row 1: Question asked / Does this component satisfy its own condition? / Do the components' specifications agree with each other? Row 2: Where failures live / Inside a single component / In the gaps between components. Row 3: Can pass while the other fails? / Yes / Yes. Row 4: When it runs / After each component is generated / At the midpoint, before Phase II build. Row 5: Evidence required / Handoff condition check per component / Cross-component consistency check across all specs.] -->

---

## The Method-Name Problem

Let me make the integration failure concrete, because the abstract version undersells it.

Suppose you have two components. The first is a `TaskRepository` with this method signature: `public void add(Task task)`. The prompt that generated it specified the name, the parameter type, and the return type. The handoff condition passed. You have a repository.

The second is a `TaskController` whose prompt said: "Write a method that saves a task by calling `repository.save(task)`." The prompt generated coherent Java. The controller compiled. The handoff condition — "the method calls the repository to persist the task" — passed by inspection.

Now put them together. The controller calls `repository.save(task)`. The repository has no `save` method. At runtime, you get a `NoSuchMethodError`. Or, if you catch this in the IDE first, a compile-time error on the line where the controller calls the method that doesn't exist.

Neither component is wrong in isolation. Both passed their individual handoff conditions. The failure is in the contract between them — a contract that was never written down, because each component was specified independently rather than against a shared interface definition.

The fix is not to patch the controller. The fix is to ask, before either component is generated: what is the exact method signature the controller will call, and does the repository specification name that exact method? If the answer to the second question is no, you don't have a consistent system design yet. You have two components that will need to be reconciled later — and later is always more expensive than now.

<!-- → [INFOGRAPHIC: Two-component mismatch diagram — left box: TaskRepository, method defined as add(Task t). Right box: TaskController, calls repository.save(task). Arrow between them labeled "NoSuchMethodError at runtime." Below both boxes: "Both passed individual handoff conditions." Caption: "Integration failures live between components whose individual specifications never talked to each other."] -->

---

## What "Consistent" Means

Consistency is not a vague quality claim. It is a structural property of a set of specifications, and it is checkable.

A set of component specifications is consistent if and only if: every method call in one component refers to a method that exists in the specification of the component being called, with the same name, the same parameter types in the same order, and a compatible return type; every field access in one component refers to a field that is accessible from the calling component, given the visibility modifiers in the receiving component's specification; and every type referenced in one component appears in the dependency graph as a component whose handoff condition has passed before the referencing component is built.

That is a long sentence, but each clause is binary. Either the name matches or it doesn't. Either the parameter types match or they don't. Either the field is accessible or it isn't. Either the dependency order is correct or it isn't. Consistency is not "seems reasonable" — it is a set of conditions that can pass or fail by inspection.

The Boondoggle Score Part I is a consistency check. It asks: given all the specifications you have written so far, do they form a consistent system? Not "are the components individually good?" That question was answered by the individual handoff conditions. The new question is whether the whole is coherent.

<!-- → [TABLE: The three consistency conditions and how to check them — columns: Condition, What to look for, Passes when, Fails when. Row 1: Method-call consistency / Every cross-component call in each prompt / Name, parameter types, and return type match the receiving spec / Any mismatch in name or signature. Row 2: Field-access consistency / Every field referenced across component boundaries / Field exists and has the required visibility modifier / Field missing or wrong access modifier. Row 3: Type-reference ordering / Every type used in a component / That type's handoff condition appears earlier in the score / Type's handoff condition appears later or is absent.] -->

---

## The Structure of the Score Part I

The Score Part I has five elements, and they must be read together.

**The Problem Summary.** This is the sentence from Chapter 6 — the one that couldn't describe a different system. It is the root against which everything else is checked. Every component in the dependency graph should be traceable to a clause in the Problem Summary. Every method in the system should exist because some behavior in the Problem Summary requires it. If a component can't be traced back, it is either an undocumented requirement or an unnecessary component.

**The architecture principles.** These are the cross-cutting constraints — the rules that apply to every component, not just one. "No GUI component may mutate model fields directly." "All data access goes through the repository." These constraints should appear in every prompt that generates a component they govern. If an architecture principle was stated in the SDD but not included in the relevant prompts, those prompts are inconsistent with the SDD.

**The dependency graph.** This is the build order, annotated. Each node names a component and its handoff condition. Each edge states why the dependency is real. The graph must be checked for two properties: order correctness (no downstream component appears before its prerequisites) and completeness (every component that appears in any prompt appears in the graph).

**The prompts, all of them.** Not the prompts in isolation — the prompts as a set. Each prompt should be checked against the others for the method-name problem: every call in one prompt refers to a method that appears in another prompt's specification, with the right name and signature.

**The handoff conditions, all of them.** Again, not in isolation. The handoff conditions should be checked for two properties: testability (each condition is binary and inspectable) and coverage (every behavior stated in the Problem Summary has at least one handoff condition that would catch its absence).

<!-- → [TABLE: Score Part I elements and their cross-checks — columns: Element, Individual check, Cross-check with other elements. Row 1: Problem Summary / Could not describe a different system / Every component traces to a clause. Row 2: Architecture principles / Each is a binary constraint, not a preference / Each principle appears in every prompt it governs. Row 3: Dependency graph / Order is correct; all nodes present / Every component in every prompt appears as a node. Row 4: Prompts / Each is complete with output format, constraints, forbidden items / Method calls across prompts use consistent names and signatures. Row 5: Handoff conditions / Each is binary and inspectable / Together they cover every behavior in the Problem Summary.] -->

---

## Why a Peer Does This Better Than You Do

The cross-checks I just described are not difficult in principle. They are systematic. They require reading all the specifications in sequence and asking whether they agree. A careful author can do this.

The problem is memory.

When you write a prompt for the controller, you remember what you intended the repository to do. You wrote the repository prompt two weeks ago. In your memory, the repository has a `save` method, because that is what you were thinking about when you wrote the controller prompt. The fact that the actual repository specification says `add` is invisible to you — not because you are careless, but because you are using your mental model of the system rather than the written record.

A peer reviewer doesn't have your mental model. When the peer reads the controller prompt and then reads the repository specification, she sees only what is written. The method name mismatch is immediately visible, because she has no cached expectation to paper over it.

This is why peer audit is a structural requirement of the Score Part I, not an optional quality improvement. The author's memory is an unverified source. The peer's fresh read is a check against the written record.

<!-- → [INFOGRAPHIC: Two-path diagram — left path: Author reviews own specs, mental model fills in gaps, mismatch invisible. Right path: Peer reviews specs, no mental model, reads only what is written, mismatch visible. Caption: "Peer audit works because the reviewer's ignorance of the author's intentions is a feature, not a deficiency."] -->

---

## The Five Audit Criteria

A peer audit against vague criteria is not an audit. It is a conversation. The Score Part I audit has five named criteria, each with a binary outcome.

**Prompt completeness.** Each prompt in the score includes: an output specification (the Java element, its name, its signature or fields), at least two explicit constraints, and at least two explicit forbidden items. A prompt that says "write a TaskRepository that handles task persistence" fails this criterion. A prompt that names the class, the methods with full signatures, the storage mechanism, and two things the class must not do passes it.

**Handoff condition testability.** Each handoff condition in the score can be evaluated by reading the generated artifact — not by running it, not by asking the author, not by trusting a feeling. "The class looks well-structured" fails this criterion. "The class declares exactly the fields `String title`, `LocalDate dueDate`, and `boolean completed`, each with the specified access modifier" passes it.

**Dependency ordering correctness.** No component in the graph is built before its prerequisites are verified. The auditor checks this by reading the graph and asking: for each edge, is there a handoff condition entry for the upstream node that precedes the downstream node's prompt? If the repository prompt appears in the score before the model's handoff condition entry, the order is wrong.

**Invariant preservation.** Each component that is depended upon by others has a handoff condition that specifies the invariants downstream components rely on. The model's field types must be specified, because the repository's behavior depends on them. The repository's method names must be specified, because the controller's behavior depends on them. If an invariant is not in the handoff condition, downstream components are building against an unspecified contract.

**Revision evidence.** If the score shows that any handoff condition failed, there is a revision record: what failed, whether the failure was prompt omission, model failure, or human acceptance failure, and what the revised prompt said. A score that shows no failures is a score that either has no record of failures or had no failures. The auditor cannot tell which without revision evidence. Absence of revision history is not evidence of a clean build — it is evidence of an incomplete record.

<!-- → [TABLE: Peer audit rubric — five criteria, three columns: Criterion, Passes when, Fails when. Row 1: Prompt completeness / Output spec, two constraints, two forbidden items present / Any element missing or vague. Row 2: Handoff condition testability / Condition evaluable by reading artifact alone / Requires running, asking, or inferring. Row 3: Dependency ordering / Every upstream handoff precedes downstream prompt / Any downstream prompt precedes its upstream handoff. Row 4: Invariant preservation / All invariants relied on downstream are stated upstream / Any downstream dependency on an unstated upstream invariant. Row 5: Revision evidence / Failures recorded with type and revised prompt / No failures recorded, or failures with no revision.] -->

---

## What the Audit Is Not

I want to address three things the peer audit is not, because each is a tempting substitute.

**It is not proofreading.** Proofreading catches surface errors — typos, formatting inconsistencies, method names that are slightly wrong. The audit is looking for specification contradictions, not surface errors. A beautifully formatted score with internally consistent prompts that call nonexistent methods has passed proofreading and failed the audit.

**It is not a judgment of the code quality.** The audit does not evaluate whether the generated Java is elegant, efficient, or idiomatic. It evaluates whether the specifications are consistent and the handoff conditions are testable. A score can have messy generated code and pass the audit. A score can have clean generated code and fail the audit, if the prompts are inconsistent with each other.

**It is not a courtesy review.** A common failure mode in peer review of any kind is the courtesy pass: the reviewer reads the document, finds nothing obviously wrong, and says "looks good" because finding nothing is easier than finding something. In a course context, this failure mode is tempting because pointing out problems feels unfriendly. The structure of the Score Part I audit is designed to resist this. Each criterion is binary. The auditor is not asked "is this good?" — she is asked "does this criterion pass or fail, and what is the evidence?" The answer "passes, because I found no failures" requires evidence of looking. The answer "fails" requires naming what failed and where.

<!-- → [TABLE: Three tempting substitutes for a real audit — columns: Substitute, What it catches, What it misses, Why it feels like enough. Row 1: Proofreading / Surface errors, typos, minor naming issues / Specification contradictions between components / The document looks clean. Row 2: Code quality review / Inelegant or non-idiomatic Java / Whether specs are mutually consistent / The code looks good. Row 3: Courtesy pass / Nothing — that's the point / Everything the criteria were designed to find / Pointing out problems feels unfriendly.] -->

---

## Reading the Score as a System

Here is how I want you to read your own Score Part I before you hand it to a peer.

Start with the Problem Summary. Read it once. Then read every component in the dependency graph and ask: which clause of the Problem Summary obligates this component to exist? If you can't find the clause, either the component doesn't belong or the Problem Summary is incomplete. Fix whichever is wrong before the peer sees it.

Then read the prompts in dependency order — the order they appear in the graph, starting from the components with no prerequisites. For each prompt, mark the methods it calls that belong to other components. Make a list. Then find the specification for each of those components and check that the method name, parameter types, and return type match. Every mismatch is a contract failure. Record it.

Then read the handoff conditions, again in dependency order. For each condition, ask: is this evaluable by reading the artifact? Then ask: does it specify the invariants that the next component depends on? If the repository's handoff condition doesn't name the method signatures, and the controller depends on those signatures, the handoff condition is incomplete.

Then read the revision records. If there are none, ask whether that is because the process was clean or because failures were not recorded. If the process was genuinely clean — every first-pass artifact satisfied every handoff condition — the revision record should say so explicitly, because absence of entries looks identical to absence of process.

<!-- → [INFOGRAPHIC: Linear reading protocol — four steps in a vertical sequence. Step 1: Read Problem Summary, trace every component to a clause. Step 2: Read prompts in dependency order, mark every cross-component method call, verify against receiving component's spec. Step 3: Read handoff conditions in dependency order, check testability and invariant coverage. Step 4: Read revision records, verify failures are recorded or confirm explicitly that none occurred. Caption: "Reading the score as a system, not as a collection of parts."] -->

---

## What Changes After This Chapter

Before Chapter 9, the Boondoggle Score was a record of individual delegations. Each entry stood alone: one AI task, one human task, one handoff condition, one evidence note. The entries were related — they belonged to the same project — but they were not checked against each other.

After Chapter 9, the score is a system specification. The entries must be consistent. The method names in one entry must match the method names in the entries that depend on them. The dependency order must be enforced. The invariants that cross component boundaries must appear in the handoff conditions of the components that establish them.

This is a different kind of document. It is not more complex in the sense of being harder to understand — each entry is still structured the same way. It is more complex in the sense that it has new obligations: internal consistency across entries, not just completeness within entries.

The peer audit is the mechanism that enforces those obligations, because the author's memory is not a reliable enforcement mechanism. The written record is. The peer's fresh read of the written record is the check.

When the Score Part I passes peer audit, it means something specific: every specification in Phase I is consistent with every other specification, the dependency order is correct, every handoff condition is testable, and every failure is recorded. That is the foundation Phase II builds on. If it is solid, Phase II can generate components that integrate cleanly. If it is not solid, Phase II will generate components that look finished and fail at the same moment as the components in this chapter's opening case — when the pieces are finally placed on one table.

<!-- → [TABLE: What "Score Part I passes peer audit" actually means — columns: Claim, What it requires, What it does not claim. Row 1: Specs are mutually consistent / Every cross-component reference verified against receiving spec / That the specs describe the right system. Row 2: Dependency order is correct / Every upstream handoff precedes downstream prompt / That no implicit dependencies were missed. Row 3: Handoff conditions are testable / Every condition evaluable by reading artifact alone / That every condition was checked. Row 4: Failures are recorded / Revision history present or clean-build statement explicit / That the build was clean.] -->

---

## LLM Exercises

1. **Contract consistency audit.** You are given three component specifications: a `Student` model with fields `String name` and `int id`; a `GradeRepository` that defines the method `public void store(Student s, double grade)`; and a `ReportController` prompt that calls `gradeRepo.save(student, grade)`. Identify every contract failure in this set. For each failure, classify it: method-name mismatch, type mismatch, or dependency-order violation. Then write the revised specification that resolves each failure.

2. **Handoff condition completeness check.** A `TaskRepository` has this handoff condition: "The class compiles and the `add` method accepts a `Task` argument." A downstream `TaskController` calls `repository.add(task)` and also calls `repository.getAll()` to retrieve the full list. Does the handoff condition cover everything the controller depends on? Identify the gap. Write the revised handoff condition that would have caught it.

3. **Score Part I self-audit.** Apply the five-criterion audit to your own Score Part I. For each criterion, write one sentence stating whether it passes or fails, and one sentence of evidence. If any criterion fails, write the revision that would bring it into compliance. If all criteria pass, write a sentence for each explaining why the evidence is sufficient rather than merely absent.

4. **Revision record reconstruction.** A student's Score Part I shows no revision history. You are the peer auditor. Write the two questions you would ask to determine whether the absence of failures is genuine or unrecorded. Then write what a genuine clean-build record should say, even when nothing went wrong — the explicit statement that makes "no failures" verifiable rather than ambiguous.
