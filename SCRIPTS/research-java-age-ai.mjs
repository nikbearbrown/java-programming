import fs from "node:fs";
import path from "node:path";

const bookDir = path.resolve(path.join(import.meta.dirname, ".."));
const pantryDir = path.join(bookDir, "pantry");
const date = "2026-05-23";
const bookTitle = "Java in the Age of AI: A Conductor's Course";

const shared = {
  aiSources: [
    "Peng, Siddharth et al., \"The Impact of AI on Developer Productivity: Evidence from GitHub Copilot,\" arXiv, 2023. A controlled experiment useful for the book's solve/verify asymmetry claim: AI assistance can accelerate implementation, but the study does not prove that generated systems satisfy unstated requirements. For this course, the source supports treating AI as a speed multiplier that still needs human specification and review.",
    "Vaithilingam, Priyan et al., \"Expectation vs. Experience: Evaluating the Usability of Code Generation Tools Powered by Large Language Models,\" CHI Extended Abstracts, 2022. This study helps frame why novice and transitional programmers can over-trust plausible generated code. It gives chapter authors a research basis for emphasizing inspection, intent recovery, and prompt repair rather than output admiration.",
    "Pearce, Hammond et al., \"Asleep at the Keyboard? Assessing the Security of GitHub Copilot's Code Contributions,\" IEEE Symposium on Security and Privacy Workshops, 2022. This is a strong cautionary source for handoff conditions: generated code may be syntactically fluent while embedding hidden risk. Use it when the chapter needs to argue that verification must name failure modes, not simply check whether code runs.",
  ],
  pedagogySources: [
    "Collins, Allan, Brown, John Seely, and Newman, Susan, \"Cognitive Apprenticeship: Teaching the Crafts of Reading, Writing, and Mathematics,\" 1989. The course's conductor stance fits cognitive apprenticeship: expert thinking is made visible, practiced in authentic tasks, then gradually transferred to the learner. It supports case study plus Glimmer sequencing.",
    "Sweller, John, \"Cognitive Load During Problem Solving: Effects on Learning,\" Cognitive Science, 1988. The research supports reducing irrelevant load for a learner new to Java by giving structured specifications and worked examples before asking for open-ended design. It also supports separating Java syntax load from architectural judgment load.",
    "Robins, Anthony, Rountree, Janet, and Rountree, Nathan, \"Learning and Teaching Programming: A Review and Discussion,\" Computer Science Education, 2003. This review is useful across the book because it describes novice programming difficulties with tracing, abstraction, and mental models. It helps calibrate Dilnoza: she is not a blank beginner, but Java and object models are new representations.",
    "Chi, Michelene T. H. and Wylie, Ruth, \"The ICAP Framework,\" Educational Psychologist, 2014. ICAP supports moving students from passive reading to constructive and interactive work: auditing, defending, revising, and peer critique. It is especially relevant for Boondoggle Score defense and peer audit chapters.",
  ],
};

const modules = [
  {
    n: 0,
    title: "Welcome and Course Orientation",
    slug: "welcome-and-course-orientation",
    oneLine: "Orientation only — not a content module: faculty context, the AI+1 argument, Boondoggle Score preview, Medhavy workflow, and required AI-use integrity norms.",
    core: "course orientation, required AI use, academic integrity, and the Boondoggle Score as process evidence",
    sources: [
      "Collins, Brown, and Newman, \"Cognitive Apprenticeship,\" 1989. Orientation should make expert practice visible before students imitate it; the faculty bio and artifact preview can show what professional supervision looks like. This source supports naming the instructor's industry judgment as part of the learning environment rather than decorative context.",
      "Mollick, Ethan and Mollick, Lilach, \"Assigning AI: Seven Approaches for Students, with Prompts,\" SSRN, 2023. The paper helps structure required AI use without pretending AI is either banned or magic. It is useful for academic integrity language that distinguishes authorized tool use from outsourcing judgment.",
      "Bretag, Tracey et al., \"Contract Cheating and Assessment Design,\" Assessment & Evaluation in Higher Education, 2019. This supports the course's emphasis on process evidence: students must submit prompts, handoff conditions, audit logs, and defenses, not just finished artifacts. It helps the orientation explain why the Boondoggle Score is harder to fake than a code-only assignment.",
      "Peng et al., \"The Impact of AI on Developer Productivity,\" arXiv, 2023. Use cautiously: it supports that AI assistance can change developer workflow, not that students can skip learning. The orientation can frame the productivity claim as motivation for supervisory fluency.",
    ],
    cases: [
      "Required-tool course policy. Documented higher-ed responses to generative AI show that blanket bans are brittle when tools are embedded in standard workflows; this course instead makes use explicit and assessable. Appropriate because Dilnoza needs permission and boundaries before the first AI-assisted build.",
      "Process-evidence assessment. Writing courses and computing courses increasingly ask for drafts, prompts, logs, and reflections to distinguish learning from artifact submission. This is a documented assessment-design response rather than a Java-specific case; use it as an opening orientation example.",
    ],
    examples: [
      "A Medhavy onboarding activity where students upload a trivial AI prompt, its output, and a one-line handoff condition, then classify which evidence proves their own judgment.",
      "An academic integrity disclosure template for AI use in Java assignments: tool, prompt, output accepted/rejected, human verification performed, unresolved doubts.",
      "A preview Boondoggle Score with three rows: AI task, human audit task, and handoff condition, so students see the term artifact before learning Java details.",
    ],
    wayback: ["Grace Hopper", "Jean E. Sammet", "Alan Turing"],
    display: "A two-column orientation display should compare prohibited hidden AI use with required disclosed AI use: evidence submitted, accountable actor, and grading basis.",
  },
  {
    n: 1,
    title: "The Conductor's Frame",
    slug: "the-conductors-frame",
    oneLine: "Students learn to separate AI's job from their job — and produce their first Boondoggle Score for a trivial system.",
    core: "solve/verify asymmetry, supervisory capacity, problem formulation, prompt completeness, and binary handoff conditions",
    sources: [
      ...shared.aiSources,
      "Parnas, David L., \"On the Criteria To Be Used in Decomposing Systems into Modules,\" Communications of the ACM, 1972. Parnas gives the chapter a durable engineering lineage: the human job is to decide information hiding boundaries before implementation. It supports the idea that specifying what must be hidden, constrained, or checked is design work, not clerical prompt writing.",
      "Simon, Herbert A., The Sciences of the Artificial, 1969. Simon's distinction between inner environment, outer environment, and artifact behavior gives the problem formulation sentence intellectual backing. It helps separate the thing being built from the larger problem it lives inside.",
    ],
    cases: [
      "Copilot productivity experiment. Peng et al. found faster task completion in a controlled programming task, but the task did not answer whether developers specified enough or audited downstream design fit; this makes it suitable for the \"AI can build, you must conduct\" opening.",
      "Security-flawed generated code. Pearce et al. found generated code could contain security weaknesses, making it a concrete case where fluent output is not sufficient evidence. For this chapter, the insight is that the handoff condition must name the risk it is meant to catch.",
      "Illustrative: confident wrong Java greeting program. AI returns a program that compiles and prints something, but ignores a required command-line argument or localization constraint. Label this as illustrative unless the author creates a documented classroom artifact.",
    ],
    examples: [
      "A greeting program prompt where the student specifies class name, input source, output format, and forbidden behavior such as adding a GUI.",
      "A task manager snippet that passes a compile check but violates a stated priority-order rule.",
      "A Boondoggle Score row that labels AI as responsible for scaffold generation and the learner as responsible for scope, constraints, and acceptance.",
    ],
    wayback: ["Grace Hopper", "Herbert A. Simon", "Watts Humphrey"],
    display: "A three-column comparison display should contrast description, specification, and handoff condition for the same trivial Java task.",
  },
  {
    n: 2,
    title: "Java Foundations for Specification",
    slug: "java-foundations-for-specification",
    oneLine: "Students learn enough Java to write specifications that constrain AI generation — and to evaluate whether AI's output satisfied them.",
    core: "Java variables, methods, static typing, invariants, and method-level handoff conditions",
    sources: [
      "Gosling, James, Joy, Bill, Steele, Guy, Bracha, Gilad, Buckley, Alex, and Smith, Daniel, The Java Language Specification, Java SE 21 Edition, Oracle, 2023. The JLS is the authoritative source for types, variables, expressions, and method declarations. It lets the chapter distinguish Java facts from teaching simplifications.",
      "Oracle, Java SE 21 API Specification, 2023. The API docs are the correct reference for standard classes and method contracts students will see in generated code. Use it to teach that Java fluency includes reading specifications, not memorizing syntax.",
      "Robins, Rountree, and Rountree, \"Learning and Teaching Programming,\" 2003. This source supports the chapter's focus on tracing and invariants rather than isolated syntax drills. It helps explain why mechanically correct Java can still be behaviorally wrong.",
      "Meyer, Bertrand, Object-Oriented Software Construction, 2nd ed., 1997. Meyer's design-by-contract framing can be scaled down to method preconditions, postconditions, and invariants. It gives the handoff condition idea a formal vocabulary without requiring full Eiffel-style contracts.",
    ],
    cases: [
      "The Unauthorized ArrayList. Use as an illustrative but realistic AI-generation case: the spec says int[] because fixed-size storage is part of the lesson, but AI chooses ArrayList. The teaching question is whether the prompt under-specified constraints or the generator ignored them.",
      "Javadoc as contract. The standard Java API documentation routinely specifies parameters, returns, exceptions, and side effects; students can compare that practice to their own method prompts. This is documented in Oracle API pages and is accessible to Dilnoza.",
      "Robustness of generated Java methods. Copilot robustness studies that generate Java from Javadoc show how small prompt wording changes can produce different methods; this supports teaching exact method specifications.",
    ],
    examples: [
      "Specify a `parseTemperature(String raw)` method with accepted units, exception behavior, and rounding rule.",
      "Audit an AI-generated method for invariant violations: null handling, bounds, mutation of parameters, and return type mismatch.",
      "Translate Python habits into Java constraints: explicit types, checked/unchecked exceptions, and method signatures as commitments.",
    ],
    wayback: ["Jean E. Sammet", "Kathleen Booth", "Grace Hopper"],
    display: "A method-contract table should list parameter, allowed values, return, side effects, exceptions, and static/no-static rationale.",
  },
  {
    n: 3,
    title: "Objects as Specifications",
    slug: "objects-as-specifications",
    oneLine: "Students learn to specify classes as behavioral contracts — precise enough to be AI prompts, complete enough to constrain the object's entire lifecycle.",
    core: "classes, encapsulation, constructors, visibility, invariants, static versus instance state, and UML-level specification",
    sources: [
      "Booch, Grady, Object-Oriented Analysis and Design with Applications, 2nd ed., 1994. Booch is useful for class responsibility thinking: objects are not bags of fields, but units of state and behavior. It supports asking students to specify lifecycle and invariants before generation.",
      "Rumbaugh, James et al., Object-Oriented Modeling and Design, 1991. This source gives the chapter a modeling lineage for UML-like class descriptions. Use it to connect class diagrams to specification, not decoration.",
      "Meyer, Bertrand, Object-Oriented Software Construction, 1997. Design by contract directly supports constructor contracts, invariants, and visibility as enforcement mechanisms. It is especially helpful for explaining why public fields are not just style errors.",
      "Oracle, The Java Language Specification, Java SE 21, chapters on classes, fields, methods, and constructors, 2023. The JLS anchors Java-specific claims about members, initialization, static fields, and access control. It prevents the chapter from drifting into language-agnostic OOP advice.",
    ],
    cases: [
      "The public field disaster. A generated class with public mutable fields compiles and passes simple tests while allowing invalid states later. It is suitable as an opening because it exposes what method-level checks miss.",
      "The Singleton That Wasn't. Use as an illustrative AI-output case where shared static state is introduced accidentally. It helps students see the behavioral consequence of static versus instance decisions.",
      "JavaBeans-style encapsulation. Documented Java conventions around private fields and accessor methods provide a real-world example of class interface control, though the chapter should avoid treating conventions as laws.",
    ],
    examples: [
      "A `Task` class specification with private fields, constructor validation, status transition rules, and no public mutable collections.",
      "A class diagram row that includes responsibility, invariant, constructor contract, and forbidden static state.",
      "An audit checklist for AI-generated classes: visibility, constructor completeness, invariant preservation, and shared-state leaks.",
    ],
    wayback: ["Ole-Johan Dahl", "Kristen Nygaard", "Jean E. Sammet"],
    display: "A lifecycle diagram should show construction, valid state transitions, method calls that preserve invariants, and illegal states blocked by encapsulation.",
  },
  {
    n: 4,
    title: "The Software Design Document",
    slug: "the-software-design-document",
    oneLine: "Students produce a complete SDD Problem Summary and dependency-ordered build graph — the specification infrastructure that makes a multi-component Boondoggle Score possible.",
    core: "software design documents, problem summaries, architecture principles, dependency graphs, critical paths, and load-bearing nodes",
    sources: [
      "Parnas, David L., \"On the Criteria To Be Used in Decomposing Systems into Modules,\" Communications of the ACM, 1972. Parnas supports module boundaries as design decisions rather than file organization. For this chapter, it justifies dependency graphs and information-hiding constraints before AI generation.",
      "IEEE, ISO/IEC/IEEE 42010: Systems and Software Engineering — Architecture Description, 2011. The standard gives vocabulary for stakeholders, concerns, viewpoints, and architecture descriptions. It helps the chapter avoid making SDDs look like arbitrary school forms.",
      "Royce, Winston W., \"Managing the Development of Large Software Systems,\" IEEE WESCON, 1970. Royce is useful historically because it shows documentation and iteration concerns before modern agile framings. The chapter should use it carefully, not as a simplistic waterfall endorsement.",
      "Bass, Clements, and Kazman, Software Architecture in Practice, 4th ed., 2021. This text supports architecture as tradeoff reasoning under quality attributes. It gives the dependency graph exercise an engineering basis beyond project management.",
    ],
    cases: [
      "The ten-system problem. Illustrative classroom case: a vague project description that could produce a task tracker, reminder app, ticketing tool, or calendar. The research link is requirements ambiguity, not a specific industry failure.",
      "The orphaned component. Software architecture literature repeatedly treats traceability from requirements to components as a quality problem; use a component with no stated need as a concrete class exercise.",
      "NASA and safety-critical software documentation. Public NASA software assurance material can provide documented examples of why requirements traceability and design rationale matter, though it may be too heavyweight for Dilnoza.",
    ],
    examples: [
      "A three-component Java task manager graph: model, persistence adapter, console or JavaFX interface, each with prerequisite edges.",
      "An SDD Problem Summary test: could the same paragraph describe ten different systems? If yes, it is not yet a specification.",
      "A load-bearing node analysis where failure in the data model invalidates GUI and file I/O components.",
    ],
    wayback: ["Winston W. Royce", "David Parnas", "Margaret Hamilton"],
    display: "A dependency graph should show nodes, AI tasks, human audits, handoff conditions, prerequisites, and one highlighted critical path.",
  },
  {
    n: 5,
    title: "Inheritance and the Specification Contract",
    slug: "inheritance-and-the-specification-contract",
    oneLine: "Students learn to specify superclass/subclass relationships as behavioral contracts — and audit AI-generated hierarchies for the single most common OOP failure.",
    core: "inheritance, behavioral subtyping, Liskov Substitution Principle, override constraints, constructor chaining, and composition decisions",
    sources: [
      "Liskov, Barbara and Wing, Jeannette, \"A Behavioral Notion of Subtyping,\" ACM Transactions on Programming Languages and Systems, 1994. This is the foundational source for behavioral subtyping: a subtype must preserve expected behavior, not merely share method names. It directly supports the Square/Rectangle substitution failure.",
      "Bloch, Joshua, Effective Java, 3rd ed., 2018. Bloch's guidance on inheritance, composition, and overriding is practical and Java-specific. It helps translate LSP into advice students can apply when auditing generated Java.",
      "Gamma, Helm, Johnson, and Vlissides, Design Patterns, 1994. Use sparingly because design patterns are out of scope; the useful contribution here is the long-standing inheritance/composition tradeoff. The chapter should cite it only to support the idea that object relationships carry design consequences.",
      "Oracle, Java Language Specification, Java SE 21, sections on classes, inheritance, overriding, and `super`, 2023. This anchors constructor chaining and override rules in Java rather than generic OOP lore.",
    ],
    cases: [
      "Square extends Rectangle. The classic example is a teaching case rather than a production postmortem, but it is ideal for showing that compilation is not behavioral substitutability.",
      "Composition where polymorphism was required. Illustrative AI case: generated code wraps a payment method instead of implementing a common interface, preventing uniform handling. Label as illustrative unless replaced with a local classroom artifact.",
      "Java Collections hierarchy. The standard library gives documented examples of interfaces and implementations where substitutability is constrained by contracts such as optional operations.",
    ],
    examples: [
      "Specify `Vehicle` and `ElectricVehicle` with preserved invariants and one forbidden override behavior.",
      "Audit an AI hierarchy for weakened preconditions, strengthened postconditions, and side-effect changes.",
      "Ask students to defend inheritance versus composition by naming the failure mode each choice introduces.",
    ],
    wayback: ["Barbara Liskov", "Jeannette Wing", "Ole-Johan Dahl"],
    display: "A contract table should compare superclass invariant, subclass extension, forbidden override, and LSP audit evidence.",
  },
  {
    n: 6,
    title: "GUI as User Need Specification",
    slug: "gui-as-user-need-specification",
    oneLine: "Students translate user need statements into JavaFX component specifications — and produce a Boondoggle Score segment for a two-screen application.",
    core: "JavaFX, FXML, user needs, GUI component inventories, event handler contracts, and layout constraints",
    sources: [
      "Oracle, \"Introduction to FXML,\" JavaFX documentation, 2014. FXML is explicitly described as an XML-based way to construct Java object graphs, which makes it apt as a specification artifact. The chapter can use this to separate interface structure from controller behavior.",
      "OpenJFX Documentation, JavaFX event handling and controls, current project documentation. OpenJFX is the living source for JavaFX usage after JavaFX moved out of the JDK. Use it for current conventions while flagging that library versions age.",
      "Norman, Donald A., The Design of Everyday Things, revised ed., 2013. Norman supports mapping user needs to visible controls and feedback, though the chapter should keep the focus on JavaFX specification rather than general UX. It helps explain why GUI requirements are not decoration.",
      "Robins, Rountree, and Rountree, \"Learning and Teaching Programming,\" 2003. Event-driven programming and GUI frameworks increase cognitive load for novices; this source supports teaching handler contracts explicitly.",
    ],
    cases: [
      "The Missing Registration. Illustrative JavaFX case: handler method exists and is correct, but the control never registers it, so the button does nothing. This is appropriate because static code reading can miss behavior unless the handoff names registration.",
      "FXML/controller mismatch. Documented JavaFX practice separates FXML markup from controller methods; mismatched `fx:id` or handler names produce runtime failures. This is accessible and concrete for the target reader.",
      "Non-technical user need. A CLI may be technically functional but fail a user need requiring discoverability; use as a grounded scenario rather than empirical postmortem.",
    ],
    examples: [
      "Translate 'enter a maintenance request without reading documentation' into controls, labels, validation messages, and submit/cancel handlers.",
      "Specify a two-screen JavaFX flow with FXML files, controller names, event sources, and handler pre/postconditions.",
      "Audit AI-generated JavaFX for missing handler registration, wrong pane selection, and hardcoded values.",
    ],
    wayback: ["Douglas Engelbart", "Adele Goldberg", "Jean E. Sammet"],
    display: "A user-need-to-component matrix should list need, control, event source, handler contract, validation rule, and handoff condition.",
  },
  {
    n: 7,
    title: "Midpoint Integration: Boondoggle Score Part I",
    slug: "midpoint-integration-boondoggle-score-part-i",
    oneLine: "Students produce and peer-audit Boondoggle Score Part I — the complete specification for their Modules 1–6 system components.",
    core: "integration, peer audit, dependency ordering, completeness checks, revision history, and process evidence",
    sources: [
      "Fagan, Michael E., \"Design and Code Inspections to Reduce Errors in Program Development,\" IBM Systems Journal, 1976. Fagan inspections provide a research lineage for structured peer review. For this chapter, the key lesson is that review has roles, criteria, and artifacts; it is not casual opinion.",
      "Sommerville, Ian, Software Engineering, 10th ed., 2015. Sommerville gives accessible coverage of requirements, design, verification, and traceability. It supports the midpoint as an integration milestone rather than a content pause.",
      "Chi and Wylie, \"The ICAP Framework,\" 2014. Peer audit can move students into interactive learning if they explain, challenge, and revise. The chapter can use this to justify why students audit each other's Boondoggle Scores.",
      "Bretag et al., \"Contract Cheating and Assessment Design,\" 2019. Process evidence and revision history reduce the value of outsourced artifacts. This supports requiring audit logs and dependency verification.",
    ],
    cases: [
      "Peer review catches missing dependency. Illustrative classroom case: GUI prompt assumes a model method that has not been specified. The review activity exposes an integration fault before AI generation.",
      "Software inspections. Fagan's documented inspection process reduced defects in industrial software; the exact numbers should be verified before drafting, but the conceptual case is strong.",
      "Portfolio assembly failure. Educational portfolio research shows final artifacts can hide uneven process; requiring revision history makes the integration work visible.",
    ],
    examples: [
      "A Score Part I completeness checklist with problem summary, architecture principles, dependency graph, prompts, handoff conditions, and labeled human tasks.",
      "A peer audit protocol with three required findings: one prompt completeness issue, one handoff testability issue, one dependency ordering issue.",
      "A revision log entry format: issue found, evidence, change made, residual risk.",
    ],
    wayback: ["Michael Fagan", "Watts Humphrey", "Margaret Hamilton"],
    display: "A peer-audit dashboard should show each component against prompt completeness, handoff testability, dependency order, and revision status.",
  },
  {
    n: 8,
    title: "Abstract Contracts and Interface Specifications",
    slug: "abstract-contracts-and-interface-specifications",
    oneLine: "Students learn to specify behavioral contracts without presupposing implementation — the hardest specification skill in the course.",
    core: "interfaces, abstract classes, behavioral contracts, preconditions, postconditions, invariants, and interchangeable implementations",
    sources: [
      "Meyer, Bertrand, Object-Oriented Software Construction, 1997. Design by contract is the chapter's core intellectual ancestor. It gives students terms for preconditions, postconditions, and invariants without tying the idea to a single Java implementation.",
      "Liskov and Wing, \"A Behavioral Notion of Subtyping,\" 1994. Interface satisfaction is behavioral, not just syntactic. The chapter can use this source to explain why two classes with the same signatures may not both satisfy the contract.",
      "Oracle, Java Language Specification, Java SE 21, sections on interfaces and abstract classes, 2023. This source grounds Java-specific distinctions such as default methods, abstract methods, and inheritance of interface members.",
      "Bloch, Effective Java, 3rd ed., 2018. Bloch's Java guidance helps students avoid overusing abstract classes or leaking implementation assumptions into interfaces.",
    ],
    cases: [
      "The Null Return. AI returns `null` when the contract required an empty list. This is a strong case because tests may pass until the empty-input branch appears.",
      "Two Sortable implementations. Illustrative exercise: both compile against the same interface; one mutates input unexpectedly or mishandles duplicates. The behavioral audit reveals the contract gap.",
      "Java Collections contracts. The Java API documents behavioral expectations for interfaces such as `List`, `Set`, and `Map`, making them real-world examples of interface-plus-contract.",
    ],
    examples: [
      "Specify `DataImporter<T>` with method signatures, input preconditions, postconditions, exception behavior, and non-null guarantees.",
      "Compare interface versus abstract class for a family of validators: shared state required or pure behavioral role?",
      "Audit two generated implementations against clauses rather than against personal preference.",
    ],
    wayback: ["Barbara Liskov", "Bertrand Meyer", "Jean Ichbiah"],
    display: "A contract clause table should list signature, precondition, postcondition, invariant, allowed exception, and implementation freedom.",
  },
  {
    n: 9,
    title: "Event-Driven Specification",
    slug: "event-driven-specification",
    oneLine: "Students specify event-driven components as state machines — and audit AI-generated handler sequences for behavioral failures that compile-time checks cannot catch.",
    core: "events, handlers, state machines, guard conditions, registration scope, duplicate events, and behavioral sequence audits",
    sources: [
      "Harel, David, \"Statecharts: A Visual Formalism for Complex Systems,\" Science of Computer Programming, 1987. Harel gives the chapter a formal lineage for representing event-driven behavior beyond linear code. Use a simplified subset: states, transitions, events, guards, and actions.",
      "Oracle/OpenJFX documentation on JavaFX event handling. The docs provide the concrete JavaFX vocabulary: event source, event target, handler, filter, and registration. This lets students connect diagrams to real Java code.",
      "Gamma et al., Design Patterns, 1994. Use carefully for observer/event-dispatch vocabulary, not for pattern memorization. It helps explain why registration location and lifecycle matter.",
      "Robins, Rountree, and Rountree, 2003. Event-driven programming is a known conceptual hurdle for learners because control flow is inverted. This supports explicit state-machine instruction.",
    ],
    cases: [
      "The button that fires twice. Illustrative JavaFX case: no guard prevents duplicate submission, so a correct handler body causes double effects.",
      "The Accumulating Handler. A handler registered inside another handler creates repeated registrations. This is realistic and easy to reproduce in a small JavaFX app.",
      "Finite state machine validation. Documented statechart practice shows that explicit transitions expose missing edge cases; use this as the research-backed rationale for the audit.",
    ],
    examples: [
      "Specify a submit workflow with states `EMPTY`, `VALID`, `SUBMITTING`, `SUBMITTED`, `ERROR`, and guard conditions.",
      "Audit AI handler code for null checks, registration scope, duplicate submission guards, and encapsulation-violating state mutations.",
      "Write a handoff condition that can be checked by reading the state transition table before running the app.",
    ],
    wayback: ["David Harel", "Edsger W. Dijkstra", "Douglas Engelbart"],
    display: "A state machine diagram should include states, event names, guard conditions, state mutations, and no-op transitions.",
  },
  {
    n: 10,
    title: "Generics, Collections, and Type-Safe Specification",
    slug: "generics-collections-and-type-safe-specification",
    oneLine: "Students specify type-safe data structures and choose the correct Collection for a given access pattern — architectural decisions visible in the Boondoggle Score.",
    core: "generics, type bounds, type erasure, wildcards, collections, access patterns, iterator contracts, and performance consequences",
    sources: [
      "Bracha, Gilad et al., \"Making the Future Safe for the Past: Adding Genericity to the Java Programming Language,\" OOPSLA, 1998. This source explains the compatibility pressure behind Java generics and erasure. It helps the chapter teach type erasure as a design compromise, not a random annoyance.",
      "Naftalin, Maurice and Wadler, Philip, Java Generics and Collections, 2006. This is a practical foundational text for wildcards, bounds, and collection choice. It can support precise examples without overloading students with type theory.",
      "Oracle, Java Tutorials and Java SE API docs for Collections Framework. The official docs specify interfaces, contracts, and performance notes for `List`, `Set`, `Map`, and queues. Use them as the primary reference students can actually consult.",
      "Bloch, Effective Java, 3rd ed., 2018. Bloch offers Java-specific guidance on generics, unchecked warnings, and APIs. It supports the chapter's warning that suppressing warnings is a decision requiring justification.",
    ],
    cases: [
      "The O(n) Lookup. Use as an illustrative performance case: `ArrayList` works at 100 items but collapses at 100,000 for lookup-heavy workloads. It is accessible and directly tied to collection selection.",
      "Unchecked cast warning ignored. AI generates raw types or unchecked casts that compile with warnings; later a `ClassCastException` appears. This is a realistic code-generation audit case.",
      "Java Collections API. The API documentation itself is a case in contract-rich interfaces: choosing `Map` over `List` declares lookup intent.",
    ],
    examples: [
      "Specify `Repository<T extends Identifiable>` with uniqueness, lookup by id, and no raw type warnings.",
      "Map access patterns to collections: append-heavy, lookup-heavy, uniqueness-required, ordered traversal, priority retrieval.",
      "Audit generated code for wildcard misuse, unchecked casts, raw types, and erasure assumptions.",
    ],
    wayback: ["Philip Wadler", "Barbara Liskov", "Edsger W. Dijkstra"],
    display: "A collection-choice matrix should list operation profile, required invariant, candidate collection, performance consequence, and failure if chosen incorrectly.",
  },
  {
    n: 11,
    title: "Recursion as Problem Decomposition",
    slug: "recursion-as-problem-decomposition",
    oneLine: "Students specify recursive methods as decomposition contracts and audit AI-generated recursion for the three failure modes specification silence produces.",
    core: "recursive decomposition, base cases, reduction steps, termination invariants, stack depth, and recursive-versus-iterative judgment",
    sources: [
      "Polya, George, How to Solve It, 1945. Polya supports decomposition and solving a smaller related problem, which is the intuitive bridge into recursion. It is useful for Dilnoza because she likely knows mathematical problem solving better than Java recursion.",
      "Dijkstra, Edsger W., \"Notes on Structured Programming,\" 1972. Dijkstra's discipline around program structure and reasoning supports treating recursion as a proof obligation. The chapter can use this lineage without requiring formal verification.",
      "Cormen, Leiserson, Rivest, and Stein, Introduction to Algorithms, 4th ed., 2022. CLRS gives stable coverage of recursion, recurrence thinking, and algorithmic tradeoffs. Use it for decomposition examples and complexity language.",
      "Robins, Rountree, and Rountree, 2003. Recursion is a persistent learner difficulty because students often memorize templates without tracing base and recursive cases. This source supports visual tracing and explicit failure-mode audits.",
    ],
    cases: [
      "The stack that overflows in production. Illustrative Java case: recursive traversal works on small inputs but fails at maximum realistic depth. The chapter's lesson is that max input size belongs in the specification.",
      "The Missing Empty Check. AI handles `null` but not empty list, leading to non-termination or wrong result. It is a clean audit exercise.",
      "Directory traversal. Real Java file-tree traversal is a documented recursion use case; it also exposes cycles, permissions, and depth limits.",
    ],
    examples: [
      "Specify recursive file count: base case, reduction step, ignored files, maximum depth, and error behavior.",
      "Audit generated recursion for missing base case, non-shrinking input, and stack overflow conditions.",
      "Defend recursion versus iteration with stack depth, readability, and maximum safe input size.",
    ],
    wayback: ["George Polya", "Edsger W. Dijkstra", "John McCarthy"],
    display: "A recursive decomposition display should show original problem, base case, reduction step, termination invariant, and stack-depth bound.",
  },
  {
    n: 12,
    title: "Data Structures as Architectural Decisions",
    slug: "data-structures-as-architectural-decisions",
    oneLine: "Students specify data architecture requirements by access pattern — and produce the data architecture segment of their Boondoggle Score.",
    core: "data architecture, access pattern specifications, collection selection, ordering, uniqueness, invariants, and load behavior",
    sources: [
      "Cormen, Leiserson, Rivest, and Stein, Introduction to Algorithms, 4th ed., 2022. CLRS anchors time complexity and data structure tradeoffs in stable algorithmic analysis. For this chapter, use it to support access-pattern reasoning rather than formal proofs.",
      "Sedgewick, Robert and Wayne, Kevin, Algorithms, 4th ed., 2011. This provides Java-adjacent examples for symbol tables, sorting, searching, and graphs. It helps connect abstract structures to Java implementation choices.",
      "Oracle, Java SE API documentation for Collections Framework, current version. The API docs are the primary source for collection contracts, ordering guarantees, and allowed operations. Students should learn to cite them when defending architecture choices.",
      "Bass, Clements, and Kazman, Software Architecture in Practice, 2021. This source supports treating data structures as architecture because they affect performance, modifiability, and failure modes. It helps the chapter connect local code choices to system behavior.",
    ],
    cases: [
      "The Missing Uniqueness Constraint. Use as an illustrative Java storage case: `ArrayList<Student>` permits duplicates unless uniqueness is enforced elsewhere. The failure is architectural, not syntactic.",
      "Same functionality, different load behavior. A lookup-heavy feature using a list versus a map gives identical small tests and divergent large-input performance. This is the core worked example.",
      "Domain invariants in data models. Public software engineering texts treat invariants and constraints as central to data design; use this to justify domain-invariant audit tasks.",
    ],
    examples: [
      "Specify a student roster by access patterns: lookup by id, sorted display by name, no duplicate id, frequent inserts.",
      "Identify the three highest-impact data structure decisions in a task manager: task id lookup, priority ordering, completed-task archive.",
      "Write a handoff condition that checks collection declarations and invariant enforcement before accepting AI schema generation.",
    ],
    wayback: ["Donald Knuth", "Robert Tarjan", "Frances E. Allen"],
    display: "A data-architecture table should map operation, frequency, invariant, collection choice, complexity, and cascade risk.",
  },
  {
    n: 13,
    title: "Hardening: Edge Cases and Failure States",
    slug: "hardening-edge-cases-and-failure-states",
    oneLine: "Students find the failure states their specifications never named — and discover that unspecified failure states are not the AI's responsibility to handle.",
    core: "edge cases, failure states, risk triage, prompt revision, regenerated components, and hardened handoff conditions",
    sources: [
      "Leveson, Nancy, Engineering a Safer World, MIT Press, 2011. Leveson's systems safety framing supports looking for hazards that arise from interactions and control gaps, not only local defects. The chapter can adapt this to software failure-state thinking without becoming a safety engineering course.",
      "Reason, James, Human Error, Cambridge University Press, 1990. Reason's model of latent conditions and active failures helps explain why unspecified failure states are normal, not personal incompetence. It supports a calm hardening tone.",
      "Pearce et al., \"Asleep at the Keyboard?\" 2022. Generated code can embed unsafe defaults, making security and failure handling a verification responsibility. This is especially relevant for swallowed exceptions and silent data loss.",
      "Fagan, \"Design and Code Inspections,\" 1976. Structured inspection supports systematic failure-state enumeration and prompt revision. Use it to avoid ad hoc edge-case brainstorming.",
    ],
    cases: [
      "The Silent Data Loss. Illustrative Java case: `IOException` is caught and swallowed, so the user believes data was saved. This is apt because the generated code may look defensive while violating the actual user need.",
      "Security weaknesses in generated code. Pearce et al. supply empirical grounding that generated code can contain serious failure modes. Use the case carefully: security is not the chapter's whole scope, but it proves plausibility is not enough.",
      "NASA hazard analysis materials. Public safety-engineering examples show how failure states are enumerated before operation; use as analogy, not as a requirement for this introductory course.",
    ],
    examples: [
      "Enumerate five failure categories for a Java file-writing component: missing file, permission failure, partial write, malformed input, silent exception.",
      "Revise a prompt to add three Must-Fix failures without expanding scope.",
      "Triage edge cases into Must-Fix, Important for v2, Nice-to-Have with production consequence evidence.",
    ],
    wayback: ["Nancy Leveson", "James Reason", "Margaret Hamilton"],
    display: "A failure-state triage grid should include failure, trigger, consequence, current prompt coverage, triage category, and revised handoff condition.",
  },
  {
    n: 14,
    title: "Final Boondoggle Score: Defense",
    slug: "final-boondoggle-score-defense",
    oneLine: "Students complete, finalize, and defend their Boondoggle Score — demonstrating that architectural decisions reflect genuine engineering judgment, not formatted compliance.",
    core: "portfolio synthesis, architectural decision defense, cascade analysis, highest-risk handoffs, and supervisory judgment",
    sources: [
      "Schön, Donald A., The Reflective Practitioner, 1983. Schön supports the final reflection and defense: professionals reason in action and explain judgments under uncertainty. The chapter can use this to frame defense as evidence of learning, not performance theater.",
      "Bass, Clements, and Kazman, Software Architecture in Practice, 2021. Architecture defense requires tradeoff reasoning; this source gives the chapter language for quality attributes, alternatives, and consequences.",
      "Fagan, \"Design and Code Inspections,\" 1976. Inspection practice supports the final review of highest-risk handoffs and cascade paths. It also legitimizes challenger questions as engineering practice.",
      "Chi and Wylie, \"The ICAP Framework,\" 2014. The final defense is interactive and constructive: students explain, respond, revise, and justify. This supports the assessment design as learning, not only evaluation.",
    ],
    cases: [
      "Return to the pebble. The Module 1 task manager returns at equivalent complexity; students now find all violations. This is a course-internal empirical case if instructors collect before/after evidence.",
      "Architecture tradeoff review. Industrial architecture reviews commonly require alternatives and consequences; Bass et al. provide the documented practice base. Use it to structure the 15-minute defense.",
      "Portfolio assessment. Process portfolios in education show development over time; the Boondoggle Score should include early drafts and revisions, not just polished final rows.",
    ],
    examples: [
      "A final defense slide or page naming three consequential decisions, rejected alternatives, and the failure each alternative introduces.",
      "A cascade path analysis from bad data model handoff to GUI misinformation to saved corrupted output.",
      "A 500-word synthesis prompt comparing what the student could not specify in Module 1 with what they can specify now.",
    ],
    wayback: ["Donald Schön", "Margaret Hamilton", "Frances E. Allen"],
    display: "A defense matrix should list decision, alternative, reason chosen, failure mode avoided, evidence in Score, and challenger question.",
  },
];

function waybackSection(names, core) {
  return names.map((name) => {
    const prompt = `Imagine ${name} reviewing a student's Java AI handoff for ${core}. Ask what evidence proves the human understood the specification rather than merely accepted generated code.`;
    return `- **${name}** — Candidate for the intellectual lineage of ${core}. Connection: use this figure to link the chapter's specification practice to older work on programming languages, software engineering, human-computer systems, or professional judgment. Selection criteria: Wikipedia-accessible; check final eligibility before portrait selection because some figures' foundational work is pre-2001 even when their lives or later publications extend beyond 2000. Example prompt: "${prompt}"`;
  }).join("\n");
}

function section2(m) {
  return `### What is settled
The settled core is that Java specifications live in multiple layers: syntax and type rules, API contracts, design constraints, and user-visible behavior. Official Java specifications and API documentation establish the language-level facts, while software engineering research establishes that decomposition, contracts, and review are design practices rather than clerical details. For this chapter, the author can state confidently that generated code must be judged against the specification that should have constrained it.

### What is disputed
The disputed issue is not whether AI tools can generate useful code; they often can. The open question is how much supervision is enough for novices and near-novices, especially when output is plausible, compiles, or passes narrow tests. The chapter should avoid implying that prompt quality alone guarantees correctness; empirical work on code generation suggests generated code quality varies by task, context, and user expertise.

### What has changed recently (last 5 years)
AI coding assistants have shifted the entry task from blank-page coding toward specification, review, and integration. Java itself has also continued evolving, with Java 21 now a major reference point for current language and platform behavior. Any tool-specific claim about Copilot, ChatGPT, IDE integrations, JavaFX distribution, or model quality should be treated as high-aging-risk and verified close to publication.`;
}

function pedagogy(m) {
  return `Dilnoza brings programming exposure from Python and MATLAB but not Java, object modeling, or full AI-assisted builds. The prior knowledge required is therefore not "knows Java"; it is "can reason about inputs, outputs, constraints, and failure." Common misconceptions are that compiling means satisfying the specification, that a prompt is a wish rather than a contract, and that AI output quality can be judged by style or confidence.

The best instructional sequence is worked-example first, audit second, produce third. Cognitive apprenticeship supports making expert judgment visible before students are asked to perform it independently. Worked examples reduce extraneous load while students acquire Java vocabulary. ICAP suggests the strongest learning will happen when students explain, revise, and defend a Boondoggle Score, not when they merely read a correct answer.

Teaching failure modes: overloading the chapter with syntax, letting students treat AI as an answer key, and grading only the final code artifact. Students who understand the concept can point to a clause, invariant, graph edge, or failure state and explain why it matters. Students who merely memorize can recite terms but cannot catch a generated output that violates the chapter's core contract.`;
}

function fileContent(m) {
  return `# Research: Chapter ${String(m.n).padStart(2, "0")} — ${m.title}
## ${bookTitle}

**Chapter one-line:** ${m.oneLine}
**Research date:** ${date}

---

## 1. Primary Sources

### Foundational papers and texts
${m.sources.map((s) => `- ${s}`).join("\n")}

### Key empirical cases
${m.cases.map((s) => `- ${s}`).join("\n")}

---

## 2. The Core Concept — State of the Field

${section2(m)}

---

## 3. Application Domain Examples

${m.examples.map((s) => `- ${s}`).join("\n")}

---

## 4. The Book's Thesis Connection

This chapter contributes to the book's thesis by making ${m.core} into a supervisory practice. The central claim of the course is that Java fluency is now the foundation for directing, evaluating, and owning AI-assisted builds; this chapter supplies one piece of that fluency.

In the Boondoggle Score, the student's own expertise must supply boundaries, invariants, tradeoffs, and acceptance evidence. A tool can propose code or prose, but it cannot know which failure would matter in the student's system unless the student names the requirement and checks the result.

The research literature supports the thesis in a calibrated way. AI coding studies support productivity and usefulness claims, but security, robustness, and usability studies show why output still needs human review. Software engineering sources on contracts, decomposition, inspection, and architecture support the course's stronger claim: the enduring skill is not typing Java fastest, but specifying and defending the system well enough that generated Java can be trusted only after audit.

---

## 5. The AI Wayback Machine — Candidate Figures

${waybackSection(m.wayback, m.core)}

Diversity note: this shortlist should be balanced across the full book. Computing history skews heavily toward U.S. and Western European men in the canonical sources; deliberately preserve candidates such as Grace Hopper, Jean E. Sammet, Frances E. Allen, Margaret Hamilton, Adele Goldberg, and Kathleen Booth where they fit the substance.

---

## 6. Pedagogical Delivery Research

${pedagogy(m)}

---

## 7. Representation and Display Research

${m.display}

---

## 8. Open Questions and Research Gaps

- Verify all current AI-tool claims within three months of publication; model behavior, IDE integrations, licensing, and institutional policies age quickly.
- Source exact adoption or wage-premium statistics from the original report before drafting. The TIKTOC mentions a 56% premium; the research file does not independently verify that number.
- Replace illustrative cases with local classroom artifacts where possible after the first course run.
- Determine whether the final book should cite Java 21, Java 25, or another LTS/current release depending on publication timing.
- For any chapter using JavaFX, confirm the target runtime and packaging expectations; JavaFX versioning and distribution are higher-aging-risk than core Java language concepts.

---

## 9. Sourcing Notes

Primary Java facts should come from the Java Language Specification, JVM Specification, Java SE API docs, and OpenJFX documentation. AI coding assistant evidence should cite papers directly rather than vendor marketing. Pedagogy claims can rely on cognitive apprenticeship, cognitive load, ICAP, and programming-education reviews. Some sources listed here are books or standards that may be paywalled or library-access only; mark page-level citations during drafting.
`;
}

fs.mkdirSync(pantryDir, { recursive: true });

for (const m of modules) {
  const nn = String(m.n).padStart(2, "0");
  const file = path.join(pantryDir, `research-ch-${nn}-${m.slug}.md`);
  fs.writeFileSync(file, fileContent(m), "utf8");
  console.log(`wrote ${path.relative(bookDir, file)}`);
}

console.log(JSON.stringify({
  written: modules.length,
  strongest: ["05 inheritance", "08 abstract contracts", "10 generics/collections", "12 data structures"],
  weakest: ["00 orientation", "07 midpoint integration", "14 final defense"],
  priorityGap: "Verify current AI-tool/wage-premium claims and replace illustrative classroom cases after first run.",
}, null, 2));
