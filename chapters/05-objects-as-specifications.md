# Chapter 5 — Objects as Specifications
*Nothing is broken until everything is allowed.*

Here is a piece of AI-generated Java that I want you to look at carefully.

```java
public class Task {
    public String title;
    public int priority;
    public boolean completed;
}
```

It compiles. It is readable. If you needed to move data around a small program, you could use it right now. A student who asked AI for a `Task` class might look at this and think: yes, that is what I asked for. Three fields. Simple. Done.

Now consider what this class actually permits. Any other class in the program can reach in and set `priority` to `-9`. Any other class can replace `title` with an empty string. Any other class can mark a deleted task as active without recording who changed it or when. The class has no opinion about any of this. It is not a `Task`. It is a container with a label on it, and the label is doing all the work.

Nothing is broken. Yet. But the moment a second class touches these fields, the `Task` class has lost its ability to enforce anything about its own state. And when the bug arrives — when a task ends up with a priority of zero and an empty title and no completion timestamp — the class will have nothing to say about how it got there.

That is the opening problem of this chapter. Not "AI wrote bad code." The code is fine for certain purposes. The problem is that the code was accepted without asking what obligations the `Task` class was supposed to carry. The student did not think about what the class was *for*. She thought about what it *contained*.

---

## A Class Is a Boundary, Not a Folder

![Same contents. Different guarantees.](images/05-objects-as-specifications-fig-01.png)
*Figure 5.1 — A locked filing cabinet next to an open*

Let me tell you what a class actually is, because the word gets used loosely and the looseness costs you later.

A class is a *boundary around state and behavior*. The boundary has a specific purpose: to make certain states impossible. Not discouraged. Not unlikely. Impossible. Once you have committed to what a valid `Task` looks like — a non-empty title, a priority between 1 and 5, a completion state that can only be changed through a specific operation — the class is the mechanism that prevents anything outside it from violating those conditions.

This is what encapsulation means. Not "put related things together," although that is a side effect. Encapsulation means: *the invariants of this object are enforced by this object, and nothing outside it can break them.*

An invariant is a condition that must always be true about the object's state. For `Task`: the title is never null or blank. The priority is always between 1 and 5. The completion state changes only through `markComplete()`. These are not preferences. They are the specification of what a valid `Task` is.

When all the fields are public, the invariant is fiction. The declaration says "this is a Task" but the implementation says "this is a struct, and you can do whatever you want to it." Any code anywhere in the program can write `task.priority = 0` and the class has no mechanism to object. The invariant exists only in comments, in documentation, in the programmer's intention — none of which runs at runtime.

The fix is not complicated:

```java
public class Task {
    private String title;
    private int priority;
    private boolean completed;

    public Task(String title, int priority) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (priority < 1 || priority > 5) {
            throw new IllegalArgumentException("Priority must be between 1 and 5");
        }
        this.title = title;
        this.priority = priority;
        this.completed = false;
    }

    public void markComplete() {
        this.completed = true;
    }

    public String getTitle() { return title; }
    public int getPriority() { return priority; }
    public boolean isCompleted() { return completed; }
}
```

Now look at what changed. The fields are `private` — no external code can touch them directly. The constructor *rejects* an invalid `Task` before it can exist. `markComplete()` is the only path to changing completion state. The class now has opinions. It enforces them.

| Item | Meaning |
| --- | --- |
| Who can change title | Anyone vs. No one after construction |
| Who can set invalid priority | Anyone vs. No one (constructor rejects it |
| How does completion change | Direct assignment anywhere vs. Only through markComplete( |
| What happens if priority = -9 is attempted | Silently accepted vs. IllegalArgumentException thrown at construction |

This is not a stylistic choice. It is a specification choice. The encapsulated version *implements a contract*. The public-fields version does not.

---

## The Contract and Its Components

I want to be precise about what a class contract includes, because "write a class specification" is the kind of instruction that sounds clear until you try to do it.

A full class contract has seven components. When you are writing a specification for AI — or for yourself — every one of them needs to be present. Missing one is how the AI generates code that looks right and isn't.

**Responsibility.** One sentence. What is this class responsible for knowing and doing? For `Task`: *a Task owns its title, priority, and completion state, and enforces that none of these can be in an invalid configuration.* If you cannot write this sentence, you do not have a specification — you have a topic.

**Fields.** What state does an instance of this class hold? For each field: name, type, and the range of valid values. `title: String, non-null, non-blank`. `priority: int, 1–5 inclusive`. `completed: boolean, initially false`.

**Visibility.** For each field: `private`, `protected`, or `public`? In almost every case involving mutable state, the answer is `private`. If you find yourself writing `public` for a field that can change, ask what you are giving up. The answer is always: the ability to enforce the invariant.

**Constructor requirements.** What must be true for a valid instance to be created? What should the constructor reject? For `Task`: a blank title must throw. A priority outside 1–5 must throw. The constructor is the class's first line of defense.

**Method signatures.** For each operation: name, parameters, return type, and what the method guarantees. `markComplete(): void — sets completed to true, no parameters, no precondition beyond the object being valid`. Methods are promises. Name them like promises.

**Invariants.** The conditions that must be true at every observable moment. These are different from constructor requirements — they must hold *after every method call*, not just at creation. For `Task`, they are the same: title non-blank, priority in range, completed only true if `markComplete()` was called.

**Forbidden shared state.** Should any field be `static`? For `Task`: no. If `completedCount` were static, every `Task` instance would share a single completion counter — one instance's behavior affects all instances. Static state belongs to the class; instance state belongs to one object. The choice has behavioral consequences that do not show up in a quick test.

![Seven-component contract diagram ](images/05-objects-as-specifications-fig-02.png)
*Figure 5.2 — Seven-component contract diagram *

When you have all seven, you have something you can hand to AI as a prompt and evaluate the output against. When you are missing any one of them, you have an invitation for the AI to make a choice you did not sanction.

---

## What AI Does With an Incomplete Specification

This is worth thinking about carefully, because the behavior is predictable once you see the pattern.

Language models are trained on enormous amounts of Java code. Most of that code was written by working programmers under time pressure who made reasonable-but-not-principled choices. Public fields are common in simple data classes. No-argument constructors are common. Minimal validation is common. When you ask AI for a `Task` class without specifying visibility, constructor requirements, or invariants, it produces what it has seen most often — and what it has seen most often reflects the habits of programmers who were not thinking about contracts.

This is not a failure of the model. It is a failure of the prompt. The model did exactly what it was asked to do: produce a plausible `Task` class. You just asked for a folder when you needed a boundary.

The audit question is always: *did the output satisfy the specification, or did it produce something that satisfies a weaker specification I did not intend?* When the fields are public and you specified nothing about visibility, the answer is that the model filled the gap with a default. The default may or may not be what you wanted. You cannot know until you check — which means you have to have something to check against.

![Two overlapping regions ](images/05-objects-as-specifications-fig-03.png)
*Figure 5.3 — Two overlapping regions *

This is why the Boondoggle Score requires the handoff condition to be written *before* the output arrives. A handoff condition for the `Task` class might read: *all three fields are private; the constructor throws on blank title and out-of-range priority; `markComplete()` is the only method that changes `completed`; no static fields are present.* That condition either passes or it does not. The AI-generated code with public fields fails it immediately on the first clause.

If you write the condition after you see the output, you will write one the output satisfies. That is not auditing. That is reverse-engineering a passing grade.

---

## Instance vs. Static: A Concrete Mistake

![Two whiteboards side by side ](images/05-objects-as-specifications-fig-04.png)
*Figure 5.4 — Two whiteboards side by side *

Let me show you a specific failure mode that the instance/static distinction produces, because it is the kind of bug that is genuinely hard to diagnose if you do not know to look for it.

Suppose the `Task` class accumulates a count of how many tasks have been completed. A student adds this:

```java
public class Task {
    private String title;
    private int priority;
    private boolean completed;
    private static int completedCount = 0;

    // ... constructor as before ...

    public void markComplete() {
        this.completed = true;
        completedCount++;
    }

    public static int getCompletedCount() {
        return completedCount;
    }
}
```

In isolation, this looks reasonable. You create tasks, you mark them complete, you query the count. Now consider what happens in a test suite that creates multiple `Task` instances across multiple test methods. The first test creates three tasks and marks two complete. `completedCount` is now 2. The second test creates a fresh `Task`, marks it complete, and asserts that `getCompletedCount()` returns 1.

The assertion fails. `getCompletedCount()` returns 3.

The counter did not reset between tests because it is `static` — it belongs to the class, not to any instance. Creating a new `Task` does not reset it. The second test's assertion about its own `Task` is contaminated by the first test's operations on completely different objects.

This is the behavioral consequence of choosing `static` when you meant instance. The bug does not appear in a single test run with a single sequence of operations. It appears when the class is used in any context that creates multiple instances, or that assumes isolation between different uses of the class. Which is most non-trivial programs.

The fix is not obvious from inspection of the failing test. The test output says "expected 1 but was 3" and points to an assertion, not to the field declaration. A programmer who does not know to look for static state may spend significant time debugging the test logic before noticing the field modifier.

The specification step catches this before the code exists. If the contract says `completedCount: not static — each instance tracks its own state`, the AI output with `static int completedCount` fails the handoff condition. The fix takes thirty seconds. The debugging session takes thirty minutes.

---

## Reading AI Output Against the Contract

Let me walk through what auditing actually looks like on the `Task` example, because the abstract description of the process is less useful than watching it applied.

The contract says:

1. All fields `private`.
2. Constructor rejects blank title (throws `IllegalArgumentException`).
3. Constructor rejects priority outside 1–5 (throws `IllegalArgumentException`).
4. `markComplete()` is the only method that modifies `completed`.
5. No `static` fields.

The AI returns:

```java
public class Task {
    public String title;
    public int priority;
    public boolean completed;

    public Task() {}

    public void setTitle(String title) { this.title = title; }
    public void setPriority(int priority) { this.priority = priority; }
    public void setCompleted(boolean completed) { this.completed = completed; }
}
```

Apply the handoff condition clause by clause.

Clause 1: fields `private`? **Fail.** All three are `public`.

Clause 2: constructor rejects blank title? **Fail.** The constructor takes no arguments. There is no title validation anywhere.

Clause 3: constructor rejects invalid priority? **Fail.** Same reason.

Clause 4: `markComplete()` is the only mutation path for `completed`? **Fail.** `setCompleted(boolean completed)` exists and accepts any boolean value from any caller.

Clause 5: no `static` fields? **Pass.** No static fields present.

One pass out of five. The output is rejected. The student records the failures, identifies which ones are prompt omissions — she did not specify field visibility, constructor parameters, or forbidden setter methods — and revises the prompt.

| Clause | What the contract requires | What the output contains | Pass or Fail | Root cause (prompt omission vs |
| --- | --- | --- | --- | --- |
| Audit checklist | five rows, one per clause. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

This is the discipline. Not "does this look right" but "does this satisfy each clause of the specification I wrote before seeing the output." The difference between those two questions is the difference between acceptance and rationalization.

---

## Why Java Was Designed This Way

You might wonder whether this matters for small programs. A three-field `Task` class with public fields works fine for a homework assignment. Nothing breaks. Why does the course treat this as a specification failure?

Here is the honest answer: small programs are where habits form.

Java's visibility modifiers, constructor validation, and instance/static distinction were not added to the language for large programs. They were added because the designers understood that a program's correctness depends on the ability of each component to enforce its own invariants — and that a component which cannot enforce its own invariants makes every other component that touches it unsafe.

David Parnas wrote about this in 1972. The principle is that you hide inside a module the design decisions that are most likely to change — the representation of state, the implementation of operations — and expose only the interface that other modules need. This is not a rule about style. It is a rule about *change propagation*. When the representation is hidden, you can change it without breaking every other class that used to read the fields directly. When the representation is public, a change to how `Task` stores its priority requires inspecting every class that ever touched `task.priority`. In a large system, that is not practical. In a small system, it is a habit you either build or don't.

Meyer formalized this as Design by Contract in 1997: every class has preconditions it requires of callers, postconditions it promises to deliver, and invariants it maintains across its lifetime. The constructor enforcing a non-blank title is a precondition. The guarantee that `markComplete()` only sets `completed` to `true` (never `false`) is a postcondition. The invariant is that both remain true at every observable moment.

When you write a class contract before prompting AI, you are doing what Meyer described: making the obligations of the class explicit before implementing it. The AI implements. You verify. The contract is what makes the verification possible.

![Timeline of the idea ](images/05-objects-as-specifications-fig-05.png)
*Figure 5.5 — Timeline of the idea *

---

## What the Specification Looks Like as a Prompt

I want to close this chapter with something concrete: what a complete class specification looks like when written as an AI prompt.

Here is a weak prompt:

> Write a Java Task class with title, priority, and completed fields.

Here is a prompt derived from the full contract:

> Write a Java class named `Task`. Responsibility: owns its title, priority, and completion state and enforces that none can be in an invalid configuration. Fields: `title` (String, private), `priority` (int, private), `completed` (boolean, private). Constructor: takes `String title` and `int priority`; throws `IllegalArgumentException` with a descriptive message if title is null or blank; throws `IllegalArgumentException` if priority is not between 1 and 5 inclusive; sets `completed` to false. Methods: `markComplete()` (void, sets `completed` to true, no parameters); `getTitle()` (returns String); `getPriority()` (returns int); `isCompleted()` (returns boolean). No static fields. No additional methods. No setters.

| weak prompt text annotated to show what each missing clause leaves unspecified (visibility → gap | constructor → gap | invariants → gap) |
| --- | --- | --- |
| Side-by-side prompt comparison | left | A concrete checkpoint for applying the chapter concept. |

Both prompts are short. The second one takes about three minutes to write. The second one produces a class you can audit against a checklist. The first one produces a class that might or might not satisfy any given requirement, depending on what defaults the model applies.

The handoff condition follows directly from the contract: *all fields private; constructor throws on invalid input; no static fields; no setters; `markComplete()` is the only mutation path for `completed`.*

You write that before you see the output. You check the output against it. You record what passed and what failed. That is the entire method. The method is not complicated. The discipline is in applying it every time, not just when the output looks suspicious — because the output that caused the bug three weeks from now is the one that looked fine today.

---

## What to Carry Into the Next Chapter

Before you move to Chapter 6, you should be able to do three things.

First: write a class contract for a domain object you have never built before. All seven components. Responsibility, fields, visibility, constructor requirements, method signatures, invariants, forbidden shared state. If you find yourself skipping a component because it seems obvious, write it down anyway. The obvious components are the ones the AI will get wrong when you leave them unspecified.

Second: audit an AI-generated class against a contract you wrote before seeing the output. Not "does this look right." Clause by clause. Pass or fail. Record the failures and identify their root causes.

Third: explain the behavioral consequence of using `static` where you meant instance. Not the definition of static — the consequence. What changes, for whom, and when does it become visible.

The next chapter asks a harder question: what happens when a single object is not enough, and the relationships between objects carry obligations that no single class can enforce alone?

---

## Exercises

These exercises are designed to be completed with an AI tool of your choice. The goal is not to generate correct Java. The goal is to generate Java whose correctness you can verify.

**Warm-Up**

1. Write a complete seven-component class contract for a `BankAccount` class: responsibility, fields (with types and valid ranges), visibility for each field, constructor requirements (what it must reject), method signatures with postconditions, invariants, and a statement about whether any state should be `static`. Write the contract before writing any Java or any prompt.

2. From your contract, write a Boondoggle Score handoff condition — a binary checklist of clauses the AI output must satisfy. Then prompt AI for the class. Apply the condition clause by clause. Record each pass or fail and identify the root cause of any failure.

**Application**

3. The following class has at least three contract violations. Identify each one, name the component of the contract it violates, and explain the behavioral consequence — not why it is bad style, but what can go wrong at runtime.

```java
public class Counter {
    public int count;
    public static String label;

    public Counter(String label) {
        this.label = label;
    }

    public void increment() { count++; }
    public void setCount(int count) { this.count = count; }
}
```

4. Rewrite the prompt that produced the `Task` class with public fields so that the handoff condition from this chapter would pass on the first attempt. Test it. If it fails, record what failed and revise until it passes.

**Synthesis**

5. A student argues: "Getters and setters are the same as public fields — you're just adding methods that do what the field assignment would do anyway." Write a two-paragraph response that explains exactly where this argument is correct and exactly where it breaks down. Use a concrete example involving constructor-enforced invariants to show the difference.

6. Write a two-row Boondoggle Score for a build that first produces a `Task` class and then produces a `TaskList` class that holds a collection of `Task` objects. The second row depends on the first passing. For each row: AI task, human task, handoff condition, evidence type, supervisory capacity.

**Challenge**

7. Design a class called `ImmutablePoint` that represents a point in 2D space. Its state must be fixed at construction and never changeable afterward. Write the full seven-component contract, then prompt AI for the implementation, then audit it. The interesting question: what does "immutable" require beyond private fields? What Java mechanisms enforce it, and which of them does AI typically omit?

---

## LLM Exercises

Use these prompts with a language model to extend your understanding. Treat each generated response as an artifact to be audited, not a source to be cited.

**LLM Exercise 1 — Contract Stress Test**

```
Here is a class contract I wrote:

[paste your seven-component contract]

Generate a Java class that satisfies every clause of this contract. Then generate a second Java class that compiles and passes a superficial reading but violates at least two clauses of the contract. For the second class, explain which clauses it violates and why a casual inspection might miss the violations.
```

**LLM Exercise 2 — Invariant Probe**

```
Here is a Java class:

[paste a class — yours or AI-generated]

Identify every invariant this class is trying to maintain. For each invariant, identify whether it is enforced by the class itself (via private fields, constructor validation, or restricted mutation paths) or whether it depends on callers behaving correctly. For any invariant that depends on caller behavior, show a code example that violates it without triggering any compiler error or runtime exception in the class itself.
```

**LLM Exercise 3 — Static vs. Instance Probe**

```
Here is a class that mixes static and instance state:

[paste a class with at least one static field]

Explain the behavioral consequence of each static field in this class. For each one: what changes if two instances of this class are created in the same program? What changes if the class is used in a multithreaded context? If the static field should be instance state instead, rewrite the class with that correction and explain what the rewrite prevents.
```

After receiving the generated analysis, audit it: does it correctly distinguish behavioral consequences from style preferences? Does it show a concrete example for each claim? Revise any explanation that stays at the level of "static is shared" without showing what that sharing produces.
