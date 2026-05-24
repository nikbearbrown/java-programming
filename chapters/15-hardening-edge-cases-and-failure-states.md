# Chapter 15 — Hardening: Edge Cases and Failure States
*The user saw success. Nothing was written.*

The save method catches `IOException`. You can see the try-catch block right there. The exception is handled. The code compiles. The code runs. The user clicks Save, sees a success message, and closes the application.

Nothing was written to disk.

The catch block is empty — or nearly empty. It catches the exception and stops. No message to the user. No log entry. No retry. No propagation to the caller. The exception was caught in the same way you might catch a ball and quietly put it in your pocket: the action happened, the problem disappeared, and the world continued as if everything was fine.

AI did not rebel. It did not write the empty catch block out of malice or carelessness. The specification said: handle `IOException`. The easiest local pattern for handling an exception is to catch it. AI caught it. The specification did not say what to do after catching it, so AI did the minimal thing and moved on. The silence in the specification became silence in the user experience, and the user has no idea that the thing she just saved does not exist.

This is the subject of this chapter: failure states that the specification never named. Not rare failure states. Not exotic failure states. The failure states that are predictable, consequential, and completely absent from most first-draft specifications — because when you are writing a specification for what a component should *do*, it is easy to forget to specify what it should do *when it cannot*.

---

## What a Failure State Is

<!-- → [IMAGE: A contract document with a "Normal Operation" section fully written out and a "Failure Conditions" section that is blank — the heading is there, the lines are there, but nothing is written. Caption: "The failure section was never filled in."] -->

A failure state is a condition under which a component cannot satisfy its normal contract.

In Chapter 5, the `Task` class had a contract: non-null title, priority between one and five, completion state changed only through `markComplete()`. Those conditions describe valid operation. A failure state is what happens when the conditions for valid operation cannot be met: the file is missing, the network is down, the database returned an error, the input was null when the method required non-null.

Every component has failure states. The interesting question is not whether they exist — they always do — but whether the specification named them. An unnamed failure state is a gap. A gap becomes the AI's decision to fill. And AI fills gaps with the easiest local pattern, which is often the wrong answer for the user.

The empty catch block is the canonical example of the wrong answer. It is locally coherent — it handles the exception in the sense that the exception does not propagate further — but it is globally wrong, because it reports success to the caller when the operation failed. The caller has no way to know that the save method silently discarded the error. The specification gap becomes a lie told to the user.

Three things must be true before a failure state is adequately specified. First: the failure condition must be named — the specific exceptional circumstance, not just "something goes wrong." Second: the response must be named — what the component does when that condition occurs. Third: the boundary must be named — whether the failure propagates to the caller, is handled locally, or is logged and absorbed. These three things together tell you what the component promises when it cannot keep its normal promise.

---

## Why AI Fills Silence With the Easiest Pattern

There is a structural reason why AI-generated code systematically underfills failure states, and it is worth understanding before we talk about how to fix it.

When you prompt AI to write a method, you describe what the method should do in normal operation. The training data for that request consists of methods that do the normal thing — they read from files, write to databases, call APIs, process inputs. The failure paths in that training data are inconsistent. Some propagate exceptions. Some swallow them. Some log them. Some do nothing. There is no consensus pattern that AI can imitate, because the correct failure response depends on the deployment context — who calls this method, what they can do with an error, whether the application can continue in a degraded state — and the training data does not contain that context.

So AI defaults to a pattern it has seen frequently: catch the exception, do something minimal (log it, print it, or nothing), and let the method return as if it succeeded. This is not wrong in all contexts. It is wrong when the caller needs to know that the operation failed. It is wrong when the user is told success when nothing happened. It is wrong when a downstream component depends on the data that was not written.

The point is that AI is not making an engineering judgment when it fills the catch block with nothing. It is filling a specification gap with a default. The default happens to be the worst possible failure mode for persistence operations: silent success on actual failure.

```java
// What AI generates when the failure state is unspecified
public void saveRequest(MaintenanceRequest request) {
    try {
        repository.write(request);
    } catch (IOException e) {
        // nothing
    }
}
```

```java
// What the specification should have produced
public void saveRequest(MaintenanceRequest request) throws IOException {
    try {
        repository.write(request);
    } catch (IOException e) {
        logger.error("Failed to save request: {}", request.getId(), e);
        throw e; // propagate — caller must know this failed
    }
}
```

The difference between these two implementations is one word in the specification: *propagate*. The specification that produced the first version said "handle `IOException`." The specification that produces the second version says "if writing fails, propagate `IOException` to the caller and do not report success." One additional clause. One completely different failure behavior.

<!-- → [TABLE: Failure state response patterns — four rows. Columns: Pattern / What the code does / When it is correct / When it is wrong. Rows: Swallow silently / catches exception, returns normally / never correct for persistence / caller believes success, data not written; Log and return / catches exception, logs, returns normally / when caller expects graceful degradation / when caller needs to know the operation failed; Propagate / catches exception, re-throws or wraps / when caller must handle the failure / when the caller has no meaningful recovery path; Log and propagate / catches, logs, re-throws / almost always the right answer for persistence / never wrong, sometimes redundant] -->

---

## The Enumeration Step

Before you can specify failure states, you have to find them. This is the part that takes discipline, because it requires you to think about your component from the outside — from the perspective of every caller, every input source, and every dependency — rather than from the inside, where you are thinking about what the method does when everything is going right.

The enumeration step asks one question for each component: *what are the conditions under which this component cannot satisfy its contract?*

For a file-writing method, the list looks like this. Missing write permission: the path exists but the process cannot write to it. Invalid path: the path contains illegal characters, is too long, or points to a location that does not exist. Partial write: the write begins but the disk fills up or the process is interrupted before completion. Null input: the caller passes a null request object. Concurrent modification: another thread modifies the repository state while the write is in progress. Timeout: the operation exceeds an acceptable duration. Disk full: the write cannot begin because there is no space.

That is seven failure states for a method that, in the specification, was described as "write the request to the file." Seven failure states, and none of them were named.

The enumeration is not about imagining every possible disaster. It is about naming the failure states that are *predictable*. A partial write on a full disk is predictable. A null request is predictable — someone, someday, will pass null. Missing permissions are predictable — the application may be deployed with the wrong file system permissions. These are not exotic edge cases. They are the standard operating environment of software running in the world.

<!-- → [DIAGRAM: A method box labeled "saveRequest()" at the center, with incoming arrows labeled by failure source: "caller" (null input, wrong types), "file system" (permissions, path, disk full, partial write), "concurrency" (race conditions), "timing" (timeout). Each arrow ends at the method boundary. Caption: "Failure arrives from every direction. The specification names which directions the method must handle."] -->

The list does not have to be exhaustive on the first pass. It has to be complete enough to identify the Must-Fix states — the failures that will produce data loss, incorrect behavior, or security violations if unhandled.

---

## Triage: Must-Fix, Important for v2, Nice-to-Have

Not every failure state is equally urgent. A specification that tries to handle every edge case in every method produces a system so defensive it is hard to read, hard to test, and hard to change. The hardening discipline requires triage: an explicit classification of every named failure state by production risk.

The triage labels are three:

**Must-Fix** means the failure state will produce data loss, incorrect behavior, a security violation, or a user-visible lie if it is not handled before shipping. Silent success on failed persistence is Must-Fix. Null pointer exceptions that crash the application are Must-Fix. An exception that propagates to a user-facing screen as a stack trace is Must-Fix. These are not negotiable. They go in the current prompt revision.

**Important for v2** means the failure state is real, consequential, and outside the current scope. Retry logic on transient network failures is Important for v2 — it matters, it is not trivial to implement correctly, and deferring it does not produce incorrect behavior in the current version (it just produces a user-visible error instead of transparent recovery). Timeout handling is often Important for v2 for the same reason. These get a written note in the Boondoggle Score: the failure state exists, it has been classified, it is deferred with justification.

**Nice-to-Have** means the failure state is unlikely in the current deployment context, its consequence is acceptable, and handling it would add complexity without proportionate benefit. Concurrent modification on a single-user desktop application is often Nice-to-Have. Handling extremely long file paths that exceed OS limits on a system where paths are generated programmatically and bounded is often Nice-to-Have. These are recorded and dismissed, with the reasoning written down.

<!-- → [TABLE: Triage classification — three rows. Columns: Label / Risk condition / Examples from file persistence / What goes in the prompt. Rows: Must-Fix / Data loss, incorrect behavior, security violation, or user-visible lie / Swallowed IOException, null request, success message after failed write / Explicit failure response added to the current prompt revision; Important for v2 / Real consequence, outside current scope, deferral does not produce incorrect current behavior / Retry on transient failure, timeout handling, disk-full recovery / Written deferral note in Boondoggle Score with justification; Nice-to-Have / Unlikely in current context, acceptable consequence, complexity exceeds benefit / Concurrent modification on single-user system, path length edge cases / Recorded and dismissed with reasoning] -->

The triage step is an interpretive judgment. It requires knowing the deployment context, the user population, and the consequence of each failure in practice. AI cannot make this judgment because it does not have that context. This is the work that belongs to the conductor.

The important thing about the triage step is that it is *explicit*. Every named failure state gets a label and a justification. The label is not "I forgot about this" — it is "I considered this, I classified it, and here is why." The Boondoggle Score row for a hardened component includes the triage list as evidence: these states were found, these are Must-Fix, these are deferred, these are dismissed. That record is what makes the hardening auditable.

---

## Scope Control: Hardening Without Expanding the Problem

There is a temptation, once you start enumerating failure states, to keep going. You find one gap, then another, then a third, and soon you are specifying a method that handles every possible error condition from every possible caller in every possible environment, and the method is fifty lines long and impossible to reason about.

Hardening has a scope constraint: the prompt revision must address the named failure states *without expanding scope beyond the original boundary*.

What does this mean in practice? It means that fixing the empty catch block does not require adding retry logic. Propagating the `IOException` to the caller is a one-clause addition to the specification. Adding retry logic is a new feature with its own failure states (how many retries? what is the backoff strategy? what happens when all retries fail?). The scope constraint says: address the Must-Fix states cleanly, defer the rest, and do not let the hardening step become a new feature.

The test is: *does the revised prompt produce a method that satisfies the original contract, plus handles the Must-Fix failure states, and nothing else?* If the revised prompt also adds retry logic, telemetry, circuit breakers, and configurable timeout policies, the scope has expanded. Those may all be good ideas. They belong in a later iteration, not in the hardening pass on the current component.

```java
// Scope-controlled hardening: original + Must-Fix states only
// Original contract: write request to file, return on success
// Must-Fix additions: propagate IOException; null check on input; no empty catch
public void saveRequest(MaintenanceRequest request) throws IOException {
    if (request == null) {
        throw new IllegalArgumentException("Request cannot be null");
    }
    try {
        repository.write(request);
    } catch (IOException e) {
        logger.error("Failed to save request {}: {}", request.getId(), e.getMessage());
        throw e;
    }
}
```

Three lines added: null check at the top, log in the catch block, re-throw in the catch block. The method now handles the two Must-Fix states (null input and swallowed IOException) without adding retry logic, telemetry, or any other feature. The scope is unchanged. The hardening is complete for this iteration.

<!-- → [IMAGE: Annotated diff of saveRequest — left column shows the original unspecified version with the empty catch block highlighted in red; right column shows the hardened version with three added lines highlighted in green and each annotated with the Must-Fix state it addresses: "null check → Must-Fix: null input", "logger.error → Must-Fix: swallowed exception (log)", "throw e → Must-Fix: swallowed exception (propagate)". Caption: "Three clauses in the specification. Three lines in the implementation. Scope unchanged."] -->

---

## Reading the Worked Example

The specification for `saveRequest` originally said: write the maintenance request to the repository; catch `IOException`. The prompt did not name what to do with the caught exception.

The failure state enumeration identifies four candidates: null input (caller passes null), swallowed exception (catch block hides failure), invalid path (repository path configured incorrectly), partial write (disk full during write).

Triage: null input is Must-Fix — a `NullPointerException` at `repository.write(null)` is a crash. Swallowed exception is Must-Fix — the user is told success when nothing was written. Invalid path is Important for v2 — it requires configuration validation at startup, not in the save method. Partial write is Nice-to-Have for the current version — the repository library handles atomicity at a level that makes partial writes unlikely in normal operation.

The revised prompt: *Write `saveRequest(MaintenanceRequest request)`. If `request` is null, throw `IllegalArgumentException` with a descriptive message. If `repository.write()` throws `IOException`, log the error with the request ID and re-throw the exception — do not return normally after a failed write, and do not swallow the exception silently.*

<!-- → [TABLE: Failure state triage for saveRequest — four rows, one per identified state. Columns: Failure state / Condition / Triage label / Justification / Prompt revision required. Rows: Null input / request == null / Must-Fix / NullPointerException crashes silently / throw IllegalArgumentException; Swallowed exception / catch block empty / Must-Fix / user sees success, data not written / log and re-throw; Invalid path / repository path misconfigured / Important for v2 / requires startup validation, not method-level fix / deferral note in Boondoggle Score; Partial write / disk full during write / Nice-to-Have / repository library handles atomicity / recorded and dismissed] -->

AI generates the revised implementation correctly when the prompt names these two Must-Fix states explicitly. When the prompt says only "handle `IOException`," it generates the empty catch block. The difference is the triage step that identifies which failure states are Must-Fix and produces the precise language for each one.

---

## The Handoff Condition for Hardening

A Boondoggle Score row for a hardened component has a different shape than a row for a component in its first draft. The handoff condition is not just "the method compiles" or "the method satisfies the functional contract." It is a checklist of the Must-Fix states, each with a specific, binary pass-or-fail check.

For `saveRequest`, the handoff condition reads: no empty catch block for `IOException`; no success return after a caught exception; null check present on `request` parameter; `IOException` propagated to caller (either re-thrown directly or wrapped in an unchecked exception). Four clauses. Each one binary. Each one checkable by inspection.

The handoff condition does not include the Important-for-v2 states. Those are deferred. They appear in the evidence section of the Boondoggle Score row as a written deferral note: "Retry logic deferred to v2. Invalid path validation deferred to startup configuration check." The deferral note is part of the evidence because it proves the states were found and classified, not simply missed.

<!-- → [INFOGRAPHIC: Boondoggle Score row anatomy for a hardened component — the row expanded to show six fields: AI Task, Human Task, Handoff Condition (with the four Must-Fix clauses listed), Evidence (with pass/fail for each clause), Deferral Notes (listing Important-for-v2 states with justification), Supervisory Capacity. Caption: "The deferral notes are evidence, not omissions. They prove the states were found."] -->

This is what hardening looks like as a specification discipline. It is not "add defensive code everywhere." It is "find the failure states, classify them, address the Must-Fix ones with precise prompt language, defer the rest with written justification, and encode all of it in the handoff condition so nothing can pass silently."

The conductor who does this consistently is building something that the conductor who skips this step is not: a system whose failure behavior is a design decision, not an accident.

---

## What to Carry Into the Next Chapter

Before you move to Chapter 16, you should be able to do three things.

First: enumerate the failure states for any method you have written in this course. Not every conceivable failure — the predictable ones. The ones that arise from null input, unavailable dependencies, file system errors, and concurrent access. If you can enumerate them without prompting, you understand what hardening looks for.

Second: classify each failure state by triage label. Must-Fix, Important for v2, Nice-to-Have. For each label, write one sentence of justification. If the justification requires knowing the deployment context, write down what you would need to know and how you would find out.

Third: write the hardened prompt for one method — the original specification plus the Must-Fix failure states, scope-controlled. The revised prompt should add clauses, not expand the method's responsibility.

The next chapter asks what happens when hardening reveals that a component's failure states cannot be handled within the component itself — when the failure propagates by design, and the architecture must be structured to receive it.

---

## Exercises

These exercises are designed to be completed with an AI tool of your choice. The goal is not to generate defensively coded Java. The goal is to generate Java whose failure behavior is a specification decision, not an accident.

**Warm-Up**

1. Enumerate the failure states for the following method signature: `public String readConfig(String filePath)`. Name at least five predictable failure conditions. For each one, write one sentence describing the user-visible consequence if the failure state is unspecified and AI fills the gap with the easiest local pattern.

2. Triage your enumerated failure states into Must-Fix, Important for v2, and Nice-to-Have. Write one sentence of justification for each classification. Then write a revised prompt for `readConfig` that addresses the Must-Fix states without expanding scope.

**Application**

3. The following method has at least two Must-Fix failure states that the specification never named. Identify each one, name the triage label, and write the specific prompt clause that would address it.

```java
public void deleteRequest(String requestId) {
    try {
        repository.delete(requestId);
    } catch (Exception e) {
        System.out.println("Error: " + e.getMessage());
    }
}
```

4. The revised version of `deleteRequest` should propagate the exception, null-check `requestId`, and log the error with the request ID before re-throwing. Write the complete revised prompt. Then prompt AI for the implementation. Apply the handoff condition — four binary clauses, one per Must-Fix state — and record each pass or fail with a root cause.

**Synthesis**

5. Write a Boondoggle Score row for a hardened `saveRequest` method. The row must include: AI task (specify the hardened method), human task (verify all Must-Fix handoff clauses), handoff condition (four binary clauses), evidence (pass/fail for each clause plus the deferral note for Important-for-v2 states), supervisory capacity.

6. A student argues: "Adding failure state handling to every method makes the codebase harder to read and maintain. It's better to handle failures at the top level and let exceptions propagate naturally." Write a two-paragraph response. Identify where this argument is correct (it sometimes is) and where it breaks down. Use the silent-success failure mode from this chapter's opening as your concrete example.

**Challenge**

7. Enumerate, triage, and harden the complete set of methods for a `FileBackedRepository` class with three methods: `save(T item)`, `load(String id)`, and `delete(String id)`. For each method: enumerate all predictable failure states, classify by triage label with justification, write the hardened prompt, prompt AI, apply the handoff condition, and record the results. The challenge: find at least one failure state that spans multiple methods — a condition that affects `save` and `load` differently, requiring coordinated handling.

---

## LLM Exercises

Use these prompts with a language model to extend your understanding. Treat each generated response as an artifact to be audited, not a source to be cited.

**LLM Exercise 1 — Failure State Enumeration**

```
Here is a Java method specification:

[paste your method specification]

Enumerate all predictable failure states for this method — conditions under which it cannot satisfy its normal contract. For each failure state: name the condition, describe the user-visible consequence if it is unhandled, classify it as Must-Fix / Important for v2 / Nice-to-Have, and justify the classification. Then identify which failure states your enumeration could have missed and why.
```

**LLM Exercise 2 — Silent Failure Detection**

```
Here is a Java method:

[paste your AI-generated method]

Identify every failure state this method handles silently — conditions where an exception is caught but the caller is not notified of the failure. For each silent failure: name the exception type, describe what the caller believes happened versus what actually happened, and classify the gap as Must-Fix / Important for v2 / Nice-to-Have. Then generate a revised version that eliminates all Must-Fix silent failures without expanding scope.
```

**LLM Exercise 3 — Scope-Controlled Hardening**

```
Here is a method and its Must-Fix failure state list:

Method: [paste your method]
Must-Fix states: [paste your triage list]

Generate a revised implementation that addresses every Must-Fix state without adding any features not named in the original specification or the Must-Fix list. After generating, list every change made and confirm that each change traces to exactly one Must-Fix state. If any change addresses more than one state or introduces a new capability, flag it.
```

After receiving the revised implementation, audit it: does any added code address an Important-for-v2 or Nice-to-Have state instead of a Must-Fix state? Does any added code expand the method's responsibility beyond the original contract? Revise the prompt to constrain any scope creep and regenerate.
