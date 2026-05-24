# Chapter 13 — Recursion as Problem Decomposition
*The specification never named how deep the folders could go.*

AI writes a method to count files in nested folders. The method is clean. It handles plain files. It handles directories. It descends through subdirectories correctly. You test it on the demo archive — three levels of nesting, about two hundred files — and it returns the right number.

Then someone passes it a real archive: a software project with its full build history, or a home directory that has been accumulating since 2011, or a network share with symbolic links that loop back to their own parent directories. The JVM prints a single line:

```
java.lang.StackOverflowError
```

No message. No partial count. No indication of how deep it went before it ran out of stack space. Just the error, and the program halted.

The method is not wrong. It does exactly what the specification said: count files, recurse into directories. The specification just did not say anything about what happens when the directories go thirty levels deep, or when a symbolic link creates a cycle, or when the recursion has been running for four seconds and is only halfway through. Those conditions were not in the specification. They were not forbidden. They were not handled. They were simply absent — and absence, in a recursive method, is how you produce a stack overflow.

This chapter is about why recursion requires a different kind of specification than anything we have written before, and what exactly must be said before you can hand a recursive problem to AI and trust the result.

---

## What Recursion Actually Is

<!-- → [IMAGE: A set of nested Russian dolls — each doll contains a smaller version of itself, with the innermost doll solid and unopenable. Caption: "The smallest case is the one that does not open. Every other case reduces to it."] -->

I want to be precise about what recursion is, because the standard explanation — "a method that calls itself" — describes the syntax without describing the contract.

Recursion is a *decomposition strategy*. The idea is this: if a problem is too complex to solve directly, find a way to express it in terms of one or more smaller instances of the same problem. Solve those smaller instances the same way — by reducing them further — until you reach an instance small enough to solve directly. That smallest instance, the one you solve without any further reduction, is the base case.

For counting files: a plain file is the base case. You do not need to open it or recurse into it. Its count is one. A directory is the recursive case — you cannot count it directly, but you can count each of its contents and sum the results. Each piece of content is either another base case (a plain file) or another recursive case (a subdirectory). You apply the same logic, and eventually everything reduces to plain files.

The elegant thing about this is that you write one method, and it handles arbitrary depth. You do not need to write a loop that knows about three levels or ten levels or a hundred levels of nesting. The method knows about one level of nesting — its own level — and the recursive call handles all the levels below it.

The dangerous thing about this is that the call stack handles the "handling all the levels below" part. Every recursive call adds a frame to the stack. When the recursion bottoms out, the stack unwinds. If the recursion is too deep before it bottoms out, the stack overflows before the unwinding can happen. The method is mathematically correct. The JVM runs out of memory for stack frames before it can finish.

<!-- → [DIAGRAM: Two-panel call stack diagram — left panel "normal recursion": stack frames growing downward as countFiles calls itself (root → child → grandchild → file), then unwinding back up with return values accumulating. Right panel "overflow": same stack growing but never reaching a base case, frames accumulating until "StackOverflowError" cuts the stack off. Labels show frame count at each depth. Caption: "The stack grows with every call and shrinks only when the base case is reached."] -->

---

## The Three Parts of a Recursive Specification

A recursive method specification has three required parts. They are not optional — you can write code without them, but you cannot audit code without them.

**The base case**, with its termination condition. The base case is the instance of the problem that does not recurse. It must be defined completely: what inputs reach it, what it returns, and why it does not require further decomposition. For `countFiles`: the base case is `root.isFile()` returning `true`. The input is a plain file. The return value is `1`. There is no recursion because a plain file has no children to descend into.

The termination condition matters because it has to be reachable. A base case that exists in the code but is unreachable from some inputs is not a base case — it is decoration. If `countFiles` has a base case for `root == null` but the method is never called with `null`, the base case never fires. What matters is not the base case you wrote; it is the base case you can prove will be reached from every input the method will actually receive.

**The recursive case**, with its reduction step. The recursive case is every input that does not reach the base case. For `countFiles`: the recursive case is `root.isDirectory()` returning `true`. The reduction step is the thing that makes the input smaller with each call — in this case, `root.listFiles()`, which returns the direct children of the directory. Each child is strictly smaller than the directory (it is contained within it), so the problem is getting smaller with each level.

The reduction step is where the most important failures live. A reduction step that does not actually shrink the problem will recurse forever — or until the stack overflows. The question to ask about every reduction step is: *can I prove that every recursive call receives an input that is strictly smaller than the current input, by some measure that is bounded below?* For file trees, the measure is depth. Each recursive call operates on a node one level deeper, and the tree has finite depth (if it terminates at all). For numeric recursion like factorial, the measure is the value of the argument. For list recursion, the measure is the length of the list.

**The termination invariant**. This is the property that must hold across all recursive calls and guarantees that the recursion terminates. For `countFiles`: the invariant is that each recursive call operates on a *strict child path* that has not been visited before. If this invariant holds, the recursion cannot cycle — it can only descend, and a file tree has finite depth.

The termination invariant is what the specification for `countFiles` omitted. The file tree does not have finite depth if symbolic links are followed — a symbolic link can point to a parent directory, creating a cycle. The recursive call on a symbolic link may receive a path the method has already visited, which means the invariant is violated, which means the recursion does not terminate.

<!-- → [TABLE: Three-part recursive specification — three rows. Columns: Component / What it must name / Failure if omitted. Rows: Base case / Inputs that halt recursion, return value, why no further decomposition needed / Missing base case — recursion never stops; Recursive case / Reduction step that strictly shrinks input, what "smaller" means / Wrong reduction step — recursion shrinks incorrectly or not at all; Termination invariant / Property that holds across all calls, why it guarantees finite depth / Stack overflow — cycles, no bound, or wrong measure] -->

All three parts must be present. A specification with only the base case and recursive case — which is the usual pattern — is missing the invariant, and the invariant is what prevents symbolic-link cycles, undetected shared nodes, and the class of inputs for which the recursion runs longer than the available stack.

---

## What AI Produces Without the Invariant

There is a predictable pattern to what AI generates when the specification names the base case and recursive case but omits the termination invariant.

The generated code follows the recursive shape correctly. It handles the base case. It recurses on the appropriate inputs. It accumulates results correctly. If you run it on a well-behaved input — a file tree with no cycles, bounded depth, no unexpected structure — it returns the right answer. It would pass every test you could write against the happy-path specification.

What it does not do is check whether the input is well-behaved. It does not track which paths it has visited. It does not check whether the next recursive call would revisit a path already on the call stack. It does not count the current recursion depth and stop before overflowing. All of those would require the invariant to be named — specifically, the invariant that each call operates on a path not yet visited.

```java
// What AI generates from a base case + recursive case specification
public int countFiles(File root) {
    if (root.isFile()) {
        return 1;
    }
    int count = 0;
    for (File child : root.listFiles()) {
        count += countFiles(child);
    }
    return count;
}
```

This code is correct for finite, acyclic file trees with bounded depth. The specification did not say the input would be finite. The specification did not say the input would be acyclic. The specification did not say the depth would be bounded. The code is a faithful implementation of what was specified — which is the problem.

<!-- → [DIAGRAM: Two file tree diagrams side by side — left: a normal finite tree with three levels, arrows descending to leaf nodes, recursion terminates; right: a tree with a symbolic link creating a cycle, arrows looping back upward, with "StackOverflowError" labeled at the point where the stack exhausts. Caption: "The code is the same in both cases. The input is different."] -->

The correct implementation adds cycle detection. The specification must name it:

```java
public int countFiles(File root, Set<String> visited) {
    String canonical;
    try {
        canonical = root.getCanonicalPath();
    } catch (IOException e) {
        return 0; // cannot resolve path — skip
    }
    if (visited.contains(canonical)) {
        return 0; // cycle detected — do not recurse
    }
    visited.add(canonical);
    if (root.isFile()) {
        return 1;
    }
    File[] children = root.listFiles();
    if (children == null) {
        return 0; // empty directory or access error
    }
    int count = 0;
    for (File child : children) {
        count += countFiles(child, visited);
    }
    return count;
}
```

Three things changed from the AI-generated version: a `visited` set tracks canonical paths, a cycle check returns zero without recursing, and `root.listFiles()` is null-checked for empty directories or permission errors. None of these appear in the AI-generated version because none of them were in the specification.

---

## The Stack as a Resource

There is a second failure mode that is distinct from the cycle problem, and it shows up even in well-behaved inputs.

The JVM call stack is a finite resource. Every method call allocates a stack frame — space for local variables, the return address, and the method parameters. In Java, the default stack size varies by JVM implementation but is typically somewhere between 256KB and 1MB per thread. Each stack frame for `countFiles` is small — a few references and a counter — but "small" is not "zero," and when you recurse a thousand levels deep, you have allocated a thousand frames.

For a file tree, a thousand levels of nesting is unusual. But for other recursive problems — processing a linked list where the list is constructed by reading a database query, recursing through a graph whose depth is determined by user input, computing a mathematical function on an argument whose magnitude is user-supplied — the depth may not be bounded by anything the programmer controls.

The specification decision here is not about correctness. It is about limits. A recursive method specification should state: *what is the maximum safe input size, and what happens if the input exceeds it?* Three answers are acceptable:

One: *the input domain is bounded, and the bound is smaller than the safe recursion depth.* If the problem is always operating on a tree with a known maximum depth of twelve levels, and the JVM stack safely supports several thousand levels, the problem does not arise. The specification names the bound.

Two: *the implementation includes a depth guard that returns an error or a default when the limit is exceeded.* The specification names the depth limit and the behavior at the limit.

Three: *the implementation uses an iterative approach with an explicit stack, replacing the JVM's implicit stack with a data structure whose size is managed explicitly.* This is always safe and sometimes necessary.

<!-- → [TABLE: Three responses to the stack depth problem — three rows. Columns: Approach / When to use it / What the specification must name / What the implementation does at the limit. Rows: Bounded domain / Input depth is provably limited / Maximum depth and why it is safe / Nothing — limit is never reached; Depth guard / Input depth is unknown or unbounded / Maximum safe depth, error or default behavior / Returns error or default when depth exceeded; Iterative with explicit stack / Maximum safety required, or input depth very large / Stack data structure type, traversal order / Stack never exceeds available heap memory] -->

The choice between these three approaches is an interpretive judgment — one of the five supervisory capacities. AI cannot make it, because AI does not know the deployment context. It does not know whether the method will be called on controlled internal data or arbitrary user-supplied archives. That knowledge lives with the engineer who is specifying the method.

---

## Recursive vs. Iterative: When the Choice Matters

I want to address a question that comes up whenever recursion is introduced, because the answer is important and often given incorrectly.

The question is: should I use recursion or iteration?

The incorrect answer is that recursion is elegant but dangerous, and iteration is safe but verbose. That framing treats style as the decision criterion and ignores the cases where the two approaches are not interchangeable.

The correct answer depends on three things.

**Stack depth.** If the problem's depth is bounded and small, recursion is fine. If the problem's depth is unbounded or large, recursion requires a depth guard or an iterative approach. The default JVM stack typically supports a few thousand to ten thousand frames before overflowing, depending on frame size. For a file tree traversal on a real system, that is usually sufficient — but not guaranteed.

**Readability tradeoff.** Some problems have a natural recursive structure that makes the recursive solution significantly clearer than the iterative equivalent. Traversing a tree, evaluating a recursive grammar, computing a function defined recursively in mathematics — these read naturally as recursion. The iterative equivalent requires an explicit stack and substantially more bookkeeping. If the depth is safe, the recursive version is often the better choice for maintainability.

**The right measure.** Some problems that appear to require recursion actually have iterative solutions that are simpler once you see them. Counting files in a directory tree can be solved with a queue — start with the root, dequeue a node, enqueue its children, count the files you encounter. The iterative version is not harder to understand, and it is immune to stack overflow because the queue lives on the heap.

<!-- → [INFOGRAPHIC: Decision tree for recursive vs. iterative — three decision nodes. First: "Is the recursion depth bounded and provably small?" → Yes: recursion is safe, evaluate readability. No: continue. Second: "Does the recursive structure make the solution significantly clearer?" → Yes: use recursion with depth guard. No: continue. Third: "Can the traversal be expressed as a queue or explicit stack?" → Yes: use iterative. No: use recursion with depth guard and document the limit.] -->

The specification should record this decision and its rationale. Not just "I used recursion" but "I used recursion because the input depth is bounded by X, the recursive structure makes the termination invariant visible, and the maximum safe depth of Y is above the maximum input depth." That record is what makes the choice auditable — and what makes it possible for the next engineer to know whether the choice still holds when the input domain changes.

---

## Reading the Worked Example

The specification for `countFiles` says: base case is a plain file returning one; recursive case is a directory summing child counts; termination invariant is that each recursive call operates on a strict child path not previously visited; `null` return from `listFiles()` is treated as zero (empty or inaccessible directory); symbolic links are not followed.

AI returns:

```java
public int countFiles(File root) {
    if (!root.exists()) {
        return 0;
    }
    if (root.isFile()) {
        return 1;
    }
    int total = 0;
    for (File f : root.listFiles()) {
        total += countFiles(f);
    }
    return total;
}
```

Apply the specification clause by clause.

Base case: `root.isFile()` returns `1`. **Pass.** `!root.exists()` returns `0`. **Pass** — handles the null-file edge case, though not the canonical path resolution the invariant requires.

Recursive case: directory sums child counts. **Pass** on structure.

Reduction step: each recursive call receives a direct child of `root`. Children are strictly contained within their parent in a normal file tree. **Pass** for acyclic inputs.

Termination invariant: no `visited` set. No canonical path tracking. Symbolic links will be followed. **Fail.** The invariant that no path is revisited cannot hold without tracking visited paths.

`listFiles()` null check: `root.listFiles()` is called directly in the loop without null-checking. If `root` is an empty directory or an inaccessible directory, `listFiles()` returns `null`, and the for-each loop throws a `NullPointerException`. **Fail.**

Symbolic link behavior: not checked. The method will follow symbolic links and recurse into whatever they point to, including cycles. **Fail.**

Three failures. Two are prompt omissions (the specification named that symbolic links must not be followed but did not say to use `getCanonicalPath()` for detection; the specification named `null` behavior but the implementation does not check). One is a specification gap that the prompt did not close (the invariant named "not previously visited" without naming the mechanism for tracking visited paths).

<!-- → [TABLE: Recursion audit for countFiles — five rows, one per specification clause. Columns: Clause / Required behavior / Generated behavior / Pass or Fail / Root cause. Rows: base case / isFile() returns 1 / present / Pass / —; null check / listFiles() null returns 0 / absent / Fail / prompt omission; reduction step / strict child of root / direct listFiles() children / Pass / —; termination invariant / no path revisited / no visited tracking / Fail / specification gap; symbolic links / not followed / followed silently / Fail / prompt omission] -->

The revised prompt names the `visited` parameter explicitly, specifies `getCanonicalPath()` as the mechanism for path identity, requires a null check on `listFiles()`, and states that any path already in `visited` returns zero immediately.

---

## What to Carry Into the Next Chapter

Before you move to Chapter 14, you should be able to do three things.

First: write a three-part recursive specification for a method you choose. Base case with termination condition, recursive case with reduction step, termination invariant. If you can write the invariant without looking back at this chapter, you understand what recursion requires.

Second: given an AI-generated recursive method, apply the specification clause by clause. Specifically: does the termination invariant hold for all inputs the method will actually receive? Not just the inputs you tested — all inputs. If the answer is "I don't know," the invariant has not been verified.

Third: decide whether a new recursive problem you encounter should be implemented recursively or iteratively. Name the decision criterion and what would have to change about the problem or deployment context for the decision to reverse.

The next chapter introduces collections — data structures that aggregate objects and expose iteration. The recursion principles from this chapter apply directly: whenever you recurse over a collection, the termination invariant is that each recursive call operates on a strictly smaller slice of the collection.

---

## Exercises

These exercises are designed to be completed with an AI tool of your choice. The goal is not to generate a working recursive method. The goal is to generate one whose termination you can verify against a specification you wrote before seeing the output.

**Warm-Up**

1. Write the three-part recursive specification for a method `sumList(List<Integer> nums)` that returns the sum of all integers in the list. Name the base case (what input halts the recursion and what it returns), the recursive case (what the method does with a non-empty list), and the termination invariant (why the recursion terminates). Then write the handoff condition — the binary checklist the AI output must satisfy.

2. Submit your specification as a prompt. Receive AI output. Apply the handoff condition clause by clause. Record each pass or fail and identify the root cause of any failure.

**Application**

3. The following recursive method has at least two specification failures. Identify each one, name the part of the specification it violates, and explain the failure mode — not just "it's wrong," but what input triggers the failure and what the JVM does.

```java
public int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}
```

4. A `countNodes(TreeNode root)` method should count all nodes in a binary tree. Write the full three-part specification. Include: what happens when `root` is `null`; what the termination invariant is; whether the implementation should be recursive or iterative, and why. Then prompt AI and audit the output.

**Synthesis**

5. Write a Boondoggle Score row for a recursive file-counting feature. AI task: implement `countFiles(File root, Set<String> visited)`. Human task: verify base case, null check, cycle detection, and symbolic link behavior. Handoff condition: binary, checkable by inspection. Evidence type and supervisory capacity: name both.

6. A student argues: "If I test the recursive method on a representative sample of real inputs and it works, the termination invariant holds." Write a two-paragraph response. Identify precisely where this argument is correct (it is, sometimes) and where it fails (construct a specific example where testing passes and the invariant is violated).

**Challenge**

7. Implement and specify a recursive method `flatten(List<Object> nested)` that takes a list where each element is either an `Integer` or another `List<Object>`, and returns a flat `List<Integer>` containing all the integers in depth-first order. Write the full three-part specification, including the termination invariant for arbitrarily deep nesting. Then: is there a depth at which the recursion becomes unsafe? Name it. What would the iterative alternative look like? Implement both, audit both, and document the tradeoff.

---

## LLM Exercises

Use these prompts with a language model to extend your understanding. Treat each generated response as an artifact to be audited, not a source to be cited.

**LLM Exercise 1 — Termination Invariant Probe**

```
Here is a recursive method specification:

[paste your three-part specification]

Generate a Java implementation that satisfies the base case and recursive case but violates the termination invariant. Then show a specific input that causes this violation to produce incorrect behavior — either wrong output, infinite recursion, or a StackOverflowError. Explain why the violation is not detectable by testing on typical inputs.
```

**LLM Exercise 2 — Reduction Step Audit**

```
Here is a recursive Java method:

[paste your AI-generated recursive method]

For each recursive call in this method: identify the measure by which the input is "smaller" than the current input (depth, length, value, or other). For each measure: prove or disprove that the measure strictly decreases with each call. If any recursive call does not strictly decrease the measure, show a specific input that causes infinite recursion or a StackOverflowError.
```

**LLM Exercise 3 — Recursive to Iterative Conversion**

```
Here is a recursive method:

[paste your recursive implementation]

Convert this method to an iterative implementation using an explicit stack (not the JVM call stack). The iterative version must produce identical output for all valid inputs. Then compare the two implementations on three dimensions: maximum safe input size (reasoning about stack depth vs. heap size), readability (which is easier to understand for a new reader), and specification completeness (which version's termination guarantee is easier to state and verify). Conclude with a recommendation for which version to use in production and why.
```

After receiving the conversion and comparison, audit it: does the iterative version actually use a stack data structure, or does it use a queue (which would change traversal order)? Does the "maximum safe input size" reasoning correctly distinguish JVM stack frames from heap-allocated nodes? Revise any claim that treats heap and stack as interchangeable resources.
