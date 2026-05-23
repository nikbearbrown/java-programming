# Java in the Age of AI: A Conductor's Course
## Complete Table of Contents — Working Draft
*INFO5100: Application Engineering Design, AI+1 Redesign*
*Tic TOC /g1 · Compiled from /i1 · /i2 · /i3 · /i4 · /l1 · /l2 · /l3 · /l4 · /c1*

---

**Version:** 0.1 (first compiled draft)
**Date:** 2026-05-23
**Status:** Pre-market review · Pre-/g2 critique
**Open Questions:** 2 logged (OQ-L4-1, OQ-L4-2)

---

## 1. Book Concept Summary

**Working title:** *Java in the Age of AI: A Conductor's Course*

**Book logline:** In the AI era, the engineer who commands a 56% wage
premium is not the one who writes the best Java — it is the one who
directs AI through Java builds with precision, evaluates what AI produces
with judgment, and signs their name to the result with accountability.
This course teaches that engineer.

**Thesis:** Java fluency in the AI era is the prerequisite for supervisory
intelligence, not the destination. The skills that make a Java engineer
irreplaceable — specifying precisely, auditing rigorously, deciding
architecturally, and owning the outcome — are exactly the skills AI
cannot supply. This course teaches them through the Boondoggling
methodology: programming as conducting.

**The course succeeds when:** A student can produce and defend a complete
Boondoggle Score for a non-trivial Java system — a conductor's score a
professional Java engineer would recognize as reflecting genuine
architectural judgment, not formatted compliance.

---

## 2. Learner Profile

**Primary reader — Dilnoza:**
27 years old. Mechanical engineering bachelor's degree. Two years at an
automotive OEM doing simulation work in Python and MATLAB. Enrolled in a
multidisciplinary graduate engineering program. Has used ChatGPT to debug
code snippets. Has never conducted a full software build with an AI tool.
Does not write Java fluently. Motivated by career outcomes — specifically,
the 56% wage premium that PwC data attributes to AI-fluent domain experts,
not to people who abandoned their domain to become generic technologists.

**What Dilnoza needs that no existing Java course provides:**
Every other Java course teaches her to compete with AI at code generation.
This course teaches her to direct AI through a Java build — which requires
understanding Java well enough to evaluate what AI produced, specify what
she wants with enough precision that AI can build it, and catch the wrong
output before it propagates.

**Prerequisite assumption:** Programming exposure in any language (Python,
MATLAB, R). No Java experience assumed. No AI tool experience assumed.
No OOP background assumed. The course builds all three from zero — not as
front-loaded prerequisites, but distributed across the arc, introduced
exactly when a Boondoggle Score task requires them.

---

## 3. Deployment Architecture

**Layer 1 — Kindle ($1):**
The readable book. Each chapter functions as a standalone essay: concept
introduction, the AI+1 argument applied to that concept, worked examples
with Boondoggle Score excerpts, Glimmer prompts the student can attempt
anywhere. Entry point. Drives platform adoption.

**Layer 2 — Medhavy (Canvas LTI):**
The living course. Each chapter is a concept node with four modes:
- **Ask AI** — Socratic scaffolding, RAG-grounded to course content
- **Quiz Me / FSRS** — Spaced retrieval of specification vocabulary and
  pattern recognition; durable encoding of concepts for exam and practice
- **Case Study** — Pre-written engineering scenarios requiring plausibility
  auditing and problem reformulation under ambiguity (Tier 4–5 work)
- **Glimmer** — The Boondoggle Score component: propose a build, specify
  it, receive AI interrogation on the weakest dimension, defend it

**The four modes map to the four-tier taxonomy:**

| Medhavy Mode | Cognitive Operation | Tier |
|---|---|---|
| Ask AI | Acquire the representation | Tier 1 scaffolding |
| Quiz Me | Make the representation durable | Tier 1 → Tier 4 bridge |
| Case Study | Apply under ambiguity; plausibility audit | Tier 4–5 |
| Glimmer | Generate, specify, defend; executive integration | Tier 4–7 |

---

## 4. Three-Act Learning Arc

**The arc statement:**
This course takes the student from *"AI is a shortcut I use without
accountability"* to *"AI is an instrument I conduct with accountability"*
— by first establishing why the specification is the work (Act One), then
building the full specification toolkit for a real Java system (Act Two),
then integrating and defending the complete Boondoggle Score under
challenge (Act Three).

**The Pebble (Week 1, first session):**
Students are given a running Java task manager application and told: "AI
built this. Your job is to evaluate whether it satisfies the specification."
The specification has three violations. Students on first pass find one or
two. Almost no one finds all three. This is the pebble. The course is the
expanding pond. Every module gives the student new water — Java knowledge,
specification tools, audit frameworks — to eventually evaluate completely
what they could not evaluate in week 1. Module 14 returns to a system of
equivalent complexity. This time they find everything.

---

### ACT ONE — ESTABLISH (Modules 1–4, Weeks 1–4)

**Opening question:** What does it mean to specify something precisely
enough that AI can build it — and how is that different from describing
what you want?

**What the student knows at the end of Act One:**
The Gru/Minion framework; the Boondoggle Score structure; Java foundations
at the method and class level; the Software Design Document as specification
infrastructure; why "it generates good code" is not the same as "it built
what I specified."

**Transition condition to Act Two:**
The student can produce a dependency-ordered build graph for a three-component
Java system, with AI prompts and handoff conditions at each node, before any
AI tool has touched the build.

---

### ACT TWO — BUILD (Modules 5–10, Weeks 5–10)

**Driving question:** I can specify a component. How do I specify a system —
and how do I know my specification is complete before AI touches it?

**What Act Two provides:**
The full specification toolkit: inheritance contracts, GUI user need translation,
interface specifications, event-driven state machines, generic type bounds,
collection selection reasoning.

**Midpoint (Module 7):** Boondoggle Score Part I — assembly and peer audit
of all Act One and early Act Two specifications.

**Hardest conceptual moment:** Module 8 (Abstract Contracts) — the first
time the student specifies something that does not yet exist: a contract
for a class not yet written, by an implementor not yet identified.

**Transition condition to Act Three:**
Submitted Boondoggle Score Part I (Module 7) plus demonstrated contract-level
plausibility auditing (Module 8 Glimmer).

---

### ACT THREE — APPLY (Modules 11–14, Weeks 11–14)

**Driving question:** I can conduct a component. Can I conduct and defend
a complete system?

**The Glimmer portfolio reveal (Module 13):**
Students learn that every Glimmer submission from Modules 1–12 was a
component of their Boondoggle Score. Module 13 is where the components
are assembled and hardened — failure states found, specifications revised,
AI prompts regenerated. Module 14 is the defense.

**What the student produces:**
A complete Boondoggle Score for a non-trivial Java system: all components,
all AI prompts, all handoff conditions, the full dependency graph,
supervisory capacity labels at every human step — plus a live defense of
the three most consequential architectural decisions and the two highest-risk
handoffs.

---

## 5. Chapter-by-Chapter Table of Contents

### MODULE 0 — Welcome and Course Orientation
*Orientation only — not a content module*

Contents: Faculty bio (adjunct industry context named explicitly); the
AI+1 argument in plain language; what a Boondoggle Score is; how Medhavy
works; the course artifact preview; academic integrity statement that
explicitly addresses required AI tool use.

---

### MODULE 1 — The Conductor's Frame
**One-line:** Students learn to separate AI's job from their job —
and produce their first Boondoggle Score for a trivial system.

**Learning outcomes:**
- M1-LO1 [PF] (Apply) Write a one-sentence problem formulation: the thing
  being built, its insertion point, its output — distinct from the problem
  it solves and the ecosystem it lives in.
- M1-LO2 [TO] (Apply) Write a complete, copy-pasteable AI prompt for a
  trivial Java task: output format, constraints, and what AI should NOT do.
- M1-LO3 [PA] (Analyze) Identify at least two categories of AI output failure
  in a provided Java snippet: scope creep, constraint violation, domain-incorrect
  implementation.

**Opening:** The broken system reveal — a running task manager with three
specification violations. Students find one or two on first pass.

**Boondoggle Score component:** First score — trivial system (greeting
program). Problem formulation sentence + one complete AI prompt + one
binary handoff condition + one [PA] labeled human task.

**Key concepts:** Solve/verify asymmetry · Gru/Minion framework · Five
supervisory capacities · Boondoggle Score structure · Problem formulation
sentence · Handoff condition criteria

**Case Study:** "The Confident Wrong Answer" — AI generates a class that
compiles, passes tests, and violates an unstated requirement.

**Glimmer:** Produce a Boondoggle Score for a self-chosen system.
*Interrogation dimension: Mechanism*

**Bridge:** "My handoff condition is binary. But how do I know it's
*sufficient* — that passing it actually means AI built what I specified?"

---

### MODULE 2 — Java Foundations for Specification
**One-line:** Students learn enough Java to write specifications that
constrain AI generation — and to evaluate whether AI's output satisfied them.

**Learning outcomes:**
- M2-LO1 [PF] (Apply) Write a variable and method specification precise
  enough that AI generates correct Java with no post-generation ambiguity.
- M2-LO2 [PA] (Analyze) Given AI-generated Java for a specified method,
  determine whether the output satisfies stated invariants and flag violating lines.
- M2-LO3 [TO] (Apply) Define a handoff condition that is binary, testable
  without running the code, and grounded in specification not aesthetics.

**Opening:** The insufficient prompt failure — student's Module 1 score
returned: "Is there anything in the output your handoff condition would
pass — but that is wrong?"

**Boondoggle Score component:** Method-level specification + handoff
condition for a file-reading component.

**Key concepts:** Static typing as specification tool · Method as contract ·
Behavioral description as prompt element · Type precision · Integration
handoff condition

**Case Study:** "The Unauthorized ArrayList" — AI generates ArrayList
where spec said int[]. Specification failure or AI failure?

**Glimmer:** Boondoggle Score segment for a two-method system.
*Interrogation dimension: Specificity*

**Bridge:** "I can specify a method. How do I specify the *thing* the
method belongs to — and the constraints that thing must satisfy regardless
of which method is called?"

---

### MODULE 3 — Objects as Specifications
**One-line:** Students learn to specify classes as behavioral contracts —
precise enough to be AI prompts, complete enough to constrain the object's
entire lifecycle.

**Learning outcomes:**
- M3-LO1 [PF] (Apply) Produce a UML-level class specification complete
  enough to be an AI prompt without additional verbal clarification.
- M3-LO2 [PA] (Analyze) Given AI-generated class implementations, identify
  encapsulation violations, incorrect visibility modifiers, and constructor
  contract contradictions.
- M3-LO3 [IJ] (Evaluate) Justify instance vs. static choice by naming the
  specific behavioral consequence of choosing incorrectly.

**Opening:** The public field disaster — all fields public, compiles and
runs, but what can go wrong that Module 2's handoff condition misses?

**Boondoggle Score component:** Class specification + three audits
(visibility, constructor, invariant) as labeled [PA] human tasks.

**Key concepts:** Behavioral contract · Encapsulation as invariant enforcement ·
Constructor contract · Instance vs. static decision · UML as specification
language

**Case Study:** "The Singleton That Wasn't" — static field where instance
state was required; subtle shared-state bug.

**Glimmer:** Add a class specification to the running Boondoggle Score.
*Interrogation dimension: Defensibility*

**Bridge:** "I can specify a class. How do I specify the *relationships*
between classes — and constrain AI building multiple classes that must
work together?"

---

### MODULE 4 — The Software Design Document
**One-line:** Students produce a complete SDD Problem Summary and
dependency-ordered build graph — the specification infrastructure that
makes a multi-component Boondoggle Score possible.

**Learning outcomes:**
- M4-LO1 [PF] (Create) Produce an SDD Problem Summary that could not
  describe ten different systems.
- M4-LO2 [TO] (Apply) Produce a dependency-ordered build graph: each node
  names its AI task, handoff condition, and prerequisite nodes.
- M4-LO3 [EI] (Evaluate) Identify the load-bearing components in a system
  design and explain why each is load-bearing in dependency graph terms.

**Opening:** The ten-system problem — a description so vague that students
name ten different systems it could describe in under two minutes.

**Boondoggle Score component:** SDD Problem Summary + architecture principles
+ dependency graph + system-scale Boondoggle Score annotation. First section
of the course artifact.

**Key concepts:** SDD Problem Summary · Architecture principles as prompt
constraints · Needs-mapping as component filter · Dependency graph · Critical
path · Load-bearing node · Cascade failure

**Case Study:** "The Orphaned Component" — a component that maps to no
stated user need. Cut it or add the need?

**Glimmer:** Annotated dependency graph as first Boondoggle Score section.
*Interrogation dimension: WHY*

**Bridge:** "My system has related classes — some are more general versions
of others. How do I specify those relationships so AI builds them correctly?"

---

### MODULE 5 — Inheritance and the Specification Contract
**One-line:** Students learn to specify superclass/subclass relationships
as behavioral contracts — and audit AI-generated hierarchies for the single
most common OOP failure.

**Learning outcomes:**
- M5-LO1 [PF] (Apply) Specify a superclass/subclass relationship: invariant
  each class enforces, the one invariant no subclass may violate.
- M5-LO2 [PA] (Analyze) Given AI-generated inheritance hierarchies, identify
  LSP violations and diagnose specification failure vs. generation failure.
- M5-LO3 [IJ] (Evaluate) Decide between inheritance and composition and
  defend the choice using the specific failure mode each introduces.

**Opening:** The substitution failure — Square extends Rectangle, compiles
correctly, fails the LSP substitution test. What handoff condition would
catch this?

**Boondoggle Score component:** Inheritance specification + LSP audit as
labeled [PA] human task.

**Key concepts:** Behavioral subtyping · LSP · Superclass contract ·
Override constraints · Inheritance vs. composition criteria · Constructor
chaining with super()

**Case Study:** "The Composition That Should Have Been Inheritance" — AI
used composition when polymorphism was required.

**Glimmer:** Add an inheritance relationship to the running Score.
*Interrogation dimension: Mechanism*

**Bridge:** "My system needs a user interface. How do I specify what the
UI looks like and what it does — precisely enough for AI to build it?"

---

### MODULE 6 — GUI as User Need Specification
**One-line:** Students translate user need statements into JavaFX component
specifications — and produce a Boondoggle Score segment for a two-screen
application.

**Learning outcomes:**
- M6-LO1 [PF] (Apply) Translate a user need statement into a JavaFX
  component specification: named controls, event sources, handler contracts,
  layout constraints.
- M6-LO2 [TO] (Apply) Produce a Boondoggle Score segment for a two-screen
  application: AI tasks for scaffold generation, human tasks for event
  handler contract audit.
- M6-LO3 [PA] (Analyze) Given AI-generated JavaFX code, identify the three
  generation failures: missing handler registration, wrong layout pane,
  hardcoded values violating parameterization.

**Opening:** The user need that requires a GUI — "non-technical user must
be able to [X] without reading documentation." Can CLI satisfy this?

**Boondoggle Score component:** GUI specification (FXML as artifact) + AI
prompt for controller + three-audit [PA] human task.

**Key concepts:** User need to component inventory · JavaFX pane selection
as specification decision · Handler contract five elements · FXML as
specification artifact · Three JavaFX generation failure modes

**Case Study:** "The Missing Registration" — correct handler logic, never
registered. Button does nothing.

**Glimmer:** Add a GUI component to the running Score.
*Interrogation dimension: Usefulness*

**Bridge:** "Can I produce the first half of my complete Boondoggle Score —
and can a peer find my weakest handoff condition before it gets graded?"

---

### MODULE 7 — Midpoint Integration: Boondoggle Score Part I
**One-line:** Students produce and peer-audit Boondoggle Score Part I —
the complete specification for their Modules 1–6 system components.

**Learning outcomes:**
- M7-LO1 [EI] (Create) Produce Boondoggle Score Part I: Problem Summary,
  architecture principles, dependency graph, AI prompts for all prior
  components, handoff conditions at every step.
- M7-LO2 [PA] (Evaluate) Audit a peer's Score Part I for prompt completeness,
  handoff condition testability, and dependency ordering correctness.

**Opening:** The assembly moment — "Every Glimmer since Module 1 is a
component of your Score. Module 7 is where you find out if it holds
together as a system."

**Boondoggle Score component:** Complete Score Part I submission.

**Key concepts:** Score completeness checklist · Dependency ordering
verification · Peer audit protocol · Three audit criteria

**Assessment:** Score Part I (process evidence: completeness audit log +
revision history + dependency verification); Peer audit report as Glimmer.
*Interrogation dimension: Defensibility*

**Bridge:** "How do I specify components that others can implement in
different ways — where the specification constrains behavior without
presupposing the implementation?"

---

### MODULE 8 — Abstract Contracts and Interface Specifications
**One-line:** Students learn to specify behavioral contracts without
presupposing implementation — the hardest specification skill in the course.

**Learning outcomes:**
- M8-LO1 [PF] (Apply) Specify an interface contract — signatures, pre/post
  conditions, invariant — precisely enough that two independent AI
  implementations are interchangeable.
- M8-LO2 [PA] (Analyze) Given two AI implementations of the same interface,
  determine which satisfies the contract, citing specific violated clauses.
- M8-LO3 [IJ] (Evaluate) Justify abstract class vs. interface using the
  specific constraint each imposes on future implementors.

**Opening:** The interchangeable implementation test — two AI implementations
of Sortable: one passes the test suite, one fails on edge cases. Both satisfy
the signature.

**Boondoggle Score component:** Interface specification + two-implementation
audit as [PA] task + behavioral handoff condition.

**Key concepts:** Interface signature vs. behavioral contract · Pre/post
conditions · Behavioral invariant · Two-implementation audit · Abstract
class vs. interface criteria · Expertise reversal in specification

**Case Study:** "The Null Return" — AI returns null on empty file where
contract required empty list. Revise the postcondition.

**Glimmer:** Add an abstract contract to the Score.
*Interrogation dimension: Specificity*

**Bridge:** "My system needs to respond to things that happen. How do I
specify not just what the handler does but the entire behavioral sequence
it participates in?"

---

### MODULE 9 — Event-Driven Specification
**One-line:** Students specify event-driven components as state machines —
and audit AI-generated handler sequences for behavioral failures that
compile-time checks cannot catch.

**Learning outcomes:**
- M9-LO1 [PF] (Apply) Specify an event-driven component: event source,
  event class, handler signature, state change produced, edge case where
  handler must do nothing.
- M9-LO2 [TO] (Apply) Produce a Boondoggle Score segment for an event-driven
  feature: AI task for handler scaffold, human audit for state machine.
- M9-LO3 [PA] (Analyze) Given AI-generated handler code, identify: missing
  null checks, incorrect registration scope, encapsulation-violating
  state mutations.

**Opening:** The button that fires twice — Submit handler is correct, no
guard against duplicate events, double submission in production.

**Boondoggle Score component:** State machine specification + AI prompt +
state machine audit as [PA] task + behavioral handoff condition.

**Key concepts:** State machine specification · Handler specification five
elements · Registration scope failure modes · State machine audit criteria ·
Guard conditions

**Case Study:** "The Accumulating Handler" — handler registered inside
another handler, exponential registration.

**Glimmer:** Add an event-driven component to the Score.
*Interrogation dimension: Mechanism*

**Bridge:** "My system needs to work with different types without losing
type safety. How do I specify that?"

---

### MODULE 10 — Generics, Collections, and Type-Safe Specification
**One-line:** Students specify type-safe data structures and choose the
correct Collection for a given access pattern — architectural decisions
visible in the Boondoggle Score.

**Learning outcomes:**
- M10-LO1 [PF] (Apply) Specify a generic class or method with explicit
  type bounds, invariants the type parameter must satisfy, and the runtime
  failure mode when the bound is violated.
- M10-LO2 [PA] (Analyze) Given AI-generated generic code, identify:
  unchecked cast warnings, wildcard misuse, type erasure consequences.
- M10-LO3 [IJ] (Evaluate) Choose the correct Collection for a specified
  access pattern and justify by naming the performance consequence of
  choosing incorrectly.

**Opening:** The wrong collection under load — correct on 100 items,
40-second response on 100,000 items. ArrayList where HashMap was required.

**Boondoggle Score component:** Data architecture segment — Collection
declarations + AI prompt + [PA] and [IJ] human tasks + behavioral
handoff condition.

**Key concepts:** Generic type bounds · Type erasure · Six Collection choices
and access pattern mapping · Iterator contract · Unchecked cast warning ·
Access pattern as specification language

**Case Study:** "The O(n) Lookup" — ArrayList for lookup-heavy operation,
performance failure in production.

**Glimmer:** Data architecture segment of the Boondoggle Score.
*Interrogation dimension: Specificity*

**Bridge:** "Some problems decompose naturally into smaller versions of
themselves. How do I specify those decompositions so AI builds them
correctly?"

---

### MODULE 11 — Recursion as Problem Decomposition
**One-line:** Students specify recursive methods as decomposition contracts
and audit AI-generated recursion for the three failure modes specification
silence produces.

**Learning outcomes:**
- M11-LO1 [PF] (Apply) Specify a recursive method: base case with
  termination condition, recursive case with reduction step, termination
  invariant.
- M11-LO2 [PA] (Analyze) Given AI-generated recursive implementations,
  identify: missing base case, incorrect reduction step, stack overflow
  conditions.
- M11-LO3 [IJ] (Evaluate) Decide between recursive and iterative
  implementation using stack depth, readability tradeoff, and maximum
  safe input size.

**Opening:** The stack that overflows in production — correct on inputs
up to 1,000, JVM stack overflow at 100,000. Specification never named
the maximum input size.

**Boondoggle Score component:** Recursive decomposition specification +
recursive failure mode audit as [PA] task + hardened handoff condition.

**Key concepts:** Decomposition specification three elements · Termination
invariant · Three recursive failure modes · Stack depth calculation ·
Recursive vs. iterative decision criteria

**Case Study:** "The Missing Empty Check" — null base case present, empty
list case absent, infinite recursion on empty input.

**Glimmer:** Add a recursive component to the Score.
*Interrogation dimension: Defensibility*

**Bridge:** "My system stores and retrieves data in different ways for
different operations. How do I specify those storage requirements as
architectural decisions?"

---

### MODULE 12 — Data Structures as Architectural Decisions
**One-line:** Students specify data architecture requirements by access
pattern — and produce the data architecture segment of their Boondoggle Score.

**Learning outcomes:**
- M12-LO1 [PF] (Apply) Specify a data structure requirement by access
  pattern, ordering requirement, and performance invariant.
- M12-LO2 [EI] (Analyze) Given a complete system specification, identify
  the three data structure decisions that most affect behavior under load.
- M12-LO3 [TO] (Apply) Produce the data architecture Boondoggle Score
  segment: AI tasks for schema generation, human tasks for domain
  invariant audit.

**Opening:** Two systems, same functionality, same test results. Under load:
one degrades linearly, one quadratically. One data structure choice.

**Boondoggle Score component:** Complete data architecture segment —
access pattern specifications, Collection selections, domain invariants,
AI schema generation prompt, [PA] domain invariant audit, [IJ] Collection
verification.

**Key concepts:** Access pattern specification language · Three highest-impact
decisions · Domain invariants and enforcement levels · Schema generation as
AI task · Data architecture handoff condition

**Case Study:** "The Missing Uniqueness Constraint" — ArrayList for student
storage, no duplicate prevention.

**Glimmer:** Complete data architecture segment of the course artifact.
*Interrogation dimension: WHY*

**The Glimmer portfolio reveal:** Module 12 bridge names what Module 13
will reveal — that all prior Glimmers compose into a portfolio.

---

### MODULE 13 — Hardening: Edge Cases and Failure States
**One-line:** Students find the failure states their specifications never
named — and discover that unspecified failure states are not the AI's
responsibility to handle.

**Learning outcomes:**
- M13-LO1 [PA] (Analyze) Enumerate minimum failure states per component
  and identify which the AI prompts never specified.
- M13-LO2 [PF] (Apply) Revise an AI prompt to include three previously
  unspecified failure states without expanding scope beyond the original
  boundary.
- M13-LO3 [IJ] (Evaluate) Triage edge cases by production risk: Must-Fix,
  Important for v2, Nice-to-Have — and defend each classification.

**Opening:** The Glimmer portfolio reveal — "Every Glimmer from Modules
1–12 is a component of your Boondoggle Score. Module 13 finds what it missed."

**Boondoggle Score component:** Hardening segment — failure state audit,
triage log, prompt revisions for Must-Fix states, regenerated components,
hardened handoff conditions.

**Key concepts:** Five failure state categories · Specification gap as
authorization · Must-Fix / Important / Nice-to-Have triage criteria ·
Prompt revision without scope expansion · Hardening audit structure

**Case Study:** "The Silent Data Loss" — IOException caught and swallowed,
nothing written, nothing logged.

**Glimmer:** Hardening segment of the course artifact.
*Interrogation dimension: Defensibility*

**Bridge:** "Can I defend the three most consequential architectural
decisions in this system — and identify the two handoffs where a failure
would cascade through everything?"

---

### MODULE 14 — Final Boondoggle Score: Defense
**One-line:** Students complete, finalize, and defend their Boondoggle
Score — demonstrating that architectural decisions reflect genuine
engineering judgment, not formatted compliance.

**Learning outcomes:**
- M14-LO1 [EI] (Create) Produce the complete final Boondoggle Score: all
  components, all AI prompts, all handoff conditions, full dependency graph,
  supervisory capacity labels at every human step.
- M14-LO2 [IJ] (Evaluate) Defend the three most consequential architectural
  decisions against a specific alternative, using the failure mode each
  alternative introduces.
- M14-LO3 [EI] (Evaluate) Identify the two highest-risk handoffs and specify
  the additional verification step that catches cascade failures before
  propagation.

**Opening:** Return to the pebble — a system of equivalent complexity to
Module 1's. This time the student finds everything. The comparison is the
evidence of what the course built.

**Course artifact:** Complete Boondoggle Score for a non-trivial Java system.
Final defense: 15 minutes — 5-minute score presentation, 10-minute
architectural decision defense under challenger questions.

**Key concepts:** Score completeness checklist · Consequential decision
identification · Challenger protocol · Cascade path analysis · Highest-risk
handoff identification

**Final Glimmer / Portfolio Synthesis:** 500-word reflection — what could
not be specified in Module 1 that can be specified now; one component that
changed between first Glimmer draft and final form; what changed and why.
*This is the emergent term project synthesis.*

---

## 6. Assessment Architecture

**The core assessment principle:** Every assessment produces process
evidence. The artifact is evidence that a process happened. It is not
the thing being assessed.

| Module | Primary Assessment | Assessment Type | Graded On |
|--------|-------------------|-----------------|-----------|
| 1 | First Boondoggle Score (Glimmer) | Glimmer | Prompt completeness + handoff condition testability |
| 2 | Two-method Boondoggle Score segment (Glimmer) | Glimmer | Specification precision + invariant coverage |
| 3 | Class specification + three audits (Glimmer) | Glimmer | Audit completeness + invariant identification |
| 4 | SDD Problem Summary + dependency graph (Glimmer) | Glimmer | Non-ambiguity test + load-bearing identification |
| 5 | Inheritance spec + LSP audit (Glimmer) | Glimmer | Contract completeness + audit accuracy |
| 6 | GUI spec + three-audit handoff (Glimmer) | Glimmer | User need translation + audit completeness |
| 7 | Boondoggle Score Part I + Peer Audit | Synthesis + Glimmer | Completeness + peer audit specificity |
| 8 | Interface contract + two-implementation audit (Glimmer) | Glimmer | Contract behavioral precision |
| 9 | State machine + audit (Glimmer) | Glimmer | State machine completeness + audit coverage |
| 10 | Data architecture segment (Glimmer) | Glimmer | Access pattern precision + Collection justification |
| 11 | Recursive spec + audit (Glimmer) | Glimmer | Three-element completeness + failure mode coverage |
| 12 | Data architecture segment (Glimmer) | Glimmer | Access pattern + domain invariant coverage |
| 13 | Hardening segment (Glimmer) | Glimmer | Triage defensibility + prompt revision quality |
| 14 | Final Boondoggle Score + Defense | Synthesis + Defense | Completeness + architectural decision quality |
| 14 | Portfolio Synthesis Reflection (Final Glimmer) | Glimmer | Specificity + self-regulation diagnosis |

**What is never assessed:**
- Java syntax recall (handled by Quiz Me; not a graded assessment)
- Code correctness in isolation (AI wrote the code; grading the code
  grades the AI's performance)
- Output quality without process evidence (a well-structured system with
  no audit trail is not evidence of learning)

---

## 7. Medhavy Mode Coverage by Module

| Module | Ask AI | Quiz Me | Case Study | Glimmer |
|--------|--------|---------|------------|---------|
| 0 | ✓ | — | — | — |
| 1 | ✓ | ✓ | The Confident Wrong Answer | First Score |
| 2 | ✓ | ✓ | The Unauthorized ArrayList | Two-method Score |
| 3 | ✓ | ✓ | The Singleton That Wasn't | Class specification |
| 4 | ✓ | ✓ | The Orphaned Component | SDD + dependency graph |
| 5 | ✓ | ✓ | The Composition That Should Have Been Inheritance | Inheritance spec |
| 6 | ✓ | ✓ | The Missing Registration | GUI spec |
| 7 | ✓ | ✓ | — | Peer audit report |
| 8 | ✓ | ✓ | The Null Return | Interface contract |
| 9 | ✓ | ✓ | The Accumulating Handler | State machine |
| 10 | ✓ | ✓ | The O(n) Lookup | Data architecture |
| 11 | ✓ | ✓ | The Missing Empty Check | Recursive spec |
| 12 | ✓ | ✓ | The Missing Uniqueness Constraint | Data architecture |
| 13 | ✓ | ✓ | The Silent Data Loss | Hardening segment |
| 14 | ✓ | ✓ | — | Portfolio synthesis |

**Case Study inventory:** 12 pre-written engineering scenarios required.
Each must be professor-approved before student use (per Medhavy 1.5
protocol — AI-generated cases not permitted in 1.5).

**Glimmer inventory:** 14 Glimmer prompts (one per module including Module 0
orientation Glimmer optional). Each Glimmer has a named interrogation
dimension (Mechanism, Specificity, Defensibility, WHY, Usefulness).

---

## 8. Spiral Concept Map

Three concepts spiral through the entire course, escalating at each return:

**Spiral 1 — The Handoff Condition**
- M1: Syntactic — "does it compile and match the output format?"
- M4: Semantic — "does every component map to a stated user need?"
- M7: Structural — "does the condition survive a dependency failure?"
- M13: Systemic — "does the condition catch the cascade before it propagates?"

**Spiral 2 — The Specification**
- M2: Method-level
- M3: Class-level
- M4: System-level
- M8: Contract-level (without presupposing implementation)
- M14: Defense-level (under active challenge)

**Spiral 3 — Plausibility Auditing**
- M1: Pattern recognition — "this looks wrong"
- M5: Principle-based — "this violates LSP"
- M9: Behavioral — "this state machine is incomplete"
- M13: Systemic — "this failure mode was invisible because unspecified"

---

## 9. Out of Scope (This Edition)

| Topic | Reason for Exclusion |
|---|---|
| Java concurrency and threading | Requires dedicated course; out of scope for one-semester introduction. Deferred to second edition or companion course. |
| Spring Boot / enterprise frameworks | Framework-specific; would age rapidly. Core specification and auditing skills transfer to any framework. |
| Database integration (JDBC, JPA) | Requires database fundamentals prerequisite not in this course's learner profile. Companion course candidate. |
| Unit testing frameworks (JUnit, Mockito) | Testing as a discipline warrants dedicated treatment. Handoff conditions serve the verification function for this course. Second edition candidate. |
| Design patterns (GoF) | Patterns are vocabulary for experienced practitioners. Premature for a first-course audience. Appropriate for a follow-on course. |
| Android / mobile development | Platform-specific. Would add 4+ modules. Out of scope. |
| Microservices architecture | Architectural pattern requiring distributed systems foundations. Out of scope for this course level. |
| AI model internals / LLM mechanics | This course treats AI tools as instruments. Understanding them as systems is a different course. |

**Acknowledged gap:** The absence of formal testing (JUnit) is the most
likely faculty objection. The response: handoff conditions are the course's
verification mechanism; they are introduced as a practice in Module 1 and
escalated through Module 14. A companion course on software quality
engineering would pair naturally here.

---

## 10. Adoption Risk Register (Top 3)

**Risk 1 — The "Is This Still a Java Course?" Objection**
*Likelihood: High · Impact: High*
Faculty adoption committees, curriculum committees, and program directors
will ask whether this is a Java course or an AI prompting course. The
framing of Java as an instrument for supervisory intelligence rather than
as the destination may be perceived as reducing rigor.
*Mitigation:* The Bloom's distribution (zero modules at Remember/Understand
as primary level; Create in three modules) is evidence of higher cognitive
demand, not lower. The final defense is more rigorous than a closed-book
exam. The comparison to Liang's coverage-first approach is the counter:
coverage-first produces the wrong outcomes for a multidisciplinary graduate
audience in 2026.

**Risk 2 — Adjunct Faculty Calibration on Boondoggle Score Grading**
*Likelihood: Medium · Impact: High*
An adjunct with Java industry experience can grade Java code. Grading a
Boondoggle Score — evaluating whether a specification reflects genuine
engineering judgment or formatted compliance — requires a different skill.
*Mitigation:* The Glimmer rubric dimensions (WHY, Usefulness, Mechanism,
Defensibility, Specificity) map precisely onto what an experienced engineer
evaluates in a code review. The adjunct is being asked to apply their
professional judgment to a specification document, not to learn a new
grading framework. Faculty onboarding must include one calibration session
with model Boondoggle Score examples (strong, adequate, insufficient).

**Risk 3 — Student Resistance in Weeks 1–3**
*Likelihood: Medium · Impact: Medium*
Dilnoza came to a Java course to learn Java. The first three weeks delay
Java syntax instruction in favor of methodology. Students who expected a
conventional language course will experience cognitive dissonance.
*Mitigation:* Module 0's welcome must explicitly name this dissonance and
explain why it is the design — not a detour. The pebble exercise in Module 1
must produce enough genuine engagement (real AI failures, real specification
gaps) that students experience the methodology as useful before they question
it. The first Glimmer submission (Module 1) must produce a genuine sense of
competence, not overwhelm.

---

## 11. Open Questions Log

| ID | Question | Stakes | Status | Owner |
|----|----------|--------|--------|-------|
| OQ-L4-1 | If students arrive with prior Java experience, how does Module 1 prevent experienced students from treating it as review they can skip? | Module 1 is the methodology foundation; skipping it hollows the course for all subsequent modules regardless of Java fluency | Open | Course designer |
| OQ-L4-2 | Is Medhavy Canvas AGS grade passback live for this deployment? Module 7 (midpoint integration) should be enforced as a required milestone before Module 8 unlocks. | If not live, enforcement is manual — instructor gradebook check required | Open | Medhavy deployment team |

---

*Tic TOC · /g1 complete · Full TOC compiled*
*Recommended next: /g2 (7 Adoption Failure Mode audit) before market positioning*
*Or: /m1 (market positioning) · /p1 (proposal draft)*
