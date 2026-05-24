# Chapter 10 — Abstract Contracts and Interface Specifications
*The signature is the doorway. The contract is everything that happens after someone walks through it.*

---

Here is something that should not be possible, and yet happens constantly.

Two programmers — or, more likely in this course, two AI generations — are given the same interface and told to implement it. Both implementations compile. Both pass the basic test suite. You wire them into your system and everything appears to work. Then, three weeks later, something breaks upstream. A list that should have remained unchanged has been sorted in place. A method that should have returned an empty list returned null. A caller that trusted the interface is now failing in a way that has nothing to do with its own code.

You go looking for the bug. It is not in the caller. It is not in the test suite. The bug was born before either implementation was written. It was born the moment you defined the interface without specifying what it was actually required to do.

![Timeline of where the bug was born ](images/10-abstract-contracts-and-interface-specifications-fig-01.png)
*Figure 10.1 — Timeline of where the bug was born *

I want to use this chapter to explain what went wrong and why it is so much harder to prevent than it sounds.

---

## The Interface Is Not the Contract

Here is the `Sortable` interface that started the problem above:

```java
public interface Sortable {
    List<Integer> sort(List<Integer> input);
}
```

What does this interface say? It says: any class that implements `Sortable` must provide a method called `sort` that accepts a `List<Integer>` and returns a `List<Integer>`. That is all it says. It says nothing about whether the returned list is a new object or the same object. It says nothing about whether the input list may be modified. It says nothing about what happens if the input is null, or empty, or contains duplicates, or is already sorted.

Both AI implementations satisfied this interface completely. The first returned a new sorted list and left the input untouched. The second sorted the input in place and returned it. Both gave you a `List<Integer>` back. Both compiled. Both passed a test that checked whether the output was sorted.

The test checked the right postcondition — the output is sorted — but missed the postcondition that mattered more in context: the input is not modified. And it missed it because that postcondition was never written down. The interface contained a signature. It did not contain a contract.

This is the distinction I want you to internalize before we go any further. A signature tells you the shape of the method — what types go in, what type comes out, what exceptions it declares. A contract tells you the *behavior* of the method — what must be true before you call it, what must be true after it returns, what state it is and is not allowed to touch in between. The signature is necessary. Without it, you cannot call the method at all. But the signature is not sufficient. Without the contract, you cannot know whether the method you received is the method you needed.

| what the signature specifies | what two valid implementations can legally differ on | which differences matter to callers |
| --- | --- | --- |
| interface — | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

---

## What a Contract Actually Contains

Let me build this precisely. An interface contract has five elements. I will work through each one using the `FileReaderService` example from the opening of this chapter, because it is the right level of complexity — simple enough to reason about completely, rich enough to show where contracts fail.

The interface:

```java
public interface FileReaderService {
    List<String> readLines(Path path) throws IOException;
}
```

**Preconditions.** What must be true about the arguments before the method is called? For `readLines`, a reasonable precondition is: `path` is not null. A caller who passes null has violated their obligation; the method's behavior in that case is undefined and the implementation is not required to handle it gracefully.

Notice what this does. It shifts responsibility. The caller owns the null check. The implementation can assume non-null input. If the caller violates the precondition, the resulting failure is the caller's fault, not a bug in the implementation. This matters when you are auditing AI-generated code: if an implementation throws `NullPointerException` on null input, you need to know whether null was a valid precondition (in which case it is a bug) or an invalid one (in which case it is the caller's problem).

**Postconditions.** What must be true about the return value after the method returns? For `readLines`, the postconditions that matter: the method never returns null — it returns an empty list if the file is empty; blank lines in the file are preserved as empty strings in the returned list; the list's order matches the file's line order.

Each of these is a falsifiable claim. You can look at an implementation and determine whether it satisfies each one. "Never returns null" — trace every return statement. "Blank lines preserved" — find where the implementation processes lines and check whether blank lines are filtered or kept. "Order preserved" — verify no sorting or reordering occurs between reading and returning.

**Invariants.** What must remain true about the object across all valid implementations? For a stateless service interface like `FileReaderService`, the invariant is simple: calling `readLines` does not modify the `Path` argument, does not write to any file, and does not change any observable state in the implementing object. For stateful interfaces — an `AccountRepository`, a `SessionManager` — the invariants are more complex and more important.

**Side effects.** What is the method allowed to do that is not reflected in its return value? Reading a file has an implicit side effect: it touches the file system. That is expected and permitted. Writing to a file, modifying shared state, or starting background threads are side effects that should be explicitly named if permitted, and prohibited if not. AI-generated implementations sometimes introduce side effects — caching, logging, state mutation — that were not in scope. If you did not state which side effects are permitted, you cannot audit for prohibited ones.

**Edge cases.** What does the method do at the boundaries of its input space? Missing file: `IOException`. Empty file: empty list. File with only blank lines: list of empty strings. These are not afterthoughts. They are part of the contract, and they are the cases AI implementations most commonly get wrong — not because AI cannot handle edge cases, but because AI makes a choice about edge cases and the choice may not be yours.

| contract clause | what Implementation A does | what Implementation B does | which satisfies the clause |
| --- | --- | --- | --- |
| precondition, postcondition (never null | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |
| postcondition (blank lines preserved | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |
| postcondition (order preserved | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |
| invariant (no side effects | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |
| edge cases | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |
| columns: contract clause, what Implementation A does, what Implementation B does, which satisfies the clause | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

---

## The Hard Skill: Specifying Without Presupposing

Here is where interface specification gets genuinely difficult, and why the source material for this chapter calls it "the hardest specification skill in the course."

When you specify a method, there is a strong pull toward specifying implementation. "The method should use a merge sort algorithm." "The method should read the file line by line using a `BufferedReader`." "The method should cache results in a `HashMap` for performance."

If those constraints appear in your interface contract, you have made a mistake. Not because those are bad choices — they might be excellent choices for a specific implementation — but because an interface is a promise to clients, not instructions to implementors. The moment you specify implementation details in an interface contract, you have coupled your clients to an implementation strategy they should not need to know about.

The hard skill is specifying what clients need to be able to rely on — the observable behavior — without dictating how any particular implementation achieves it. "Returns a list of strings in the same order as the lines in the file" specifies behavior. "Reads lines using `Files.readAllLines()`" specifies implementation. The first belongs in the contract. The second belongs in a code comment inside a specific class.

This distinction matters acutely when you are generating implementations with AI. The goal of an interface contract is interchangeability: any implementation that satisfies the contract can stand where any other implementation stands, and clients will not notice the difference. If your contract is behavioral, you can generate two implementations and audit both. If your contract has leaked implementation details, you have accidentally specified exactly one valid implementation and the second AI generation will violate your contract not because it is wrong but because it made different correct choices.

![Two columns ](images/10-abstract-contracts-and-interface-specifications-fig-02.png)
*Figure 10.2 — Two columns *

---

## Interface vs. Abstract Class: The Constraint Each Imposes

There is a design decision that arises every time you are specifying shared behavior: should this be an interface or an abstract class? The usual answer given in textbooks is "use an interface when you want to specify behavior without sharing state; use an abstract class when you want to share state or provide default implementations." That is correct and incomplete.

The more useful way to frame it is: what constraint do you want to impose on future implementors?

An interface imposes one constraint: you must provide implementations for these methods with these signatures. It imposes nothing else. An implementing class can extend any superclass it wants. It can implement other interfaces simultaneously. It can organize its internal state any way it likes. The interface gives maximum freedom in exchange for behavioral commitment only.

An abstract class imposes more. A class that extends your abstract class cannot extend any other class — Java's single inheritance rule means the abstract class consumes the one slot. If your abstract class has fields, those fields become part of every subclass whether the subclass wanted them or not. If your abstract class has concrete methods, those methods become inherited behavior that subclasses must explicitly override if they want different behavior, rather than simply not inheriting it.

The decision rule is this: choose an interface when behavioral commitment is the only constraint you need. Choose an abstract class when you need to share state, enforce a particular structure, or provide concrete default behavior that implementors will almost always want.

The failure mode of choosing an interface when you needed an abstract class: implementations diverge in ways that matter — they maintain different state structures, they handle shared behavior inconsistently, and you end up with de facto coupling that was never made explicit.

The failure mode of choosing an abstract class when you needed an interface: you lock implementors out of extending other classes they need, you push implementation details into a place where they appear to be contractual, and you make it harder to generate independent implementations because the abstract class's structure has already made choices on their behalf.

| Item | Meaning |
| --- | --- |
| constraint on implementors, inheritance flexibility, state sharing, default behavior, when AI generation is easier, failure mode of wrong choice | The pattern becomes easy to misuse or overlook. |
| two columns showing how each design decision plays out | A concrete checkpoint for applying the chapter concept. |

When AI generates a hierarchy using an abstract class, your audit question is: did the abstract class make implementation choices that belong in the contract, or choices that belong in a specific implementation? Concrete methods in abstract classes are the most common place this goes wrong. A concrete method says "here is how every subclass will do this unless it overrides." That is a design claim. If it is in your contract, it should be there deliberately, not because AI decided it was helpful.

---

## Auditing Two Implementations Against One Contract

Let me work through the audit that the opening case required. You have the `FileReaderService` contract, fully specified. You have two AI-generated implementations. Your job is to determine which satisfies the contract, citing the specific clause each violates or preserves.

This is not a matter of running the code and seeing which one produces correct output on the test cases you thought of. That approach will find violations on test cases you included. It will miss violations on cases you did not think to test, which are usually the cases that cause production failures.

The audit is a reading exercise. You go clause by clause through the contract and trace the implementation.

**Precondition: `path` is not null.** Find how each implementation begins. Does it check for null? If it does, what does it do — throw `NullPointerException`, throw `IllegalArgumentException`, return an empty list? Any behavior on null input is acceptable if null was excluded by precondition; the contract does not specify failure behavior for precondition violations because the caller was not supposed to violate them. Mark both: how does each handle null, and is that consistent with the precondition?

**Postcondition: never returns null.** Find every return statement. Trace each path through the method. Is there any path that returns null? A common AI pattern: `if (file.isEmpty()) return null;` — sensible, wrong.

**Postcondition: blank lines preserved.** Find where lines are processed. Is there any filtering step? A `filter(line -> !line.isBlank())` call is the violation to look for. It is a common AI optimization — "remove empty lines for cleaner output" — that directly violates this postcondition.

**Postcondition: order preserved.** Is there any sorting? Any collection type that does not preserve insertion order — a `HashSet`, a `TreeSet` — used as an intermediate step? If lines pass through an unordered collection before being returned, order is not preserved even if the final output happens to look ordered on the test input.

**Invariant: no side effects.** Is there any write operation? Any modification of shared state? Any logging that writes to a file rather than stdout? Caching that stores results in instance fields?

**Edge case: missing file throws `IOException`.** Does the implementation declare `throws IOException`? Does the method body allow `IOException` to propagate, or does it catch and swallow it?

This sequence — one clause, one trace, one verdict — is your handoff condition. Not "it looks right." "I traced clause three, blank-line preservation, and found a `filter()` call on line 23 of Implementation A that removes blank lines. Implementation A fails clause three. Implementation B has no filter step. Implementation B passes clause three."

![Clause-by-clause audit log ](images/10-abstract-contracts-and-interface-specifications-fig-03.png)
*Figure 10.3 — Clause-by-clause audit log *

---

## The Lesson the Opening Case Was Trying to Teach

The two `Sortable` implementations that both compiled and both passed the basic test were not a failure of AI. They were a failure of specification.

The AI did exactly what it was asked to do: produce a class that implements `Sortable` with a method that accepts and returns `List<Integer>`. Both implementations did that. The problem was that "implements `Sortable`" did not mean what the programmer needed it to mean, because `Sortable` had not been given a behavioral contract.

When you generate multiple implementations and find that they differ in ways that matter, that is not evidence of AI inconsistency. That is evidence that your interface underspecified the behavior, and both implementations found different valid ways to fill the gap. The right response is not to accept the implementation that happened to match your assumptions. The right response is to go back to the contract, add the clause that was missing, and generate again — this time with a specification that has a verifiable answer.

The goal of an interface contract is to make interchangeability real. If any implementation that satisfies your contract can stand where any other stands, then you have done the job. If your system only works with one specific implementation even though both satisfy the interface, the contract is incomplete.

Tests do not fix this. Tests sample the contract. They check specific inputs and specific outputs. A test suite that passes tells you the implementation satisfies the contract on the cases you thought to test. It tells you nothing about the cases you didn't. The contract is the thing the tests are supposed to be testing. Write the contract first. The tests follow from it.

![Contract vs](images/10-abstract-contracts-and-interface-specifications-fig-04.png)
*Figure 10.4 — Contract vs*

---

## The Central Lesson and Its Limit

The central lesson is this: the method signature is the doorway. What happens inside — the behavioral obligations, the edge cases, the side effects permitted and prohibited — that is the contract. No signature generates a contract automatically. No test suite replaces one. The contract has to be written before the implementation exists, because the contract is what the audit compares the implementation against.

The limit is the same limit every chapter in this course runs into. A contract, no matter how carefully specified, covers the dimensions you thought to specify. It does not cover the emergent behavior that arises when ten implementations of ten interfaces interact. It does not cover concurrency. It does not cover the cases where a correct implementation causes incorrect behavior in a caller that was making an assumption the contract did not prohibit.

What the contract gives you is precision about the boundary between client and implementor. Everything inside the boundary — the obligations you stated and audited — you have actually checked. Everything outside the boundary is still unknown. That is not a failure of the method. That is an honest statement of what the method can and cannot do.

In an AI-augmented development environment, that precision is exactly what you need. The AI will produce implementations. It will produce them quickly, and they will be plausible. Your job is to determine whether "plausible" is the same as "correct," and you cannot do that without a contract that makes correctness falsifiable.

---

## LLM Exercises

1. **Prompt and contract.** Choose an interface relevant to your course project. Write the full behavioral contract — preconditions, postconditions, invariants, permitted side effects, edge cases. Then write the AI prompt you would use to generate two independent implementations. Identify at least two behavioral constraints you stated explicitly in the prompt and explain which contract element each protects.

2. **Dual-implementation audit.** You will be given two AI implementations of the same interface and the contract they were supposed to satisfy. For each implementation, go clause by clause and identify every clause it satisfies and every clause it violates. State for each violation whether the failure is a prompt omission, a model failure, or a human acceptance failure.

3. **Interface or abstract class.** For a design decision in your project where both options are plausible, write the specific constraint each choice imposes on future implementors. Name the failure mode each choice introduces. Conclude with a decision and state what evidence would cause you to reverse it.

4. **Interchangeability test.** Write a handoff condition for a pair of AI implementations that is binary, testable without running the code, and grounded in the behavioral contract. State the exact evidence — specific lines, specific clause checks — you would need to produce for each implementation to demonstrate both are genuinely interchangeable.

| omitted clause type (null handling | mutation behavior | empty input | return value identity | side effects) |
| --- | --- | --- | --- | --- |
| Common interface contract omissions and the AI generation failures they cause — | The pattern becomes easy to misuse or overlook. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

## Prompts

Use these prompts with Claude to generate interactive D3 v7 versions of the
figures in this chapter. Each produces a standalone HTML file you can open
in a browser and modify freely.

**Prerequisites:** Load `brutalist/CLAUDE.md` and `brutalist/DESIGN.md` into
your Claude project context before using these prompts. They define the stack,
naming conventions, color system, and typography the figures use.

---

### Figure 10.1 — Timeline of where the bug was born 

Create a standalone D3 v7 HTML file for Figure Timeline of where the bug was born . Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Timeline of where the bug was born — horizontal sequence: interface defined (no contract) → AI generates Implementation A → AI generates Implementation B → both compile → both pass tests → three weeks later, upstream failure; callout at the first step showing the missing postcondition (input not modified) that would have prevented every subsequent step from going wrong. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/10-abstract-contracts-and-interface-specifications-fig-01.html`

---

### Figure 10.2 — Two columns 

Create a standalone D3 v7 HTML file for Figure Two columns . Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Two columns — behavioral specification (what observable properties must hold) vs. implementation specification (how those properties should be achieved); each column with three examples from FileReaderService, with arrows showing which column belongs in an interface contract and which belongs in a class-level comment. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/10-abstract-contracts-and-interface-specifications-fig-02.html`

---

### Figure 10.3 — Clause-by-clause audit log 

Create a standalone D3 v7 HTML file for Figure Clause-by-clause audit log . Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Clause-by-clause audit log — six rows (one per contract clause), three columns: clause text, Implementation A verdict with evidence, Implementation B verdict with evidence; Implementation A fails two clauses, Implementation B passes all six. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/10-abstract-contracts-and-interface-specifications-fig-03.html`

---

### Figure 10.4 — Contract vs

Create a standalone D3 v7 HTML file for Figure Contract vs. Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Contract vs. tests — two overlapping circles: left circle is "contract space" (all behavioral obligations), right circle is "test coverage" (cases the test suite checks); the overlap is what tests verify; the left-only region is what the contract specifies but tests miss; label the left-only region "where the Sortable bug lives"; caption: tests sample the contract, they do not replace it. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/10-abstract-contracts-and-interface-specifications-fig-04.html`
