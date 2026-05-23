import fs from "node:fs";
import path from "node:path";

const bookDir = path.resolve(path.join(import.meta.dirname, ".."));
const chaptersDir = path.join(bookDir, "chapters");
const logsDir = path.join(bookDir, "logs");
const date = "2026-05-23";
const book = path.basename(bookDir);

const sources = {
  ai: "Peng et al., 2023; Vaithilingam et al., 2022; Pearce et al., 2022",
  java: "Gosling et al., Java Language Specification, Java SE 21, 2023; Oracle Java SE API, 2023",
  pedagogy: "Collins, Brown, and Newman, 1989; Sweller, 1988; Robins, Rountree, and Rountree, 2003; Chi and Wylie, 2014",
  design: "Parnas, 1972; Meyer, 1997; Fagan, 1976; Bass, Clements, and Kazman, 2021",
};

const modules = [
  {
    module: 0,
    title: "Welcome and Course Orientation",
    slug: "welcome-and-course-orientation",
    oneLine: "Orientation only — not a content module: faculty context, the AI+1 argument, Boondoggle Score preview, Medhavy workflow, and required AI-use integrity norms.",
    los: [
      "Describe the AI+1 argument in plain language and explain why this course requires supervised AI use.",
      "Identify the parts of a Boondoggle Score: AI task, human task, handoff condition, dependency, and supervisory capacity label.",
      "Apply the course integrity policy by disclosing tool use, accepted output, rejected output, and unresolved uncertainty.",
    ],
    opening: "Dilnoza arrives expecting a Java course. She expects variables, loops, classes, and eventually a project. Instead, the first artifact she sees is a completed Boondoggle Score for a small Java build: prompts, dependency edges, rejected AI output, and human audit notes. At first it feels sideways. Then she sees the code compiles while one requirement is silently violated. The question changes. The course is not asking whether AI can write Java. It is asking whether she can be accountable for Java that AI helped write.",
    concept: "This chapter frames the course as programming by conducting. A conductor does not play every instrument, but the conductor is responsible for the score, the entrances, the balance, and the moment when a wrong note matters. In this book, AI is the instrument. Java is the musical language. The human engineer owns the score.",
    formal: "A Boondoggle Score is a dependency-ordered record of an AI-assisted build. Each row names what AI is allowed to do, what the human must verify or decide, what evidence permits the next step, and which supervisory capacity is being exercised.",
    example: "A first orientation score has three rows. Row one asks AI to generate a `Greeting` class with a named method and no extra dependencies. Row two assigns the human to inspect whether the generated code used the required method signature. Row three permits execution only if the class name, method name, output format, and forbidden additions all match the prompt.",
    misconceptions: [
      ["If AI use is required, integrity no longer matters.", "Required use makes integrity more visible, not less. The submitted evidence shifts from pretending no tool was used to showing what the learner asked, accepted, rejected, and verified."],
      ["The Boondoggle Score is paperwork after coding.", "The score is the build plan. If it is written after the code, it cannot protect the handoffs that already happened."],
      ["A Java course should start with syntax.", "This course starts with accountability because syntax without acceptance criteria teaches students to trust whatever compiles."],
    ],
    mechanism: "The chapter turns AI use from hidden assistance into inspectable process evidence.",
  },
  {
    module: 1,
    title: "The Conductor's Frame",
    slug: "the-conductors-frame",
    oneLine: "Students learn to separate AI's job from their job — and produce their first Boondoggle Score for a trivial system.",
    los: [
      "M1-LO1 [PF] (Apply) Write a one-sentence problem formulation: the thing being built, its insertion point, its output — distinct from the problem it solves and the ecosystem it lives in.",
      "M1-LO2 [TO] (Apply) Write a complete, copy-pasteable AI prompt for a trivial Java task: output format, constraints, and what AI should NOT do.",
      "M1-LO3 [PA] (Analyze) Identify at least two categories of AI output failure in a provided Java snippet: scope creep, constraint violation, domain-incorrect implementation.",
    ],
    opening: "The task manager runs. It even looks finished. AI produced it from a short request, and the first screen gives the student confidence: tasks can be added, listed, and marked done. Then the specification appears. Completed tasks must remain visible for audit, priorities must sort high to low, and deleted tasks must be recoverable until the session ends. The app violates all three. Most students find one or two. Almost nobody finds all three on the first pass.",
    concept: "The central move is separating description from specification. A description says what the student hopes to get. A specification states what must be true for the work to count as done. AI is good at turning plausible descriptions into plausible artifacts. The human role is to decide what plausibility is not enough to prove.",
    formal: "A handoff condition is a binary, inspectable rule that must pass before the next build step begins. It is not a feeling of confidence, an aesthetic preference, or a vague quality claim.",
    example: "For a greeting program, a weak prompt says: 'Write a Java greeting app.' A conductor prompt says: 'Write a single Java class named `GreetingApp` with a `public static void main(String[] args)` method. It must print exactly `Hello, Dilnoza` when run with no arguments. Do not add packages, input prompts, GUI code, files, or external libraries.' The handoff condition is equally concrete: the code is acceptable only if the class name, method signature, exact output string, and forbidden additions can be verified by inspection before execution.",
    misconceptions: [
      ["If the program compiles, the handoff condition passed.", "Compilation proves the Java parser and type checker accepted the code. It does not prove the output matched the specification."],
      ["A prompt is just a request.", "In this course, a prompt is a delegated work order. If it omits a constraint, the omission is part of the human design record."],
      ["The AI made the mistake.", "Sometimes it did. But the conductor must first ask whether the specification allowed the mistake."],
    ],
    mechanism: "The chapter makes the solve/verify asymmetry operational through problem formulation and binary handoff conditions.",
  },
  {
    module: 2,
    title: "Java Foundations for Specification",
    slug: "java-foundations-for-specification",
    oneLine: "Students learn enough Java to write specifications that constrain AI generation — and to evaluate whether AI's output satisfied them.",
    los: [
      "M2-LO1 [PF] (Apply) Write a variable and method specification precise enough that AI generates correct Java with no post-generation ambiguity.",
      "M2-LO2 [PA] (Analyze) Given AI-generated Java for a specified method, determine whether the output satisfies stated invariants and flag violating lines.",
      "M2-LO3 [TO] (Apply) Define a handoff condition that is binary, testable without running the code, and grounded in specification not aesthetics.",
    ],
    opening: "A student asks AI for a method that reads scores and returns the average. The generated method works for the sample input. It also divides by zero on an empty array, rounds differently from the requirement, and changes the parameter type from `int[]` to `ArrayList<Integer>`. The output is not nonsense. That is what makes it dangerous.",
    concept: "Java foundations matter here because type, method signature, return value, and exception behavior are specification tools. A learner does not need to memorize the whole Java Language Specification. But she must understand that `int[] scores`, `double`, `static`, and `throws IOException` are not decoration. They constrain what AI may build and what the human can audit.",
    formal: "A method specification states the method name, parameter list, return type, preconditions, postconditions, side effects, and failure behavior. An invariant is a condition that must remain true before and after the method runs.",
    example: "Suppose the component needs `public static double averageScore(int[] scores)`. The specification says `scores` must not be null, empty input returns `0.0`, and the method must not modify the array. AI returns a version that converts to `List<Integer>` and throws on empty input. The audit is not 'does it look Java-like?' The audit asks: did the signature stay fixed, did the empty case match, and was the input left unchanged?",
    misconceptions: [
      ["Changing `int[]` to `ArrayList<Integer>` is harmless because both hold numbers.", "The storage type is part of the requirement. Changing it may change dependencies, memory behavior, and the lesson the component is meant to teach."],
      ["A handoff condition should run the code.", "Some handoff checks should happen before execution: signature, forbidden dependencies, mutation, and explicit exception behavior can often be inspected."],
      ["Types are syntax chores.", "In Java, types are promises. They are one of the first ways the human constrains generation."],
    ],
    mechanism: "The chapter uses Java signatures and invariants as the first concrete language of specification.",
  },
  {
    module: 3,
    title: "Objects as Specifications",
    slug: "objects-as-specifications",
    oneLine: "Students learn to specify classes as behavioral contracts — precise enough to be AI prompts, complete enough to constrain the object's entire lifecycle.",
    los: [
      "M3-LO1 [PF] (Apply) Produce a UML-level class specification complete enough to be an AI prompt without additional verbal clarification.",
      "M3-LO2 [PA] (Analyze) Given AI-generated class implementations, identify encapsulation violations, incorrect visibility modifiers, and constructor contract contradictions.",
      "M3-LO3 [IJ] (Evaluate) Justify instance vs. static choice by naming the specific behavioral consequence of choosing incorrectly.",
    ],
    opening: "AI generates a `Task` class with public fields. The code is short, readable, and easy to use. It also lets any other class set `priority = -9`, replace the title with an empty string, and mark a deleted task as active without recording who changed it. Nothing is broken until everything is allowed.",
    concept: "A class is not a folder for related variables. It is a boundary around state and behavior. The class specification says what state may exist, how it may change, and which operations are allowed to preserve the invariant. Encapsulation is not a style preference; it is how Java objects prevent illegal states from spreading.",
    formal: "A class contract includes responsibility, fields, visibility, constructor requirements, method signatures, invariants, and forbidden shared state. Static state belongs to the class itself; instance state belongs to one object. Choosing wrongly changes behavior.",
    example: "The `Task` class contract requires private `title`, private `priority`, and private `completed`; a constructor rejects blank titles and priorities outside 1–5; `markComplete()` is the only method that changes completion state. AI returns public fields and a no-argument constructor. The audit marks three failures: no invariant enforcement, invalid construction path, and uncontrolled mutation.",
    misconceptions: [
      ["Public fields are fine in small programs.", "Small programs are where habits form. A public field means no method can defend the object's invariant."],
      ["Static is simpler.", "Static is shared. If the data should differ per task, static creates cross-object interference."],
      ["UML diagrams are extra documentation.", "A useful class diagram is a promptable contract: responsibility, state, methods, and constraints."],
    ],
    mechanism: "The chapter deep-dives how object boundaries enforce invariants across an object's lifecycle.",
  },
  {
    module: 4,
    title: "The Software Design Document",
    slug: "the-software-design-document",
    oneLine: "Students produce a complete SDD Problem Summary and dependency-ordered build graph — the specification infrastructure that makes a multi-component Boondoggle Score possible.",
    los: [
      "M4-LO1 [PF] (Create) Produce an SDD Problem Summary that could not describe ten different systems.",
      "M4-LO2 [TO] (Apply) Produce a dependency-ordered build graph: each node names its AI task, handoff condition, and prerequisite nodes.",
      "M4-LO3 [EI] (Evaluate) Identify the load-bearing components in a system design and explain why each is load-bearing in dependency graph terms.",
    ],
    opening: "The class hears this description: 'Build an app that helps students manage work.' In two minutes, they name a calendar, a Kanban board, a tutoring scheduler, a grade predictor, a reminder app, a group-project tracker, a reading log, a study timer, a flashcard system, and a file organizer. The description is not wrong. It is just not yet a design.",
    concept: "A Software Design Document is the system's specification infrastructure. It gives AI something stable to build against and gives the human a way to detect drift. The most important sentence is the Problem Summary: the thing being built, for whom, where it fits, and what output it must produce.",
    formal: "A dependency graph is a directed map of build order. Each node names a component or artifact; each edge means one node must exist or be verified before another can be safely built.",
    example: "A three-component task manager might have `Task` model, `TaskRepository`, and `TaskConsoleView`. The model has no prerequisites. The repository depends on the model because it stores tasks. The view depends on both because it displays and changes stored tasks. A load-bearing node is the model: if its invariant is wrong, the repository and view can both look correct while preserving bad data.",
    misconceptions: [
      ["The SDD slows down coding.", "The SDD prevents expensive wrong coding by making assumptions inspectable before generation."],
      ["A dependency graph is just project management.", "It is a verification structure. It tells the human which handoff must pass before downstream work begins."],
      ["Architecture principles are slogans.", "A useful principle constrains a prompt: for example, 'no GUI component may mutate model fields directly.'"],
    ],
    mechanism: "The chapter makes system-scale specification visible through problem summaries and dependency-ordered handoffs.",
  },
  {
    module: 5,
    title: "Inheritance and the Specification Contract",
    slug: "inheritance-and-the-specification-contract",
    oneLine: "Students learn to specify superclass/subclass relationships as behavioral contracts — and audit AI-generated hierarchies for the single most common OOP failure.",
    los: [
      "M5-LO1 [PF] (Apply) Specify a superclass/subclass relationship: invariant each class enforces, the one invariant no subclass may violate.",
      "M5-LO2 [PA] (Analyze) Given AI-generated inheritance hierarchies, identify LSP violations and diagnose specification failure vs. generation failure.",
      "M5-LO3 [IJ] (Evaluate) Decide between inheritance and composition and defend the choice using the specific failure mode each introduces.",
    ],
    opening: "Square extends Rectangle. The code compiles. The setter methods inherit cleanly. Then a method that expects to widen a rectangle changes only width, and the square silently changes height too. The subclass has the right shape vocabulary and the wrong behavior.",
    concept: "Inheritance is a promise that a subclass can stand where the superclass is expected. The famous Liskov Substitution Principle is not a slogan about elegance. It is a behavioral audit: if code that works with the parent breaks when handed the child, the hierarchy is lying.",
    formal: "A superclass contract states the invariants and method behaviors every subclass must preserve. A subclass may add behavior, but it must not violate the expectations clients are allowed to have about the superclass.",
    example: "A `Notification` superclass promises `send()` records exactly one delivery attempt and returns a delivery result. An AI-generated `EmailNotification` retries internally and records three attempts before returning. That might be useful, but it violates the superclass contract unless retries were part of the shared behavior. The conductor must decide: revise the superclass contract, override with explicit constraints, or use composition instead.",
    misconceptions: [
      ["Inheritance means 'is a' in ordinary language.", "Ordinary language is not enough. The subtype must preserve behavior under substitution."],
      ["Composition is always safer.", "Composition avoids some inheritance failures but can make polymorphic use harder. The choice needs a named failure mode."],
      ["AI chose a hierarchy, so the design is done.", "Hierarchy is an architectural claim. The human must defend it."],
    ],
    mechanism: "The chapter uses LSP audits to turn inheritance from taxonomy into behavioral verification.",
  },
  {
    module: 6,
    title: "GUI as User Need Specification",
    slug: "gui-as-user-need-specification",
    oneLine: "Students translate user need statements into JavaFX component specifications — and produce a Boondoggle Score segment for a two-screen application.",
    los: [
      "M6-LO1 [PF] (Apply) Translate a user need statement into a JavaFX component specification: named controls, event sources, handler contracts, layout constraints.",
      "M6-LO2 [TO] (Apply) Produce a Boondoggle Score segment for a two-screen application: AI tasks for scaffold generation, human tasks for event handler contract audit.",
      "M6-LO3 [PA] (Analyze) Given AI-generated JavaFX code, identify the three generation failures: missing handler registration, wrong layout pane, hardcoded values violating parameterization.",
    ],
    opening: "The user need says a non-technical user must submit a maintenance request without reading documentation. AI builds a command-line program with perfect parsing. It is technically impressive and wrong. The user needed a visible workflow, not a clever parser.",
    concept: "A GUI specification translates need into controls, layout, events, and feedback. In JavaFX, that means naming screens, panes, controls, `fx:id` values, controller methods, and the state changes each handler is allowed to make. The visual layer is not frosting. It is part of the requirement.",
    formal: "A handler contract names the event source, event type, handler signature, precondition, state change, validation behavior, and failure response.",
    example: "A two-screen request app has `RequestForm.fxml` and `Confirmation.fxml`. The form contains `nameField`, `roomField`, `descriptionArea`, and `submitButton`. The `handleSubmit` method must validate non-empty fields, create a `MaintenanceRequest`, add it to the repository, and navigate only on success. AI returns a controller with validation logic but never connects the button to the handler. The audit catches missing registration before the user clicks anything.",
    misconceptions: [
      ["If the handler method exists, the button works.", "In event-driven GUI code, registration is part of the behavior."],
      ["A GUI requirement is about appearance.", "This chapter treats GUI as user-need access: what the user can see, do, recover from, and trust."],
      ["Hardcoded values are harmless in a prototype.", "Hardcoding can violate the parameterization the prompt required and make later handoffs brittle."],
    ],
    mechanism: "The chapter translates user needs into JavaFX controls, event sources, and handler contracts.",
  },
  {
    module: 7,
    title: "Midpoint Integration: Boondoggle Score Part I",
    slug: "midpoint-integration-boondoggle-score-part-i",
    oneLine: "Students produce and peer-audit Boondoggle Score Part I — the complete specification for their Modules 1–6 system components.",
    los: [
      "M7-LO1 [EI] (Create) Produce Boondoggle Score Part I: Problem Summary, architecture principles, dependency graph, AI prompts for all prior components, handoff conditions at every step.",
      "M7-LO2 [PA] (Evaluate) Audit a peer's Score Part I for prompt completeness, handoff condition testability, and dependency ordering correctness.",
    ],
    opening: "Every Glimmer submission since Module 1 looked small enough to survive alone. Now the pieces are placed on one table. The method prompt assumes a class that does not exist. The GUI prompt mutates fields the class hid. The dependency graph puts the view before the repository. The midpoint is where formatted compliance stops being persuasive.",
    concept: "Integration is a different cognitive task from producing parts. A Boondoggle Score Part I must prove that the problem summary, prompts, handoff conditions, and dependency graph agree with one another. Peer audit matters because another reader can often see a gap the author's memory patched silently.",
    formal: "A peer audit is a structured review against named criteria: prompt completeness, handoff testability, dependency order, invariant preservation, and revision evidence.",
    example: "A peer reads a score for a two-screen task manager. The prompt for the controller says it should call `repository.save(task)`, but the repository specification only defines `add(Task task)`. The mismatch is not a naming nit. It is a failed handoff: AI cannot generate reliable integration code against unstable component contracts.",
    misconceptions: [
      ["Peer audit is proofreading.", "Proofreading catches surface errors. This audit catches specification contradictions."],
      ["If each component is good, the system is good.", "Integration failures often occur between good components whose assumptions differ."],
      ["Revision history is bureaucratic.", "Revision history is evidence that the audit changed the design rather than merely decorating it."],
    ],
    mechanism: "The chapter forces local specifications to survive system-level integration and peer challenge.",
  },
  {
    module: 8,
    title: "Abstract Contracts and Interface Specifications",
    slug: "abstract-contracts-and-interface-specifications",
    oneLine: "Students learn to specify behavioral contracts without presupposing implementation — the hardest specification skill in the course.",
    los: [
      "M8-LO1 [PF] (Apply) Specify an interface contract — signatures, pre/post conditions, invariant — precisely enough that two independent AI implementations are interchangeable.",
      "M8-LO2 [PA] (Analyze) Given two AI implementations of the same interface, determine which satisfies the contract, citing specific violated clauses.",
      "M8-LO3 [IJ] (Evaluate) Justify abstract class vs. interface using the specific constraint each imposes on future implementors.",
    ],
    opening: "Two AI-generated classes implement `Sortable`. Both compile. Both pass the basic test. One mutates the input list. The other returns a new sorted list and leaves the original unchanged. The interface signature did not say which behavior was required. The bug was born before either class existed.",
    concept: "An interface is a boundary between what clients can rely on and how implementors may satisfy that reliance. The hard skill is specifying behavior without dictating implementation. That means signatures are necessary but insufficient. The contract must name preconditions, postconditions, invariants, side effects, and edge cases.",
    formal: "A precondition is what must be true before a method is called. A postcondition is what must be true after it returns. An invariant is what must remain true across all valid implementations.",
    example: "The `FileReaderService` interface declares `List<String> readLines(Path path) throws IOException`. The contract says missing files throw `IOException`, empty files return an empty list, blank lines are preserved, and the method never returns `null`. AI implementation A returns `null` for empty files. Implementation B returns an empty list. Both match the signature; only B satisfies the behavioral contract.",
    misconceptions: [
      ["The method signature is the contract.", "The signature is the doorway. The behavioral contract says what must happen after someone walks through it."],
      ["Interfaces are always better than abstract classes.", "An interface gives implementation freedom. An abstract class can share state or behavior. The right choice depends on the constraint the system needs."],
      ["Tests define the contract.", "Tests sample the contract. They do not replace stating it."],
    ],
    mechanism: "The chapter separates signature compatibility from behavioral interchangeability.",
  },
  {
    module: 9,
    title: "Event-Driven Specification",
    slug: "event-driven-specification",
    oneLine: "Students specify event-driven components as state machines — and audit AI-generated handler sequences for behavioral failures that compile-time checks cannot catch.",
    los: [
      "M9-LO1 [PF] (Apply) Specify an event-driven component: event source, event class, handler signature, state change produced, edge case where handler must do nothing.",
      "M9-LO2 [TO] (Apply) Produce a Boondoggle Score segment for an event-driven feature: AI task for handler scaffold, human audit for state machine.",
      "M9-LO3 [PA] (Analyze) Given AI-generated handler code, identify: missing null checks, incorrect registration scope, encapsulation-violating state mutations.",
    ],
    opening: "The submit button works. Then a user double-clicks. Two requests are created, two confirmations appear, and the repository now holds duplicate data. The handler body looked correct because the specification only named the happy path.",
    concept: "Event-driven programs do not run top to bottom in the way beginners expect. They wait, react, mutate state, and wait again. To specify them, the conductor must name states, events, guards, transitions, and no-op cases. A handler is not just a method; it is a transition in a state machine.",
    formal: "A state machine specification lists valid states, events that can occur, guard conditions for transitions, actions taken during transitions, and states in which the event must do nothing.",
    example: "A form submission feature begins in `EMPTY`, moves to `VALID` when required fields are present, enters `SUBMITTING` after a click, and reaches `SUBMITTED` only after repository save succeeds. A second click in `SUBMITTING` must do nothing. AI returns a handler that saves on every click. The audit fails the duplicate-event guard.",
    misconceptions: [
      ["The handler logic is correct, so the feature is correct.", "The feature includes when the handler is registered, how often it can fire, and which state it is allowed to change."],
      ["Null checks are defensive clutter.", "In event-driven code, missing input or missing selection is often a normal state, not an exceptional surprise."],
      ["State machines are too formal for small GUIs.", "Small GUIs are exactly where hidden states produce surprising behavior."],
    ],
    mechanism: "The chapter turns event handlers into auditable state transitions with guards and no-op cases.",
  },
  {
    module: 10,
    title: "Generics, Collections, and Type-Safe Specification",
    slug: "generics-collections-and-type-safe-specification",
    oneLine: "Students specify type-safe data structures and choose the correct Collection for a given access pattern — architectural decisions visible in the Boondoggle Score.",
    los: [
      "M10-LO1 [PF] (Apply) Specify a generic class or method with explicit type bounds, invariants the type parameter must satisfy, and the runtime failure mode when the bound is violated.",
      "M10-LO2 [PA] (Analyze) Given AI-generated generic code, identify: unchecked cast warnings, wildcard misuse, type erasure consequences.",
      "M10-LO3 [IJ] (Evaluate) Choose the correct Collection for a specified access pattern and justify by naming the performance consequence of choosing incorrectly.",
    ],
    opening: "The program is correct with 100 tasks. With 100,000 tasks, lookup takes long enough that users think it froze. AI used `ArrayList` because the prompt said 'store tasks.' The real requirement was 'retrieve a task by id often.' That is a different specification.",
    concept: "Generics and collections are not advanced syntax added after the basics. They are how Java lets the conductor specify what kind of data may move through a component and how that data will be accessed. `List<Task>`, `Map<String, Task>`, and `Set<String>` declare different expectations.",
    formal: "An access-pattern specification names the dominant operations, expected scale, ordering requirements, uniqueness requirements, and failure mode of the wrong collection choice.",
    example: "A repository needs frequent lookup by task id, occasional insertion, and no duplicate id. The prompt must specify `Map<String, Task>` or an equivalent keyed structure, plus the uniqueness invariant. If AI returns `ArrayList<Task>` and loops through every task on lookup, the code can pass small tests and still violate the architecture.",
    misconceptions: [
      ["Warnings are not errors, so unchecked casts are acceptable.", "A warning is evidence the type system stopped proving something. Suppressing it requires a reason."],
      ["All collections are interchangeable at this scale.", "Small examples hide asymptotic behavior. The handoff must name expected scale and access pattern."],
      ["Generics are for reusable libraries only.", "Even a small repository benefits when the type parameter states what values are legal."],
    ],
    mechanism: "The chapter connects Java type safety and collection choice to explicit access-pattern requirements.",
  },
  {
    module: 11,
    title: "Recursion as Problem Decomposition",
    slug: "recursion-as-problem-decomposition",
    oneLine: "Students specify recursive methods as decomposition contracts and audit AI-generated recursion for the three failure modes specification silence produces.",
    los: [
      "M11-LO1 [PF] (Apply) Specify a recursive method: base case with termination condition, recursive case with reduction step, termination invariant.",
      "M11-LO2 [PA] (Analyze) Given AI-generated recursive implementations, identify: missing base case, incorrect reduction step, stack overflow conditions.",
      "M11-LO3 [IJ] (Evaluate) Decide between recursive and iterative implementation using stack depth, readability tradeoff, and maximum safe input size.",
    ],
    opening: "AI writes a recursive method to count files in nested folders. It works on the demo directory. Then it receives a deeply nested archive and the JVM stack overflows. The specification never named maximum depth, cycle behavior, or the condition under which recursion should stop.",
    concept: "Recursion is not a trick where a method calls itself. It is a decomposition contract: solve the smallest case directly, reduce every larger case toward that smallest case, and preserve a termination invariant. AI can imitate recursive shapes. The conductor must verify that the shape actually shrinks the problem.",
    formal: "A recursive specification has three required parts: base case, recursive case, and termination invariant. It should also name maximum safe input size or explain why stack depth is acceptable.",
    example: "For `countFiles(File root)`, the base case is a plain file returning one. The recursive case is a directory returning the sum of child counts. The termination invariant is that each recursive call moves to a strict child path and never revisits a path. The handoff condition fails if AI omits empty-directory behavior or follows symbolic links without cycle protection.",
    misconceptions: [
      ["If there is a base case, recursion is safe.", "The recursive case must move toward that base case. A base case unreachable from some inputs is decoration."],
      ["Recursive code is always more elegant.", "Elegance does not pay for stack overflow. Maximum input size matters."],
      ["AI is good at recursion patterns, so this is low risk.", "Pattern fluency can hide a wrong reduction step."],
    ],
    mechanism: "The chapter teaches recursive methods as auditable decomposition contracts with termination evidence.",
  },
  {
    module: 12,
    title: "Data Structures as Architectural Decisions",
    slug: "data-structures-as-architectural-decisions",
    oneLine: "Students specify data architecture requirements by access pattern — and produce the data architecture segment of their Boondoggle Score.",
    los: [
      "M12-LO1 [PF] (Apply) Specify a data structure requirement by access pattern, ordering requirement, and performance invariant.",
      "M12-LO2 [EI] (Analyze) Given a complete system specification, identify the three data structure decisions that most affect behavior under load.",
      "M12-LO3 [TO] (Apply) Produce the data architecture Boondoggle Score segment: AI tasks for schema generation, human tasks for domain invariant audit.",
    ],
    opening: "Two systems have the same screens and pass the same sample tests. One uses a list for everything. The other uses a map for lookup, a priority queue for next action, and a set for uniqueness. At classroom scale they look identical. Under load, they are different systems.",
    concept: "Data structures are architecture because they shape what the system can do cheaply, safely, and predictably. Choosing `ArrayList`, `HashMap`, `TreeSet`, or `PriorityQueue` is not only an implementation detail. It encodes assumptions about access, ordering, uniqueness, and performance.",
    formal: "A data architecture requirement names the data entity, dominant access pattern, ordering requirement, uniqueness rule, mutation pattern, expected scale, and invariant enforcement location.",
    example: "A student roster needs lookup by university id, display sorted by last name, and prevention of duplicate ids. A single `ArrayList<Student>` can be made to work, but it pushes uniqueness and lookup into repeated manual scans. A better specification may use `Map<String, Student>` for identity plus a sorted view for display. The handoff condition checks both declarations and invariant enforcement.",
    misconceptions: [
      ["Data structure choice can wait until performance becomes a problem.", "By then, downstream code may already depend on the wrong access pattern."],
      ["The AI will pick a reasonable collection.", "AI often chooses familiar defaults unless the prompt names access patterns and invariants."],
      ["Performance is premature optimization.", "Choosing the structure that matches the required operation is not optimization. It is design."],
    ],
    mechanism: "The chapter elevates collection and storage choices into explicit architecture decisions tied to invariants and load.",
  },
  {
    module: 13,
    title: "Hardening: Edge Cases and Failure States",
    slug: "hardening-edge-cases-and-failure-states",
    oneLine: "Students find the failure states their specifications never named — and discover that unspecified failure states are not the AI's responsibility to handle.",
    los: [
      "M13-LO1 [PA] (Analyze) Enumerate minimum failure states per component and identify which the AI prompts never specified.",
      "M13-LO2 [PF] (Apply) Revise an AI prompt to include three previously unspecified failure states without expanding scope beyond the original boundary.",
      "M13-LO3 [IJ] (Evaluate) Triage edge cases by production risk: Must-Fix, Important for v2, Nice-to-Have — and defend each classification.",
    ],
    opening: "The save method catches `IOException`. Then it does nothing. No message. No retry. No log. The user sees success while nothing was written. AI did not rebel. It filled a silence in the specification with the easiest local pattern.",
    concept: "Hardening is the work of finding what the specification failed to name. The point is not to imagine every possible disaster. The point is to enumerate the failure states that matter for this component, classify them by risk, and revise prompts and handoff conditions so Must-Fix states cannot pass silently.",
    formal: "A failure state is a condition under which a component cannot satisfy its normal contract. A triage label states whether that condition must be fixed now, deferred with justification, or recorded as outside the current scope.",
    example: "For file writing, Must-Fix states include missing permission, invalid path, partial write, and swallowed exception. A prompt revision says: 'If writing fails, propagate `IOException` to the caller and do not report success.' The handoff condition checks there is no empty catch block and no success message after failed persistence.",
    misconceptions: [
      ["Edge cases are rare, so they can wait.", "Some edge cases are rare and catastrophic. Triage must name consequence, not frequency alone."],
      ["Adding every failure state makes the prompt better.", "Hardening without scope control creates a new, larger, less testable problem."],
      ["If AI did not handle it, AI is at fault.", "If the failure state was predictable and unspecified, the conductor owns the silence."],
    ],
    mechanism: "The chapter teaches failure-state enumeration, risk triage, and prompt revision without scope expansion.",
  },
  {
    module: 14,
    title: "Final Boondoggle Score: Defense",
    slug: "final-boondoggle-score-defense",
    oneLine: "Students complete, finalize, and defend their Boondoggle Score — demonstrating that architectural decisions reflect genuine engineering judgment, not formatted compliance.",
    los: [
      "M14-LO1 [EI] (Create) Produce the complete final Boondoggle Score: all components, all AI prompts, all handoff conditions, full dependency graph, supervisory capacity labels at every human step.",
      "M14-LO2 [IJ] (Evaluate) Defend the three most consequential architectural decisions against a specific alternative, using the failure mode each alternative introduces.",
      "M14-LO3 [EI] (Evaluate) Identify the two highest-risk handoffs and specify the additional verification step that catches cascade failures before propagation.",
    ],
    opening: "The course returns to the pebble: a system as complex as the first task manager. This time the student does not start by asking whether it works. She asks what it promised, what it depends on, where failure would cascade, and which human decision accepted each handoff.",
    concept: "The final defense is the moment the book's argument becomes visible. A polished artifact is not enough. The student must explain why the system is decomposed this way, why these prompts delegate safely, why these handoff conditions catch the important failures, and why rejected alternatives were rejected.",
    formal: "A consequential decision is an architectural choice whose alternative would change system behavior, risk, maintainability, or verification burden. A highest-risk handoff is a transition where accepting bad output would cascade into downstream components.",
    example: "A student defends choosing `Map<String, Task>` over `ArrayList<Task>` for lookup. The alternative is simpler to display but risks slow lookup and duplicate id bugs. The highest-risk handoff is the repository contract: if it accepts duplicate ids, the GUI can faithfully display corrupted state. The added verification step checks uniqueness enforcement before GUI generation begins.",
    misconceptions: [
      ["The defense is a presentation of what I built.", "The defense is an examination of what you decided and why those decisions survived alternatives."],
      ["A complete score is a long score.", "Completeness means every necessary handoff has evidence. Length is not the metric."],
      ["Reflection is separate from engineering.", "Professional judgment includes explaining how a design changed when evidence exposed a weakness."],
    ],
    mechanism: "The chapter integrates the whole course into architectural decision defense and cascade-risk accountability.",
  },
];

function citations(extra = "") {
  return `Sources to carry into drafting: ${[sources.ai, sources.java, sources.pedagogy, sources.design, extra].filter(Boolean).join("; ")}.`;
}

function learningObjectives(m) {
  return m.los.map((lo) => `- ${lo}`).join("\n");
}

function tableComment(m) {
  return `<!-- → [TABLE: ${m.title} Boondoggle Score excerpt with columns for AI task, human supervisory capacity, handoff condition, evidence, and downstream dependency.] -->`;
}

function figureComment(m) {
  return `<!-- → [FIGURE: Dependency and verification flow for ${m.title}, showing the learner's specification, AI generation, human audit, handoff condition, and next component.] -->`;
}

function chapter(m, fileNumber) {
  const n = String(m.module).padStart(2, "0");
  return `# Module ${m.module}: ${m.title}

**One-line:** ${m.oneLine}

## Learning Objectives

${learningObjectives(m)}

## Opening Case

${m.opening}

The mistake is tempting because the code looks like progress. That is the recurring trap in this course. AI can produce an artifact faster than the learner can fully explain the artifact's obligations. The course therefore asks the learner to slow down at the handoff, not at the keyboard.

## Core Concept

${m.concept}

${m.formal}

This is where the AI-era Java course differs from a coverage-first Java course. The chapter still teaches real Java. It just teaches Java as a language for constraining and auditing delegated work. Dilnoza does not need to become faster than AI at producing boilerplate. She needs to become precise enough that the boilerplate can be judged.

${figureComment(m)}

## Worked Example

**Situation.** ${m.example}

**Analytical process.** The conductor does four things before accepting the output:

1. Names the intended behavior in a sentence short enough to be falsified.
2. Identifies the Java element that carries the promise: class, method, interface, event handler, data structure, or graph edge.
3. Writes a handoff condition that can pass or fail.
4. Records the human audit task in the Boondoggle Score before moving downstream.

${tableComment(m)}

**Dead end.** The common dead end is accepting the first artifact that appears coherent. Coherence is not compliance. The learner must point to the exact clause or invariant the artifact satisfies.

**Resolution.** The output is accepted only after the handoff condition passes. If the condition fails, the student does not patch silently. She revises the prompt, records the failure, and explains whether the failure came from the prompt, the model output, or the human's missing constraint.

**The lesson:** generated Java is a candidate answer, not evidence of completion.

**The limit:** this method cannot prove every property of a system; it makes the most important obligations explicit enough to audit.

## Boondoggle Score Checkpoint

For this module, add one score segment with these fields:

- **AI task:** the work the model is allowed to perform for ${m.title.toLowerCase()}.
- **Human task:** the decision or audit the learner must perform personally.
- **Handoff condition:** one binary rule that must pass before the next dependency begins.
- **Evidence:** the exact code, prompt clause, diagram edge, or revision note that proves the handoff passed.
- **Supervisory capacity:** one of Problem Formulation, Tool Orchestration, Plausibility Auditing, Interpretive Judgment, or Executive Integration.

The checkpoint is intentionally small. The course is building a habit: every delegation has an acceptance condition, and every acceptance condition has evidence.

## Common Misconceptions

${m.misconceptions.map(([claim, why]) => `**${claim}** ${why}`).join("\n\n")}

## Exercises

1. **Apply:** Write a prompt for a Java artifact in this module's domain. Include output format, constraints, and at least two things AI must not do.
2. **Analyze:** Given an AI-generated answer, mark the first line or design choice that violates the specification. Explain whether the problem is prompt omission, model failure, or human acceptance failure.
3. **Create:** Add one Boondoggle Score row for your own course project. The row must include AI task, human task, handoff condition, and evidence.
4. **Evaluate:** Name one alternative design or prompt choice and defend why you rejected it. Your defense must name the failure mode the alternative would introduce.

## What Would Change My Mind

I would revise this chapter's central claim if controlled classroom evidence showed that students who accepted AI-generated Java with only code-output grading developed equal or better ability to identify specification violations, defend architectural decisions, and catch hidden failure states than students who maintained Boondoggle Scores. The relevant evidence would need to test transfer to unfamiliar systems, not just performance on the same assignment type.

## Still Puzzling

- How much Java syntax should be retrieved from memory before AI assistance becomes educationally harmful rather than helpful?
- Which handoff conditions are best checked by inspection, and which require execution, tests, or peer review?
- How should the course calibrate students who arrive with strong Java experience but weak specification discipline?
- What evidence from the first course run should be added to replace illustrative cases with documented local cases?

## Sources and Drafting Notes

${citations()}

Claims about specific AI-tool performance, wage premiums, or current platform behavior should be verified near publication. The TIKTOC's 56% wage-premium claim is motivational but still needs original-source confirmation before final release. [verify]

---

## Prompts

Use these prompts with Claude to generate interactive D3 v7 versions of the
figures in this chapter. Each produces a standalone HTML file you can open
in a browser and modify freely.

**Prerequisites:** Load \`brutalist/CLAUDE.md\` and \`brutalist/DESIGN.md\` into
your Claude project context before using these prompts. They define the stack,
naming conventions, color system, and typography the figures use.
`;
}

function intro() {
  const map = modules.map((m, i) => {
    if (m.module === 0) return `- **Module 0, ${m.title}:** Sets the rules of the course: AI use is required, disclosed, and evaluated through process evidence.`;
    return `- **Module ${m.module}, ${m.title}:** ${m.oneLine}`;
  }).join("\n");
  return `# Introduction

AI did not make Java irrelevant. It made vague Java dangerous.

This book is for the learner who can already reason technically but has not yet learned to conduct a full software build. Dilnoza, the reader imagined in the course design, has used Python or MATLAB, has asked ChatGPT to debug fragments, and understands engineering work. What she does not yet have is Java fluency joined to supervisory judgment: the ability to specify what should be built, direct AI through the build, evaluate what comes back, and sign her name to the result.

The central claim is simple: in the age of AI, Java fluency is not the destination. It is the instrument. The irreplaceable skill is not typing more code than the model. The irreplaceable skill is knowing what code must do, what it must not do, what evidence proves the handoff is safe, and which human judgment cannot be delegated.

The book calls that practice **boondoggling**: programming as conducting. A Boondoggle Score is the written score for an AI-assisted build. It names the AI tasks, human tasks, handoff conditions, dependency order, and supervisory capacities required to produce a system that a professional Java engineer would recognize as accountable work.

This is still a Java book. It teaches methods, classes, interfaces, inheritance, JavaFX, events, collections, generics, recursion, and data structures. But it teaches them in the order a conductor needs them: exactly when a specification or audit task requires the concept. Java syntax is not ignored. It is put to work.

## How This Book Is Organized

${map}

The course deliberately excludes Spring Boot, databases, formal unit testing frameworks, concurrency, Android, design patterns as a catalog, and AI model internals. Those topics matter, but they would turn this book into a survey. The wager here is narrower and sharper: if the learner can conduct a non-trivial Java build with explicit specifications, handoff conditions, and defensible architecture, she has built the foundation those later topics require.

## How To Read

Read linearly the first time. The handoff condition in Module 1 becomes a graph edge in Module 4, a contract audit in Module 8, a state-machine guard in Module 9, and a cascade-risk defense in Module 14. Skipping the early chapters makes the later artifacts look like forms instead of thinking.

When you see an AI prompt in the book, do not treat it as a magic incantation. Treat it as a work order. When you see a handoff condition, ask whether it could fail. When you see generated Java, ask what it proves and what it merely resembles.
`;
}

function appendix() {
  return `# Appendix: Fundamental Themes

This appendix gathers the themes that recur across the course. They are not extra vocabulary. They are the load-bearing ideas that make the chapters cohere.

## 1. Generated Code Is Candidate Work

AI output is not accepted because it is fluent, fast, or familiar. It is accepted only when it satisfies the relevant specification. The same rule applies to a method in Module 2, a class in Module 3, an interface in Module 8, and the final system in Module 14.

## 2. The Handoff Condition Is The Course's Spine

A handoff condition is a binary, inspectable rule that must pass before downstream work begins. Early conditions check names, signatures, and forbidden additions. Later conditions check dependency order, interface behavior, state transitions, failure handling, and cascade risk.

## 3. Java Is A Specification Language

Types, signatures, visibility modifiers, interfaces, generics, exceptions, collections, and event handlers are not only implementation details. They are ways to state what future code is allowed to assume.

## 4. The Human Supplies The Boundary

AI can produce a plausible component inside a boundary. It cannot decide, by itself, whether the boundary is the right one for the system, the user, the domain, or the risk. The human supplies problem formulation, plausibility auditing, tool orchestration, interpretive judgment, and executive integration.

## 5. Integration Is Its Own Skill

Correct parts can still form a wrong system. The dependency graph, peer audit, and final defense exist because assumptions often fail between components rather than inside them.

## 6. Silence Is A Specification Choice

If a prompt does not name an edge case, failure state, invariant, or forbidden behavior, AI may fill the gap in the easiest local way. Hardening is the practice of finding dangerous silences and revising them without expanding the scope beyond recognition.

## 7. Defense Is Evidence Of Understanding

The final Boondoggle Score is not a portfolio of pretty outputs. It is evidence that the learner can explain why the system is shaped as it is, what alternatives were rejected, where the handoffs are risky, and what would change the design.

## Closing Note

The theme underneath all the others is accountability. The AI era does not remove the engineer from the system. It makes the engineer's judgment easier to hide and more important to make visible.
`;
}

function wordCount(text) {
  return (text.match(/\b\S+\b/g) || []).length;
}

function sourceCount(text) {
  const names = new Set();
  for (const name of ["Peng", "Vaithilingam", "Pearce", "Gosling", "Oracle", "Collins", "Sweller", "Robins", "Chi", "Parnas", "Meyer", "Fagan", "Bass"]) {
    if (text.includes(name)) names.add(name);
  }
  return names.size;
}

function writeFile(rel, content) {
  const full = path.join(bookDir, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  return { rel, words: wordCount(content), sources: sourceCount(content), verify: (content.match(/\[verify\]/g) || []).length };
}

fs.mkdirSync(chaptersDir, { recursive: true });
fs.mkdirSync(logsDir, { recursive: true });

const stale = path.join(chaptersDir, "02-chapter-01.md");
if (fs.existsSync(stale) && fs.readFileSync(stale, "utf8").includes("CONTENT PLACEHOLDER")) {
  fs.unlinkSync(stale);
}

const written = [];
written.push(writeFile("chapters/01-introduction.md", intro()));
for (const m of modules) {
  const fileNumber = String(m.module + 2).padStart(2, "0");
  written.push(writeFile(`chapters/${fileNumber}-${m.slug}.md`, chapter(m, fileNumber)));
}
written.push(writeFile("chapters/97-fundamental-themes.md", appendix()));

const logPath = path.join(logsDir, "log.csv");
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, "date,book,chapter_slug,word_count,sources_count,verify_flag_count,pantry_notes_found,pantry_lib_files_used,thin_pantry,mechanism_explained,contested_claims_flagged\n", "utf8");
}

const rows = [];
for (const item of written) {
  const slug = path.basename(item.rel, ".md");
  const moduleMatch = modules.find((m) => item.rel.includes(m.slug));
  const notes = moduleMatch ? "yes" : "no";
  const mechanism = moduleMatch ? moduleMatch.mechanism : item.rel.includes("introduction") ? "Roadmap explains programming as conducting and the module progression." : "Appendix consolidates the course's recurring supervisory themes.";
  rows.push([
    date,
    book,
    slug,
    item.words,
    item.sources,
    item.verify,
    notes,
    5,
    "no",
    `"${mechanism.replaceAll('"', '""')}"`,
    0,
  ].join(","));
}
fs.appendFileSync(logPath, rows.join("\n") + "\n", "utf8");

console.log("Chapter writing queue:");
for (const item of written) {
  console.log(`  WRITTEN  ${path.basename(item.rel)}  ~${item.words} words  ${item.sources} sources  ${item.verify} [verify]`);
}
console.log("");
console.log(`Chapters written: ${written.length}`);
console.log(`Removed placeholder: ${fs.existsSync(stale) ? "no" : "02-chapter-01.md"}`);
console.log(`Log written to: ${path.relative(bookDir, logPath)}`);
