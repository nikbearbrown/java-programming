# Module 2: Java Foundations for Specification

**One-line:** Students learn enough Java to write specifications that constrain AI generation — and to evaluate whether AI's output satisfied them.

## Learning Objectives

- M2-LO1 [PF] (Apply) Write a variable and method specification precise enough that AI generates correct Java with no post-generation ambiguity.
- M2-LO2 [PA] (Analyze) Given AI-generated Java for a specified method, determine whether the output satisfies stated invariants and flag violating lines.
- M2-LO3 [TO] (Apply) Define a handoff condition that is binary, testable without running the code, and grounded in specification not aesthetics.

## Opening Case

A student asks AI for a method that reads scores and returns the average. The generated method works for the sample input. It also divides by zero on an empty array, rounds differently from the requirement, and changes the parameter type from `int[]` to `ArrayList<Integer>`. The output is not nonsense. That is what makes it dangerous.

The mistake is tempting because the code looks like progress. That is the recurring trap in this course. AI can produce an artifact faster than the learner can fully explain the artifact's obligations. The course therefore asks the learner to slow down at the handoff, not at the keyboard.

## Core Concept

Java foundations matter here because type, method signature, return value, and exception behavior are specification tools. A learner does not need to memorize the whole Java Language Specification. But she must understand that `int[] scores`, `double`, `static`, and `throws IOException` are not decoration. They constrain what AI may build and what the human can audit.

A method specification states the method name, parameter list, return type, preconditions, postconditions, side effects, and failure behavior. An invariant is a condition that must remain true before and after the method runs.

This is where the AI-era Java course differs from a coverage-first Java course. The chapter still teaches real Java. It just teaches Java as a language for constraining and auditing delegated work. Dilnoza does not need to become faster than AI at producing boilerplate. She needs to become precise enough that the boilerplate can be judged.

![Dependency and verification flow for Java Foundations for](images/04-java-foundations-for-specification-fig-01.png)
*Figure 4.1 — Dependency and verification flow for Java Foundations for*

## Worked Example

**Situation.** Suppose the component needs `public static double averageScore(int[] scores)`. The specification says `scores` must not be null, empty input returns `0.0`, and the method must not modify the array. AI returns a version that converts to `List<Integer>` and throws on empty input. The audit is not 'does it look Java-like?' The audit asks: did the signature stay fixed, did the empty case match, and was the input left unchanged?

**Analytical process.** The conductor does four things before accepting the output:

1. Names the intended behavior in a sentence short enough to be falsified.
2. Identifies the Java element that carries the promise: class, method, interface, event handler, data structure, or graph edge.
3. Writes a handoff condition that can pass or fail.
4. Records the human audit task in the Boondoggle Score before moving downstream.

| Item | Meaning |
| --- | --- |
| Java Foundations for Specification Boondoggle Score excerpt with columns for AI task, human supervisory capacity, handoff condition, evidence, and downstream dependency. | A concrete checkpoint for applying the chapter concept. |

**Dead end.** The common dead end is accepting the first artifact that appears coherent. Coherence is not compliance. The learner must point to the exact clause or invariant the artifact satisfies.

**Resolution.** The output is accepted only after the handoff condition passes. If the condition fails, the student does not patch silently. She revises the prompt, records the failure, and explains whether the failure came from the prompt, the model output, or the human's missing constraint.

**The lesson:** generated Java is a candidate answer, not evidence of completion.

**The limit:** this method cannot prove every property of a system; it makes the most important obligations explicit enough to audit.

## Boondoggle Score Checkpoint

For this module, add one score segment with these fields:

- **AI task:** the work the model is allowed to perform for java foundations for specification.
- **Human task:** the decision or audit the learner must perform personally.
- **Handoff condition:** one binary rule that must pass before the next dependency begins.
- **Evidence:** the exact code, prompt clause, diagram edge, or revision note that proves the handoff passed.
- **Supervisory capacity:** one of Problem Formulation, Tool Orchestration, Plausibility Auditing, Interpretive Judgment, or Executive Integration.

The checkpoint is intentionally small. The course is building a habit: every delegation has an acceptance condition, and every acceptance condition has evidence.

## Common Misconceptions

**Changing `int[]` to `ArrayList<Integer>` is harmless because both hold numbers.** The storage type is part of the requirement. Changing it may change dependencies, memory behavior, and the lesson the component is meant to teach.

**A handoff condition should run the code.** Some handoff checks should happen before execution: signature, forbidden dependencies, mutation, and explicit exception behavior can often be inspected.

**Types are syntax chores.** In Java, types are promises. They are one of the first ways the human constrains generation.

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

### Figure 4.1 — Dependency and verification flow for Java Foundations for

Create a standalone D3 v7 HTML file for Figure Dependency and verification flow for Java Foundations for. Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Dependency and verification flow for Java Foundations for Specification, showing the learner's specification, AI generation, human audit, handoff condition, and next component.. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/04-java-foundations-for-specification-fig-01.html`
