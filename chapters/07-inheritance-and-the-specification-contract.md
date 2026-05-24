# Chapter 7 — Inheritance and the Specification Contract
*A subclass that lies about what it is will eventually be caught — usually at the worst possible moment.*

---

Here is a puzzle that feels like it should be trivial.

A square is a rectangle. Every square you have ever seen satisfies every geometric property of a rectangle — four right angles, opposite sides equal and parallel. If you were writing a classification system for shapes and someone asked "is a square a rectangle?", you would say yes without hesitation.

Now write the Java. Make `Square` extend `Rectangle`. Give `Rectangle` methods `setWidth` and `setHeight`. Notice that when you call `setWidth` on a square, the height must change too — a square with unequal sides is no longer a square. So you override `setWidth` in `Square` to set both dimensions simultaneously.

The code compiles. The code runs. A square is, geometrically speaking, a rectangle. And yet you have just created a hierarchy that will fail.

Here is the failure. Write a method somewhere in your system that accepts a `Rectangle` and widens it:

```java
void widen(Rectangle r) {
    int h = r.getHeight();
    r.setWidth(h * 2);
    assert r.getHeight() == h; // height should not have changed
}
```

That assertion is reasonable. If you hand this method a `Rectangle`, the height stays fixed when you change the width. But if you hand it a `Square` — which your type system says is perfectly legal, because `Square extends Rectangle` — the assertion fails. The height changed. The method did not ask for it to change. The subclass behaved differently from what the superclass promised.

This is not a compiler error. It is not a runtime crash (unless you have assertions enabled). It is a silent behavioral violation. The code looks correct. The types check out. The contract is broken anyway.

![Code snippet of the widen() method with two](images/07-inheritance-and-the-specification-contract-fig-01.png)
*Figure 7.1 — Code snippet of the widen() method with two*

That is the trap. And I want to spend this chapter explaining exactly why it is a trap, because it is the same trap that appears every time you accept an AI-generated inheritance hierarchy without auditing the behavioral promises the hierarchy makes.

---

## What Inheritance Actually Promises

Most introductory treatments of inheritance emphasize structure. A subclass gets the fields and methods of its superclass. It can add new ones. It can override existing ones. This is all true, and it is all incomplete.

Inheritance is not primarily a structural relationship. It is a behavioral promise. When you write `Square extends Rectangle`, you are not just saying that squares and rectangles share some code. You are saying: *wherever a Rectangle is expected, a Square may be used, and the behavior will be the same.*

That is the Liskov Substitution Principle, stated by Barbara Liskov in 1987 and formalized with Jeannette Wing in 1994. I want to be careful not to present it as a slogan — "subtypes must be substitutable for their base types" — because slogans invite nodding agreement without understanding. Let me state it operationally instead.

If you have a piece of code that works correctly with objects of type `T`, and you substitute an object of type `S` where `S` claims to be a subtype of `T`, the code must continue to work correctly. Not approximately correctly. Not mostly correctly. Correctly. If it doesn't, the hierarchy is lying about its relationship.

The square-rectangle hierarchy fails this test because `widen` works correctly on rectangles and fails on squares — even though squares claim to be rectangles. The claim is geometrically accurate and behaviorally false.

![Square-Rectangle LSP failure ](images/07-inheritance-and-the-specification-contract-fig-02.png)
*Figure 7.2 — Square-Rectangle LSP failure *

This distinction — between the structural claim and the behavioral contract — is exactly what you need to audit when AI generates an inheritance hierarchy. The AI knows how to write Java. It will produce syntactically correct, structurally coherent code. What it cannot guarantee, without an explicit specification from you, is that the behavioral contracts hold across the hierarchy.

---

## The Superclass Contract

The concept I want to introduce here is the *superclass contract*. A superclass contract is a statement of what every subclass is obligated to preserve. Not just the method signatures — those are enforced by the compiler. The behavioral obligations: what invariants hold before and after each method, what clients are permitted to assume, what the subclass may never change even when overriding.

Let me build this carefully using the `Notification` example.

Suppose you are building a notification system. You write a superclass:

```java
public abstract class Notification {
    public abstract DeliveryResult send(String recipient, String message);
}
```

What does `send` promise? At minimum, it probably promises something like this: calling `send` with a valid recipient and message produces a `DeliveryResult` describing what happened, and records exactly one delivery attempt in the system log.

Now AI generates an `EmailNotification` subclass. The generated implementation retries internally — it attempts delivery three times before returning, recording an attempt each time. The returned `DeliveryResult` is accurate: it reflects success or final failure. The method signature is correct. The code compiles.

And yet this may violate the superclass contract. If clients of `Notification` assume that calling `send` once records one attempt — which is a reasonable assumption, and possibly the assumption that drives the billing system downstream — then `EmailNotification` has broken something the client was allowed to depend on.

Was that in your specification? If you did not write down "records exactly one delivery attempt," AI had no obligation to preserve it. The AI did something reasonable. It retried, because retrying is sensible behavior for email delivery. But "reasonable" is not the same as "specified." The violation is not the AI's fault. It is a specification omission.

| what was stated in the specification | what AI generated | whether this is a prompt omission | model failure | human acceptance failure |
| --- | --- | --- | --- | --- |
| send() behavior | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | The pattern becomes easy to misuse or overlook. | The pattern becomes easy to misuse or overlook. |
| columns: what was stated in the specification, what AI generated, whether this is a prompt omission | model failure | A concrete checkpoint for applying the chapter concept. | The pattern becomes easy to misuse or overlook. | The pattern becomes easy to misuse or overlook. |

This is the pattern I want you to see. The superclass contract has to be written before generation, not inferred after. When you read AI-generated code and ask "does this satisfy my contract?", the question only has an answer if the contract exists in explicit form. Otherwise you are asking whether a contract you have not yet written has been satisfied, which is not a question — it is a wish.

---

## Writing the Superclass Contract

A superclass contract has four parts. I will state them precisely because the common failure is believing that two of them are sufficient and being surprised when the other two cause failures.

**Invariants the superclass enforces.** What conditions must be true about every instance of this class at all times? A `Rectangle` invariant might be: width and height are both positive. A `BankAccount` invariant might be: balance is never negative. These are conditions that no subclass may violate, even when overriding methods.

**Preconditions on each method.** What must be true before the method is called? These are the caller's obligations. If `send` requires a non-null, non-empty recipient, that is a precondition. Subclasses may not *strengthen* preconditions — they cannot demand more from callers than the superclass demanded. If the superclass accepted any non-empty string, the subclass cannot start rejecting strings that don't match a particular format. Callers wrote code against the superclass contract; the subclass must honor it.

**Postconditions on each method.** What must be true after the method returns? These are the class's obligations to callers. Subclasses may not *weaken* postconditions — they cannot promise less than the superclass promised. If `send` promises to record one delivery attempt, a subclass that records three has weakened a postcondition (or violated an invariant the calling code depends on, depending on how you look at it).

**Invariants each subclass may not break.** Some invariants belong specifically to the contract between superclass and client, not to any individual subclass. A `Rectangle` client is allowed to assume that setting width does not change height. That assumption is not stated as an explicit postcondition on `setWidth` — it is implied by what `Rectangle` is. But it must be stated explicitly in the contract if it is to survive subclassing, because AI will not preserve an unstated assumption.

| Item | Meaning |
| --- | --- |
| class invariant, setWidth precondition, setWidth postcondition, client assumptions the subclass may not break | A concrete checkpoint for applying the chapter concept. |
| showing the stated contract vs. what Square's override preserves or violates | A concrete checkpoint for applying the chapter concept. |

---

## LSP Violations in AI-Generated Hierarchies

Here is what I have observed about AI-generated inheritance: the violations are almost never structural. The AI understands Java inheritance mechanics. It will correctly place fields, correctly call `super()`, correctly handle visibility. The violations are behavioral, and they cluster around three patterns.

**Precondition strengthening.** The superclass accepts a broad range of inputs. The AI-generated subclass, optimized for a specific use case, quietly rejects inputs the superclass would have handled. A `parse(String input)` method in the superclass accepts any string and returns null on failure. The AI-generated subclass throws `IllegalArgumentException` on inputs the superclass would have silently returned null for. Code that called the superclass and handled null now gets an unexpected exception when handed the subclass.

**Postcondition weakening.** The superclass promises a specific return value or state. The AI-generated subclass, adding functionality, subtly changes what it returns. The `send` example above is this pattern. The subclass does *more* — it retries, it logs richer data, it returns richer results. But in doing more, it violates the specific obligation the superclass made to callers.

**Invariant violation.** The superclass maintains a class-level invariant. The AI-generated subclass, in the course of extending the class, breaks it. The square that must keep width equal to height. The bank account subclass that allows overdrafts because that is what the subclass is for, forgetting that the parent class made a no-overdraft promise.

The audit for each pattern follows directly from the contract:

For precondition strengthening: find every input the method accepts, trace what the subclass does with inputs the superclass would have handled, verify the behavior is identical.

For postcondition weakening: find every postcondition the superclass stated, trace the subclass's return values and state changes, verify each postcondition is preserved.

For invariant violation: state every class-level invariant, find every method that could modify the relevant state, verify the invariant holds after each modification.

![Three LSP violation patterns as diagnosis flowchart ](images/07-inheritance-and-the-specification-contract-fig-03.png)
*Figure 7.3 — Three LSP violation patterns as diagnosis flowchart *

---

## Inheritance or Composition: A Decision With a Named Failure Mode

There is a question that comes up whenever inheritance fails, and it comes up specifically when AI generates a hierarchy you did not fully specify: should this be inheritance at all, or should it be composition?

I want to give you a framework for that decision that is more useful than "favor composition over inheritance." That principle is correct but not actionable. You need to know *which failure* each choice introduces.

Inheritance introduces LSP risk. When you inherit, you are promising behavioral substitutability. Every client of the superclass now implicitly trusts that your subclass will honor the contract. If you cannot guarantee that — if your new class has fundamentally different behavior in some dimension the superclass made promises about — you will eventually break a client. The square-rectangle hierarchy is the canonical example: the geometric "is-a" relationship does not translate into a behavioral one.

Composition introduces interface risk. When you compose — when your class holds an instance of another class and delegates to it — you have complete control over what you expose. You cannot accidentally inherit a method you didn't want. But you also cannot be polymorphically substituted. Code that expects a `Rectangle` cannot accept your composed shape, even if your composed shape does everything a rectangle does. You lose the design benefit of the type hierarchy.

The decision rule is this: use inheritance when the subclass genuinely satisfies the superclass contract — when you have written the contract out and verified that no method in the subclass violates a precondition, postcondition, or invariant. Use composition when the subclass extends the superclass in a dimension that would require weakening a postcondition or strengthening a precondition. Do not use the geometric or ordinary-language "is-a" test. It will mislead you. A square is a rectangle. It cannot be a `Rectangle`.

| Item | Meaning |
| --- | --- |
| use case, what the relationship promises, failure mode introduced, audit question to ask before choosing | The pattern becomes easy to misuse or overlook. |
| shows both choices as legitimate with named costs, not composition as universally superior | A concrete checkpoint for applying the chapter concept. |

When AI generates a hierarchy, your job is to ask: has the AI generated an inheritance relationship because it satisfies the behavioral contract, or because the geometric/linguistic relationship seemed obvious? AI defaults to what is linguistically natural. Your job is to audit for what is behaviorally true.

---

## What the Audit Actually Looks Like

Let me be concrete. You have asked AI to generate an inheritance hierarchy. You have received it. Here is the sequence of questions you work through before accepting the artifact.

**Does each subclass satisfy every precondition of its superclass methods?** Find the input range each superclass method accepts. Find the corresponding override or inherited method in the subclass. Check whether the subclass rejects any input the superclass would have accepted. If yes: precondition strengthening. Reject and revise.

**Does each subclass satisfy every postcondition of its superclass methods?** Find what the superclass promises each method will return or what state it will leave. Find the corresponding behavior in the subclass. Check whether the subclass returns anything less specific, less reliable, or differently structured than the superclass promised. If yes: postcondition weakening. Reject and revise.

**Does each subclass preserve every class invariant?** State the invariants of the superclass. Find every subclass method that modifies relevant state. Verify that after each modification, the invariant still holds. If a subclass method leaves the object in a state the superclass invariant prohibits: invariant violation. Reject and revise.

**Is the inheritance relationship justified by behavioral substitutability, not linguistic convenience?** Ask the substitution question directly: if I hand this subclass to code written against the superclass, will anything break? If you cannot confidently say no — if you have to think about edge cases where the behavior diverges — you may have the wrong design. Consider composition.

This is your handoff condition. Not "the code compiles." Not "the hierarchy looks right." "I have traced each of the four questions, found no violations, and can name the specific evidence for each."

![Four-question audit flowchart for AI-generated hierarchies ](images/07-inheritance-and-the-specification-contract-fig-04.png)
*Figure 7.4 — Four-question audit flowchart for AI-generated hierarchies *

---

## The Central Lesson and Its Limit

The central lesson is this: hierarchy is an architectural claim, not a code convenience.

When you write `extends`, you are making a promise to every caller that will ever hold a reference to the superclass. You are promising that your subclass will not surprise them. That promise has to be made explicitly, audited carefully, and defended against the AI's tendency to generate what is structurally convenient rather than what is behaviorally true.

The limit is also worth stating plainly. The behavioral contract I have described — preconditions, postconditions, invariants — captures the most common failure modes. It does not capture everything. It does not prevent failures that arise from threading, from state shared across instances, from emergent behavior when many objects interact. It does not guarantee that a hierarchy that satisfies the contract today will satisfy it after six more subclasses are added by different people at different times.

What it gives you is a boundary. Everything inside the boundary — the obligations you have specified and audited — you have actually checked. Everything outside is still unknown. The discipline is not a proof of correctness. It is a method for making your commitments explicit enough to test, and your tests explicit enough to pass or fail.

That is what makes it useful in an AI-augmented environment specifically. The AI will generate code that compiles and runs and does something plausible. Your job is to determine whether "plausible" is the same as "correct." You cannot do that without a specification. You cannot audit without a contract. And you cannot catch an LSP violation that will surface six months from now unless you asked, before accepting the artifact, whether behavioral substitutability actually holds.

---

## LLM Exercises

1. **Prompt and specification.** Choose a superclass/subclass relationship relevant to your course project. Write the full superclass contract — invariants, preconditions, postconditions, client assumptions. Then write the AI prompt you would use to generate the hierarchy. Identify at least two behavioral constraints you stated explicitly in the prompt and explain which contract element each protects.

2. **LSP audit.** You will be given an AI-generated inheritance hierarchy and the superclass contract it was supposed to satisfy. For each subclass method, identify whether it strengthens a precondition, weakens a postcondition, or violates a class invariant. For each violation, state whether the failure is a prompt omission, a model failure, or a human acceptance failure.

3. **Inheritance or composition.** For a hierarchy in your project where you are uncertain whether inheritance is the right design, write a one-paragraph defense of each option. Each defense must name the specific failure mode it introduces. Conclude with a decision and explain what behavioral evidence would cause you to reverse it.

4. **Handoff condition.** Write a handoff condition for an AI-generated inheritance hierarchy that is binary, testable without running the code, and grounded in the four-part contract. State the exact evidence — specific lines, specific invariant checks — you would need to produce to demonstrate the condition passed.

| violation type (precondition strengthening | postcondition weakening | invariant violation) | typical trigger (what in the prompt or context leads AI to this pattern) | example |
| --- | --- | --- | --- | --- |
| Common AI-generated LSP violations by pattern — | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | Use the chapter example as the concrete test case. | Use the chapter example as the concrete test case. |
