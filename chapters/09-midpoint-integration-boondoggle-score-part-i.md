# Module 7: Midpoint Integration: Boondoggle Score Part I

**One-line:** Students produce and peer-audit Boondoggle Score Part I — the complete specification for their Modules 1–6 system components.

## Learning Objectives

- M7-LO1 [EI] (Create) Produce Boondoggle Score Part I: Problem Summary, architecture principles, dependency graph, AI prompts for all prior components, handoff conditions at every step.
- M7-LO2 [PA] (Evaluate) Audit a peer's Score Part I for prompt completeness, handoff condition testability, and dependency ordering correctness.

## Opening Case

Every Glimmer submission since Module 1 looked small enough to survive alone. Now the pieces are placed on one table. The method prompt assumes a class that does not exist. The GUI prompt mutates fields the class hid. The dependency graph puts the view before the repository. The midpoint is where formatted compliance stops being persuasive.

The mistake is tempting because the code looks like progress. That is the recurring trap in this course. AI can produce an artifact faster than the learner can fully explain the artifact's obligations. The course therefore asks the learner to slow down at the handoff, not at the keyboard.

## Core Concept

Integration is a different cognitive task from producing parts. A Boondoggle Score Part I must prove that the problem summary, prompts, handoff conditions, and dependency graph agree with one another. Peer audit matters because another reader can often see a gap the author's memory patched silently.

A peer audit is a structured review against named criteria: prompt completeness, handoff testability, dependency order, invariant preservation, and revision evidence.

This is where the AI-era Java course differs from a coverage-first Java course. The chapter still teaches real Java. It just teaches Java as a language for constraining and auditing delegated work. Dilnoza does not need to become faster than AI at producing boilerplate. She needs to become precise enough that the boilerplate can be judged.

![Dependency and verification flow for Midpoint Integration: Boondoggle](images/09-midpoint-integration-boondoggle-score-part-i-fig-01.png)
*Figure 9.1 — Dependency and verification flow for Midpoint Integration: Boondoggle*

## Worked Example

**Situation.** A peer reads a score for a two-screen task manager. The prompt for the controller says it should call `repository.save(task)`, but the repository specification only defines `add(Task task)`. The mismatch is not a naming nit. It is a failed handoff: AI cannot generate reliable integration code against unstable component contracts.

**Analytical process.** The conductor does four things before accepting the output:

1. Names the intended behavior in a sentence short enough to be falsified.
2. Identifies the Java element that carries the promise: class, method, interface, event handler, data structure, or graph edge.
3. Writes a handoff condition that can pass or fail.
4. Records the human audit task in the Boondoggle Score before moving downstream.

| Item | Meaning |
| --- | --- |
| Midpoint Integration: Boondoggle Score Part I Boondoggle Score excerpt with columns for AI task, human supervisory capacity, handoff condition, evidence, and downstream dependency. | A concrete checkpoint for applying the chapter concept. |

**Dead end.** The common dead end is accepting the first artifact that appears coherent. Coherence is not compliance. The learner must point to the exact clause or invariant the artifact satisfies.

**Resolution.** The output is accepted only after the handoff condition passes. If the condition fails, the student does not patch silently. She revises the prompt, records the failure, and explains whether the failure came from the prompt, the model output, or the human's missing constraint.

**The lesson:** generated Java is a candidate answer, not evidence of completion.

**The limit:** this method cannot prove every property of a system; it makes the most important obligations explicit enough to audit.

## Boondoggle Score Checkpoint

For this module, add one score segment with these fields:

- **AI task:** the work the model is allowed to perform for midpoint integration: boondoggle score part i.
- **Human task:** the decision or audit the learner must perform personally.
- **Handoff condition:** one binary rule that must pass before the next dependency begins.
- **Evidence:** the exact code, prompt clause, diagram edge, or revision note that proves the handoff passed.
- **Supervisory capacity:** one of Problem Formulation, Tool Orchestration, Plausibility Auditing, Interpretive Judgment, or Executive Integration.

The checkpoint is intentionally small. The course is building a habit: every delegation has an acceptance condition, and every acceptance condition has evidence.

## Common Misconceptions

**Peer audit is proofreading.** Proofreading catches surface errors. This audit catches specification contradictions.

**If each component is good, the system is good.** Integration failures often occur between good components whose assumptions differ.

**Revision history is bureaucratic.** Revision history is evidence that the audit changed the design rather than merely decorating it.

## Exercises

1. **Apply:** Write a prompt for a Java artifact in this module's domain. Include output format, constraints, and at least two things AI must not do.
2. **Analyze:** Given an AI-generated answer, mark the first line or design choice that violates the specification. Explain whether the problem is prompt omission, model failure, or human acceptance failure.
3. **Create:** Add one Boondoggle Score row for your own course project. The row must include AI task, human task, handoff condition, and evidence.
4. **Evaluate:** Name one alternative design or prompt choice and defend why you rejected it. Your defense must name the failure mode the alternative would introduce.

## What Would Change My Mind

I would revise this chapter's central claim if controlled classroom evidence showed that students who accepted AI-generated Java with only code-output grading developed equal or better ability to identify specification violations, defend architectural decisions, and catch hidden failure states than students who maintained Boondoggle Scores. The relevant evidence would need to test transfer to unfamiliar systems, not just performance on the same assignment type.

## Still Puzzling

- How much Java syntax should be retrieved from memory before AI assistance becomes educationally harmful rather than helpful?
- Which handoff conditions are best checked by inspection, and which require execution, tests, or peer review?
- How should the course calibrate students who arrive with strong Java experience but weak specification discipline?
- What evidence from the first course run should be added to replace illustrative cases with documented local cases?

## Sources and Drafting Notes

Sources to carry into drafting: Peng et al., 2023; Vaithilingam et al., 2022; Pearce et al., 2022; Gosling et al., Java Language Specification, Java SE 21, 2023; Oracle Java SE API, 2023; Collins, Brown, and Newman, 1989; Sweller, 1988; Robins, Rountree, and Rountree, 2003; Chi and Wylie, 2014; Parnas, 1972; Meyer, 1997; Fagan, 1976; Bass, Clements, and Kazman, 2021.

Claims about specific AI-tool performance, wage premiums, or current platform behavior should be verified near publication. The TIKTOC's 56% wage-premium claim is motivational but still needs original-source confirmation before final release. [verify]

---

## Prompts

Use these prompts with Claude to generate interactive D3 v7 versions of the
figures in this chapter. Each produces a standalone HTML file you can open
in a browser and modify freely.

**Prerequisites:** Load `brutalist/CLAUDE.md` and `brutalist/DESIGN.md` into
your Claude project context before using these prompts. They define the stack,
naming conventions, color system, and typography the figures use.

---

### Figure 9.1 — Dependency and verification flow for Midpoint Integration: Boondoggle

Create a standalone D3 v7 HTML file for Figure Dependency and verification flow for Midpoint Integration: Boondoggle. Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Dependency and verification flow for Midpoint Integration: Boondoggle Score Part I, showing the learner's specification, AI generation, human audit, handoff condition, and next component.. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/09-midpoint-integration-boondoggle-score-part-i-fig-01.html`
