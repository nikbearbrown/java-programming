# Chapter 4 — Java Foundations for Specification
*The type is a promise. Learn to read the promises before you read the code.*

---

Here is something that happened in a classroom I ran, and I want to start with it because it illustrates the exact thing I'm going to spend this chapter on.

A student asked an AI system to write a method that reads an array of scores and returns the average. The AI produced working Java. The student ran it on the sample input, saw the right number appear, and moved on. The method also divided by zero on an empty array. It also rounded differently from the specification. It also changed the parameter from `int[]` to `ArrayList<Integer>`.

None of that was visible from the output. The output was a number. The number was correct. The student accepted the artifact.

That is the trap. And it is a trap precisely because the code *looks right*. When something looks wrong, you notice it. When something looks like progress, you stop looking.

I want you to understand why the student's method was wrong — not because it crashed on empty input, but because the student had no way to know it was wrong. She had no specification to audit against. She had a result, and results feel like answers. They are not always answers. Sometimes they are the beginning of a more dangerous problem.

<!-- → [INFOGRAPHIC: The trap — two-column split showing what the student saw (correct output on sample input, checkmark) vs. what was actually in the generated method (divide-by-zero on empty array, wrong rounding, wrong parameter type); the visual should make the gap between visible output and hidden violations legible at a glance] -->

---

## What Java Actually Is, In This Context

Most introductory Java courses begin with syntax. Here is how you declare a variable. Here is how you write a loop. Here is how you call a method. That is a perfectly reasonable way to teach Java when the goal is to get students writing code.

That is not what I'm doing here.

I'm going to teach you Java as a *specification language*. A language for making promises about behavior that can be stated precisely enough to audit. The reason is simple: if you are working with AI generation, the syntax is not your problem. The AI knows the syntax. Your problem is whether the thing the AI produced satisfies the obligations you had in mind when you made the request. And to know that, you need to understand what Java's structural elements are actually *saying*.

Let me show you what I mean.

When you write `int[] scores` as a parameter, you are not just picking a container. You are saying: this method accepts a fixed-length sequence of integers. Not a list. Not a set. Not a nullable object reference that could be an ArrayList. A fixed-length sequence of integers. That is a constraint on what callers may pass and a promise about what the method will see.

When you write `double` as a return type, you are saying: this method produces a 64-bit floating-point number. Not an integer. Not a string. A double. If the result needs to be exact to two decimal places and you later discover that `double` arithmetic produces floating-point rounding errors at the fifth decimal place — that is a specification issue. It was present before the first line of the method body was written.

When you write `static`, you are saying: this method has no instance state. It does not depend on which object called it. It has only its inputs.

When you write `throws IOException`, you are saying: callers of this method must be prepared for the possibility that it fails in a specific, named way.

None of this is syntax decoration. Every word in a Java method signature is a constraint. The signature is the outermost ring of the specification. If the AI generated a method with the wrong signature, the audit starts there, before you read a single line of the body.

<!-- → [TABLE: Java signature elements and their specification meaning — columns: element, what it promises to callers, what it constrains in the body, common AI-generated violation] -->

---

## The Method Specification as a Structured Promise

Let me give you a more precise framework. A method specification has six parts. I want you to know all six because the common failure mode is omitting three of them and then being surprised when the generated code violates the omitted ones.

**Name.** What the method is called. This matters because naming is meaning. A method called `computeAverage` carries a different implicit contract than a method called `getAverage` or `average`. The name communicates intent to anyone reading the code and to the AI system generating it.

**Parameter list.** The types, order, and names of everything the method receives. The types are the binding constraints. The names are documentation. If you specify `int[] scores`, you have told the AI that the input is an array of primitives with a fixed length. The AI should not return a version that accepts `List<Integer>` without explicit permission.

**Return type.** What the method produces. A `double` is not an `int`. An `Optional<Double>` is not a `double`. The return type determines what callers can do with the output and what the method is permitted to return in edge cases.

**Preconditions.** What must be true about the inputs before the method runs. Preconditions are the caller's obligations. If `scores` must not be null, that is a precondition. If `scores` must have at least one element, that is a precondition. Preconditions that go unstated are the most common source of silent failures — the code runs without error, but on inputs the specification never anticipated.

**Postconditions.** What must be true about the output after the method runs. Postconditions are the method's obligations to callers. If an empty `scores` array should produce `0.0`, that is a postcondition. If the returned value must be the arithmetic mean of all elements, rounded to two decimal places using half-up rounding, those are postconditions. Be as specific as you can afford to be. Vague postconditions are invitations for AI to make choices on your behalf that you did not authorize.

**Side effects and failure behavior.** Does the method modify its inputs? Does it write to a file? Does it change any external state? What does it do when something goes wrong — does it return a sentinel value, throw a named exception, or crash? These are not edge cases. They are part of the specification, and they are frequently the part that AI generates incorrectly because they were not stated.

<!-- → [TABLE: Six-part method specification for averageScore — rows: name, parameter list, return type, preconditions, postconditions, failure behavior — with one column showing what the student stated and one showing what AI generated] -->

Here is what a specification for the averaging method might look like if you write it out completely:

> **Method:** `averageScore`
> **Signature:** `public static double averageScore(int[] scores)`
> **Preconditions:** `scores` is not null.
> **Postconditions:** If `scores.length == 0`, returns `0.0`. Otherwise, returns the arithmetic mean of all elements in `scores` as a `double`, using standard floating-point division. The elements of `scores` are not modified.
> **Side effects:** None.
> **Failure behavior:** Throws `IllegalArgumentException` if `scores` is null.

Now look at that specification and ask: could an AI generate a method that passes every test on non-empty, non-null input and still violates this specification? Yes. Easily. It could modify the array elements as a side effect of sorting before computing. It could return an `int` by accidentally using integer division. It could return a different value for empty arrays. It could silently accept null and produce a `NullPointerException` rather than throwing `IllegalArgumentException`.

The specification is not paranoia. The specification is what turns a vague sense of "I wanted an averaging method" into a falsifiable contract.

---

## Invariants: What Must Stay True

There is a related concept that I want to introduce here because it becomes essential when you start auditing AI-generated code for larger systems. An *invariant* is a condition that must remain true before and after a method runs — not just about the return value, but about the state of the data the method touches.

The simplest invariant for `averageScore` is this: the elements of `scores` after the method returns must be identical to the elements of `scores` before the method was called. The array is not the method's to modify. If AI generates a version that sorts the array as a performance optimization — sorting is faster to average if you want to skip duplicates, say — that violates the invariant even if the returned average is correct.

Invariants matter most when data is shared. If the same array is passed to three different methods and one of them modifies it, the other two are now operating on a different input than the specification assumed. This is a class of bug that is extremely difficult to detect from outputs alone. The output may still look correct on the next call, if the modification happened in a particular order. The bug surfaces under a specific sequence of operations that may not appear in any test case.

The way you catch it is not by running the code more. The way you catch it is by stating the invariant before generation and auditing for it before acceptance.

<!-- → [INFOGRAPHIC: Before/after state diagram — array contents before method call vs. after, showing invariant preservation (contents unchanged) vs. invariant violation (sorted as side effect)] -->

---

## What the Audit Actually Looks Like

I want to be concrete about what happens when you receive AI-generated Java and your job is to determine whether it satisfies your specification. This is not a vague process. There is a sequence of things you check, in order, before you accept the artifact.

**First: check the signature.** Is the method name correct? Is the parameter list exactly what was specified — same types, same order, no additions, no substitutions? Is the return type correct? Does the `throws` clause match?

If any of these are wrong, you do not need to read the method body. The artifact has already violated the specification. You revise the prompt, record the failure, and generate again.

**Second: check the preconditions.** Find where the method handles null input, empty input, or out-of-range input. Is the behavior exactly what you specified? If you said "throw `IllegalArgumentException` on null," does the method throw `IllegalArgumentException`, or does it throw `NullPointerException`, or does it silently return a default value?

**Third: check the postconditions.** For each output case you specified — normal case, edge cases — trace through the generated code and verify that the output matches the specification. You are not running the code. You are reading it. This is the part that requires genuine understanding of what the code does.

**Fourth: check the side effects.** Does the method modify any of its inputs? Does it write to any external state? Read every line that touches the input parameters. If any line reassigns, sorts, removes, or otherwise modifies the input, flag it.

**Fifth: check the failure behavior.** What does the method do when something unexpected happens? Is it what you specified?

This sequence is your handoff condition. The artifact passes when it satisfies all five checks. It fails when it violates any one of them. "It seems to work" is not a handoff condition. "The method body produces correct output on non-empty, non-null input when I trace through it, and the signature, precondition handling, postcondition behavior, side effects, and failure behavior match the specification exactly" — that is a handoff condition.

<!-- → [INFOGRAPHIC: Five-step audit sequence as a decision tree — each step has a pass branch (continue to next) and a fail branch (revise prompt, record failure, regenerate)] -->

---

## Why Types Are Promises, Not Syntax

I want to return to something I said at the beginning, because I think it deserves more than a passing mention. Java's type system is one of the primary mechanisms by which you constrain AI generation. Types are not syntax chores. They are the earliest and most mechanical part of the specification — the part a compiler can check, the part that is visible before any execution, the part that the AI must respect if it is to generate a usable artifact.

When you change `int[]` to `ArrayList<Integer>`, you are not making an equivalent substitution. You are changing the promise. An array has a fixed length. A list does not. An array of primitives does not require boxing and unboxing. A list of `Integer` objects does. The memory behavior is different. The null behavior is different — `int[]` can be null, but its elements cannot; `ArrayList<Integer>` can be null, and its elements can be null. The performance characteristics at scale are different.

Whether these differences matter for your specific use case is a question that requires judgment. But the judgment has to be *yours*. If AI changes the type without your permission, it has substituted its judgment for yours on a question that has downstream consequences. The right response is not "well, `ArrayList<Integer>` holds numbers and `int[]` holds numbers, so they're equivalent." The right response is "I specified `int[]`. You generated `ArrayList<Integer>`. I need to understand why before I can accept this."

Sometimes the AI has a reason. Sometimes the reason is good. But you need to *ask*, because accepting the substitution silently means accepting all the consequences of the substitution — including the ones you haven't discovered yet.

<!-- → [TABLE: int[] vs ArrayList<Integer> — rows: fixed length, element nullability, boxing/unboxing overhead, memory layout, null container behavior, performance at scale — columns: int[], ArrayList<Integer>, consequence of silent substitution; student should see that "both hold numbers" hides six distinct behavioral differences] -->

---

## The Central Lesson and Its Limit

The central lesson of this chapter is this: generated Java is a candidate answer, not evidence of completion.

A candidate answer must be audited against an explicit specification before it becomes accepted work. The audit is not running the code. The audit is reading the code against the promises you made before you made the request. If you did not make explicit promises — if you asked for "a method that averages scores" without specifying signature, preconditions, postconditions, side effects, and failure behavior — then you do not have a specification to audit against. You have a vague intention and an artifact that may or may not match it.

The course is asking you to slow down at the specification, not at the keyboard. The keyboard part is fast now. The AI is fast. The danger is accepting speed as a substitute for precision.

The limit of this approach is also worth being honest about. A method specification, no matter how precise, cannot prove every property of a large system. It cannot guarantee thread safety in a concurrent program. It cannot guarantee that two methods that individually satisfy their specifications compose correctly. It cannot prevent emergent failures that arise from interactions across components you hadn't thought to specify together.

What it can do is make the most important obligations explicit enough to audit. It is a discipline for delegation, not a proof system for correctness. The specification is the boundary of what you have checked. Everything beyond that boundary is still unknown.

I want you to remember that limit. The temptation, once you learn to write specifications, is to feel that you have checked everything. You have checked what you specified. Those are not the same thing. The discipline is valuable precisely because it forces you to be explicit about what you have and have not committed to.

---

## LLM Exercises

1. **Prompt and specification.** Write a complete six-part specification for a Java method of your choice in this module's domain. Then write the AI prompt you would use to generate it. Identify at least two things you explicitly prohibited in the prompt and explain which specification element each prohibition protects.

2. **Audit task.** You will be given an AI-generated Java method and the specification it was supposed to satisfy. Identify every line or design choice in the generated method that violates the specification. For each violation, state whether the failure is a prompt omission (you failed to specify it), a model failure (you specified it and the AI violated it anyway), or a human acceptance failure (you accepted an artifact without checking this element).

3. **Handoff condition writing.** For a method you are delegating to AI in your course project, write a handoff condition that is binary, testable without running the code, and grounded in specification elements rather than aesthetics or general impressions. State the exact evidence you would need to produce to demonstrate the condition passed.

4. **Invariant identification.** For a method that takes at least one array or collection as a parameter, state the invariant governing that input's contents. Describe exactly how you would check, by reading the generated code, whether the invariant is preserved.

<!-- → [TABLE: Common type substitutions AI makes without permission — columns: specified type, substituted type, differences that matter, downstream consequences to check] -->
