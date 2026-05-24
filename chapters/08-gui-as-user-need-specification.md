# Chapter 8 — GUI as User Need Specification
*The user needed a visible workflow, not a clever parser.*

A non-technical user must submit a maintenance request without reading documentation. That is the requirement. One sentence. Perfectly clear.

AI reads it and builds a command-line program with an argument parser. The parsing is clean. The validation is thorough. The error messages are helpful. You run it from a terminal, pass the room number and description as flags, and it logs the request correctly. The code is impressive.

It is also completely wrong.

The user who needs to submit a maintenance request without reading documentation is not a developer who knows what a flag is. She is a facilities coordinator, or a building resident, or a front-desk manager. She does not have a terminal open. She does not know what `--room-number` means. She needs to look at a screen, see a form, fill it in, press a button, and receive confirmation that something happened. The requirement was not about parsing. It was about access.

This is the problem this chapter is about. Not JavaFX syntax. Not layout managers. The problem is that a GUI requirement is a *user-need specification*, and if you treat it as a coding task before you have translated it into a specification, AI will produce something that satisfies the coding task and misses the user need entirely. The command-line parser is a perfect example of that failure: technically coherent, functionally useless, and the kind of thing that gets accepted because the code looks like progress.

---

## What a GUI Specification Actually Contains

![The specification comes before the code. The sketch comes before the specification.](images/08-gui-as-user-need-specification-fig-01.png)
*Figure 8.1 — A wireframe sketch of a two-panel maintenance request*

Before you prompt AI for a single line of JavaFX, you need to know what you are specifying. A GUI specification is not a description of what the screen looks like. It is a translation of the user need into four things: controls, layout, events, and feedback.

**Controls** are the things the user interacts with: text fields, buttons, labels, dropdown menus, checkboxes. Each control has a name — specifically, an `fx:id` that the controller can reference — a type, and a purpose. For the maintenance request application: `nameField` (TextField, captures submitter name), `roomField` (TextField, captures room number), `descriptionArea` (TextArea, captures request description), `submitButton` (Button, triggers submission). These are not implementation details. They are the nouns of the user interaction.

**Layout** is how the controls are arranged relative to each other and to the screen. In JavaFX, layout is structural, not cosmetic. A `VBox` stacks children vertically. An `HBox` arranges them horizontally. A `GridPane` places them in rows and columns. A `BorderPane` divides the screen into five regions. Choosing the wrong layout pane is not a style error — it changes how the application responds to window resizing, how tab order works, and how the controls relate to each other visually. The specification names the pane, not just the controls inside it.

**Events** are the user actions the application must respond to. For the maintenance request form: the user clicks `submitButton`. That is the event source. The event type is `ActionEvent`. The handler is `handleSubmit`, a method in the controller class. The specification names all three.

**Feedback** is what the user sees after an action. On successful submission: navigate to `Confirmation.fxml`, display a confirmation message. On validation failure: display an inline error message, do not navigate, leave the form editable. The specification names both the success path and the failure path — because a user who does not know what happened has not been served by the application.

| Component | What it names | Why it belongs in the spec before prompting AI | What AI produces if it's missing |
| --- | --- | --- | --- |
| Controls | fx:id, type, purpose | AI can't register handlers without fx:id values | Unnamed controls AI invents, disconnected from the controller |
| Layout | Pane type and nesting | AI defaults to a pane that may resize incorrectly | VBox where GridPane was needed, or vice versa |
| Events | Source, type, handler name | AI may write handler logic without registering it | Dead handler: code exists, button does nothing |
| Feedback | Success path and failure path | AI omits the failure path unless specified | Validation logic that silently fails or throws |

When all four components are present, you have something that can be handed to AI as a prompt and audited against a checklist. When any one is missing, you have invited AI to make a structural choice you did not sanction — and structural choices in GUI code are much harder to fix after the fact than field visibility in a data class.

---

## The Handler Contract

The most important thing to specify precisely is the event handler, because it is where the application's behavior actually lives.

A handler contract has seven components:

**Event source.** Which control fires the event? `submitButton`.

**Event type.** What kind of event? `ActionEvent` (button click), `KeyEvent` (keyboard input), `MouseEvent` (mouse interaction). Getting this wrong means the handler never fires, or fires on the wrong interaction.

**Handler signature.** The exact method declaration. `public void handleSubmit(ActionEvent event)`. In JavaFX, the handler must be annotated with `@FXML` if it is wired through the FXML file, and the signature must match what the FXML loader expects. A handler with the right logic but the wrong signature does nothing.

**Precondition.** What must be true before the handler runs? For `handleSubmit`: the form fields are visible and editable. This is usually implicit, but naming it makes the failure path obvious: if the precondition is not met, the handler should not proceed.

**State change.** What does the handler do to application state? Creates a `MaintenanceRequest` object, adds it to the repository, triggers navigation to `Confirmation.fxml`. These are the side effects. A handler that has no state change is probably a dead handler — the validation logic exists but nothing downstream receives it.

**Validation behavior.** What does the handler check before committing the state change? For `handleSubmit`: `nameField` must not be empty; `roomField` must not be empty; `descriptionArea` must not be empty. Each failing check must produce a specific, visible response — not a silent return, not a thrown exception, but a message the user can act on.

**Failure response.** What does the handler do when validation fails? Display an inline error label. Leave the form in its current state. Do not navigate. This is different from the success path and must be specified separately, because AI will often produce validation logic that silently returns or displays a console error the user cannot see.

![Handler contract anatomy ](images/08-gui-as-user-need-specification-fig-02.png)
*Figure 8.2 — Handler contract anatomy *

The seven-component handler contract is to event-driven programming what the seven-component class contract from Chapter 5 is to object-oriented programming. Both exist for the same reason: to make the obligations of a piece of code explicit before it is written, so that the generated output can be audited against something real.

---

## The Three Generation Failures

When you prompt AI for JavaFX code, three failures appear with enough regularity that they deserve names. They are not random. They follow from specific gaps in the specification.

**Missing handler registration.** The handler method exists. The validation logic is correct. The state change is right. But the button does nothing when clicked, because the handler was never connected to the button.

In JavaFX, a handler can be registered in two ways: in the FXML file (`onAction="#handleSubmit"` on the button element) or in the controller's `initialize()` method (`submitButton.setOnAction(this::handleSubmit)`). If the specification does not say which method to use, AI will often write the handler method and omit the registration — because the method is the interesting part and the registration is boilerplate. The audit catches this by checking whether the button is wired before running a single test.

**Wrong layout pane.** The controls are present. The `fx:id` values match. The handlers are registered. But the form resizes incorrectly, the tab order is wrong, or the validation message appears in the wrong position — because the layout pane is not what the specification required.

This failure is harder to spot than missing registration, because the application runs and the basic interaction works. The problem surfaces when the window is resized, or when a validation message needs to appear below a specific field, or when the form needs to be scrollable. A `VBox` behaves differently from a `GridPane` under these conditions, and fixing the pane after the rest of the controller is written means revisiting the `fx:id` bindings and possibly the controller's field references.

**Hardcoded values violating parameterization.** The specification required that certain values — window dimensions, error messages, repository references — be passed in or configured, not embedded in the code. AI hardcodes them. The application works in the demo scenario and breaks in every other scenario: a different screen resolution, a different error message locale, a test that needs to inject a mock repository.

This failure is the hardest to catch without a specific handoff clause, because the hardcoded values look fine in isolation. The audit catches it only if the handoff condition explicitly names the parameterization requirements: *no hardcoded window dimensions; error message strings drawn from a resource bundle or constant; repository accessed through an interface, not instantiated directly.*

| Failure name | What the output contains | What the specification gap was | Handoff clause that catches it |
| --- | --- | --- | --- |
| Missing handler registration | Handler method exists, button does nothing | Registration method not specified | "Button onAction attribute or initialize() registration present" |
| Wrong layout pane | VBox where GridPane required | Pane type not named in spec | "Root pane type matches specification" |
| Hardcoded values | Literal strings and dimensions in code | Parameterization not specified | "No hardcoded values for [named items]" |

The three failures have a common structure: AI produces something that satisfies a weaker version of the specification. The handler logic satisfies "write a method that validates input" but not "wire the button to the handler." The layout satisfies "arrange these controls" but not "arrange them in a GridPane that preserves column alignment on resize." The hardcoded values satisfy "the application runs" but not "the application is parameterizable."

Each gap traces back to a missing specification clause. The audit finds it. The revised prompt closes it.

---

## Building the Boondoggle Score for Two Screens

A two-screen application has a dependency structure that the Boondoggle Score makes explicit: you cannot audit the confirmation screen until the form screen's submission behavior has been verified, because the confirmation screen is only reachable through a successful submission.

![Dependency chain for two-screen application ](images/08-gui-as-user-need-specification-fig-03.png)
*Figure 8.3 — Dependency chain for two-screen application *

The score for this application has at minimum three rows.

**Row 1.** AI task: generate `RequestForm.fxml` with the specified controls, layout pane, and `fx:id` values. Human task: inspect the FXML for correct pane type, all four `fx:id` values present and matching the specification, and `onAction` attribute on `submitButton`. Handoff condition: pane type is `GridPane`; `nameField`, `roomField`, `descriptionArea`, and `submitButton` all present with correct `fx:id`; `onAction="#handleSubmit"` on the button. Evidence: side-by-side of specification and generated FXML with each clause checked. Supervisory capacity: Plausibility Auditing.

**Row 2.** AI task: generate `RequestFormController.java` with `handleSubmit` implemented according to the handler contract. Human task: verify that all seven handler contract clauses are satisfied — event source, event type, handler signature with `@FXML`, precondition check, state change (object creation + repository add + navigation trigger), validation behavior (non-empty checks with visible error), failure response (no navigation on failure, error label visible). Handoff condition: all seven clauses pass on inspection. Evidence: annotated source listing with each clause marked pass or fail. Supervisory capacity: Plausibility Auditing.

**Row 3.** AI task: generate `Confirmation.fxml` with the specified confirmation message and a return button. Human task: verify that the navigation from `handleSubmit` loads `Confirmation.fxml` correctly, and that the return button navigates back to `RequestForm.fxml` with a cleared form. Handoff condition: navigation loads the correct FXML file; return button is registered; form fields are cleared on return. Evidence: execution trace through both navigation paths. Supervisory capacity: Tool Orchestration.

| Row | AI Task | Human Task | Handoff Condition | Evidence |
| --- | --- | --- | --- | --- |
| to make the chain visible. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

Row 3 depends on Row 2 passing. Row 2 depends on Row 1 passing. The dependency is not bureaucratic — it reflects a real structural fact about the application. If the FXML `fx:id` values do not match the controller's field declarations, the controller cannot compile. If the handler is not wired, Row 2's audit is meaningless. The score makes this sequence explicit so that a failure in Row 1 is caught before it corrupts Row 2.

---

## Reading the Worked Example

Let me apply all of this to the concrete case from this chapter's opening, because the abstract description of the audit process is less useful than watching it run.

The specification for `RequestFormController` says: `handleSubmit` receives `ActionEvent`, validates non-empty `nameField`, `roomField`, and `descriptionArea`, creates a `MaintenanceRequest`, adds it to the repository, and navigates to `Confirmation.fxml` on success. On any validation failure, an inline error label is made visible and navigation does not occur.

AI returns this controller:

```java
public class RequestFormController {
    @FXML private TextField nameField;
    @FXML private TextField roomField;
    @FXML private TextArea descriptionArea;
    @FXML private Button submitButton;

    public void handleSubmit(ActionEvent event) {
        if (nameField.getText().isEmpty() ||
            roomField.getText().isEmpty() ||
            descriptionArea.getText().isEmpty()) {
            System.out.println("Validation failed");
            return;
        }
        MaintenanceRequest request = new MaintenanceRequest(
            nameField.getText(),
            roomField.getText(),
            descriptionArea.getText()
        );
        repository.add(request);
        // navigate to confirmation
    }
}
```

Apply the handler contract clause by clause.

Event source: `submitButton`. Present as a field. **Pending** — registration check needed in FXML or `initialize()`.

Event type: `ActionEvent`. Correct in the method signature. **Pass.**

Handler signature: `@FXML` annotation absent. **Fail.** Without `@FXML`, the FXML loader cannot inject the fields or wire the handler.

Precondition: implicit (form visible). No check needed. **Pass.**

State change: `MaintenanceRequest` created. Repository add present. Navigation: commented out, not implemented. **Fail.**

Validation behavior: all three fields checked for emptiness. **Pass.** But the failure response is `System.out.println` — not a visible error label. **Fail.**

Failure response: no navigation on failure. **Pass.** But no visible feedback to the user. **Fail.**

Three passes, three fails, one pending. The handler contract fails on `@FXML` annotation, navigation implementation, and visible failure feedback. All three are prompt omissions — the specification did not say to use `@FXML`, did not name the FXML file for navigation, and did not specify that the failure response must be visible in the UI rather than logged to the console.

| Clause | Expected | Found in output | Pass or Fail | Root cause |
| --- | --- | --- | --- | --- |
| Handler contract audit for handleSubmit | seven rows, one per clause. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. | A concrete checkpoint for applying the chapter concept. |

The student records the three failures, identifies them as prompt omissions, and revises the prompt to add: `@FXML` annotations required on all injected fields and the handler method; navigation implemented using `FXMLLoader` to load `Confirmation.fxml`; validation failure response sets `errorLabel.setVisible(true)` with a descriptive message string.

The revised output is re-audited against the same seven-clause checklist. This time it passes.

---

## Why the Visual Layer Is Part of the Requirement

You might think the GUI is presentation — something added after the logic is working, a surface that can be swapped out without changing what the application does.

This is wrong, and it is worth understanding why, because the mistake produces the command-line parser from the opening of this chapter.

The user need is not "store a maintenance request in a database." The user need is "a non-technical user must submit a maintenance request without reading documentation." The submission workflow — the visible sequence of actions, the feedback at each step, the confidence that something happened — is not separate from the requirement. It *is* the requirement. A program that stores maintenance requests in a database but requires the user to read documentation to operate it has failed the requirement just as surely as a program that stores nothing.

This is what Donald Norman called the "gulf of execution" — the distance between what a user wants to do and the actions the system makes available. A command-line interface with flags has a large gulf of execution for a non-technical user: she cannot see what actions are possible, cannot tell whether her input was accepted, and has no recovery path when something goes wrong. A form with labeled fields, visible validation, and a confirmation screen has a small gulf: every step is visible, every error is legible, every success is confirmed.

The GUI specification is not describing cosmetics. It is closing the gulf of execution. And closing the gulf is part of the requirement, not an afterthought to it.

![Gulf of execution diagram ](images/08-gui-as-user-need-specification-fig-04.png)
*Figure 8.4 — Gulf of execution diagram *

When you write the GUI specification — naming the controls, the layout, the handlers, the feedback — you are making design decisions about the size of that gulf. A `submitButton` with a handler that provides visible confirmation closes the gulf. A `submitButton` with a handler that logs to the console and silently returns opens it. The specification has to name which one you are building.

---

## What to Carry Into the Next Chapter

Before you move to Chapter 9, you should be able to do three things.

First: translate a user need statement into a GUI specification with all four components — controls with `fx:id` values, layout pane with justification, event sources with handler names, and both the success and failure feedback paths. If you can write the specification without looking at JavaFX documentation, you understand what the specification contains.

Second: write a handler contract for a single event handler in a form application. All seven clauses. If any clause is missing, name the generation failure it enables.

Third: build a three-row Boondoggle Score for a two-screen application and name the dependency between the rows. The dependency is not a formality. It is a statement about what breaks if a handoff fails.

The next chapter moves from single-screen forms to multi-screen navigation and introduces a new problem: state that must survive the transition between screens without being stored in static fields.

---

## Exercises

These exercises are designed to be completed with an AI tool of your choice. The goal is not to generate a working JavaFX application. The goal is to generate one whose behavior you can verify against a specification you wrote before seeing the output.

**Warm-Up**

1. A university needs a room booking system. The user need: a student must book a study room without asking front desk staff for help. Write a GUI specification for the booking form: list every control with its `fx:id` and purpose, name the layout pane and justify the choice, name every event source and its handler, and describe the success and failure feedback paths.

2. From your specification, write a Boondoggle Score handoff condition for the booking form's submit handler. The condition must be binary and checkable by inspection. Then prompt AI for the controller. Apply the condition clause by clause. Record each pass or fail with a root cause.

**Application**

3. The following handler has at least two contract violations. Identify each one, name the clause it violates, and explain the user-visible consequence — not why it is bad style, but what the user experiences when it fails.

```java
public void handleBooking(ActionEvent event) {
    if (roomField.getText().isEmpty()) {
        return;
    }
    BookingRequest booking = new BookingRequest(
        roomField.getText(),
        dateField.getValue()
    );
    BookingRepository.getInstance().save(booking);
    System.out.println("Booking saved");
}
```

4. The AI-generated FXML for your booking form uses `VBox` as the root pane, but your specification required `GridPane`. Write the specific handoff clause that catches this failure, and explain what user-visible behavior differs between the two pane types for this form.

**Synthesis**

5. Write a three-row Boondoggle Score for a two-screen booking application: the booking form screen and a confirmation screen. The third row must depend on the second passing. For each row: AI task, human task, handoff condition, evidence type, supervisory capacity.

6. A student argues: "The GUI is just presentation layer — I can add it after the business logic is done." Write a two-paragraph response that explains where this argument holds and where it breaks down. Use the gulf of execution concept and at least one concrete example from a form application to show the difference.

**Challenge**

7. Design the complete GUI specification for a three-screen application of your choice: a data entry screen, a review screen, and a confirmation screen. Write handler contracts for every handler in the application. Then prompt AI for the full application in three Boondoggle Score rows and audit each output before proceeding to the next. Document every failure, its root cause, and the prompt revision that resolved it.

---

## LLM Exercises

Use these prompts with a language model to extend your understanding. Treat each generated response as an artifact to be audited, not a source to be cited.

**LLM Exercise 1 — Generation Failure Probe**

```
Here is a JavaFX controller I generated:

[paste your AI-generated controller]

Identify every instance of the three generation failures: missing handler registration, wrong layout pane assumption, and hardcoded values that should be parameterized. For each failure found: name the clause of the specification it violates, explain the user-visible consequence, and show the minimum change that would fix it.
```

**LLM Exercise 2 — Handler Contract Generation**

```
Here is a user need statement:

[paste your user need]

Write a complete seven-component handler contract for the primary submission handler in an application that satisfies this need. Then generate a JavaFX controller that satisfies the contract. Then generate a second controller that compiles and passes a superficial reading but violates at least two clauses of the contract. For the second controller, explain which clauses it violates and why a code review that only checks for compilation would miss the violations.
```

**LLM Exercise 3 — Boondoggle Score Audit**

```
Here is a two-screen JavaFX application specification:

[describe your two-screen application]

Generate a three-row Boondoggle Score for this application. Each row must include: AI task, human task, handoff condition (binary, checkable by inspection), evidence type, and supervisory capacity. Then generate the JavaFX code for the first row's AI task. Apply the first row's handoff condition to the generated output and report the result. If any clause fails, identify whether the failure was a prompt omission, a model default, or an emergent violation.
```

After receiving the generated score and audit, check: are the handoff conditions actually binary? Does each row's supervisory capacity label match the kind of judgment the human task requires? Revise any row where the answer is no.

## Prompts

Use these prompts with Claude to generate interactive D3 v7 versions of the
figures in this chapter. Each produces a standalone HTML file you can open
in a browser and modify freely.

**Prerequisites:** Load `brutalist/CLAUDE.md` and `brutalist/DESIGN.md` into
your Claude project context before using these prompts. They define the stack,
naming conventions, color system, and typography the figures use.

---

### Figure 8.1 — A wireframe sketch of a two-panel maintenance request

Create a standalone D3 v7 HTML file for Figure A wireframe sketch of a two-panel maintenance request. Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: A wireframe sketch of a two-panel maintenance request form — left panel showing labeled fields (Name, Room, Description) and a Submit button, right panel showing a confirmation message. Pencil-sketch style, not polished UI. Caption: "The specification comes before the code. The sketch comes before the specification.". Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/08-gui-as-user-need-specification-fig-01.html`

---

### Figure 8.2 — Handler contract anatomy 

Create a standalone D3 v7 HTML file for Figure Handler contract anatomy . Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Handler contract anatomy — seven labeled sections arranged around a central "handleSubmit" method signature. Each section shows the component name, a one-line definition, and the specific value for the maintenance request example. Designed as a reference card the student can apply to any handler.. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/08-gui-as-user-need-specification-fig-02.html`

---

### Figure 8.3 — Dependency chain for two-screen application 

Create a standalone D3 v7 HTML file for Figure Dependency chain for two-screen application . Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Dependency chain for two-screen application — three nodes: "RequestForm.fxml scaffold" → "handleSubmit handler" → "Confirmation.fxml scaffold + navigation." Arrows labeled with handoff conditions. Each node annotated with the supervisory capacity exercised at that handoff.. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/08-gui-as-user-need-specification-fig-03.html`

---

### Figure 8.4 — Gulf of execution diagram 

Create a standalone D3 v7 HTML file for Figure Gulf of execution diagram . Use the CDN https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, ResizeObserver redraw, SVG role="img", aria-labelledby, title, and desc. Build the figure from this structural brief: Gulf of execution diagram — two rows. Top row: command-line interface, user need to execution path shown as a long arrow with multiple unlabeled steps. Bottom row: JavaFX form, same user need to execution path shown as a short arrow with labeled, visible steps. Labels: "What the user wants to do" on the left, "Actions the system makes available" on the right. The gap between them is the gulf.. Use the described data shape and labels; when exact values are not supplied, use plausible illustrative values that preserve the relationships in the brief. Use a zero baseline for bars or areas, direct labels where possible, and annotations named in the brief. Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/08-gui-as-user-need-specification-fig-04.html`
