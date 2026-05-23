# Module 0: Welcome and Course Orientation

**One-line:** Orientation only — not a content module: faculty context, the AI+1 argument, Boondoggle Score preview, Medhavy workflow, and required AI-use integrity norms.

## Learning Objectives

- Describe the AI+1 argument in plain language and explain why this course requires supervised AI use.
- Identify the parts of a Boondoggle Score: AI task, human task, handoff condition, dependency, and supervisory capacity label.
- Apply the course integrity policy by disclosing tool use, accepted output, rejected output, and unresolved uncertainty.

## Opening Case

Dilnoza arrives expecting a Java course. She expects variables, loops, classes, and eventually a project. Instead, the first artifact she sees is a completed Boondoggle Score for a small Java build: prompts, dependency edges, rejected AI output, and human audit notes. At first it feels sideways. Then she sees the code compiles while one requirement is silently violated. The question changes. The course is not asking whether AI can write Java. It is asking whether she can be accountable for Java that AI helped write.

The mistake is tempting because the code looks like progress. That is the recurring trap in this course. AI can produce an artifact faster than the learner can fully explain the artifact's obligations. The course therefore asks the learner to slow down at the handoff, not at the keyboard.

## Core Concept

This chapter frames the course as programming by conducting. A conductor does not play every instrument, but the conductor is responsible for the score, the entrances, the balance, and the moment when a wrong note matters. In this book, AI is the instrument. Java is the musical language. The human engineer owns the score.

A Boondoggle Score is a dependency-ordered record of an AI-assisted build. Each row names what AI is allowed to do, what the human must verify or decide, what evidence permits the next step, and which supervisory capacity is being exercised.

This is where the AI-era Java course differs from a coverage-first Java course. The chapter still teaches real Java. It just teaches Java as a language for constraining and auditing delegated work. Dilnoza does not need to become faster than AI at producing boilerplate. She needs to become precise enough that the boilerplate can be judged.

![Dependency and verification flow for Welcome and Course](images/02-welcome-and-course-orientation-fig-01.png)
*Figure 2.1 — Dependency and verification flow for Welcome and Course*

## Worked Example

**Situation.** A first orientation score has three rows. Row one asks AI to generate a `Greeting` class with a named method and no extra dependencies. Row two assigns the human to inspect whether the generated code used the required method signature. Row three permits execution only if the class name, method name, output format, and forbidden additions all match the prompt.

**Analytical process.** The conductor does four things before accepting the output:

1. Names the intended behavior in a sentence short enough to be falsified.
2. Identifies the Java element that carries the promise: class, method, interface, event handler, data structure, or graph edge.
3. Writes a handoff condition that can pass or fail.
4. Records the human audit task in the Boondoggle Score before moving downstream.

| Item | Meaning |
| --- | --- |
| Welcome and Course Orientation Boondoggle Score excerpt with columns for AI task, human supervisory capacity, handoff condition, evidence, and downstream dependency. | A concrete checkpoint for applying the chapter concept. |

**Dead end.** The common dead end is accepting the first artifact that appears coherent. Coherence is not compliance. The learner must point to the exact clause or invariant the artifact satisfies.

**Resolution.** The output is accepted only after the handoff condition passes. If the condition fails, the student does not patch silently. She revises the prompt, records the failure, and explains whether the failure came from the prompt, the model output, or the human's missing constraint.

**The lesson:** generated Java is a candidate answer, not evidence of completion.

**The limit:** this method cannot prove every property of a system; it makes the most important obligations explicit enough to audit.

## Boondoggle Score Checkpoint

For this module, add one score segment with these fields:

- **AI task:** the work the model is allowed to perform for welcome and course orientation.
- **Human task:** the decision or audit the learner must perform personally.
- **Handoff condition:** one binary rule that must pass before the next dependency begins.
- **Evidence:** the exact code, prompt clause, diagram edge, or revision note that proves the handoff passed.
- **Supervisory capacity:** one of Problem Formulation, Tool Orchestration, Plausibility Auditing, Interpretive Judgment, or Executive Integration.

The checkpoint is intentionally small. The course is building a habit: every delegation has an acceptance condition, and every acceptance condition has evidence.

## Common Misconceptions

**If AI use is required, integrity no longer matters.** Required use makes integrity more visible, not less. The submitted evidence shifts from pretending no tool was used to showing what the learner asked, accepted, rejected, and verified.

**The Boondoggle Score is paperwork after coding.** The score is the build plan. If it is written after the code, it cannot protect the handoffs that already happened.

**A Java course should start with syntax.** This course starts with accountability because syntax without acceptance criteria teaches students to trust whatever compiles.

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

### Figure 2.1 — Dependency and verification flow for Welcome and Course

Create a standalone D3 v7 HTML file for Figure Dependency and verification flow for Welcome and Course. Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Dependency and verification flow for Welcome and Course Orientation, showing the learner's specification, AI generation, human audit, handoff condition, and next component.. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/02-welcome-and-course-orientation-fig-01.html`
