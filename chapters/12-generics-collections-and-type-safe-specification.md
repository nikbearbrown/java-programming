# Chapter 12 — Generics, Collections, and Type-Safe Specification
*When the Data Structure Is the Specification.*

---

The program is correct with 100 tasks. You can demo it, submit it, and move on.

With 100,000 tasks, lookup takes long enough that users think it froze.

Nothing in the code is wrong, exactly. The logic is sound. The methods return the right values. The tests pass. But AI used `ArrayList` because the prompt said "store tasks," and `ArrayList` is a reasonable thing to use when you want to store tasks. The real requirement was "retrieve a task by id often" — and that is a completely different specification. `ArrayList` retrieves by position. Retrieving by id from an `ArrayList` means scanning every element until you find the one with the matching id. With 100 tasks, that scan takes microseconds. With 100,000 tasks, it takes long enough to matter. With a million tasks, it is genuinely broken.

The failure is not in the Java. The failure is in the prompt. The prompt didn't specify the access pattern, so the model chose a data structure that satisfies the specification as written. It just doesn't satisfy the specification as needed.

This chapter is about the difference between those two things — and about how to write a specification precise enough that the two converge.

| Task count | Lookup behavior | Time consequence | User experience |
| --- | --- | --- | --- |
| The ArrayList failure at scale — | The pattern becomes easy to misuse or overlook. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

---

## What the Type Annotation Actually Says

Before getting to access patterns, I want to spend some time on what a type annotation in Java actually means, because the common read — "it prevents putting the wrong kind of object in the container" — is true but incomplete.

Consider the difference between these two declarations:

```java
ArrayList tasks = new ArrayList();
ArrayList<Task> tasks = new ArrayList<>();
```

The first is legal Java. It is also a statement to every future reader of the code — including AI when you ask it to generate downstream components — that the list might contain anything. A `String`. An `Integer`. A `Task`. The compiler will let you put any object in, and will require a cast every time you take one out. If the cast is wrong, you get a `ClassCastException` at runtime, at the point of use, which may be far from the point of insertion.

The second declaration says something specific: this list contains `Task` objects. The compiler enforces that claim. Nothing that isn't a `Task` can go in without an explicit cast that the compiler will flag as unchecked. Everything that comes out is guaranteed to be a `Task` without any cast at the call site.

The difference in safety is real, but I want to focus on the difference in specification. `ArrayList<Task>` is a prompt constraint. When you write it in your handoff condition — "the repository field must be declared `ArrayList<Task>`, not raw `ArrayList`" — you are making the type boundary inspectable. AI that generates `ArrayList tasks` has violated the handoff condition visibly, on the declaration line, before any behavior is even exercised.

This is what type-safe specification means in this course. Not just "use generics because they're better practice" — use generics because they make the data contract visible, inspectable, and auditable without running the code.

| Dimension | Raw (ArrayList) | Generic (ArrayList<Task>) |
| --- | --- | --- |
| Raw collection vs. generic collection as specification — | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

---

## Type Erasure and Why It Matters Here

There is a complication worth understanding, because it explains a class of AI-generated warnings you will encounter and need to evaluate.

At runtime, Java erases type parameters. `ArrayList<Task>` and `ArrayList<String>` are both just `ArrayList` once the program is compiled. The generic type information exists only at compile time, for the compiler's benefit. At runtime, the JVM sees only `ArrayList`.

This matters because it means certain operations that look type-safe in source code are not actually guaranteed at runtime. The most common case is an unchecked cast — a cast from a raw type to a parameterized type:

```java
ArrayList<Task> tasks = (ArrayList<Task>) someUntypedList;
```

The compiler will let this compile, but will produce an unchecked cast warning. It is warning you that the cast cannot be verified at runtime because of type erasure. If `someUntypedList` actually contains `String` objects, the cast will succeed — and then you will get a `ClassCastException` later, at the point where you try to use a `String` as a `Task`. The error will be far from the cast, which is the worst kind of debugging situation.

The practical consequence for this course is this: an unchecked cast warning in AI-generated code is evidence the type system stopped proving something. It is not an error, so the code compiles. But it is not a warning you can safely ignore. Suppressing it with `@SuppressWarnings("unchecked")` requires a reason — specifically, a reason you can state in the handoff condition that explains why the cast is actually safe.

If you can't state that reason, the warning is a handoff condition failure waiting to be discovered. The audit step is where you find it.

![Type erasure is why an unchecked cast warning is evidence of a guarantee gap, not just a style note.](images/12-generics-collections-and-type-safe-specification-fig-01.png)
*Figure 12.1 — Timeline diagram *

---

## The Access Pattern Specification

Now to the opening case. The problem was not the ArrayList. The problem was the missing access pattern specification.

An access pattern specification names five things: the dominant operations, the expected scale, the ordering requirements, the uniqueness requirements, and the failure mode when the wrong collection is chosen. Every one of these belongs in the prompt before AI generates the data structure.

Let me show what this looks like for the task repository case.

**Without access pattern specification:**

> *Generate a `TaskRepository` class that stores `Task` objects and provides methods to add a task and retrieve a task by id.*

This prompt will produce working code. At 100 tasks, it will produce correct code. `ArrayList<Task>` satisfies everything stated.

**With access pattern specification:**

> *Generate a `TaskRepository` class that stores `Task` objects with these access pattern requirements: dominant operation is retrieval by task id (called on every user interaction); expected scale is 10,000–100,000 tasks; no duplicate ids; insertion order is not required. Use `HashMap<String, Task>` keyed by task id. Do not use `ArrayList`, `LinkedList`, or any collection that requires iterating through elements to find a task by id. The handoff condition is: the storage field is declared `HashMap<String, Task>`, the `findById` method accepts a `String` and returns `Task` or `null` without iteration, and the `add` method rejects a task whose id already exists in the map.*

The second prompt is longer. It is also the specification of a system that will perform correctly at production scale. Every clause in the second prompt traces to the access pattern requirements. The forbidden items — `ArrayList`, `LinkedList`, iteration-based lookup — are forbidden precisely because they would satisfy the prompt as written while violating the prompt as needed.

| Prompt clause | Access pattern requirement it encodes | What breaks if omitted |
| --- | --- | --- |
| Clause-by-clause traceability | the access pattern prompt — | A concrete checkpoint for applying the chapter concept. |

| Element | What to specify | Example for task repository |
| --- | --- | --- |
| Access pattern specification elements — | A concrete checkpoint for applying the chapter concept. | Use the chapter example as the concrete test case. |

---

## Choosing the Right Collection

Java's collection hierarchy is not a set of interchangeable containers with different names. Each type encodes a set of performance guarantees and behavioral contracts. Choosing the wrong one is not a style error — it is a specification error, visible in the Boondoggle Score as a prompt that stated the wrong type.

Here are the decisions that matter most in practice, and the reasoning behind each:

**`ArrayList<E>` vs. `LinkedList<E>`.** Both implement `List<E>`. Both maintain insertion order. Both permit duplicates. The difference is access pattern. `ArrayList` gives O(1) access by index and O(n) insertion or deletion in the middle. `LinkedList` gives O(n) access by index and O(1) insertion or deletion at a known position. If your dominant operation is `get(index)` or iteration, use `ArrayList`. If your dominant operation is inserting or removing from the middle of a large list frequently, `LinkedList` is worth considering — but its constant factors are often worse than `ArrayList` in practice due to memory layout. For most course-sized repositories, `ArrayList` is correct unless the specification explicitly names a reason otherwise.

**`HashMap<K, V>` vs. `TreeMap<K, V>`.** Both implement `Map<K, V>`. The difference is ordering. `HashMap` gives O(1) average-case get and put, with no guaranteed key order. `TreeMap` gives O(log n) get and put, with keys stored in natural order (or a specified `Comparator` order). If you need to retrieve by key quickly and don't care about key order, use `HashMap`. If you need to iterate over keys in sorted order — for display, for range queries — use `TreeMap`. The handoff condition must state which property the prompt depends on, because the choice is invisible unless specified.

**`HashSet<E>` vs. `TreeSet<E>`.** Same logic as the map types, applied to sets. `HashSet` gives O(1) contains and add with no ordering. `TreeSet` gives O(log n) with sorted iteration. Use `HashSet` when the only operation is membership testing. Use `TreeSet` when you need sorted iteration over a unique set.

**`ArrayDeque<E>` vs. `Stack<E>` vs. `LinkedList<E>` for stack/queue behavior.** `Stack<E>` is a legacy class and should not be used in new code — it extends `Vector`, which synchronizes every operation unnecessarily. `ArrayDeque<E>` implements both `Deque<E>` and `Queue<E>` efficiently. If you need stack or queue behavior, the prompt should specify `ArrayDeque<E>` and the handoff condition should verify that `Stack` does not appear.

| If you need |
| --- |
| Collection decision guide — |

---

## Wildcards and Bounded Type Parameters

There is a further precision available in generic specifications: the bounded type parameter. This is where generics move from "what kind of thing is in this container" to "what must be true about the kind of thing in this container."

The syntax `<T extends Comparable<T>>` means: T can be any type, as long as that type implements `Comparable<T>`. A method that accepts `List<T extends Comparable<T>>` is making a specification claim: whatever you put in this list, it must be sortable. If you try to pass a `List<MyTask>` where `MyTask` doesn't implement `Comparable`, the compiler rejects it at the call site.

This matters for the same reason raw types matter: it makes the contract inspectable. A method signature `public static <T extends Comparable<T>> void sort(List<T> list)` says everything about what the method requires, without any documentation. The type bound is the documentation.

Wildcards — `?` — express a different constraint. `List<?>` means "a list of some type I don't know or care about." `List<? extends Task>` means "a list of Task or any subclass of Task." `List<? super Task>` means "a list of Task or any superclass of Task."

The practical rule, called PECS (Producer Extends, Consumer Super), is this: if a collection is a source you read from, use `? extends`. If it is a destination you write to, use `? super`. If it is both, use the exact type. This rule exists because of a type-safety constraint you can derive from first principles: if you have a `List<? extends Task>` and you try to add a `Task` to it, the compiler rejects it — because the list might actually be a `List<PriorityTask>`, and adding a plain `Task` to a `List<PriorityTask>` would violate its type contract.

For this course, the important audit point is simpler than the full derivation: a wildcard in a position where an exact type was available is evidence of an underspecified prompt. If AI generates `List<?>` where the prompt should have said `List<Task>`, the handoff condition fails — not because wildcards are wrong, but because an unknown type where a known type was required means the specification didn't state what it should have.

| Situation | Use | Do not use | Why |
| --- | --- | --- | --- |
| at the method signature. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | It makes the underlying reasoning visible instead of implied. |

---

## What Goes in the Handoff Condition

By now the pattern should be clear. The handoff condition for a component that uses generics and collections must name:

- The collection type, including the type parameter: not `List` but `List<Task>`, not `Map` but `Map<String, Task>`.
- The presence or absence of unchecked cast warnings: if the component generates warnings, the handoff condition must state why each is safe, or the condition fails.
- The access pattern the collection was chosen to serve: why `HashMap` and not `TreeMap`, why `ArrayList` and not `LinkedList`.
- The invariants that downstream components depend on: if the controller expects `findById` to return in O(1) time, that expectation must appear in the repository's handoff condition, because the controller cannot verify it without knowing the storage type.

This last point connects directly to Chapter 9. A repository handoff condition that says "the class compiles and stores tasks" leaves the controller's assumptions about performance unverified. A handoff condition that says "the storage field is `HashMap<String, Task>`; `findById(String id)` is O(1) average case by key lookup; no iteration over the collection occurs in retrieval methods" gives the controller a contract it can depend on and audit against.

The collection choice is an architectural decision. Architectural decisions belong in the Boondoggle Score, not in the generated code comment that nobody reads.

| Element | Weak version (fails) | Strong version (passes) |
| --- | --- | --- |
| Handoff condition elements for a generic collection component — | A concrete checkpoint for applying the chapter concept. | A specific, evidence-linked version that readers can verify. |

---

## The Prompt That Gets This Right

Let me close with a complete example of a prompt that specifies generics and access pattern correctly, so you have a template to work from.

**Task:** Generate a `TaskRepository` class for a task management system.

**Correct prompt:**

> *Write a Java class named `TaskRepository`. The storage field must be declared `private final Map<String, Task> tasks = new HashMap<>()`. The class must provide: `void add(Task task)` — adds the task using `task.getId()` as the key; throws `IllegalArgumentException` if a task with that id already exists. `Task findById(String id)` — returns the task with the matching id, or `null` if not found; must not iterate through the map. `List<Task> getAll()` — returns a new `ArrayList<Task>` containing all tasks in the map, in no specified order. Do not use `ArrayList` as the primary storage structure. Do not use raw types anywhere in the class. Do not use unchecked casts. The class must have no GUI code, no file I/O, no Scanner, and no static fields.*

The handoff condition for this prompt is equally specific:

> *The class declares `private final Map<String, Task> tasks = new HashMap<>()`. The `add` method uses `tasks.put(task.getId(), task)`. The `findById` method uses `tasks.get(id)`. No method iterates through the map with a loop to find a task by id. No raw types appear in any field or method signature. No unchecked cast warnings appear when the class is compiled.*

Every clause is binary. Every clause is inspectable by reading the code. Every clause protects a downstream dependency.

| Clause | What it verifies | Why it belongs |
| --- | --- | --- |
| Handoff condition clause anatomy for TaskRepository — | A concrete checkpoint for applying the chapter concept. | It makes the underlying reasoning visible instead of implied. |

---

## LLM Exercises

1. **Access pattern specification.** You are building a `StudentRegistry` that needs to: look up a student by university id frequently; iterate all students in alphabetical order by last name periodically; guarantee no duplicate ids. Write the full access pattern specification for this component — dominant operation, expected scale (choose a reasonable number and justify it), ordering requirements, uniqueness requirements, and failure mode of the wrong choice. Then write the conductor-style prompt that encodes this specification, including the collection type, the forbidden alternatives, and the handoff condition.

2. **Unchecked cast audit.** A peer's AI-generated `DataStore` class contains this line: `List<User> users = (List<User>) rawStorage.get("users");`. The compiler produces an unchecked cast warning. Classify this: is it a prompt omission, model failure, or acceptable with justification? Write the argument for each classification, then state which applies and why. Finally, write the revised handoff condition that would catch this before acceptance.

3. **Wildcard diagnosis.** AI generates a method signature `public void processItems(List<?> items)` for a method that is supposed to call `item.getPriority()` on each element, where `getPriority()` is defined in the `Task` interface. Explain why this method signature is wrong in terms of what the wildcard prevents. Write the corrected signature with the appropriate bound, and write the handoff condition that would verify the corrected version.

4. **Collection substitution defense.** Your `EventLog` repository stores log entries in insertion order and the dominant operation is appending a new entry at the end. AI generates `LinkedList<LogEntry>`. You recall that `ArrayList<LogEntry>` is usually faster for appending due to memory layout, even though both are O(1) amortized. Write the Boondoggle Score entry for this decision: AI task, human task, handoff condition, evidence, and supervisory capacity. Your evidence must name the access pattern, the scale assumption, and the reason you either accept `LinkedList` or revise the prompt to require `ArrayList`.
