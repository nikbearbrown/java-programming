# Chapter 6 — The Software Design Document
*The Specification Infrastructure That Makes Multi-Component Work Possible.*

---

I want to start with a demonstration I run in the first lecture of this unit. I put five words on the screen — "build an app for students" — and ask the class to name what I've described.

In two minutes, they give me a calendar, a Kanban board, a tutoring scheduler, a grade predictor, a reminder app, a group-project tracker, a reading log, a study timer, a flashcard system, and a file organizer.

Every one of those is a reasonable interpretation of five words. Every one of them is a completely different system. Every one of them would produce completely different Java, with different components, different dependencies, different handoff conditions, and a completely different Boondoggle Score.

The description is not wrong. It is just not yet a design.

This is the problem a Software Design Document solves — not by adding bureaucracy, but by forcing a decision that has to be made anyway. The SDD is where you decide what you are actually building, before you ask AI to build it. Every word you write in the SDD is a word the model won't have to guess.

![One description. Ten different systems. The SDD collapses this fan to a single path.](images/06-the-software-design-document-fig-01.png)
*Figure 6.1 — A single vague prompt ("build an app for*

---

## The Problem Summary

The most important sentence in any SDD is the Problem Summary. Not the most important section — the most important *sentence*. If you can write one sentence that could not describe ten different systems, you have done the hardest design work in the document.

Here is a sentence that could describe ten different systems: "The app helps students manage their work."

Here is a sentence that couldn't: "The app tracks incomplete reading assignments for a single user, stores each assignment as a title, due date, and completion flag, displays them sorted by due date, and marks them complete through a console interface."

Notice what the second sentence does. It names the user (single user), the domain object (reading assignment), the fields that define it (title, due date, completion flag), the display behavior (sorted by due date), and the interaction model (console). A student who reads that sentence knows whether their `Task` class has the right fields before they write a single line of code. An AI that receives that sentence in a prompt generates a component you can actually audit against stated obligations, rather than against whatever the model inferred.

The test I apply to a Problem Summary is brutal and simple: could a different student, reading only this sentence, produce a system that yours would refuse to work with? If yes, the summary is underspecified. If no — if the sentence constrains the design tightly enough that two people building independently would produce compatible components — you have a Problem Summary.

| Version | Text | What it leaves ambiguous |
| --- | --- | --- |
| Three Problem Summary attempts for the same system — | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

---

## What Makes a Sentence Testable

The reason specificity matters isn't aesthetic. It is mechanical: a Problem Summary is a test for everything you build downstream. Every component, every handoff condition, every Boondoggle Score entry should be traceable back to a clause in the Problem Summary. If a component can't be traced back — if you can't point to the sentence that obligates it to exist — then either the component doesn't belong or the Problem Summary is missing something.

Let me show what that tracing looks like in practice.

Problem Summary: "The app tracks incomplete reading assignments for a single user, stores each assignment as a title, due date, and completion flag, displays them sorted by due date, and marks them complete through a console interface."

The `ReadingAssignment` class exists because the summary names the domain object and its fields. The class must have exactly those fields — title, due date, completion flag — because the summary specifies them. If the AI generates a class with an additional `priority` field or a missing `dueDate`, the handoff condition fails, and you can point to the exact clause in the summary that it violates.

The sort behavior exists because the summary names it. If the display doesn't sort by due date, you can point to the clause. The console interface exists because the summary names it. If the AI generates a GUI, you can point to the clause.

This is what I mean by specification infrastructure. The SDD doesn't slow down building. It makes every subsequent handoff condition traceable to a decision that was already made, rather than a decision you have to reconstruct after something goes wrong.

| Problem Summary clause | Component it obligates | Handoff condition it generates |
| --- | --- | --- |
| Traceability map for the ReadingAssignment system — | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

---

## The Dependency Graph

Once the Problem Summary exists, the next task is producing a dependency graph. This is a directed map of build order. Each node is a component or artifact. Each edge means one node must exist and be verified before another can safely be built.

The graph is not project management. It is a verification structure. It tells you which handoff conditions must pass before you can trust any downstream work. If you build downstream before the upstream handoff is verified, you are building on a foundation you don't know is solid.

![Each edge is a dependency. Each node has a handoff condition that must pass before the edge can be trusted.](images/06-the-software-design-document-fig-02.png)
*Figure 6.2 — A directed acyclic graph for the three-component task*

Let me work through a concrete example. Suppose the system has three components: a `ReadingAssignment` model class, a `ReadingRepository` that stores and retrieves assignments, and a `ReadingConsoleView` that displays and updates them.

The model has no prerequisites. It depends on nothing. You can build and verify it first.

The repository depends on the model because it stores `ReadingAssignment` objects. If you build the repository before the model's handoff condition passes, you are storing objects whose shape you haven't confirmed. Any mismatch in field names, types, or constructors will propagate into the repository and surface as a fault that looks like a repository problem but is actually a model problem. The dependency graph tells you to verify the model first. Not as a preference — as a logical obligation.

The view depends on both, because it displays assignments and marks them complete. If either the model or the repository has an unverified defect, the view can look correct while quietly preserving or displaying bad data.

The edge in the graph is not just "A comes before B." It means "B's handoff condition can only be meaningful if A's handoff condition has already passed." This is why the graph is a verification structure, not a schedule.

---

## Load-Bearing Nodes

In any dependency graph, some nodes are more consequential than others. A load-bearing node is one whose defects propagate downstream to every component that depends on it. In the three-component example, the model is load-bearing. Its fields define what the repository stores and what the view displays. If the model's invariant is wrong — if `completionFlag` is an int instead of a boolean, or if `dueDate` is stored as a String — the repository and view can both pass their own handoff conditions while the system as a whole behaves incorrectly.

Identifying load-bearing nodes is an act of interpretive judgment, not mechanical inspection. You read the dependency graph and ask: which nodes, if they fail silently, would cause the most downstream damage? Which failures would be hardest to detect after the fact?

The answer is usually the nodes closest to the domain model — the classes that define what the system treats as real. In an object-oriented Java system, that means the model classes: the classes that encode the domain objects, their fields, and their invariants. These are the nodes where the specification lives, and they are therefore the nodes where specification failures are most expensive.

| Component | Load-bearing? | Reason | Propagation risk |
| --- | --- | --- | --- |
| Load-bearing vs. non-load-bearing components — | A concrete checkpoint for applying the chapter concept. | It makes the underlying reasoning visible instead of implied. | A concrete checkpoint for applying the chapter concept. |

A load-bearing node deserves a more careful handoff condition. Not a longer one — a more precise one. For the model class, the handoff condition should name every field by type, every constructor signature, and every invariant the class must maintain. "The class looks right" is not a handoff condition for a load-bearing node. "The class has fields `String title`, `LocalDate dueDate`, and `boolean completed`; a constructor that sets all three; and no setter for `title`" is.

---

## Writing the SDD

A full SDD for a course-sized project has more than a Problem Summary and a dependency graph. But those two elements are the ones that make everything else possible. Without the Problem Summary, you don't have a test for your components. Without the dependency graph, you don't have a build order or a propagation map.

The other elements that matter, and what they contribute:

**Architecture constraints.** These are principles that constrain what AI is allowed to generate, applied across all components. "No GUI component may mutate model fields directly." "All data access goes through the repository; the view never touches the model's collection." These are not aesthetic preferences. They are statements that, if violated, will cause specific classes of failure. Writing them down before generation means you can include them in every prompt, and check for their violation in every audit.

**Glossary.** Name the domain terms and define them precisely. What does "complete" mean? Does it mean the assignment was submitted, or marked done by the user, or both? What does "due date" mean — the calendar date, or a date-time? Ambiguity in the glossary becomes ambiguity in the model, which becomes ambiguity in every downstream component. Resolving it before generation costs one paragraph. Resolving it after three components have been built costs a rewrite.

**Component list.** Name every component the system requires, in dependency order. For each component: the Java element it corresponds to (class, interface, method, event handler), the single sentence that states what it must do, and the handoff condition that will be used to verify it. This list becomes the skeleton of the Boondoggle Score. Every row in the score should trace to a row in the component list.

| Element | What it contributes | What breaks without it |
| --- | --- | --- |
| SDD element inventory — | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

---

## The SDD as a Prompt Source

There is a practical reason to write the SDD before generating any code, beyond the verification argument. The SDD is a prompt source.

Every prompt you write for the rest of the project should draw from the SDD. The Problem Summary goes in the context. The architecture constraints go in the forbidden-items list. The component definition goes in the output specification. The handoff condition goes in the acceptance criteria.

If you write a prompt that contradicts the SDD, you have a problem. Either the prompt is wrong — and you need to revise it — or the SDD is wrong — and you need to revise that. Either way, the contradiction is visible, and you can resolve it before generating code.

If you write a prompt without consulting the SDD, you are inventing constraints on the fly. Some of those constraints will be consistent with the SDD. Some will not. You won't know which until something fails downstream.

The SDD creates what I'll call a single source of truth for the project. AI generates candidates against it. The human audits candidates against it. The Boondoggle Score records evidence against it. When something goes wrong, you trace back to it.

![Every prompt and every handoff condition traces to the SDD. Contradictions surface before generation, not after.](images/06-the-software-design-document-fig-03.png)
*Figure 6.3 — A hub-and-spoke diagram *

---

## The Opening Case, Reconsidered

Let me go back to the demonstration. Ten systems from five words.

Every one of those ten systems could be built. AI would happily generate code for any of them from a short prompt. Some of the code would even be good. But the moment you need two components to work together — the moment the view needs to call the repository, or the repository needs to store the model — you need a shared specification. You need a sentence that both components were built against.

Without the SDD, you write the model, then the repository, and at some point you discover that the repository was built against an inferred model that doesn't quite match the model you actually wrote. The fix is either to revise the repository, or to revise the model, or to add adapter code that translates between them. Any of those options is more expensive than writing one precise sentence before you started.

This is the argument for the SDD in its simplest form. Not that it is good practice. Not that professional engineers use documents like it. The argument is that the cost of writing it is measured in minutes, and the cost of not writing it is measured in rework.

| Activity | With SDD | Without SDD |
| --- | --- | --- |
| Cost comparison | writing SDD vs. not writing it — | A concrete checkpoint for applying the chapter concept. |

---

## What the SDD Does Not Do

The SDD is specification infrastructure. It is not a guarantee.

Writing a Problem Summary does not guarantee the summary is correct. You can write a precise sentence that specifies the wrong system. The SDD is only as good as the decisions it encodes. If the decisions are wrong, the SDD helps you detect that earlier — but it doesn't prevent wrong decisions.

Writing a dependency graph does not guarantee you've identified every dependency. Complex systems have implicit dependencies that don't appear until integration. The graph is a tool for making explicit dependencies visible and ordered. It is not a complete map of everything that could go wrong.

What the SDD does is make your assumptions inspectable. Before it exists, your assumptions about what the system is, what it does, and in what order it should be built are scattered across your mental model, your prompts, and your expectations. Some of them are consistent with each other. Some are not. You can't tell which.

After the SDD exists, the assumptions are written down. You can read them. You can check them against each other. You can find the ones that conflict before they produce conflicting code. You can hand the document to a classmate and ask whether they see the same system you see.

That is what I mean by specification infrastructure. Not a finished plan. A foundation that makes the plan auditable.

| Claim | True? | Why |
| --- | --- | --- |
| What the SDD does and does not guarantee — | A concrete checkpoint for applying the chapter concept. | It makes the underlying reasoning visible instead of implied. |

---

## The Boondoggle Score Entry

Every SDD produces a natural Boondoggle Score entry — or rather, it produces as many entries as there are components in the dependency graph, each with a pre-populated handoff condition drawn from the component list.

The entry for the SDD itself records the work of producing the document:

- **AI task:** Generate a draft Problem Summary from a brief description of the system the student provides.
- **Human task:** Verify that the Problem Summary could not describe a different system. Test it by asking whether two students building independently would produce compatible components.
- **Handoff condition:** The Problem Summary names the user, the domain object, the required fields, the display behavior, and the interaction model. No load-bearing term is ambiguous.
- **Evidence:** The summary text, with each required element underlined or annotated.
- **Supervisory capacity:** Problem Formulation.

The dependency graph entry is similar but records a different human task: verify that every downstream component's node appears after its prerequisites, and that every load-bearing node has a more precise handoff condition than its dependents.

| Item | Meaning |
| --- | --- |
| Boondoggle Score entries for the SDD phase | two rows. Row 1: Problem Summary |
| Human task: test uniqueness and completeness | A concrete checkpoint for applying the chapter concept. |
| Handoff condition: all five elements present and unambiguous | A concrete checkpoint for applying the chapter concept. |
| Evidence: annotated summary | A concrete checkpoint for applying the chapter concept. |
| Supervisory capacity: Problem Formulation. Row 2: Dependency graph | AI task: generate draft graph from component list |
| Human task: verify order, identify load-bearing nodes, confirm precision of load-bearing handoff conditions | A concrete checkpoint for applying the chapter concept. |
| Handoff condition: every edge reflects a real dependency | Audience, stakes, timing, and platform conventions shape the choice. |
| Evidence: graph with annotations | A concrete checkpoint for applying the chapter concept. |
| Supervisory capacity: Executive Integration. | A concrete checkpoint for applying the chapter concept. |

---

## What This Adds to the Conductor's Frame

In Chapter 3, the conductor's job was to specify a single component, audit it against a handoff condition, and record the evidence. The scope was one component, one condition, one entry.

A multi-component system doesn't change the conductor's job — it multiplies it. Every component still needs a specification. Every handoff still needs a condition. Every condition still needs evidence. What the SDD adds is the infrastructure that makes that multiplication tractable.

Without the SDD, writing ten handoff conditions for ten components is ten separate acts of invention, each drawing on your mental model of what the system is supposed to be. With the SDD, writing ten handoff conditions is ten acts of transcription, each drawing on a single written source. The decisions are still yours. The SDD just makes them visible, checkable, and shared.

The conductor's frame tells you how to manage a single delegation. The SDD tells you what all the delegations are for.

| Dimension | Chapter 3 | Chapter 6 |
| --- | --- | --- |
| Conductor's Frame (Ch. 3) vs. SDD (Ch. 6) — | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

---

## LLM Exercises

1. **Problem Summary stress test.** Write a Problem Summary for a system of your choice. Then deliberately try to describe a *different* system using only your sentence — swap out one noun or one behavioral clause. If a small change produces a completely different system, the original sentence wasn't specific enough. Revise until the sentence resists that test. Submit both the original and revised versions with an annotation explaining what changed and why.

2. **Dependency graph construction.** For the following three-component system — a `Student` model class, a `GradeBook` that stores student grades, and a `ReportPrinter` that formats and outputs grade reports — draw the dependency graph. For each edge, write one sentence explaining why the dependency is real: what would break if you built the downstream component before the upstream handoff passed.

3. **Load-bearing identification.** Given this dependency graph: `Config` → `DatabaseConnection` → `UserRepository` → `AuthService` → `LoginController`. Identify which node or nodes are load-bearing. For each load-bearing node, write the handoff condition you would apply — naming specific field types, method signatures, or invariants — and explain why the precision is higher than it would be for a terminal node.

4. **SDD-to-prompt tracing.** Take the Problem Summary you wrote in Exercise 1 and write a conductor-style prompt for one of its components. Then annotate the prompt: for each constraint in the prompt, mark which clause in the Problem Summary obligates that constraint. Any prompt constraint you can't trace back is either a constraint the SDD is missing, or a constraint that doesn't belong in the prompt.
