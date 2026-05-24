# Chapter 2 — Welcome and Course Orientation
*The instrument plays. The conductor is responsible.*

There is a story I want to tell you before we write a single line of Java.

A student — call her Dilnoza — opens the course expecting something familiar: variables, loops, classes, a project at the end. That is how programming courses go. You learn the vocabulary, you practice the grammar, eventually you build something and the building proves you learned. Dilnoza has done this before. She knows how to study it.

What she finds instead is a completed document she has never seen anything like. It is a table with rows and columns, and it describes a small Java build she did not write. One column says what AI was allowed to do. Another says what the human had to verify. A third says what evidence would prove the handoff between them worked. At the bottom, there is a note: *one requirement is silently violated, and the code compiles anyway.*

She reads that again. The code compiles. The requirement is violated. Both things are true at once.

The question the course is asking — the real question, the one that runs through every chapter that follows — is not whether AI can write Java. Of course it can write Java. The question is whether *she* can be accountable for Java that AI helped write. Those are completely different skills, and only one of them will still matter when the code is running somewhere she cannot reach.

---

## What a Conductor Actually Does

![A conductor mid-gesture at a podium, baton raised,](images/02-welcome-and-course-orientation-fig-01.png)
*Figure 2.1 — A conductor mid-gesture at a podium, baton raised,*

I want you to think about what a conductor does during a performance. Not the waving — the *responsibility*.

The conductor does not play the violin. She does not blow the oboe. She does not read one part at a time; she reads the score, which is all the parts simultaneously, and she knows what each part is supposed to do *relative to every other part* at every moment. When the cellos enter a beat late, she hears it against what the violas are doing. When the tempo creeps, she feels it against where the piece needs to be in four bars. She is not faster than the musicians at playing their instruments. She is accountable for the whole in a way that no individual musician can be.

That is the job this course is training you for.

AI is the instrument. Java is the musical language — the shared notation that makes the performance possible. You are the conductor. And the conductor's job is not to be faster than the musicians. It is to hold the score in mind, to know when an entrance is wrong, and to be the person the hall holds responsible when it is.

There is an old word for a score that has been padded, elaborated, and over-arranged until the underlying music disappears under its own ornament. A *boondoggle*. The Boondoggle Score in this course takes that word deliberately. Every AI-assisted build has a moment when the output gets accepted because it *looks like progress* — the artifact is there, it compiles, it runs — and the underlying obligation quietly vanishes. The Boondoggle Score is the method for keeping that obligation visible. It is a dependency-ordered record of the build: what AI was asked to do, what the human verified, what evidence permitted the next step, and what capacity the human was exercising at each handoff.

We will return to exactly what that means. But first I want to say something about why this course starts here, before syntax, before loops, before classes.

---

## The Trap That Looks Like Progress

Here is something worth understanding about how AI produces code.

When you give a language model a well-specified prompt — give it the class name, the method signature, the output format, the things it must not include — it can produce working Java faster than most humans typing. Not faster than a human copy-pasting, but faster than a human *thinking*. And the output often looks exactly right. It compiles. It runs. The variable names are sensible. The formatting is clean.

The problem is that *looking right* and *being right* are not the same condition, and the gap between them is where software fails.

| Item | Meaning |
| --- | --- |
| "What compilation proves" vs. "What compilation does not prove" | rows include: syntax is valid |
| types are consistent | invariants hold |
| method calls resolve | edge cases are handled |
| the build tool is satisfied | the person who specified the behavior is satisfied |

A compiler checks a very specific set of things. It checks that your syntax follows the rules of the language. It checks that the types are consistent. It checks that the methods you call exist and take the arguments you are passing. It does not check whether the method does what you intended. It does not check whether the class you built satisfies the requirement you were given. It does not check whether the name you chose accurately describes the behavior. Those things are not the compiler's job. They are yours.

When a human writes all the code by hand, this gap is usually manageable — not because humans are more careful, but because the act of writing forces you to think through the logic at the level of each line. You cannot write a loop without deciding how it terminates. You cannot write a conditional without deciding what the two branches do. The thinking and the typing happen at the same time, and errors that survive compilation get caught by the programmer who just spent five minutes building the thing and still has it in working memory.

When AI writes the code, that coupling breaks. The artifact arrives already assembled. You did not build the loop; you received it. You did not choose the conditional logic; you inherited it. The code is in front of you but the reasoning that produced it is not, and your working memory contains the *specification you wrote*, not the *implementation you received*. Those two things can diverge in ways that are invisible until they matter.

This is not a reason to avoid AI. It is a reason to understand exactly what changes when you use it. The artifact arrives faster, but the obligation to verify it does not go away — it becomes, if anything, harder to discharge, because you are auditing something you did not build rather than reviewing something you built.

---

## Five Capacities

The course maps five distinct things a human engineer does when supervising AI-assisted work. These are not five phases in a sequence. They are five *capacities* — five kinds of judgment — that any given handoff might require one or more of.

**Problem Formulation.** Before AI can do anything useful, someone has to know what the problem actually is. Not the words that describe the problem, but the structure of it — the constraints, the failure modes, the edge cases, the things the output must never do. This is harder than it sounds. A prompt that seems specific often underspecifies the most important things. The capacity being exercised here is the ability to translate an engineering intention into a specification precise enough to be falsified.

**Tool Orchestration.** This is the capacity to sequence AI tasks correctly — to know which things AI can be given in which order, what has to be done before what, and where a dependency means that accepting bad output early will corrupt everything downstream. A build has a structure. The Boondoggle Score makes that structure explicit.

**Plausibility Auditing.** The generated artifact arrives. Does it look right? This is not asking whether it compiles. This is asking whether the logic, the names, the structure, and the behavior match the specification well enough to proceed. Plausibility auditing is the capacity to look at the output and see the gap between what was asked and what was produced — even when the gap is not a syntax error and would not be caught by a test.

**Interpretive Judgment.** Some problems require a decision that AI cannot make — not because AI could not generate a plausible-looking answer, but because the decision requires weighing things that are not in the prompt. Who is this for? What happens when it fails? What is the cost of being wrong in the conservative direction versus the aggressive direction? Interpretive judgment is the capacity to make that call and record it.

**Executive Integration.** At the end of a build, all the pieces have to cohere. Not just compile together — cohere. The class names have to reflect the same conceptual model. The method behavior has to be consistent across the system. The thing has to do what it was supposed to do for the person who asked for it. Executive integration is the capacity to hold the whole in mind, the way a conductor holds the score.

![Five-panel horizontal layout, one panel per supervisory capacity](images/02-welcome-and-course-orientation-fig-02.png)
*Figure 2.2 — Five-panel horizontal layout, one panel per supervisory capacity*

These five capacities are what the Boondoggle Score is tracking. Each row of the score asks: which of these is the human exercising at this handoff? And the answer tells you something about whether the handoff is being taken seriously.

---

## What the Score Looks Like

Let me show you a small example before we go any further, because the concept becomes much clearer once you have seen a concrete instance.

Suppose the task is to generate a `Greeting` class with a single method, `greet(String name)`, that returns a formatted string. The method must return a string in the format `"Hello, [name]!"` — not `"Hi"`, not `"Hello [name]"`, not `"Hello, [name].\n"` — exactly that format. The class must have no other methods, no fields, no imports beyond what the method itself requires.

Here is what one row of the Boondoggle Score looks like for that task:

| AI Task | Human Task | Handoff Condition | Evidence | Supervisory Capacity |
| --- | --- | --- | --- | --- |
| Boondoggle Score row — | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

The handoff condition is binary. It passes or it does not. The student does not decide that the output is "close enough" and move on. She does not patch the output silently and pretend the issue never happened. If the condition fails, she records the failure, revises the prompt, and explains — in the score — whether the problem was in the prompt, in the model's output, or in a constraint she failed to specify.

That last distinction matters more than it might seem. A prompt omission is different from a model failure. A prompt omission means the specification was incomplete — the human did not constrain the thing that went wrong. A model failure means the prompt was clear and the model still produced something that violated it. These two failure modes have different remedies, and conflating them produces the same error twice.

The point of writing the handoff condition *before* receiving the output is to make this distinction visible. If you write the condition after — if you look at the output and then decide what the condition should have been — you will always find a condition the output satisfies. That is not auditing. That is rationalization.

---

## Why Java, and Why Like This

![Sheet music for a small ensemble ](images/02-welcome-and-course-orientation-fig-03.png)
*Figure 2.3 — Sheet music for a small ensemble *

You might reasonably ask: why does a Java course care about any of this? Java is a language. A course on Java should teach the language.

Here is the thing. Java is a language that was designed, from its earliest versions, around the idea that programs are *specifications of behavior* that run without a human supervising each instruction. Once you compile the program and give it to the machine, the machine does what the program says — not what you *meant* the program to say. The program is precise in a way that human intentions usually are not, and the gap between them is where bugs live.

This course teaches Java as a language for *expressing constraints* — for saying, precisely, what a piece of delegated work is allowed to do, must do, and must never do. That is what method signatures are. That is what access modifiers are. That is what interfaces are. They are all ways of specifying, in language the machine can check, what the obligations of a piece of code are.

When you add AI to the picture, this constraint-specification function becomes the *critical* skill. The machine will check that your types are consistent. The compiler will check that your syntax is valid. But whether the AI-generated class satisfies the behavioral obligation you actually had in mind — whether the thing does what it was supposed to do — that check belongs to the human engineer. The Boondoggle Score is how you structure that check so it does not get skipped.

The alternative — accepting generated code because it compiles, testing it perfunctorily, shipping it — is not programming. It is transcription. And the thing about transcription is that the transcriber does not understand what she is copying, which means she cannot catch the error in it.

Dilnoza, at the end of the course, will know Java. She will know it as a specification language, a constraint language, a language for making obligations explicit. She will know how to write a prompt that a model can fail at in a falsifiable way. She will know how to read the output against the specification rather than against her hope. She will know what "it compiles" does and does not prove.

That is the course. That is why it starts here.

---

## What to Carry Into the Next Chapter

![A simple dependency arrow diagram ](images/02-welcome-and-course-orientation-fig-04.png)
*Figure 2.4 — A simple dependency arrow diagram *

Before you move to Chapter 3, you should be able to do three things.

First: describe the AI+1 argument in a sentence that a skeptical colleague would find worth arguing with. Not "AI is useful but humans still matter" — that is too vague to be interesting. Something like: *the value of AI assistance in software development scales with the precision of the human's specification and the rigor of the human's verification, not with the fluency of the output.* If you can make that argument and defend it against the obvious objection — that fluent output is often correct output — you understand what this course is about.

Second: look at a Boondoggle Score row and name the supervisory capacity it exercises. You do not need to have built one yet. You need to be able to read one and say: *this handoff is asking the human to exercise plausibility auditing, and here is what that means concretely.*

Third: know the integrity norm. In this course, when you use AI, you disclose what you asked, what you accepted, what you rejected, and where you are still uncertain. Not because the tool is forbidden — it is required — but because the disclosure is how the instructor can see whether you are supervising the tool or being supervised by it.

The chapter that follows teaches the first Java concept you will need. It is a small concept, carefully chosen. You will write a specification for AI. You will receive output. You will audit it against a handoff condition you wrote before you saw the output. You will record what happened.

The music begins.

---

## Exercises

These exercises are designed to be completed with an AI tool of your choice. The goal is not to generate correct Java. The goal is to generate Java in a way that can be audited.

**Warm-Up**

1. Write a prompt for a Java class called `Multiplier` with a single method `multiply(int a, int b)` that returns `int`. The prompt must specify: the class name, the method signature, the return behavior, and at least two things the class must not contain. Before submitting the prompt, write the handoff condition — the binary rule that will determine whether you accept the output.

2. Submit your prompt and receive AI-generated output. Apply your handoff condition. If it passes, record the evidence. If it fails, record what failed and whether the cause was a prompt omission, a model failure, or a constraint you did not anticipate.

**Application**

3. Extend the prompt from Exercise 1 to handle the case where both arguments are zero. Write a new handoff condition that covers this case. Generate new output and audit it. Compare the two outputs and explain what changed.

4. Take a peer's handoff condition (or invent one that is plausible but slightly underspecified) and find a piece of AI-generated code that would pass the condition while violating the spirit of the specification. Explain the gap in one sentence.

**Synthesis**

5. Write a two-row Boondoggle Score for a build that produces a `Formatter` class with one method and a `Runner` class that calls it. The second row must depend on the first passing. For each row: AI task, human task, handoff condition, evidence type, supervisory capacity.

6. The following prompt was submitted and the output compiled but failed the handoff condition: *"Write a Java class that greets a user."* Rewrite the prompt so that the handoff condition you would write is falsifiable. Then write that condition.

**Challenge**

7. Design a Boondoggle Score for a small three-class system of your choice. The system must have at least one dependency edge (Class B cannot be built until Class A is audited). Explain how a failure in the first row would propagate if it were not caught, and what kind of failure it would produce downstream.

---

## LLM Exercises

Use these prompts with a language model to extend your understanding. Treat each generated response as an artifact to be audited, not a source to be cited.

**LLM Exercise 1 — Stress-Testing Handoff Conditions**

```
I am writing a Boondoggle Score for a Java build. Here is my handoff condition:

[paste your handoff condition from Exercise 1 or 2]

Generate a Java class that compiles and passes this condition while violating the behavioral intent behind it. Then explain what I would need to add to the condition to close that gap.
```

**LLM Exercise 2 — Prompt Precision Audit**

```
Here is a prompt I wrote for a Java artifact:

[paste your prompt]

List every behavioral dimension the prompt leaves unspecified. For each gap, give one example of generated output that would compile and satisfy the stated constraints but violate a reasonable interpretation of the intent.
```

**LLM Exercise 3 — Boondoggle Score Generation**

```
Here is a small Java build specification:

[describe a 2–3 class system in plain language]

Generate a Boondoggle Score for this build with one row per delegation step. Each row must include: AI task, human task, handoff condition, evidence type, and supervisory capacity. Flag any step where the handoff condition you are proposing cannot be checked by inspection alone — it would require execution, a test, or peer review.
```

After receiving the generated score, audit it: are the handoff conditions actually binary? Are the supervisory capacity labels accurate? Revise any row where the answer is no.

## Prompts

Use these prompts with Claude to generate interactive D3 v7 versions of the
figures in this chapter. Each produces a standalone HTML file you can open
in a browser and modify freely.

**Prerequisites:** Load `brutalist/CLAUDE.md` and `brutalist/DESIGN.md` into
your Claude project context before using these prompts. They define the stack,
naming conventions, color system, and typography the figures use.

---

### Figure 2.1 — A conductor mid-gesture at a podium, baton raised,

Create a standalone D3 v7 HTML file for Figure A conductor mid-gesture at a podium, baton raised,. Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: A conductor mid-gesture at a podium, baton raised, orchestra visible but slightly blurred behind — emphasizing the human figure as the locus of accountability, not the players. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/02-welcome-and-course-orientation-fig-01.html`

---

### Figure 2.2 — Five-panel horizontal layout, one panel per supervisory capacity

Create a standalone D3 v7 HTML file for Figure Five-panel horizontal layout, one panel per supervisory capacity. Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Five-panel horizontal layout, one panel per supervisory capacity — label, one-sentence definition, and a small icon or glyph that represents the kind of judgment involved. Designed to be readable at a glance and memorable as a reference card.. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/02-welcome-and-course-orientation-fig-02.html`

---

### Figure 2.3 — Sheet music for a small ensemble 

Create a standalone D3 v7 HTML file for Figure Sheet music for a small ensemble . Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Sheet music for a small ensemble — close crop on one part, with pencil annotations in the margin — evoking the idea of a score as a living document being interpreted, not just executed. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/02-welcome-and-course-orientation-fig-03.html`

---

### Figure 2.4 — A simple dependency arrow diagram 

Create a standalone D3 v7 HTML file for Figure A simple dependency arrow diagram . Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: A simple dependency arrow diagram — "Specification" → "Delegation" → "Audit" → "Handoff" → "Next Dependency" — with a small label under each node indicating what can go wrong at that stage: underspecification, prompt omission, plausibility failure, rationalized acceptance, propagated error. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/02-welcome-and-course-orientation-fig-04.html`
