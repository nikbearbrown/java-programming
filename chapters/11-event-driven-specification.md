# Chapter 11 — Event-Driven Specification
*The handler body was correct. The specification only named the happy path.*

The submit button works. You test it: fill in the fields, click once, the request is created, the confirmation appears. Everything is right.

Then a user double-clicks.

Two requests appear in the repository. Two confirmations flash on screen. The data is duplicated. The system is now inconsistent in a way that cannot be undone without manual cleanup — and the handler code, if you look at it, is completely correct. The validation is right. The state change is right. The navigation is right. Nothing in the code is wrong.

The specification is wrong. It named one path: user fills in form, user clicks button, request is submitted. It said nothing about what happens on a second click before the first one finishes. Not "second click is forbidden" — it said nothing. The specification had a gap, and the gap was invisible until a user found it.

This is the problem event-driven programs introduce that procedural programs do not. A procedural program runs from top to bottom. You can read the code and follow the execution. An event-driven program waits, reacts, mutates state, and waits again — and the sequence of events that arrives is not determined by the code. It is determined by the user, the network, the clock, and whatever else is wired to the event queue. The code specifies what happens when an event arrives. It does not specify which events will arrive, in which order, how many times, or whether the system is in a valid state to handle them when they do.

Specifying an event-driven component means specifying not just what the handler does, but *when* the handler is allowed to do it. That is the subject of this chapter.

---

## Events Are Not Method Calls

<!-- → [IMAGE: Two diagrams side by side — left: a linear call stack with arrows flowing top to bottom labeled "Procedural: you control the sequence"; right: a state machine with multiple incoming event arrows at each node labeled "Event-driven: the sequence arrives from outside"] -->

Before we can specify event-driven behavior, I want to make sure you understand what makes it structurally different from everything we have written in this course so far.

When you write `repository.save(request)`, you control when that line executes. It runs when the program reaches it, in the sequence you wrote. If you need it to run after validation, you put it after the validation check. The order is yours.

When you wire `submitButton.setOnAction(this::handleSubmit)`, you have done something different. You have registered a handler — told the JavaFX event system: when the user generates an `ActionEvent` on this button, call this method. The system will call it. You do not call it. And the system will call it every time the user generates that event, not just the first time, not just when the form is in a valid state, not just when the repository is ready to receive a save. Every time.

This means the handler method is not a procedure. It is a *transition rule*. It says: when this event occurs, do this thing. But a transition rule is only correct relative to the state the system is in when the event arrives. The same handler body that is correct in one state is catastrophically wrong in another. The double-click failure is exactly this: `handleSubmit` is correct when the system is waiting for a submission. It is wrong when the system is already processing a submission. Same method, same body, wrong state.

The fundamental shift in how you specify event-driven code is this: you are no longer specifying what a method does. You are specifying what a *state machine* does. And a state machine has more parts than a method.

---

## The State Machine Specification

A state machine specification has five components. All five are necessary. Missing any one of them produces a gap that AI cannot fill correctly, because AI cannot infer the answer from the method body alone.

**States.** What are the valid configurations of the component? For the form submission feature: `EMPTY` (no required fields filled), `VALID` (all required fields present, not yet submitted), `SUBMITTING` (submission in progress, awaiting repository confirmation), `SUBMITTED` (submission succeeded). Each state is a condition under which certain events are meaningful and others are not.

**Events.** What can happen? Not just the happy-path events — all events. For the form submission feature: `fieldEdited` (user changes any field), `submitClicked` (user clicks the submit button), `saveSucceeded` (repository confirms the save), `saveFailed` (repository returns an error). Every event that can arrive at the component must be named, even if the correct response to it in some states is to do nothing.

**Guards.** What must be true for a transition to be allowed? Guards are conditions checked before the transition fires. For `submitClicked` transitioning from `VALID` to `SUBMITTING`: the guard is that all required fields are non-empty. If the guard fails, the event does not trigger the transition — the system stays in its current state and (usually) shows an error.

**Transitions.** Given a state and an event (and a passing guard), what state does the system move to, and what action does it take? This is the most familiar part. `VALID + submitClicked [guard passes] → SUBMITTING: create MaintenanceRequest, call repository.save()`. The action is the handler body. But the handler body is only meaningful in the context of the transition: which state it starts from, which state it ends in.

**No-op cases.** This is the part that almost always gets omitted from the specification, and it is the part that the double-click failure lives in. For every state, for every event that can arrive in that state, the specification must say what happens. If the answer is "nothing," the specification must say nothing — because "nothing" is an implementation choice, and AI will not make it unless instructed. `SUBMITTING + submitClicked → SUBMITTING: no action` is a valid transition. It must be written. If it is not written, AI writes a handler that saves on every click, because saving on click is what the happy-path specification says to do.

<!-- → [TABLE: State machine for the form submission feature — rows: each (state, event) pair. Columns: Current State / Event / Guard / Next State / Action. Includes the no-op rows explicitly: SUBMITTING + submitClicked → SUBMITTING, no action; SUBMITTED + submitClicked → SUBMITTED, no action; EMPTY + submitClicked → EMPTY, show validation error] -->

The no-op cases are not edge cases. They are the specification of what the system *refuses to do* — which is as important as the specification of what it does.

---

## Why AI Misses the No-Op

There is a predictable reason why AI-generated event handlers omit the no-op cases, and understanding it helps you write better prompts.

When you ask AI to write `handleSubmit`, you are asking it to write code that handles a submit event. The training data for that request consists of handler methods that handle submit events — they validate, create objects, save to repositories, navigate to confirmation screens. That is the shape of the solution space the model is sampling from. No-op cases do not appear in that shape, because no-op cases are not in the handler body. They are in the state check that wraps the handler body.

An AI-generated handler that saves on every click is not a failure of reasoning. It is the handler the training data predicts, given the prompt. The model is not wrong about what `handleSubmit` should do when a submit event arrives in the right state. It is incomplete about what `handleSubmit` should do when a submit event arrives in the wrong state — because the prompt did not name the wrong state.

This is why the state machine specification must be complete before you prompt. The prompt must include: the current valid state when the handler may fire; the states in which the handler must do nothing; and the check that distinguishes them. Without those three things, AI produces the happy-path handler and leaves the no-op cases as gaps.

Here is the difference in practice.

Weak prompt: *Write a handler for the submit button that validates the fields, creates a MaintenanceRequest, saves it to the repository, and navigates to the confirmation screen.*

Strong prompt: *Write a handler for the submit button. The handler checks whether the component is in VALID state (all three fields non-empty and submission not yet in progress). If in VALID state: set state to SUBMITTING, disable the submit button, create a MaintenanceRequest, save to repository, navigate to confirmation on success, return to VALID with error message on failure. If not in VALID state (fields empty, already SUBMITTING, or already SUBMITTED): do nothing and return immediately. The state must be tracked as a field, not inferred from the UI.*

The second prompt produces a handler that is auditable. The first produces a handler that compiles.

<!-- → [DIAGRAM: Annotated state machine for the form submission feature — four states (EMPTY, VALID, SUBMITTING, SUBMITTED) as labeled circles, with directed arrows for each named transition. No-op transitions shown as self-loops with "no action" labels. Guards shown as conditions on the relevant arrows. This is the visual equivalent of the full state machine specification table above.] -->

---

## Registration Scope: When the Handler Is Wired Matters

There is a second category of event-driven specification failures that is distinct from the no-op problem, and it does not appear in the handler body at all.

Registration scope is the question of *where and when* the handler is connected to the event source. In JavaFX, this usually happens in `initialize()` — the method the FXML loader calls after injecting the fields. But there are patterns where students register handlers in the wrong scope and produce behavior that is correct in isolation and wrong in composition.

The most common version: a handler is registered inside a loop or in a method that is called multiple times. Each call adds another registration. The button now has two handlers, three handlers, N handlers, and fires the action N times per click. The handler body is correct. The registration count is wrong.

```java
// Correct — registered once in initialize()
@Override
public void initialize(URL location, ResourceBundle resources) {
    submitButton.setOnAction(this::handleSubmit);
}

// Wrong — registered every time the method is called
public void refreshForm() {
    submitButton.setOnAction(this::handleSubmit); // adds another registration
    nameField.clear();
    roomField.clear();
    descriptionArea.clear();
}
```

If `refreshForm()` is called after each successful submission — to reset the form for a new entry — the submit button accumulates one new handler registration per submission. The first submission works correctly. The second fires the handler twice. The tenth fires it ten times.

The audit catches this by checking registration scope before anything else: where is `setOnAction` called, and how many times can that line execute during the component's lifetime? If the answer is more than once, the registration is wrong.

<!-- → [IMAGE: Two side-by-side sequence diagrams — left: single registration in initialize(), showing one handler call per click across three submissions; right: registration in refreshForm(), showing one call on first submission, two on second, three on third. Caption: "Registration count compounds silently."] -->

The state machine specification makes this visible: the state machine has one instance per component. The registration that wires events to transitions should happen once, at initialization. Any subsequent call that re-registers is adding a second state machine on top of the first.

---

## Encapsulation-Violating State Mutations

The third category of event-driven failure is a violation that Chapter 5 introduced but event-driven code amplifies.

In Chapter 5, the invariant violation came from external code writing directly to private fields — bypassing the class's enforcement mechanism. In event-driven code, the same violation occurs when handler methods reach outside the component's own state and mutate fields they do not own.

Here is a typical example. The `RequestFormController` has a handler for `submitClicked`. Inside the handler, the student decides to update a status label that lives in a *different* controller — the main application window controller. To do this, she passes a reference to the main controller into the form controller, and the handler calls `mainController.statusLabel.setText("Submitted")`.

This violates encapsulation in the same way as the public-fields `Task` class, with an additional complication: it creates a *dependency between two state machines*. The form controller's handler is now responsible for maintaining the invariant of the main controller's status label. If the main controller is ever modified — if `statusLabel` is renamed, or if the status is managed through a method rather than direct field access — the form controller's handler breaks silently. The two state machines are now coupled by a hidden dependency that neither class documents.

The correct pattern is the one the specification must name: the form controller fires a result event or calls a callback. The main controller registers a handler for that result. Each controller is responsible for its own state. The dependency is explicit — it appears in the method signature, not buried in the handler body.

```java
// Wrong — form controller mutates main controller's state directly
public void handleSubmit(ActionEvent event) {
    // ... validation and save ...
    mainController.statusLabel.setText("Submitted"); // encapsulation violation
}

// Correct — form controller notifies; main controller updates itself
public void handleSubmit(ActionEvent event) {
    // ... validation and save ...
    if (onSubmitSuccess != null) {
        onSubmitSuccess.accept(request); // callback, set by the main controller
    }
}
```

<!-- → [DIAGRAM: Two side-by-side object diagrams — left: "Wrong" — RequestFormController holds a reference to MainAppController, arrow labeled "statusLabel.setText()" pointing directly at MainAppController's internal field; right: "Correct" — RequestFormController holds a Consumer<MaintenanceRequest> callback, arrow labeled "onSubmitSuccess.accept(request)" pointing to MainAppController's own handler method. Caption: "The dependency is the same in both cases. In the wrong version it is hidden. In the correct version it is named."] -->

The handoff condition for this failure is: *no handler method in this controller accesses fields or methods of a different controller through a stored reference.* If the condition fails, the audit names the specific cross-controller dependency and the prompt revision adds the callback pattern to the specification.

---

## Reading the Worked Example

The source specification for the form submission feature says: `handleSubmit` may fire only in `VALID` state. In `SUBMITTING` state, a submit event must be ignored. The state is tracked as a field of type `SubmissionState`, not inferred from the button's disabled status.

AI returns:

```java
public class RequestFormController {
    @FXML private TextField nameField;
    @FXML private TextField roomField;
    @FXML private TextArea descriptionArea;
    @FXML private Button submitButton;

    @FXML
    public void handleSubmit(ActionEvent event) {
        if (nameField.getText().isEmpty() ||
            roomField.getText().isEmpty() ||
            descriptionArea.getText().isEmpty()) {
            errorLabel.setVisible(true);
            return;
        }
        submitButton.setDisable(true);
        MaintenanceRequest request = new MaintenanceRequest(
            nameField.getText(),
            roomField.getText(),
            descriptionArea.getText()
        );
        repository.save(request);
        navigateToConfirmation();
    }
}
```

Apply the state machine specification.

State tracking: no `SubmissionState` field present. State is inferred from `submitButton.isDisabled()`. **Fail.** The specification required an explicit state field. Inferring state from UI element properties couples the logic to the presentation layer.

`SUBMITTING` guard: `submitButton.setDisable(true)` prevents UI interaction but does not guard against programmatic firing. If `handleSubmit` is called directly (in tests, or through a different event path), the guard is bypassed. **Fail.**

No-op in `SUBMITTING`: because there is no state field and no guard on the state, a second call to `handleSubmit` while the first save is in progress will attempt a second save. The button's disabled state prevents the user from clicking, but does not prevent the duplicate-save scenario if the event is fired another way. **Fail** on the specification's intent, though it may pass on casual testing.

Null check on repository: `repository.save(request)` with no null check on `repository`. If the controller is constructed without injecting a repository — as might happen in a unit test — this throws a `NullPointerException` rather than a meaningful error. **Fail.**

<!-- → [TABLE: State machine audit for handleSubmit — rows mapping each specification clause to the output's behavior. Columns: Clause / Required behavior / Generated behavior / Pass or Fail / Root cause. Includes the state-tracking clause, SUBMITTING guard clause, no-op clause, and null-check clause.] -->

Four failures, all prompt omissions. The specification did not name the `SubmissionState` field type. It did not name that the guard must check the field, not the button's disabled status. It did not say that the null check on `repository` was required. These are the gaps that produce the failures.

The revised prompt adds: `SubmissionState` enum with values `EMPTY`, `VALID`, `SUBMITTING`, `SUBMITTED`; a `private SubmissionState state` field initialized to `EMPTY`; the guard at the top of `handleSubmit` checks `if (state != SubmissionState.VALID) return;`; a null check on `repository` before the save call.

---

## The Audit Test for Event-Driven Code

I want to close with a concrete audit checklist, because event-driven code has enough distinct failure modes that a generic "does this look right" inspection will miss them.

Before accepting any AI-generated event handler, check four things in this order.

**Registration scope.** Where is the handler registered? Can that registration line execute more than once during the component's lifetime? If yes, the handler will fire multiple times per event after the second registration. This check must happen before anything else, because a handler that fires N times per click will fail every subsequent test in confusing ways.

**State guard.** Does the handler check which state the component is in before doing anything? The check must use an explicit state field, not a UI property. UI properties are presentation; state is logic. They can diverge.

**No-op completeness.** For every state in the state machine, the handler must have a defined response when the event arrives. If the response is "do nothing," the code must say so explicitly — an early return, a guard that covers all non-firing states. A handler that only specifies the happy path is an incomplete specification masquerading as working code.

**Cross-component mutation.** Does the handler reach into a different controller or component and modify its state directly? If it does, the dependency is hidden and the invariant is unenforceable. The correct pattern is a callback, an event, or an observable property — something that makes the dependency explicit in the method signature.

<!-- → [INFOGRAPHIC: Four-item audit checklist for event-driven handlers — each item as a labeled box with a one-sentence description, the failure it catches, and the handoff clause phrasing. Designed as a card the student posts next to the Boondoggle Score row for any handler they are auditing.] -->

These four checks do not replace the seven-clause handler contract from Chapter 8. They extend it. The handler contract names what the handler should do on the happy path. The four checks here name what happens when the path is not happy — when the event arrives in the wrong state, fires twice, or reaches outside its own component to borrow someone else's state.

---

## What to Carry Into the Next Chapter

Before you move to Chapter 12, you should be able to do three things.

First: draw the state machine for a two-state UI component you have used in this course. Label the states, label the events, write the transitions including the no-op cases. If you cannot write the no-op cases, you do not yet know the full specification.

Second: identify the registration scope of every handler in a controller you have written or reviewed. Name where each handler is registered and whether that line can execute more than once. If it can, name the failure it produces.

Third: write the handoff condition for the duplicate-event guard in the form submission feature. The condition must be binary, checkable by inspection, and must distinguish between guarding against UI interaction (disabling the button) and guarding against programmatic firing (checking the state field).

The next chapter asks what happens when the state machine spans more than one class — when the component that fires the event and the component that handles it are not the same object, and the transition must be coordinated across a boundary.

---

## Exercises

These exercises are designed to be completed with an AI tool of your choice. The goal is not to generate event-driven Java. The goal is to generate event-driven Java whose state transitions you can verify against a specification you wrote before seeing the output.

**Warm-Up**

1. Draw the state machine for a simple toggle button: two states (`ON` and `OFF`), one event (`clicked`), two transitions. Then extend it with a third state: `DISABLED` (the button cannot be toggled). Write all transitions and no-op cases explicitly, including what happens when `clicked` arrives in `DISABLED` state.

2. Write the state machine specification for the form submission feature as a prompt. Include all five components: states, events, guards, transitions, and no-op cases. Then prompt AI for the handler. Apply the four-item audit checklist. Record each pass or fail with a root cause.

**Application**

3. The following handler has at least three specification failures. Identify each one using the four-item audit checklist, name which check it fails, and explain the user-visible consequence.

```java
public class SearchController {
    @FXML private TextField queryField;
    @FXML private Button searchButton;
    private ResultsController resultsController;

    public void handleSearch(ActionEvent event) {
        String query = queryField.getText();
        List<Result> results = searchService.search(query);
        resultsController.resultsList.getItems().setAll(results);
    }

    public void refreshSearch() {
        searchButton.setOnAction(this::handleSearch);
        queryField.clear();
    }
}
```

4. Rewrite the prompt that produced the handler in Exercise 3 so that all four audit checks would pass on the first attempt. Include the state machine specification in your prompt. Test the revised prompt and apply the checklist again.

**Synthesis**

5. Write a two-row Boondoggle Score for the form submission feature covering the state machine implementation and the handler registration. The second row must depend on the first passing. For each row: AI task, human task, handoff condition, evidence type, supervisory capacity.

6. A student argues: "Disabling the submit button after the first click is equivalent to adding a state guard — the user can't click twice." Write a two-paragraph response that identifies precisely where this argument is correct and where it fails. Include at least one scenario where the button is disabled but the handler fires anyway.

**Challenge**

7. Design the complete state machine specification for an autocomplete search field: the field has states for `IDLE`, `TYPING` (user is editing the query), `SEARCHING` (a search request is in flight), and `SHOWING_RESULTS` (results are displayed). Events include `keystroke`, `searchCompleted`, `resultSelected`, and `fieldCleared`. Write all transitions, guards, and no-op cases. Then prompt AI for a JavaFX implementation, audit the output against the full specification, and document every failure and the prompt revision that closed it.

---

## LLM Exercises

Use these prompts with a language model to extend your understanding. Treat each generated response as an artifact to be audited, not a source to be cited.

**LLM Exercise 1 — No-Op Completeness Probe**

```
Here is a handler specification:

[paste your state machine specification]

Generate a JavaFX handler that satisfies the happy-path transitions in this specification. Then identify every (state, event) pair in the specification for which the handler's behavior is undefined — pairs where neither a transition nor an explicit no-op is implemented. For each undefined pair, show what the handler currently does when the event arrives in that state, and explain the user-visible consequence.
```

**LLM Exercise 2 — Registration Scope Audit**

```
Here is a JavaFX controller:

[paste your controller]

For every handler registration in this controller: identify where the registration occurs (method name and scope), how many times that line can execute during the component's lifetime, and what the handler's behavior would be after the second registration. If any registration can execute more than once, show the compounding failure with a concrete example of N clicks producing more than N handler invocations.
```

**LLM Exercise 3 — State Machine Derivation**

```
Here is an AI-generated JavaFX handler:

[paste a handler you received from AI]

Derive the state machine this handler implicitly implements: infer the states from the conditions it checks, the events from the method signature and registration, the guards from the conditional logic, the transitions from the state changes, and the no-op cases from the early returns. Then compare the derived state machine to the specification I intended:

[paste your original state machine specification]

For each discrepancy between the derived machine and the intended specification, identify whether the discrepancy is a prompt omission, a model default, or an emergent violation.
```

After receiving the derivation, check: does the derived state machine correctly identify every state the handler can leave the component in? Does it name the no-op cases explicitly, or does it describe them as "returns without action" without naming the state? Revise any description that elides the state the component is in after the no-op.
