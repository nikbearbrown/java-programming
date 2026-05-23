# Appendix: Fundamental Themes

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
