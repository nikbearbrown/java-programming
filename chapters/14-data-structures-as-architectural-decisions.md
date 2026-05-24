# Chapter 14 — Data Structures as Architectural Decisions
*What the System Can Do Cheaply Is Decided Before the First Line of Logic.*

---

Two systems have the same screens. They pass the same sample tests. A user sitting down to either one would notice no difference.

Under load, they are different systems.

The first uses a list for everything. Looking up a student by id? Scan the list. Checking whether a username is already taken? Scan the list. Finding the highest-priority task? Scan the list, tracking the maximum. Each of these operations is O(n) — it takes time proportional to the number of elements. At classroom scale, with fifty or a hundred records, this is invisible. At ten thousand records, the scan that takes a microsecond at fifty records takes two hundred microseconds. At a hundred thousand records, it takes two milliseconds. These numbers sound small until you multiply them by the number of times they happen per user interaction.

The second system uses a map for lookup, a priority queue for next action, and a set for uniqueness. The same operations that take O(n) in the first system take O(1) or O(log n) in the second. The user never sees the difference at classroom scale. The production system that serves ten thousand users simultaneously is not the same conversation.

The interesting question is not which system is better. The interesting question is: where is the decision made?

It is made in the prompt. And if it is not made in the prompt, it is made by the model's defaults — which favor familiarity over fitness.

<!-- → [INFOGRAPHIC: Two-system side-by-side — left: "System A" with a single ArrayList branching to three operations (lookup by id, username check, find highest priority), each labeled O(n). Right: "System B" with three structures (HashMap, HashSet, PriorityQueue) each handling one operation, labeled O(1), O(1), O(log n). Below both: "Same screens. Same tests passing. Different load behavior." Caption: "The structural decision is invisible at classroom scale and consequential at production scale."] -->

---

## Architecture Is What You Can't Change Cheaply Later

The word "architecture" is used loosely in software. I want to use it precisely here.

A decision is architectural if changing it later requires rewriting the components that depend on it. Choosing `ArrayList` as the storage structure for a repository is architectural because the repository's callers depend on the access patterns that `ArrayList` provides. If you decide three components later that you need O(1) lookup by key, you can't just swap in `HashMap`. You have to rewrite the repository, update its handoff condition, re-audit its callers, and verify that nothing broke. That is not a refactor. That is a design change that propagates through the dependency graph.

This is why the source note says data structure choice "can wait until performance becomes a problem" is a misconception. By the time performance becomes a problem, downstream code already depends on the wrong access pattern. The cost of changing the structure at that point includes everything that assumed the old structure was correct.

The specification-first approach this course teaches exists precisely because of this dynamic. When the data structure is named in the prompt — not guessed by the model, but specified by the conductor — the choice is made consciously, at the moment when it is cheapest to make. When it appears in the handoff condition, the choice is recorded as a commitment. When it appears in the Boondoggle Score, it is traceable.

<!-- → [TABLE: Architectural vs. non-architectural decisions — columns: Decision, Architectural?, Why. Row 1: Storage collection type (ArrayList vs HashMap) / Yes / Repository callers depend on access patterns; change propagates through dependency graph. Row 2: Variable naming within a method / No / Callers see only the method signature; internal names don't propagate. Row 3: Ordering guarantee of a collection (insertion vs. sorted) / Yes / Display components may depend on order; changing it breaks their assumptions. Row 4: Loop variable type (int vs long) for small bounds / No / No downstream component depends on this choice. Row 5: Uniqueness enforcement mechanism (Set vs manual check) / Yes / Duplicate-prevention callers depend on this; changing it changes the invariant.] -->

---

## The Seven Elements of a Data Architecture Requirement

Chapter 12 introduced the access pattern specification with five elements. This chapter extends it. A complete data architecture requirement names seven things, and each one constrains a different dimension of what AI may generate.

**The data entity.** What is being stored? Not just the Java type — the domain object and its role. "A collection of `Task` objects representing incomplete work items" is more useful than "tasks," because it tells the model what the object is for, which constrains which operations make domain sense.

**The dominant access pattern.** The operation that happens most frequently in production use. Retrieval by key, iteration in order, membership testing, priority-based extraction — these are different operations with different optimal structures. The dominant pattern determines the structure. If you specify it, you have constrained AI's choice to the correct subset. If you don't, AI picks a familiar default.

**The ordering requirement.** Does the data need to come out in a particular order? Insertion order, sort order, or no order? This is separate from the dominant access pattern because you can need O(1) lookup by key *and* sorted iteration for display. The structures that satisfy each combination are different, and some combinations require maintaining two structures simultaneously.

**The uniqueness rule.** Can duplicate elements or keys exist? Must they be prevented at insertion, or checked before insertion, or tolerated? The answer shapes whether a `Set` or `Map` is appropriate (uniqueness enforced by the structure) versus `List` with a manual guard (uniqueness enforced by the caller). The handoff condition must state which approach was specified and which invariant the structure maintains.

**The mutation pattern.** How does the data change over time? Append-only, frequent deletion, update-in-place, or read-mostly? An append-only log has different optimal characteristics than a frequently-updated registry. `ArrayList` is efficient for append. `LinkedList` is efficient for middle insertion. `HashMap` is efficient for update-by-key. Specifying the mutation pattern closes off the wrong choices.

**The expected scale.** Order-of-magnitude estimate for collection size at production use. This doesn't need to be precise. "Dozens" is different from "thousands" is different from "millions." The scale estimate is what transforms "both are O(n)" from a tie into a decision: O(n) at dozens is fine; O(n) at millions is not.

**The invariant enforcement location.** Which component is responsible for maintaining each invariant? If uniqueness must be enforced, is it the repository's `add` method, the service layer above it, or the caller? If ordering must be maintained, is it the structure itself (as in `TreeMap`) or the retrieval method (as in a sort before return)? The handoff condition must state where each invariant lives, because that determines which component's audit must verify it.

<!-- → [TABLE: The seven elements applied to the StudentRoster example — columns: Element, What to specify, Example. Row 1: Data entity / Domain object and its role / Student objects representing enrolled students with university ids. Row 2: Dominant access pattern / Most frequent operation in production / Lookup by university id on every interaction. Row 3: Ordering requirement / Required output order / Sorted by last name for display. Row 4: Uniqueness rule / Whether duplicates are permitted and how enforced / No duplicate ids; enforced at insertion in repository. Row 5: Mutation pattern / How data changes / Append and delete; no update-in-place. Row 6: Expected scale / Order of magnitude at production / Thousands per institution; tens of thousands across a district. Row 7: Invariant enforcement location / Which component maintains each invariant / Uniqueness: repository.add(); sort order: view.display() retrieves sorted list from TreeMap or calls Collections.sort().] -->

---

## When One Structure Isn't Enough

The student roster example in the source reveals something the access pattern specification must handle: sometimes the required operations cannot all be served cheaply by a single structure.

The roster needs lookup by id (O(1) average with `HashMap`) and display sorted by last name (O(n log n) or O(n) if always maintained). A `HashMap<String, Student>` keyed by id gives fast lookup but no ordering. A `TreeMap<String, Student>` keyed by last name gives sorted display but O(log n) lookup and requires last name to be the key, which fails if two students share a last name. A `TreeSet<Student>` with a comparator by last name gives sorted unique elements but O(log n) contains and no key-based lookup.

None of these is the right answer by itself. The right architecture for this access pattern is two structures: a `HashMap<String, Student>` keyed by university id for lookup, and either a `TreeMap<String, Student>` keyed by a composite last-name/id key for display, or a sorted-on-demand approach where `display()` retrieves `map.values()` and sorts it. The handoff condition must specify both structures, because a reviewer who checks only the `HashMap` declaration has not verified the display behavior.

This is the architectural decision that a prompt like "store students and display them sorted by last name" will not produce correctly. AI will likely choose one structure. The conductor's job is to specify both, with their respective handoff conditions, and to document which component is responsible for keeping them consistent when a student is added or removed.

<!-- → [TABLE: Two-structure solution for StudentRoster — columns: Structure, Declaration, Operations it serves, Consistency obligation. Row 1: Identity store / HashMap<String, Student> keyed by university id / O(1) lookup by id; uniqueness enforcement / Must be updated on every add and remove. Row 2: Display view / TreeMap<String, Student> keyed by composite last-name+id, OR Collections.sort() on map.values() / Sorted iteration by last name / TreeMap: updated on every add/remove. Sort-on-demand: no ongoing obligation, sort cost paid at display time. Caption: "The handoff condition must name both structures and state which component keeps them consistent."] -->

<!-- → [INFOGRAPHIC: Structure-requirement mapping diagram — three access requirements on the left (lookup by id, display sorted by last name, no duplicate ids), three structure options in the middle (HashMap, TreeMap, TreeSet), lines showing which options satisfy which requirements, and a fourth option on the right: HashMap + sorted view, satisfying all three. Caption: "When no single structure satisfies all access requirements, the specification must name two structures and their consistency obligation."] -->

---

## The Priority Queue Case

There is a structure the standard collection hierarchy contains that students rarely reach for because most prompts don't name it: the `PriorityQueue`.

A `PriorityQueue<E>` maintains its elements in priority order — smallest first, or first according to a provided `Comparator`. Inserting an element is O(log n). Retrieving and removing the highest-priority element is O(log n). Membership testing is O(n). It is not a general-purpose collection. It is a structure optimized for one specific access pattern: "give me the most important thing next."

If your system needs to process tasks in priority order — highest priority task first, always, regardless of insertion order — and you specify `ArrayList<Task>`, AI will generate code that works: a loop that scans for the maximum-priority task, removes it, and processes it. This is O(n) per extraction. With a `PriorityQueue<Task>` and a priority comparator, every extraction is O(log n). At a thousand tasks, the difference is a factor of roughly 500 per extraction. At ten thousand tasks, it is a factor of roughly 5,000.

The prompt that produces the right structure is not "write a task processor that handles tasks in priority order." That prompt will produce `ArrayList`. The prompt that produces the right structure names the structure: "The task queue must be declared `PriorityQueue<Task>` with a comparator that orders tasks by priority descending. Do not use `ArrayList`, `LinkedList`, or any structure that requires scanning to find the highest-priority task."

<!-- → [TABLE: PriorityQueue vs ArrayList for priority-ordered processing — columns: Operation, ArrayList<Task>, PriorityQueue<Task>, Consequence at 10,000 tasks. Row 1: Add a task / O(1) amortized / O(log n) / Comparable; PriorityQueue slightly slower to insert. Row 2: Get highest-priority task / O(n) scan / O(1) peek / ~10,000 comparisons vs. ~1; PriorityQueue wins decisively. Row 3: Remove highest-priority task / O(n) scan + O(n) removal / O(log n) / ~20,000 operations vs. ~14; PriorityQueue wins decisively. Row 4: Membership test / O(n) / O(n) / Tie; neither is optimized for this. Row 5: Prompt produces it by default? / Yes (familiar default) / No (must be named explicitly) / Default choice correct only if priority ordering isn't required.] -->

---

## Specifying the Invariant Enforcement Location

The seventh element — invariant enforcement location — deserves more attention than a list item, because it is the element most often missing from student prompts and most often responsible for integration failures.

Consider the uniqueness invariant. A system that must prevent duplicate student ids can enforce this in several places:

In the data structure itself, if you use `HashMap<String, Student>` with the id as key: a second `put` with the same key silently overwrites the first. That is not uniqueness enforcement — it is silent mutation. To enforce uniqueness with a `HashMap`, the `add` method must check whether the key already exists before putting.

In the repository's `add` method, with an explicit check: `if (students.containsKey(id)) throw new IllegalArgumentException(...)`. This puts the invariant in the right place — the boundary where new data enters the system.

In the service layer above the repository: the caller checks before calling `add`. This is weaker, because it depends on every caller being disciplined. A new caller that skips the check breaks the invariant.

At the structure level via `Set`: using `HashSet<Student>` requires defining `equals` and `hashCode` on `Student` by id, which makes uniqueness automatic but also makes set semantics govern every other operation. This may not be what you want.

The specification must name the location. "The repository enforces no duplicate ids by checking `students.containsKey(task.getId())` before every `put`, and throwing `IllegalArgumentException` if the id exists" is inspectable. "No duplicate ids" is not, because it doesn't say where the check lives or what happens when it fails.

The handoff condition must verify the location, not just the invariant. "Class compiles and prevents duplicate ids" fails this test. "The `add` method contains `if (students.containsKey(id)) throw new IllegalArgumentException()` as its first statement" passes it.

<!-- → [TABLE: Invariant enforcement location options for uniqueness — columns: Location, Mechanism, Risk if missing or wrong. Row 1: Data structure (HashMap key) / Second put silently overwrites / Not enforcement — silent mutation masquerading as uniqueness. Row 2: Repository.add(), explicit check / containsKey before put; throw on duplicate / Correct if all insertions go through this method; fails if callers bypass. Row 3: Service layer above repository / Caller checks before calling add / Fragile; new callers may skip the check. Row 4: Set<E> with equals/hashCode by id / Structural uniqueness via Set contract / Correct but requires well-defined equals/hashCode; set semantics apply to all operations.] -->

---

## The Data Architecture Boondoggle Score Segment

Every data architecture decision in the system should produce a Boondoggle Score entry. Not "the repository class" as a single entry — each data structure decision within the repository that has downstream dependencies is its own entry.

A complete entry for the `StudentRoster`'s lookup structure:

- **AI task:** Generate a `StudentRoster` class with a `private final Map<String, Student> students = new HashMap<>()` storage field and an `add(Student s)` method that enforces uniqueness by id.
- **Human task:** Verify the field declaration names `HashMap<String, Student>` explicitly; verify the `add` method checks `students.containsKey(s.getId())` before inserting; verify no raw types appear.
- **Handoff condition:** The field is declared `private final Map<String, Student> students = new HashMap<>()`. The `add` method throws `IllegalArgumentException` if the id already exists. No raw `Map` or `HashMap` declarations without type parameters appear.
- **Evidence:** Lines 3 (field declaration), 11–13 (add method uniqueness check) of the generated class, verified by inspection.
- **Supervisory capacity:** Interpretive Judgment (decision about structure and invariant location) + Plausibility Auditing (verification of the generated code against the handoff).

A second entry is needed for the display behavior — the sorted-view structure or sort-on-demand approach — because that is a separate architectural decision with its own handoff condition and its own downstream dependencies.

The principle: one entry per architectural decision that has a downstream dependent. If the view depends on sorted order, the sorted-order mechanism needs its own entry, because "the view works" without "the order mechanism is specified" is not a complete verification.

<!-- → [TABLE: Two Boondoggle Score entries for StudentRoster — columns: Entry, AI task, Human task, Handoff condition, Supervisory capacity. Row 1: Identity store / Generate HashMap<String, Student> with uniqueness-enforcing add / Verify field declaration, containsKey check, no raw types / Field declared HashMap<String, Student>; add throws on duplicate id / Interpretive Judgment + Plausibility Auditing. Row 2: Display behavior / Generate sorted display method using TreeMap or Collections.sort / Verify sort mechanism is specified and consistent with identity store updates / Display output is in last-name order; sort mechanism named in code; consistency obligation documented / Interpretive Judgment + Plausibility Auditing.] -->

---

## Identifying the Three Decisions That Matter Most

The second learning objective asks for something that requires judgment, not just application: given a complete system specification, identify the three data structure decisions that most affect behavior under load.

The reasoning is this: every data structure decision affects behavior. But not every decision affects behavior *under load* in the same way. The decisions that matter most are the ones that occur most frequently in production, on the largest data sets, with the most dependents downstream.

To identify them, ask three questions about each structure in the system:

*How often is it accessed?* A structure that is read on every user interaction amplifies its access-pattern consequences. A structure that is read once at startup does not.

*How large will it get?* A structure with ten elements will never show O(n) consequences. A structure with ten thousand elements will. The scale estimate from the data architecture requirement answers this question.

*How many components depend on it?* A structure that is accessed by three downstream components is a load-bearing node. A mistake in its specification propagates to all three. A structure accessed by only one component has contained consequences.

The three decisions that matter most are the ones that score highest across all three questions simultaneously. These are the entries in the Boondoggle Score that deserve the most precise handoff conditions — the ones where "the class looks right" is most dangerous and "these specific clauses pass by inspection" is most necessary.

<!-- → [TABLE: Identifying the highest-impact data structure decisions — columns: Structure, Access frequency, Expected scale, Downstream dependents, Impact score (qualitative). Row 1: StudentRoster storage (HashMap) / Every user interaction / Thousands / 2 (controller, view) / High. Row 2: Sorted display structure / On display request / Thousands / 1 (view) / Medium. Row 3: Active session cache (if present) / Every request / Tens / 1 (auth component) / Medium-high due to frequency. Row 4: Audit log (if append-only) / Write-only except for admin / Thousands / 1 (admin view) / Low — write-only doesn't amplify errors.] -->

---

## What the Chapter Before This One Missed

Chapter 12 taught that the data structure is the specification — that naming `HashMap<String, Task>` in the prompt is a specification act, not an implementation detail. That claim is correct as far as it goes.

This chapter adds what Chapter 12 left implicit: the data structure choice is not just a choice about a single component. It is a commitment that propagates through the dependency graph. The components that depend on the repository assume specific access patterns. The components that depend on those components inherit those assumptions. The invariant enforcement location determines which component must be audited for which invariant.

Data structures are architectural because they shape the system's obligations, not just the component's behavior. That is why they belong in the Boondoggle Score with the same rigor as any other handoff condition — and why specifying them by access pattern, ordering requirement, uniqueness rule, mutation pattern, expected scale, and invariant enforcement location is not over-engineering. It is the work of deciding what the system can do cheaply, safely, and predictably, before the first line of logic is written.

<!-- → [TABLE: What Chapter 12 specified vs. what Chapter 14 adds — columns: Dimension, Chapter 12, Chapter 14. Row 1: Scope / Single component / System-wide propagation. Row 2: Collection type / Named in prompt and handoff condition / Named with downstream consistency obligation. Row 3: Invariant location / Implied by choice / Explicitly specified and audited. Row 4: When choice is made / At prompt time / At specification time, before the dependency graph is built. Row 5: Boondoggle Score entries / One per component / One per architectural decision with a downstream dependent.] -->

---

## LLM Exercises

1. **Seven-element specification.** You are building a `CourseRegistry` that must: enroll students by student id (no duplicates), retrieve a student's enrolled courses by student id in O(1) time, display all courses sorted alphabetically by course name, and track the total number of enrollments for billing. Write the complete seven-element data architecture requirement for this component. Then write the conductor-style prompt that encodes all seven elements, including the collection type(s), forbidden alternatives, and invariant enforcement locations.

2. **Two-structure design.** A `MessageQueue` must support: fast retrieval of the next unread message by timestamp (oldest first), membership testing to check if a given message id has been read, and display of all messages sorted by sender name. Show that no single Java collection satisfies all three requirements optimally. Name the two structures you would use, specify their types including type parameters, state which operation each serves, and write the handoff condition that verifies both.

3. **Invariant location audit.** An AI-generated `InventoryManager` class has this storage field: `private List<Item> inventory = new ArrayList<>()`. The `addItem` method does not check for duplicate item codes. The `findByCode` method scans the list. Identify every data architecture specification failure: missing invariant enforcement, wrong structure for the dominant operation, and any missing uniqueness guarantee. For each failure, state whether it is prompt omission, model failure, or human acceptance failure. Write the revised prompt and the revised handoff condition.

4. **Impact ranking.** A system has four data structures: a `HashMap<String, User>` accessed on every login, a `List<AuditLog>` that is append-only and never read during normal operation, a `PriorityQueue<Job>` that schedules background tasks processed once per minute, and a `Set<String>` of banned usernames checked on account creation. Rank these by impact on behavior under load using the three-question framework from this chapter. Justify each ranking. Then identify which structure's handoff condition requires the most precise specification, and write that handoff condition.
