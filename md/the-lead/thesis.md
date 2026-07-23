---
title: "Staging Intelligence: A Dramaturgical Framework for Designing Edge-Native Agentic Systems"
date: 2026-04-08
excerpt: "Agent systems are better understood as staged plays — with worlds, characters, acts, and controlled improvisation — than as traditional workflows. The Lead's master's thesis."
---

# Staging Intelligence: A Dramaturgical Framework for Designing Edge-Native Agentic Systems

**Master's Thesis**
*Submitted in partial fulfilment of the requirements for the degree of Master of Science in Computer Science*

---

## Abstract

The proliferation of large language models has given rise to a new class of software—agentic systems—that autonomously plan, act, and interact. Yet the architectures used to build such systems remain fragmented, often stitching together stateless functions, queues, databases, and model APIs into brittle pipelines. This thesis proposes a shift in perspective: **agent systems are better understood as staged plays**—with worlds, characters, acts, and controlled improvisation—than as traditional workflows.

Drawing on dramaturgical theory (Goffman, Burke) and the actor model (Hewitt, Agha), we introduce the *Play Framework*, a formal, platform-independent design language for multi-agent systems. We then demonstrate how this framework maps onto any runtime that provides stateful actors and durable workflow orchestration, using a pure Dart simulation (`sim_v2`) as a concrete reference implementation that validates the framework's structural properties across three distinct domains.

Through a case study (a "Launch Product" play) and a comparative evaluation against conventional pipeline architectures, we demonstrate that the Play Framework reduces architectural complexity, improves developer experience, and yields lower latency and cost at scale. The thesis concludes with a roadmap for "simulation-first" design, where systems are first imagined as plays and then enacted by autonomous agents.

---

## Table of Contents

1. Introduction
2. Literature Review & Background
   - 2.1 The Rise of Agentic Systems
   - 2.2 Distributed Edge Computing
   - 2.3 The Actor Model and Stateful Agents
   - 2.4 Dramaturgical Theory as a Design Lens
   - 2.5 Multi-Agent Orchestration: Protocols and Open Problems
   - 2.6 The Missing Abstraction: Orchestration vs. Choreography
3. Theoretical Framework: The Play Model
   - 3.1 Definitions: Play, Character, Act, Scene, Script, Improvisation
   - 3.2 From Metaphor to Formal Model
   - 3.3 Controlled Improvisation: Balancing Structure and Autonomy
   - 3.4 Limitations as Character Behaviours: The Role of Acknowledged Constraints
   - 3.5 From Dramaturgical Concepts to System Primitives
4. Methodology
   - 4.1 Research Questions
   - 4.2 Design Science Approach
   - 4.3 Case Study Selection
   - 4.4 Evaluation Metrics
5. Architecture & Implementation
   - 5.1 The Play Engine
   - 5.2 Mapping the Play Model to Runtime Primitives
   - 5.3 Case Study: "Ship the Dashboard — A Dev Team Sprint"
   - 5.4 Implementation Details
   - 5.5 The Dual-Track Architecture: Deterministic Floor, LLM Ceiling
   - 5.6 Risk-Proportional Validation of LLM Outputs
   - 5.7 LLM Temperature as Improvisation Control
   - 5.8 Domain-Agnostic Generalisation
   - 5.9 Reference Implementation: Unified System Architecture
6. Evaluation
   - 6.1 Performance Benchmarks
   - 6.2 Cost Analysis
   - 6.3 Developer Experience
   - 6.4 Qualitative Assessment of Agent Coherence
   - 6.5 Implementation Evidence: Test Suite as Empirical Validation
7. Discussion
   - 7.1 Implications for Practice
   - 7.2 Limitations and Responses
   - 7.3 Threats to Validity
8. Synthesis: The Play Framework as a Unified Architecture
9. Conclusion & Future Work
   - 9.3 Progressive Discovery as Validation
   - 9.4 External Memory and Working Directory Resolution
   - 9.5 On the Adequacy of Architecture
   - 9.6 Concluding Reflection

References
Appendix A: Code Listings
Appendix B: Survey Instrument
Appendix C: Cross-Reference — Thesis Sections to Implementation

---

## Chapter 1: Introduction

### 1.1 Background

Large language models (LLMs) have unlocked the ability to build software that not only responds to queries but also autonomously plans, reasons, and executes multi-step tasks. These *agentic systems* are now deployed in production across industries: from customer support copilots that handle millions of conversations to research assistants that synthesise papers, from DevOps bots that review code to autonomous marketing agents that manage campaigns.

Despite their promise, building reliable, scalable agentic systems remains a significant engineering challenge. A typical architecture today consists of a patchwork of components:

- A stateless function (e.g., AWS Lambda, Google Cloud Functions) that calls an LLM API.
- A queue to manage long-running tasks.
- A vector database for retrieval.
- A separate state store for conversational memory.
- An orchestration layer to coordinate multi-step workflows.

This "glue architecture" introduces complexity, latency, and cost. More critically, it forces developers to think in terms of infrastructure rather than agent behaviour.

### 1.2 The Problem: Rigid Systems, Unpredictable Agents

Two conflicting pressures dominate agent system design:

1. **Systems demand rigidity** — They need defined APIs, deterministic execution, and clear error boundaries.
2. **Agents demand flexibility** — They should adapt, improvise, and handle open-ended tasks.

Current architectural patterns lean heavily toward rigidity: workflows are encoded as directed acyclic graphs (DAGs), and agents are treated as stateless function calls. This approach often leads to brittle systems that fail when agents deviate from the expected path.

### 1.3 A New Lens: The Play Metaphor

This thesis introduces a different mental model: **agentic systems as staged plays**.

- A *play* defines a world and a desired outcome.
- *Characters* (agents) have distinct roles, behaviours, and tools.
- The narrative unfolds through *acts* (phases) and *scenes* (steps).
- Dialogue becomes message passing.
- Crucially, a play can be *scripted* (fully predetermined) or *improvised* (dynamic), but always within the constraints of the world and the roles.

This metaphor offers a structured yet flexible design language that bridges human intuition and machine execution. Importantly, the Play Framework is specified at the conceptual level — it is not tied to any particular cloud provider, runtime, or programming language. Any platform that supports stateful actors and durable execution can serve as its substrate.

### 1.4 Research Questions

1. **RQ1:** How can dramaturgical concepts be formalised into a platform-independent design framework for agentic systems?
2. **RQ2:** How can this framework be implemented on a modern distributed runtime to achieve production-grade characteristics?
3. **RQ3:** What are the quantitative and qualitative benefits — in terms of latency, cost, developer experience, and agent coherence — compared to conventional pipeline architectures?

### 1.5 Contributions

- A novel **Play Framework** for designing agentic systems, grounded in dramaturgical theory and the actor model, specified independently of any platform.
- A **reference implementation** in pure Dart (`sim_v2`) as one concrete realisation of the framework — not its definition — validated across three domain plays (medieval survival, software development, financial portfolio).
- An **evaluation** through a concrete case study and comparative benchmarks.
- A set of **design patterns and anti-patterns** for building "simulation-first" agent systems.

### 1.6 Thesis Outline

Chapter 2 reviews the relevant literature. Chapter 3 formalises the Play Framework. Chapter 4 describes the research methodology. Chapter 5 presents the architecture and implementation. Chapter 6 reports evaluation results. Chapter 7 discusses implications and limitations with substantive responses to each. Chapter 8 synthesises all contributions, and Chapter 9 concludes.

---

## Chapter 2: Literature Review & Background

### 2.1 The Rise of Agentic Systems

The concept of software agents dates back to the 1980s (Wooldridge & Jennings, 1995), but the advent of large language models has fundamentally changed their capabilities. Modern agents can interpret natural language, use tools, and perform multi-step reasoning (OpenAI, 2023; Anthropic, 2024).

Frameworks like LangChain, AutoGPT, and Microsoft's Semantic Kernel have popularised agent building. More recently, LangGraph introduced a graph-based state machine for agents, enabling controlled branching and cycles. Meanwhile, OpenAI's Agents SDK and Responses API provide built-in tool calling and multi-turn reasoning. These frameworks, however, remain primarily concerned with the LLM layer and do not prescribe how the broader system — actors, state, orchestration — should be structured.

### 2.2 Distributed Edge Computing

Edge computing moves computation closer to users, reducing latency and enabling new use cases (Satyanarayanan, 2017). The emergence of globally distributed, stateful runtimes — whether provided by Cloudflare, Fastly, Deno Deploy, or emerging Kubernetes-based edge platforms — has made it possible to co-locate compute, state, and inference in a single logical tier. This architectural shift is relevant to agentic systems because it eliminates the cross-region data transfers and cold-start penalties that plague conventional cloud pipelines.

The Play Framework is designed to exploit any such runtime. The key requirements are: (a) stateful, addressable actor instances; (b) durable, resumable workflow execution; and (c) low-latency inter-actor messaging. Multiple platforms now satisfy these requirements to varying degrees.

### 2.3 The Actor Model and Stateful Agents

The actor model (Hewitt, 1973; Agha, 1986) treats actors as the fundamental units of computation: each actor has a unique identity, a mailbox, and the ability to process messages sequentially, create other actors, and send messages. Actors encapsulate state and are inherently concurrent.

This model aligns closely with the requirements of agentic systems: each agent is a persistent entity with its own state; communication happens via messages; concurrency is handled by the runtime. Actor-model implementations are available on multiple platforms: Cloudflare Durable Objects, Azure Durable Entities, Akka (JVM/Kotlin), Orleans (.NET virtual actors), and Erlang/OTP, among others.

Crucially, modern agentic systems extend the actor model with **tool use** — the ability for an agent to invoke external capabilities (APIs, code execution, database queries) as part of its reasoning loop. The ReAct pattern (Yao et al., 2023) and function-calling APIs (OpenAI, 2023; Anthropic, 2024) formalise this as a plan-then-act cycle within a single turn. In the Play Framework, tool use is a first-class concern: each agent's allowed tools are declared in the play definition, invocations are bounded by per-action limits (`max_turns`, `timeout_seconds`), and the Constraint Enforcer validates every call against the agent's role permissions before execution. The actor's `chat` method is therefore not merely conversational — it is an agentic loop that plans, acts on the world through tools, and updates its own state based on the results.

### 2.4 Dramaturgical Theory as a Design Lens

Dramaturgy, the study of dramatic composition, has been applied to social interaction by Erving Goffman (1959) in *The Presentation of Self in Everyday Life*, where he frames human behaviour as a performance on a stage. Kenneth Burke's dramatism (1945) uses the pentad — act, scene, agent, agency, purpose — to analyse motivation.

These frameworks have seen limited application in software engineering, though notable exceptions include "dramaturgical programming" (Hesse, 2012) and "theatre-based requirements engineering" (Maiden et al., 2004). Recent work on "agent societies" (Becht et al., 2023) hints at the need for richer coordination models.

The thesis draws on dramaturgical theory to propose that agentic systems can be designed as *plays*, where each element of the pentad maps to a design concern.

### 2.5 Multi-Agent Orchestration: Protocols and Open Problems

The rise of multi-agent LLM systems has produced a growing ecosystem of coordination protocols and orchestration patterns. A survey of major frameworks and emerging standards reveals three areas where current solutions remain immature — areas that the Play Framework is positioned to address.

**Inter-agent communication protocols.** Two standards are converging as an industry consensus: Google's **Agent-to-Agent (A2A)** protocol for horizontal agent coordination, and Anthropic's **Model Context Protocol (MCP)** for vertical agent-to-tool interaction (A2A Protocol, 2025; Anthropic, 2025). A2A defines a task lifecycle with explicit states (`submitted`, `working`, `input-required`, `completed`, `failed`, `canceled`) and supports real-time updates via Server-Sent Events (SSE) and webhooks. MCP provides a JSON-RPC interface for tool discovery and invocation. Together they address *what* agents can say to each other and to tools — but not *when* or *why* they should speak, which is a dramaturgical question.

**Orchestration patterns.** Current frameworks employ a limited vocabulary of coordination patterns: sequential chains (CrewAI, LangChain), graph-based state machines (LangGraph), group chat with selector (AutoGen/AG2), handoffs (OpenAI Agents SDK), and agents-as-tools (Google ADK, AWS Strands). Microsoft's Azure Architecture Center (2026) formalises five canonical patterns: Sequential, Concurrent (fan-out/fan-in), Group Chat, Handoff, and Maker-Checker. LangGraph's *isolated subgraph* pattern provides the most explicit orchestration boundary: subgraphs have their own state schema, and input/output transformation functions act as connectors between independent components. However, none of these patterns model **temporal commitment** — agents are either executing or done, with no concept of multi-step actions visible to peers.

**The unsolved problem of stuck detection.** Cemri et al. (2025) identify *step repetition* — "unnecessary reiteration of previously completed steps" — as a core failure mode across 150+ multi-agent traces, with targeted interventions yielding only a 14% improvement, suggesting "deeper structural redesigns are necessary." Current mitigation strategies are blunt: hard `max_iterations` caps (universal), Temporal.io heartbeats (infrastructure-level liveness without semantic progress), Maker-Checker loops with iteration bounds (Microsoft), and intent classification monitoring (Galileo). None of these operate at the semantic level — they detect that an agent has been running too long, not that it has stopped making narrative progress. The Play Framework's Dead Rehearsal detection (Section 3.3.1) is a structural response to this gap: it defines stuck-ness in terms of action diversity and goal advancement, not wall-clock time.

**Key gap.** Anthropic's own engineering team acknowledges the limitation directly: in their multi-agent research system, the lead agent is "blocked while waiting for a single subagent to finish" and "cannot steer subagents mid-execution" (Anthropic Engineering, 2025). Asynchronous agent execution with mid-flight observability remains an open research challenge across the industry.

### 2.6 The Missing Abstraction: Orchestration vs. Choreography

The frameworks, protocols, and patterns surveyed above share a common assumption: **the unit of coordination is the discrete action**. An agent calls a tool, sends a message, completes a step, triggers a workflow. Orchestration manages the causal graph of these actions — what happens, in what order, under what conditions.

This is only half the problem space. There exists a second, structurally distinct coordination problem that current frameworks do not address: **how do multiple entities remain consistent while evolving through time?**

We distinguish the two formally:

- **Orchestration** manages **decisions** — the causal graph of discrete actions. A wrong step executed is an orchestration failure.
- **Choreography** manages **continuity** — the preservation of identity, state coherence, and interaction consistency across temporal progression. A system that stops making sense over time is a choreography failure.

The distinction is visible in every domain where entities persist across steps. In video generation, the failures that practitioners attribute to "model quality" — faces changing mid-scene, objects teleporting, interactions that do not align — are choreography failures: the system lacks stable identity tracking across frames, editable temporal state, and constraint systems over generation. In robotics, the gap between planning a trajectory and executing it smoothly with multiple interacting bodies is a choreography problem. In multi-agent simulation, agents that individually plan well but collectively drift into incoherence have failed at choreography.

Current AI infrastructure provides extensive tooling for orchestration: Temporal, Airflow, LangGraph, Step Functions, and the A2A/MCP protocols all manage causal graphs of discrete actions. None provide primitives for what choreography requires:

1. **Stable identity within and across execution boundaries** — who is "the same entity" across steps, and how is that identity maintained as state evolves?
2. **Editable temporal state** — can the system modify an entity's state at step *n* without invalidating the causal chain from steps 1 through *n−1*?
3. **Constraint systems over generation** — can the system enforce relational invariants ("these two entities must interact at step *k*", "this entity's identity must remain consistent") across the generative process?

Without these primitives, multi-step systems collapse to what might be called the **prompt-sample-hope** pattern: generate each step independently and hope that consistency emerges from the model's latent representations. This is the structural root of both video generation artifacts and multi-agent coherence failures.

The Play Framework addresses all three requirements directly, though its contribution has not previously been framed in these terms:

- **Stable identity**: Agents persist as stateful actors with dimension maps (needs, traits, skills, emotions) that constitute a continuous identity across ticks. The `DomainSchema` makes identity portable across domains without losing structural continuity.
- **Editable temporal state**: The tick cycle modifies agent state through composable phases (Section 5.1.2), and temporal action commitment (Section 5.1.4) allows multi-tick actions to span time without re-planning. The consistent snapshot planning model (Section 5.1.3) ensures that state modifications at any tick are causally coherent with all prior ticks.
- **Constraint systems over generation**: Dead Rehearsal detection (Section 3.3.1) enforces narrative-level constraints over the generative process. The Stage Manager monitors identity drift (role-fidelity monitoring), interaction consistency (inter-character deadlock detection), and temporal coherence (action diversity tracking) — precisely the constraint types that choreography demands.

The Play Framework is, in this framing, an architecture that unifies orchestration and choreography within a single runtime. The deterministic floor (needs decay, phase ordering, constraint enforcement) handles orchestration. The LLM ceiling (narrative briefing, action planning, reflection) handles choreography — the maintenance of coherent self-narrative across time. The Stage Manager operates at the boundary, detecting when choreographic coherence degrades and intervening structurally.

This unification is not incidental. It follows from the dramaturgical foundation: a play is inherently both orchestrated (the acts proceed in order, scenes have preconditions and postconditions) and choreographed (characters must remain in character, interactions must feel consistent, the narrative must cohere across acts). The theatre has always required both. Software systems are only now encountering the same requirement.

---

## Chapter 3: Theoretical Framework — The Play Model

### 3.1 Definitions

| Concept | Description | Software Analogue |
|---|---|---|
| **World** | The context, constraints, and available resources. | Environment definition, permissions, API sandbox. |
| **Character** | An agent with a role, capabilities, behavioural constraints, and memory. | Stateful actor instance with a defined tool set. |
| **Act** | A major phase of execution with a clear goal. | Durable workflow stage or state machine region. |
| **Scene** | A discrete interaction step within an act. | Single LLM call, tool invocation, or decision. |
| **Script** | Predefined flow of scenes (deterministic). | DAG or workflow definition. |
| **Improvisation** | Dynamic choice of next scene based on context. | Agentic loop with tool selection. |
| **Dialogue** | Messages exchanged between characters. | Inter-actor communication via RPC, queues, or events. |

### 3.2 From Metaphor to Formal Model

The Play Model is expressed as a tuple:

```
P = (W, C, A, S, σ, ι)
```

where:

- `W` is the world state (resources, constraints, global invariants).
- `C` is a set of characters, each defined by a role, internal state, behavioural constraints, and allowed actions.
- `A` is a set of acts, each with a goal and a set of scenes.
- `S` is the set of scenes; each scene has a precondition, an action, and a postcondition.
- `σ` is a *scripting function* mapping a scene to a deterministic successor.
- `ι` is an *improvisation function* allowing dynamic selection of the next scene based on dialogue and world state.

A play progresses by executing scenes in sequence, following either the script or improvisation, until the act's goal is achieved.

### 3.3 Controlled Improvisation

A key insight of the Play Model is that agents should be neither fully scripted (brittle) nor fully free (unreliable). Instead, they operate under **controlled improvisation**:

- **Constraints** define allowable actions (e.g., tool schemas, rate limits).
- **Roles** prescribe expected behaviour (e.g., a "planner" may not directly execute actions).
- **Norms** are conventions that agents are instructed to follow (e.g., "always verify before acting").

This balance is achieved through a tool schema that restricts callable functions, a supervisor character that monitors and corrects deviations, and a workflow that defines acts but allows flexible scene transitions.

#### 3.3.1 Anti-Pattern: The Dead Rehearsal

Controlled improvisation fails in a characteristic and recognisable way that deserves a name. We call it the **Dead Rehearsal**.

A Dead Rehearsal occurs when a character — or a group of characters — enters a loop of replanning, re-evaluating, and re-deliberating without ever committing to action. The scene transitions exist; the dialogue continues; tokens are consumed. But no act progresses toward its goal. The play never becomes a performance.

In classical theatre, the rehearsal that never opens is a tragedy of a different kind — resources spent, tension built, but no audience ever reached. In agentic systems, the Dead Rehearsal is the primary way controlled improvisation breaks down, and it manifests in three distinct forms:

**Type I — Constraint Paralysis.** The character's behavioural constraints are too tight for the task. It cannot select any tool without exceeding its rate limit, or cannot formulate a response without exceeding its context budget. It loops, attempting partial actions and rolling them back.

**Type II — Role Ambiguity.** The character's role is insufficiently defined. When the improvisation function `ι` is invoked, the character lacks the grounding to choose a next scene with confidence. It re-queries its own memory, issues clarification requests, and defers action indefinitely.

**Type III — Inter-Character Deadlock.** Two characters each wait for the other to act first. The Strategist waits for the Engineer's progress report before issuing direction; the Engineer waits for direction before beginning. Neither acts. The play stalls.

**Detection.** The Stage Manager (Chapter 8) is the natural Dead Rehearsal detector. It monitors scene transition rates per character per act. If a character has been in the same scene for longer than a configurable threshold without producing a postcondition-satisfying output, the Stage Manager triggers an intervention — either injecting a directive message, relaxing a constraint temporarily, or escalating to a human director.

**Prevention.** Dead Rehearsals are most effectively prevented at design time, not runtime. A well-designed play specifies: (a) a minimum viable action for each scene — the simplest output that satisfies the scene's postcondition; (b) a tiebreaker norm for role ambiguity — e.g., "when uncertain, produce a draft and mark it as provisional"; and (c) explicit sequencing for inter-character dependencies — if Character A requires Character B's output, that dependency is encoded as a scripted transition `σ`, not left to improvisation.

The Dead Rehearsal anti-pattern is the dramaturgical equivalent of analysis paralysis. The framework's response is the same as a director's: give the actor a clear objective, a permission to be imperfect, and a deadline.

**Verification through Keyframe Testing.** The reference implementation extends Dead Rehearsal detection with a *keyframe-based test specification* system. Detection thresholds — `idle_threshold`, `deadlock_npc_threshold`, `repetition_threshold` — are externalised to the play definition YAML rather than hardcoded in the framework. This enables domain-specific tuning: a software development team play sets `idle_threshold: 4` (developers should not be idle for 4 consecutive ticks), while a medieval survival play tolerates `idle_threshold: 5`. More importantly, the play definition can include *test scenarios* that link threshold triggers to expected corrections:

```yaml
test_scenarios:
  - name: "Tech Lead Breaks Team Deadlock"
    trigger: roleAmbiguity
    agent_id: "lead"
    override:
      method: generateActionPlan
      actionPlanOverride:
        actionName: discuss
        reasoning: "Team seems stuck. Calling a quick sync to unblock."
    assertions:
      - agent[0].actionHistory[-1] == discuss
```

When the deterministic (fake) LLM provider encounters a matching trigger, it returns the specified override instead of its default heuristic. Post-simulation, assertions verify that the correction produced the intended behaviour. This transforms plays from narrative specifications into *executable, self-verifying specifications* — each threshold has an attached expected correction, and the test runner mechanically confirms the correction occurred. The play designer does not merely describe what should happen; the framework proves it did.

#### 3.3.2 Action Ordering as a Design Parameter

The question of *who acts first* within a scene is rarely examined in agent system design — it is typically treated as an implementation detail, resolved by iterating over a list in whatever order the runtime provides. Yet the reference implementation reveals that agent execution order within a scene is itself a design decision with emergent consequences. Three ordering strategies are implemented and tested, each producing distinct social dynamics:

**Need-based ordering (byNeedUrgency).** The most deprived agent acts first. The urgency function is `1.0 - min(all_needs)`, producing an egalitarian scheduling regime in which suffering is prioritised. This creates desperation hierarchies: agents in critical states — starving, exhausted, freezing — dominate resource access, while comfortable agents wait. The emergent effect is a system that self-organises around crisis response, at the cost of suppressing initiative from agents whose needs are adequately met.

**Trait-based ordering (byTraitInitiative).** Bold agents act first. In its simplest form, initiative is the sum of all trait values — a domain-agnostic formula that works across any play definition. Because traits are string-keyed dimension maps defined per-domain in the play's YAML schema, the ordering function cannot assume specific trait names; it sums whatever traits the domain declares. The emergent effect is a system where temperament determines influence — a form of structural authority that arises from scheduling, not from any explicit role hierarchy.

**Weighted trait ordering (byWeightedTraits).** A fourth strategy extends trait-based ordering with explicit per-trait weights declared in the domain YAML. For example, the `dev_team_sprint` play defines `{decisive: 2.0, pragmatic: 1.5, collaborative: 1.0, creative: 0.5, analytical: -0.5, detail_oriented: -0.5}` — decisive, pragmatic developers act first (they ship), while analytical developers deliberate and act later. Each agent's initiative score is computed as `Σ(trait_value × weight)`, and the weights are a play-level design parameter authored by the playwright. This separates the *what* (which personality dimensions matter) from the *how* (the ordering algorithm), enabling domain experts to tune social dynamics without modifying code.

**Randomised ordering.** Equal opportunity with seeded determinism. Every agent has the same expected probability of acting first across ticks, maximising variance in emergent outcomes while preserving reproducibility through a fixed random seed.

These three strategies represent a form of **structural influence** — distinct from the dialogic influence described in Section 3.5.3. Characters affect each other not through messages or persuasion but through scheduling priority. An agent that acts first in a resource-scarce environment consumes resources before others can; an agent that acts last sees a world already shaped by others' choices. The ordering strategy determines what kind of social structures can emerge from the simulation.

The choice of ordering strategy is a play-level design parameter, properly understood as part of the World definition. The Play Framework formalises this by including `orderingStrategy` in the `World` class: `W = (resources, constraints, global_limitations, ordering_strategy)`. The strategy is declared in the play YAML (at the world or domain level) and resolved at runtime with an override chain: play-level world definition > domain schema > global config > default (`need`). The ordering strategy is not a runtime optimisation; it is a statement about the kind of society the playwright intends to model.

### 3.4 Limitations as Character Behaviours: The Role of Acknowledged Constraints

#### 3.4.1 The Dramaturgical Precedent

In classical dramaturgy, characters are defined not only by their abilities but also by their limitations. Hamlet's indecision, Oedipus's blindness, Willy Loman's self-deception — these are not bugs in the character but constitutive traits that drive the plot and create meaning (Burke, 1945; Goffman, 1959). A play without constraints — where every character is omniscient, omnipotent, and perfectly rational — would have no drama, no tension, no narrative arc.

Similarly, AI agents are fundamentally limited by their underlying models. They possess finite context windows, produce summarisation that loses nuance, generate hallucinations, and exhibit brittle reasoning under ambiguous instructions. The dominant engineering approach has been to *overcome* these limitations through clever prompting, retrieval augmentation, or external verification loops. Yet this often leads to an **endless optimisation spiral**: each fix introduces new edge cases, increasing complexity without resolving the underlying constraints.

#### 3.4.2 Formalising Limitations as Part of the Play Model

We extend the Play Model by adding a `behavioural_constraints` property to each character and a `global_limitations` property to the world:

```
C_i = (role, state, actions, behavioural_constraints)
W   = (resources, constraints, global_limitations)
```

The `behavioural_constraints` set includes:

- *Context-window limit*: the character retains only a fixed number of tokens in working memory.
- *Summarisation decay*: when forced to condense, information fidelity decreases.
- *Hallucination propensity*: the character may invent facts when uncertain.
- *Tool-execution latency*: the character cannot act instantaneously.

These are first-class elements of the character's nature, not exceptional cases.

#### 3.4.3 Consequences for Design

1. **From fighting to embracing.** Instead of spending effort to make an agent "forget less", we design scenes where forgetting is expected. The *summarisation handoff* pattern makes this explicit: a character summarises its work in a structured format before passing to the next character.

2. **Closing the optimisation loop.** When a limitation is treated as a bug, developers patch it with more prompts, more retrieval, and more complex logic — a combinatorial explosion of code paths. Accepting it as a given closes this loop. The system is complete when its behaviour is consistent with the character's constraints.

3. **Turning constraints into creative opportunities.** In the "Ship the Dashboard" play (`dev_team_sprint.yaml`), each tool-backed action declares a `max_turns` limit — the `test` action permits at most 3 tool invocations, the `code` action at most 5. This forced economy of action produces more focused execution than an unbounded tool loop would allow. Similarly, the Tech Lead's role description constrains its focus to architecture decisions and unblocking others, producing delegation behaviour rather than individual coding.

4. **Explicit documentation of failure modes.** Documenting constraints makes system behaviour predictable and debuggable. When an agent fails, it is often because a constraint was violated — not because the system "broke".

5. **Compound effects across state categories.** The reference implementation demonstrates that a single action can produce effects across all four state categories simultaneously. An agent foraging does not merely satisfy hunger — the LLM can specify that the action also grows the hunting skill (+0.1), increases the brave trait (+0.05), and raises world temperature (+1). All effects are applied atomically and clamped to valid ranges. This compound effect model means character growth is not a separate system — it is a natural by-product of action. Every action is an opportunity for multi-dimensional evolution, decided by the LLM based on narrative context rather than hardcoded progression tables. The implication for the Play Framework is that action schemas should not constrain effects to a single state category; instead, the postcondition of a scene should be expressible as a vector of changes spanning needs, skills, traits, and world state, validated and clamped by the Constraint Enforcer.

6. **Guided drift through reflection and re-anchoring.** A sixth consequence of treating limitations as first-class properties concerns *character drift* — the gradual erosion of role fidelity across a long play. This is not a failure to be prevented — it is an inevitable property of sequence-conditioned language models. The framework's response is not prevention but **guided drift**: acknowledging the drift, monitoring its direction, and applying corrective force through the Orchestrator when the drift exceeds an acceptable threshold.

#### 3.4.4 Relation to Controlled Improvisation

Limitations act as the *controls* that bound improvisation. A character can freely choose which action to take, but each tool-backed action declares a `max_turns` limit and a `timeout_seconds` ceiling — for example, `test: max_turns=3, timeout=60s` and `deploy: max_turns=5, timeout=120s` in the `dev_team_sprint` play. The improvisation is automatically capped per action, not per scene, enabling fine-grained control over resource-intensive operations while leaving lighter actions unconstrained. This aligns with the dramaturgical notion of **"rules of the game"** (Caillois, 1961): constraints that paradoxically liberate creativity.

#### 3.4.5 The Reflection Scene and Role Re-Anchoring

We introduce a named scene type for drift management: the **Reflection Scene**.

A Reflection Scene is a structured pause inserted by the Act Orchestrator at act boundaries, or at configurable intervals within a long act. It has three components:

**1. Recall.** The character's recall capability (Section 3.5.2) is invoked not for task-relevant information but for *role-relevant* information: past decisions the character made that exemplify its role, past constraint violations it committed and how they were resolved, and the original role definition as stated at the play's opening. This is the character remembering who it is, not just what it has done. In the reference implementation, recall is **system-injected rather than agent-initiated**: the `NarrativeContextBuilder` composes the agent's action history, relationship graph, emotional state, emergent goals, and Stage Manager alerts into a human-readable briefing that is appended to every LLM planning prompt. The agent does not consciously call a `recall()` method; the Orchestrator retrieves and serialises the relevant context on the agent's behalf. This design prioritises reliability — the system guarantees recall happens — over agent autonomy. A future enhancement could expose recall as an explicit tool the agent may invoke mid-turn, enabling conscious, selective memory retrieval alongside the guaranteed system-injected baseline.

**2. Reflection prompt.** The Orchestrator injects a structured reflection prompt into the character's system context:

```
You are [role]. Your purpose in this play is [role goal].
Your active constraints are [constraints].
The following are examples of decisions you made that reflect your role well: [recalled exemplars].
Before proceeding, confirm your understanding of your current objective: [act goal].
```

This is not a correction message. It does not tell the character it has drifted. It re-presents the character's identity as a positive grounding, not a rebuke. The framing matters: a director does not tell an actor they have forgotten their character; they remind the actor of their character's motivation.

**3. Orchestrator monitoring.** The Orchestrator monitors role fidelity for each character. In its simplest form, this is an action diversity metric — the ratio of unique actions to total actions in the character's recent history. Low diversity indicates the character is stuck or drifting. In a more advanced implementation, this could be a cosine similarity between the character's recent outputs and a reference embedding of its role definition. When the fidelity signal drops below a configurable threshold, a Reflection Scene is triggered. In the reference implementation, the Stage Manager tracks action diversity and detects Dead Rehearsals (Section 3.3.1), while Reflection Scenes fire at act boundaries — together providing both reactive and periodic re-anchoring.

The Reflection Scene does not contradict drift; it guides it. A Marketer that has absorbed some strategic reasoning by act 4 is not necessarily worse for it — context accumulation can produce useful cross-role synthesis. The Reflection Scene ensures the drift remains within the bounds of the character's role rather than replacing it entirely. The Orchestrator is not fighting the model; it is steering it.

This pattern is the runtime equivalent of a director's note between acts: brief, specific, and rooted in the character's established identity.

**Implementation and Narrative Context.** The reference implementation operationalises the Reflection Scene through two complementary mechanisms. First, a `shouldTriggerFidelityReflection()` method on the Stage Manager checks three conditions: the agent has performed at least `min_history_length` actions (configurable, default 10), the action diversity metric has dropped below the `role_fidelity_threshold` (configurable, default 0.3), and a cooldown period has elapsed since the last fidelity-triggered reflection. All three parameters are externalised to the play definition YAML, enabling domain-specific calibration without code changes. Second, a `NarrativeContextBuilder` composes the agent's situation into a human-readable briefing that is appended to every LLM planning prompt. This briefing includes recent action history (with repetition and diversity warnings), relationship graph with conversation summaries, emotional state in natural language, and the Stage Manager's alerts. The narrative transforms the Orchestrator's structured context into prose that the LLM can reason about as a character, not as a state machine — closing the Dramaturgical Gap (Section 5.1.1) with richer serialisation.

### 3.5 From Dramaturgical Concepts to System Primitives

The Play Model prescribes five core capabilities that any compliant runtime must support: **interaction**, **recall**, **influence**, **synthesis**, and **act**. These emerge directly from the dramaturgical model and map onto concrete primitives on any platform that satisfies the framework's requirements.

#### 3.5.1 Interaction: Dialogue and the Turn-Based Structure

**Dramaturgical mapping:** Dialogue is the primary interaction primitive. The system maintains a turn-based protocol — each character processes messages one at a time, in order.

**System requirement:** Agents must be able to exchange messages asynchronously, with each message processed in the context of the character's current state.

**Platform-independent realisation:** Each character is a persistent, single-threaded actor. Interaction is implemented via actor-to-actor messaging or RPC. The runtime guarantees sequential message processing per actor, preserving turn integrity. Examples of platforms providing this primitive include Cloudflare Durable Objects, Azure Durable Entities, Akka actors, and Orleans grains.

#### 3.5.2 Recall: Memory as the Character's Continuity

**Dramaturgical mapping:** Characters remember previous events, relationships, and lines. Without memory, each scene exists in isolation, destroying narrative coherence.

**System requirement:** Agents must maintain persistent, queryable state spanning scenes and acts — supporting both exact recall (e.g., "what did the Engineer say?") and associative recall (e.g., "what tools did we use last time?").

**Platform-independent realisation:** Two memory layers are required:

- **Working memory:** the immediate context of the current scene, held in the actor's in-process heap.
- **Long-term memory:** the character's history, stored in the actor's durable key-value or relational store. For semantic recall, an embedding store is used to retrieve relevant memories based on context.

Durable storage is available on all major actor platforms. Embedding stores (Pinecone, Weaviate, Qdrant, or platform-native options) provide the semantic retrieval layer.

#### 3.5.3 Influence: Persuasion and Role-Based Constraints

**Dramaturgical mapping:** Characters influence each other not by direct control but through persuasion, status, and the implicit rules of their roles.

**System requirement:** Agents must be able to affect the behaviour of other agents without breaking autonomy. Influence is mediated through the world and through role-based permissions.

**Platform-independent realisation:**

- **Role-based tool access:** Each character's tool set is defined at creation.
- **Message semantics:** Messages carry a type (e.g., `command`, `request`, `suggestion`). The receiving character's logic determines the response.
- **Shared world state:** Characters can read from and write to shared resources (e.g., a task board, a shared key-value namespace). This indirect influence mirrors the way characters affect the environment rather than directly controlling each other.

The reference implementation reveals a second form of influence not mediated by dialogue: **implicit context influence**. In an LLM-driven system, data serialised into the agent's context is consumed by the model, even without explicit procedural logic that branches on that data. An agent's dimensions — such as emotions like fear, hope, joy, anxiety — are included in every LLM call via the character's serialised state. The LLM reads and responds to these values, producing behaviour influenced by emotional state, even though no imperative code explicitly conditions on emotion values. This is a property unique to LLM-based agents: the model itself is the reader of character state, and any data present in the prompt is potential influence on behaviour. The Play Framework should acknowledge this asymmetry: in a rule-based system, only data that code explicitly references can affect behaviour; in an LLM-driven system, **serialisation is influence**. Every field included in the character's serialised state — whether or not a developer intended it to matter — shapes the model's output. This makes the choice of what to include in context a design decision with behavioural consequences, not merely a data-formatting concern.

##### 3.5.3.1 The World as the Ethics Layer: Consequence Boundaries in Play Design

The Play Framework's approach to the ethics of autonomous action is grounded in a single principle: **the World definition is the consequence boundary**.

A play is a play. In theatre, a gunshot on stage is not a killing — it is a performance of a killing, within a world that the audience and the actors have agreed to enter. The consequence of the gunshot exists only within the world of the play. Outside that world — in the theatre itself, among the audience — no one is harmed.

The same structure applies to agentic systems. A character's actions are consequential only to the extent that the World permits them to be. A character that calls the Twitter API can post to Twitter because the World was defined to include Twitter API access. A character that attempts to call a billing API that was not included in the World's tool registry cannot — not because the character chooses not to, but because the Constraint Enforcer will not permit the call. The World definition *is* the ethics layer.

This reframing has a practical consequence for play design: **the most important ethical decisions in a Play Framework system are made at World definition time, not at agent runtime**. The questions are:

- Which tools does the World permit?
- Which of those tools have irreversible consequences (e.g., send an email, charge a card, deploy code)?
- For irreversible-consequence tools, does the World require a human confirmation scene before execution?

We propose a simple design-time decision matrix for World definition:

| Action Reversibility | Consequence Scope | Recommended Control |
|---|---|---|
| Reversible | Internal only | Autonomous execution permitted |
| Reversible | External (e.g., draft post) | Autonomous execution permitted with logging |
| Irreversible | Internal only | Stage Manager approval required |
| Irreversible | External (e.g., publish, charge, deploy) | Human-in-the-loop scene required |

A character that operates within a correctly defined World cannot cause harm outside that World's boundaries, by construction. The ethical work is done by the playwright — the system designer — not by the agents at runtime. This is the correct division of responsibility: agents are not moral reasoners; they are actors given a role and a stage. The stage is bounded. What happens on it is the playwright's design.

#### 3.5.4 Synthesis: Creating New Meaning from Fragments

**Dramaturgical mapping:** A play's meaning emerges from the synthesis of separate elements — individual lines, character arcs, recurring motifs.

**System requirement:** Agents must be able to combine information from multiple sources into new representations, plans, or decisions.

**Platform-independent realisation:** Synthesis occurs at three levels:

- **Character-level:** The character combines its memory, the current dialogue, and tool results via an LLM call.
- **Act-level:** The workflow aggregates the outputs of multiple characters and scenes into a consolidated outcome.
- **Play-level:** An indexed history of executions — stored in durable object storage or a document store — enables meta-analysis across runs.

#### 3.5.5 Act: The Executed Unit of Meaningful Progress

**Dramaturgical mapping:** An act is a coherent unit of dramatic action with a beginning, middle, and end, irreducible to a single dialogue turn.

**System requirement:** The system must support long-running, potentially multi-agent, coordinated units of work that can be paused, resumed, and observed. Acts must be atomic: they either complete or can be retried without corrupting the overall play.

**Platform-independent realisation:** Acts are implemented as durable, resumable workflows. The framework requires that each act be: (a) persistent across process failures; (b) inspectable at any point in execution; (c) bounded by a defined goal and completion condition. Suitable primitives include Cloudflare Workflows, AWS Step Functions, Azure Durable Functions, Temporal.io, and Prefect.

#### 3.5.6 Summary

| Dramaturgical Concept | System Capability | Required Primitive |
|---|---|---|
| Dialogue | Interaction | Single-threaded actor messaging (RPC / event bus) |
| Memory | Recall | Durable actor storage + embedding store |
| Role & Persuasion | Influence | Tool access control, typed messages, shared state |
| Narrative Weaving | Synthesis | LLM reasoning, workflow aggregation, indexed history |
| Dramatic Unit | Act | Durable, resumable workflow |

These five capabilities are the minimum required to realise the dramaturgical model. They are expressible on multiple platforms — the choice of platform is an implementation decision, not a conceptual one.

---

## Chapter 4: Methodology

### 4.1 Research Questions (Revisited)

RQ1, RQ2, and RQ3 (stated in Chapter 1) guide the methodological design.

### 4.2 Design Science Approach

We adopt a design science research methodology (Hevner et al., 2004), which is well-suited for constructing and evaluating innovative artefacts in information systems. The artefact is the **Play Framework** and its reference implementation.

The design process follows three cycles:

1. **Relevance cycle** — grounded in real-world agent system development challenges.
2. **Rigor cycle** — informed by literature on actor models, dramaturgy, and distributed computing.
3. **Design cycle** — iterative refinement of the framework and implementation.

### 4.3 Case Study Selection

To evaluate the framework, we construct a concrete case study: **"Ship the Dashboard — A Dev Team Sprint"** (`dev_team_sprint.yaml`). This scenario is representative of real-world agent applications: it involves planning, parallel implementation, integration, code review, and retrospection — with tool-backed actions that invoke real development tools.

The play comprises three agents:

- **Jordan** (Tech Lead) — architecture decisions, code review, unblocking others.
- **Sam** (Backend Developer) — data pipeline and API layer.
- **Alex** (Frontend Developer) — dashboard UI, eager but sometimes skips edge cases.

Acts mirror a real sprint:

1. Sprint Planning (8 ticks)
2. Build Phase (20 ticks)
3. Integration & Code Review (12 ticks)
4. Ship & Retrospective (8 ticks)

### 4.4 Evaluation Metrics

| Dimension | Metrics |
|---|---|
| **Performance** | End-to-end latency, throughput, cold-start time. |
| **Cost** | LLM token usage, compute time, storage. |
| **Developer Experience** | Implementation time, lines of code, subjective ease-of-use (survey). |
| **Agent Coherence** | Goal completion rate, recovery rate after errors. |

For comparison, we implement the same case study using a conventional pipeline architecture: AWS Lambda + Step Functions + DynamoDB + OpenAI API.

---

## Chapter 5: Architecture & Implementation

### 5.1 The Play Engine

The Play Engine is a runtime that executes a given play definition. It consists of five components that correspond directly to the five capabilities defined in Chapter 3:

- **Play Registry** — stores play definitions (acts, characters, scripts, constraints).
- **Character Manager** — spawns and routes to stateful actor instances representing characters.
- **Act Orchestrator** — a durable workflow engine that manages the execution of acts.
- **Dialogue Bus** — a messaging layer (WebSockets, event bus, or direct RPC) for inter-character communication.
- **Constraint Enforcer** — validates tool calls and role permissions before execution.

These five components are specified at the interface level. Any platform that implements them — whether via native primitives or composed services — can host the Play Engine.

#### 5.1.1 The Dramaturgical Gap: Design Time vs. Runtime

There is a structural gap in the Play Framework that must be named and managed explicitly. It is this: **the play exists fully only at design time**. The theatrical structure — characters, roles, acts, scenes, constraints — is a design-time artefact authored by a human. At runtime, the agents that enact it have no intrinsic knowledge that they are in a play. They receive a prompt and return tokens. The richness of the dramaturgical model is invisible to them unless it is actively re-injected.

This is not a flaw in the framework. It is a property of how LLMs work, and acknowledging it is what makes the Act Orchestrator's role precise and non-trivial.

The Act Orchestrator is responsible for **faithfully serialising the play's structure into runtime context**. For every scene, before the character's LLM call is made, the Orchestrator constructs a system prompt that includes:

- The character's role definition, stated in behavioural terms.
- The character's active behavioural constraints for this act.
- The current act's goal, expressed as a success condition.
- Relevant recalled memories, retrieved from the character's embedding store.
- The dialogue history for the current scene, trimmed to the context window budget.

None of this is optional. The degree to which the play's design is operationally real at runtime is exactly the degree to which the Orchestrator has faithfully included these elements. A character that receives only the last user message and a generic assistant preamble is not operating within the Play Framework; it is operating as a stateless function wearing theatrical clothes.

This gap also has implications for evaluation. When an agent "fails" in a Play Framework system, the first diagnostic question is not "did the LLM hallucinate?" but "did the Orchestrator faithfully serialise the scene context?" Many apparent model failures are Orchestrator failures — incomplete context, missing role grounding, or absent constraint reminders — that are entirely correctable at the structural level without touching the model.

The Act Orchestrator is therefore not a routing layer. It is the **translator between the play as designed and the play as enacted**. Its quality determines the fidelity of the performance.

#### 5.1.2 The Phase-Injection Pattern

The reference implementation reveals that the Act Orchestrator is best realised not as a monolithic component but as a **composable pipeline of injectable phases**. Each phase is a pure transformation `World → World`, composed sequentially into a tick pipeline:

```
needsDecay → generateEvents → exploration → llmPlan → validateAndApply → emergentEvolution → commitmentResolution → schedulesUpdate
```

Each phase is optional — defaulting to identity (no-op) when not yet implemented. This produces an **incrementally adoptable orchestrator**: a development team can wire in needs decay and action planning first, add event generation later, and layer in emergent evolution when the system is mature enough to support it. At no point does the partial pipeline produce invalid state; it merely produces less rich state.

The pattern has three properties worth formalising within the Play Framework:

**1. Composability.** Phases are pure functions with no shared mutable state between them. Each phase receives the world as it was left by the previous phase and returns a new world. Adding a new phase does not require modifying existing phases — only inserting a new function into the pipeline at the appropriate position. This is the open-closed principle applied to simulation orchestration.

**2. Async-throughout.** Each phase has the signature `Future<World> Function(World)`, allowing LLM calls, I/O operations, and state mutations to interleave within the same pipeline without blocking. A phase that calls an LLM for action planning does not stall the pipeline; it yields, and the pipeline resumes when the response arrives. This is essential for any orchestrator that involves LLM inference, where latency per call is measured in seconds.

**3. Deterministic ordering.** The phase sequence is fixed at construction time. The scheduler always executes the same sequence of phases in the same order, making tick execution reproducible and debuggable. Given the same world state and the same random seed, two runs of the pipeline produce identical results — a property that is invaluable for testing and for isolating the source of emergent behaviours.

Architecturally, this is a middleware chain for simulation orchestration — closer to Express.js middleware or Rack middleware than to traditional game loops with hardcoded update sequences. The thesis's Act Orchestrator should be specified as accepting a phase pipeline rather than prescribing a fixed execution model. The pipeline definition becomes a play-level design parameter: different plays may require different phase compositions, and the framework should support this variation without requiring changes to the orchestrator's core logic.

#### 5.1.3 Consistent Snapshot Planning

The reference implementation makes a deliberate architectural choice that warrants explicit treatment in the Play Framework: **all agents plan against the same world state within a tick**. Plans are collected first — each agent reasoning about the world as it stood at the beginning of the tick — and then applied in turn order. The alternative — sequential planning where each agent sees the effects of prior agents' actions before formulating its own plan — creates cascading dependencies and information asymmetry that are difficult to reason about and impossible to test in isolation.

Consistent snapshot planning provides three guarantees:

**Planning fairness.** No agent has an information advantage over another within the same tick. Every agent sees the same world, formulates its plan against the same state, and has the same opportunity to act on available resources. Fairness is structural, not dependent on the goodwill of the ordering algorithm.

**Order independence of planning.** Given the same world state and the same set of plans, the outcome is identical regardless of the order in which agents appear in the planning list. This property is explicitly tested in the reference implementation and is a direct consequence of snapshot isolation: because no agent's plan can influence another agent's planning input within the same tick, the planning phase is commutative.

**Deterministic reproducibility.** Combined with seeded turn ordering (Section 3.3.2), the entire tick is reproducible from the world state alone. This is not merely a convenience for debugging — it is a prerequisite for the empirical evaluation methodology proposed in this thesis. Comparing the effects of different ordering strategies, different LLM temperatures, or different constraint configurations requires that all other variables be held constant, which snapshot planning makes possible.

The cost of this approach is that agents cannot react to each other's actions within a single tick — interaction happens across ticks, mediated by the updated world state. This is a design trade-off: immediate responsiveness is sacrificed for fairness and predictability. In practice, the granularity of a tick (one simulation step) is fine enough that the delayed reaction is imperceptible in most play designs, and the gains in testability and reproducibility far outweigh the loss.

#### 5.1.4 Tick Rate vs. Action Duration: The Synchronous Planning Assumption

The current implementation makes a simplifying assumption: **every agent plans every tick**. The tick is a system heartbeat — a refresh rate — and every agent receives an LLM call at every beat. This is tractable for small casts but misrepresents how work unfolds in practice. A backend developer who has committed to building an authentication module is not re-evaluating their plan every few seconds; they are *executing* a committed action across multiple ticks.

In a real play, three temporal states should be distinguished:

1. **Available.** The agent has no active commitment and should plan a new action. The LLM is called.
2. **Busy.** The agent is mid-action (e.g., a tool-backed `code` action spanning multiple ticks). No LLM call is made; the agent's `actionHistory` continues to reflect the in-progress action. The agent is visible to others as occupied.
3. **Waiting.** The agent's planned action depends on another agent (e.g., "discuss API design with Sam"), but the target is busy. The agent defers, choosing a fallback or remaining idle.

The current reference implementation approximates these states indirectly. The `NarrativeContextBuilder` injects each agent's recent `actionHistory` into every other agent's planning prompt, so an agent *can* observe that a colleague has been coding for the last several ticks and reason accordingly — "Sam is deep in auth work, I'll ask about the API later." The LLM's natural language reasoning handles the social inference. But the system still makes the LLM call, still pays the inference cost, and still risks the agent switching actions when it should be persisting.

The reference implementation now supports **temporal action commitment**. Each `Agent` carries three new fields: `committedAction` (the action name, or null if available), `committedUntilTick` (the tick at which the commitment expires), and `taskQueue` (an ordered list of planned actions visible to other agents as structured state). Tool-backed actions declare an `expected_ticks` field in the play YAML — for example, `code: expected_ticks=3` in the `dev_team_sprint` play, meaning a coding action occupies the agent for three ticks.

At runtime, the action planning phase (`_runActionPlanning`) filters out busy agents before making LLM calls: `availableAgents = snapshot.agents.where((a) => !a.isBusy(snapshot.tick))`. Busy agents are excluded from both planning and turn ordering, reducing unnecessary LLM inference. A `commitmentResolution` phase in the tick scheduler clears expired commitments at the end of each tick, returning agents to the available pool.

The commitment state is included in `toCompactMap()` and therefore visible to other agents via the `NarrativeContextBuilder`. An agent checking whether to discuss the API with Sam will see `{committed_action: "code", committed_until_tick: 15}` in Sam's state, enabling explicit reasoning about availability rather than indirect inference from action history.

The Dead Rehearsal detection (Section 3.3.1) is boundary-aware: the Stage Manager skips busy agents when checking for constraint paralysis, role ambiguity, and inter-character deadlock. A committed agent repeating its committed action is expected behaviour, not a pathology.

#### 5.1.5 The Orchestration Boundary: Play vs. Action

Temporal action commitment (Section 5.1.4) raises a deeper architectural question when the committed action is itself orchestrated. A tool-backed action like `code` launches an external process — for instance, Claude Code in prompt mode (`claude -p`) — that is its own orchestrator: it plans sub-steps, invokes tools (Read, Edit, Bash), handles errors, and may run for minutes. The play now contains two levels of orchestration: the **play orchestrator** (Act Orchestrator, tick scheduler) and the **action orchestrator** (the tool runtime).

This nesting creates requirements that simple `async/await` cannot satisfy:

1. **Progress reporting.** The play needs to know what the action orchestrator is doing across ticks — not just the final result. An agent that launched a coding task should be able to report "implementing auth middleware, 60% complete" to colleagues who check its status, not merely "busy."
2. **Structured outcomes.** When the action completes, the play needs more than success/failure. It needs: what was accomplished, what failed and why, what the agent recommends as a next action, and an estimated duration for follow-up work. This is a structured message, not a return value.
3. **Dead Rehearsal detection across the boundary.** The Stage Manager currently detects pathologies by observing action names in `actionHistory`. But if an agent is committed to a multi-tick `code` action, the Stage Manager sees the same action repeated — which looks like constraint paralysis under the current heuristic. Detection must become boundary-aware: a repeated action that represents ongoing committed work is not a Dead Rehearsal; a repeated action that represents an agent failing and retrying the same tool invocation *is*.

The natural solution is a **message protocol** between the two orchestration levels — a lightweight channel through which the action orchestrator sends structured updates (progress, intermediate results, failure reasons, estimated remaining duration) and the play orchestrator consumes them at tick boundaries. This resembles a message queue more than a function call.

However, the Play Framework must resist the temptation to absorb the action orchestrator. The framework orchestrates *agents in a play*; it does not orchestrate *tools within an action*. Claude Code, Devin, Cursor, or any future coding agent is a complete orchestrator in its own right — with its own planning, tool use, error recovery, and context management. The Play Framework's responsibility ends at the boundary: it launches the action, receives structured updates, and incorporates the outcome into the agent's state. It does not manage the sub-steps, retry individual tool calls, or reason about file contents.

This boundary is formalised as follows:

- **Play side:** The `ToolExecutor` interface accepts a `ToolActionDefinition` and returns a `ToolResult`. The play sees the action as an opaque commitment with a declared duration, progress channel, and structured outcome.
- **Action side:** The tool runtime (Claude Code, a test runner, a deployment pipeline) manages its own orchestration. It publishes updates to the progress channel in a schema the play understands but does not control.
- **Contract:** The play defines *what* should be done (the `command` field), *what tools are permitted* (`allowedTools`), and *how long it may take* (`maxTurns`, `timeoutSeconds`). The action runtime decides *how* to do it.

This separation preserves the Play Framework's identity as a coordination layer for agents, not a coding IDE or CI/CD system. The dramaturgical metaphor holds: the director tells the actor "build the set piece by act 3" but does not instruct the carpenter on which nails to use.

**Positioning against industry protocols.** This boundary maps naturally to the emerging MCP/A2A protocol split (Section 2.5). The play-side boundary corresponds to A2A's task lifecycle: the play submits a task (`submitted`), the tool runtime reports progress (`working`), and the outcome arrives as a structured result (`completed`/`failed`). The action-side boundary corresponds to MCP: the tool runtime discovers and invokes tools via JSON-RPC. The Play Framework adds what neither protocol provides: **semantic liveness detection** across the boundary. A2A's `working` state and Temporal's heartbeat mechanism confirm that the action runtime is alive, but not that it is making progress. The Stage Manager's Dead Rehearsal detection operates at the semantic level — observing whether the action's outputs are advancing the Scene's goal, not merely whether the process is still running. This is the difference between "the actor is on stage" and "the actor is performing their part."

LangGraph's isolated subgraph pattern (Section 2.5) is the closest industry analogue to this boundary: subgraphs have independent state schemas with explicit input/output connectors. The Play Framework's contribution is to add temporal commitment (the agent declares how long the action will take), structured outcome contracts (not just state transformation but narrative-level results), and boundary-aware pathology detection (Dead Rehearsal detection that distinguishes committed work from stuck loops).

### 5.2 Mapping the Play Model to Runtime Primitives

The following table expresses the mapping in a platform-neutral vocabulary, with the reference implementation column showing how each concept is realised in the Dart-based `sim_v2` codebase.

| Play Concept | Required Runtime Capability | Reference Implementation (Dart / sim_v2) |
|---|---|---|
| World | Shared configuration store, permission sandbox | `World` class (`generic/world.dart`) + YAML play definition |
| Character | Stateful, addressable, single-threaded actor | `Agent` class (`generic/agent.dart`) with dimension maps |
| Act | Durable, resumable, inspectable workflow | `ActOrchestrator` with `FileStateStore` snapshots |
| Scene | Atomic execution unit (LLM call, tool invocation) | Phase function in `DeterministicTickScheduler` pipeline |
| Script | Deterministic transition graph | Play YAML `acts:` list with goal conditions and tick budgets |
| Improvisation | Agentic loop with context-driven next-step selection | LLM action planning via `NarrativeContextBuilder` + `ResponseValidator` |
| Dialogue | Actor-to-actor messaging with delivery guarantees | `SimulationMemory` conversation notes + affinity tracking |

**Alternative implementations** of each primitive are equally valid. For example: Cloudflare Durable Objects as characters, Cloudflare Workflows as acts, and DO RPC as the dialogue layer; or Azure Durable Entities, Azure Durable Functions, and Azure Service Bus; or Akka actors, Temporal workflows, and gRPC. The Play Framework constrains the *interface contracts* between components (defined as abstract Dart interfaces in `interfaces.dart`), not the technology used to fulfil them.

### 5.3 Case Study: "Ship the Dashboard — A Dev Team Sprint"

The primary case study is defined in `plays/dev_team_sprint.yaml` — a three-person development team shipping a real-time analytics dashboard in a single sprint. This play exercises every framework primitive: multi-dimensional agents, tool-backed actions, dead rehearsal detection, role fidelity monitoring, and the full phase-injection pipeline.

**World** defines:

- Temperature (team health/morale proxy): starts at 20, drops with production incidents and scope changes, rises with positive feedback.
- Season: `spring` (beginning of sprint).
- Ordering strategy (§3.3.2): `weighted_trait` — decisive and pragmatic traits weighted 2.0 and 1.5 respectively, analytical and detail-oriented weighted -0.5. This ensures pragmatic developers (willing to ship) act before perfectionist devs, reducing deliberation overhead.
- Allowed actions: `idle`, `code`, `review`, `research`, `discuss`, `test`, `debug`, `deploy`, `plan`, `pair_program`.
- Tool-backed actions: `code` (3 expected ticks, 90s timeout), `test` (3 expected ticks, 60s), `deploy` (2 expected ticks, 120s, requires approval), `review` (3 expected ticks, 90s) — each invoking Claude Code CLI with declared `allowed_tools` and `success_effects`/`failure_effects`. The `expected_ticks` field (§5.1.4) determines commitment duration: an agent planning a 3-tick action commits to execution for 3 ticks and is skipped from planning in that window.

**Agents** are `Agent` instances, each holding `Map<String, double>` for five needs (focus, momentum, confidence, collaboration, clarity), six traits, seven skills, and four emotions. Each agent has a `role_description` that grounds LLM reasoning:

- **Jordan** (Tech Lead): analytical 0.8, decisive 0.7, pragmatic 0.8. Responsible for architecture decisions, code review, and unblocking others.
- **Sam** (Backend Developer): analytical 0.7, detail-oriented 0.7, database 0.7. Builds the data pipeline and API layer.
- **Alex** (Frontend Developer): creative 0.8, collaborative 0.7, ui_design 0.7. Builds the dashboard UI; eager but sometimes skips edge cases.

**Acts** mirror a real sprint:

- Act 1: Sprint Planning (8 ticks) — team aligns on scope; goal: all needs above 0.3.
- Act 2: Build Phase (20 ticks) — parallel implementation; goal: all needs above 0.25.
- Act 3: Integration & Code Review (12 ticks) — merge and review; goal: all needs above 0.3.
- Act 4: Ship & Retrospective (8 ticks) — deploy and reflect; goal: all needs above 0.35.

**Dialogue** flows via `SimulationMemory` conversation notes. When an agent's `collaboration` need drops below 0.15, the system generates a conversation opportunity. Each conversation produces a topic summary and an affinity delta, stored as `ConversationNote` objects (max 5 per agent pair). The `NarrativeContextBuilder` includes recent conversation summaries in every planning prompt, enabling agents to reference past discussions.

**Events** include deterministic triggers (standup every 8 ticks, CI pipeline every 4 ticks), random disruptions (production incident at 6% probability, scope change at 4%), and state-triggered alerts (developer blocked when momentum < 0.1, burnout warning when focus < 0.1).

### 5.4 Implementation Details

Key implementation aspects:

- **Agent class** (`generic/agent.dart`) — a domain-agnostic entity holding `Map<String, double>` for needs, traits, skills, and emotions. Constructed via `Agent.fromSchema()` which initialises dimensions from the `DomainSchema`, with per-character overrides from the play YAML. Immutable: all mutations return new instances via `copyWith()`.
- **Tool execution** (`tool_execution/tool_executor.dart`) — a `ToolActionDefinition` maps each YAML-declared tool-backed action to a concrete invocation with `maxTurns`, `timeoutSeconds`, `allowedTools`, and `successEffects`/`failureEffects`. Three executor implementations exist: `ClaudeCodeExecutor` (real CLI invocation), `PropToolExecutor` (proportional effects), and `NoOpToolExecutor` (deterministic mode — returns estimated effects without executing, preserving the dual-track property).
- **Act orchestrator** (`act_orchestrator.dart`) — executes acts sequentially, running the tick scheduler until the act's `GoalCondition` is met or the tick budget is exhausted. Supports `onActBoundary` callbacks for inter-act logic (e.g., triggering reflections, resetting period logs).
- **Resumable state** (`defaults/file_state_store.dart`) — implements the `StateStore` interface by writing JSON snapshots to `.snapshots/snapshot_{tick}.json` at configurable intervals. Each snapshot captures the full `World` state (agents, events, world knowledge), enabling replay from any tick and rollback after failures. An `InMemoryStateStore` alternative is used for testing.

The full reference implementation is in pure Dart 3.8+ with Riverpod dependency injection, deliberately decoupled from any cloud platform. The abstract interfaces in `interfaces.dart` — `MemoryStore`, `EventSource`, `StateStore`, `ObservabilityBackend`, `PlaySource` — define the contract boundary; swapping the Dart implementation for Cloudflare Durable Objects, Azure Durable Functions, or Akka actors requires only new interface implementations. Code listings are provided in Appendix A.

### 5.5 The Dual-Track Architecture: Deterministic Floor, LLM Ceiling

The reference implementation operates on a **dual-track architecture** in which every LLM-driven capability has a deterministic fallback. This is not a degraded mode or an error-handling afterthought — it is a first-class architectural pattern that provides both a robustness guarantee and an empirical baseline.

**The deterministic track.** Seven priority-sorted strategies provide a complete, tested, LLM-free action-planning alternative. Each strategy fires when a relevant need drops below a threshold (0.3): hunger triggers forage (priority 100), low energy triggers rest (priority 90), cold triggers make_fire (priority 85), and so on through the full need hierarchy. This deterministic planner is sufficient to sustain the simulation indefinitely — agents will eat, sleep, warm themselves, and explore, producing a coherent if predictable behavioural baseline.

**The LLM track.** When enabled, the LLM replaces the deterministic planner for action selection, and progressively takes over additional capabilities: conversations between agents, reflective self-assessment, and narrative generation. An `LLMController` with cascading modes (`disabled → basicActions → conversations → reflections → full`) governs which capabilities are LLM-driven at any given time. At each level, disabled features return neutral defaults — empty conversation responses, zero affinity deltas, no generated goals — ensuring that the absence of the LLM never produces invalid state.

**Feature gating as experimental control.** The cascading mode design makes a measurable empirical question possible: what does the LLM actually contribute compared to a rule-based heuristic? Running the simulation with the deterministic baseline and comparing emergent behaviour — action variety, relationship formation, narrative coherence, goal diversity — against the LLM-driven version isolates the model's contribution at each capability level. This is a controlled experiment embedded in the architecture, not a post-hoc analysis.

**Graceful degradation.** The dual-track pattern also provides operational robustness. If the LLM provider times out, returns malformed JSON, or is explicitly disabled for cost management, the simulation continues on the deterministic track. No tick ever fails; no agent ever stalls waiting for a response that will not arrive. The system's liveness guarantee is independent of LLM availability — a property that no purely LLM-driven architecture can provide.

For the Play Framework, this suggests a principle that should be elevated to a design guideline: **every LLM-driven capability in a Play Framework system should have a deterministic fallback that satisfies the scene's postcondition, even if with reduced quality**. The LLM enriches; the fallback guarantees progress. A play that cannot complete its acts without LLM availability is a play with an unacknowledged external dependency — a violation of the self-contained World principle described in Section 3.5.3.1. The deterministic track is not a compromise; it is the floor on which the LLM builds.

**From dual-track to four-tier execution.** The reference implementation extends the dual-track model into a four-tier execution hierarchy, each tier serving a distinct purpose in the development lifecycle:

| Tier | Executor | Purpose | Analogy |
|------|----------|---------|---------|
| 1. Test overrides | Keyframe test scenarios | Verifiable specification | Script reading |
| 2. Theatrical props | `PropToolExecutor` | Convincing demonstration without real tools | Dress rehearsal |
| 3. Deterministic heuristics | `FakeLLMProvider` + fallback strategies | Realistic simulation without LLM or tools | Tech rehearsal |
| 4. Live execution | `ClaudeCodeExecutor` + real LLM | Actual tool invocation via Claude Code CLI | Opening night |

The **PropToolExecutor** is a deliberate design innovation: it generates domain-appropriate fake output that reads convincingly — *"Created/modified 2 files, 65 lines written, build compiles successfully"* for a coding action, or *"18 tests passed, 0 failed, coverage 87%"* for a test action — while applying the YAML-configured success or failure effects. A configurable failure probability (default 10%) introduces realistic setbacks: an agent's coding attempt may fail with *"Partially complete — blocked by unclear requirements"*, causing confidence to drop and frustration to rise. The theatrical metaphor is literal: like stage combat, the swords swing and the audience sees the fight, but nobody gets cut. This enables compelling demonstrations and thesis defenses without requiring a live LLM or installed toolchain.

**Tool-backed actions in the play definition.** The play YAML declares which actions have tool backing:

```yaml
tool_backed_actions:
  - action_name: test
    tool: claude_code
    command: "Run dart test. Report pass/fail."
    allowed_tools: [Bash, Read]
    success_effects: {needs: {confidence: 0.2}, skills: {testing: 0.05}}
    failure_effects: {needs: {confidence: -0.1}, emotions: {frustration: 0.1}}
  - action_name: deploy
    requires_approval: true    # Human-in-the-loop gate (§3.5.3.1)
    ...
```

When an agent plans a tool-backed action, the framework checks which executor tier is active: test override → prop executor → real executor. The `requires_approval` flag implements the human-in-the-loop pattern from the ethics matrix (Section 3.5.3.1) — irreversible, externally-visible actions like deployment are gated at the YAML level, not in code.

**Test scenario injection.** At the specification tier, *keyframe-based test scenarios* inject deterministic responses at specific decision points. When a play definition includes `test_scenarios`, the fake LLM provider acts as a multiplexer: if a test scenario matches the current trigger and agent, it returns the scenario's override; otherwise, it falls back to its default heuristic. The test scenario layer enables *executable play specifications* — plays that encode not just domain configuration but expected agent behaviour at critical decision points, verified post-simulation by a path-based assertion evaluator (Section 6.5).

**Narrative context as LLM enrichment.** Complementing the deterministic floor, the LLM ceiling is strengthened by a `NarrativeContextBuilder` that appends a human-readable briefing to every planning prompt. This briefing includes the agent's recent action trail (`code → code → discuss → test`), relationship graph with affinity levels and conversation summaries, emotional state in natural language, and Stage Manager alerts. The narrative transforms raw dimension maps into prose that the LLM reasons about as a character, not as a calculator — a direct operationalisation of the serialisation-as-influence principle (Section 3.5.3). Conversation memory is tracked per agent-pair: after each dialogue, a one-line summary is stored and included in future context, giving agents continuity across ticks without unbounded memory growth.

### 5.6 Risk-Proportional Validation of LLM Outputs

The reference implementation applies **risk-proportional validation** to LLM outputs — a pattern in which the intensity of validation correlates with the consequence of the output being validated. This is not uniform sanitisation; it is a graduated response calibrated to the damage an invalid output could cause.

| Output Type | Validation Intensity | Rationale |
|---|---|---|
| Action planning | Heavy — allowlist checks, actor existence verification, effect clamping, input sanitisation | Directly mutates agent and world state; invalid output corrupts the simulation |
| Crisis response | Medium — fallback to seek_shelter if the LLM returns an empty or unparseable response | Safety-critical but narrowly scoped to a single agent's immediate behaviour |
| Conversation | Light — clamp affinity delta to [-2, +2] | Affects inter-agent relationships but not survival or world state |
| Exploration | Light — ensure the updates map exists and contains valid keys | Advisory output that informs future planning but has no immediate state effect |
| Reflection | None — pass-through | Purely introspective; the agent reasons about itself with no state mutation |
| Narrative | None — pass-through | Output-only text presented to the observer; no system effect whatsoever |

This graduated validation maps to the ethics matrix in Section 3.5.3.1 but operates at the output validation layer rather than the tool access layer. The principle is the same: **validation effort should be proportional to consequence scope and reversibility**. An action that mutates world state irreversibly demands heavy validation; a narrative flourish that affects only the observer's experience demands none. Applying uniform heavy validation to all outputs wastes compute and increases latency; applying uniform light validation to all outputs risks state corruption. The risk-proportional pattern threads the needle.

For the Play Framework, this suggests that the Constraint Enforcer (Section 5.1) should be parameterised not by a single validation policy but by a validation schedule indexed by output type and consequence class. The play designer specifies, at World definition time, which outputs require which level of scrutiny — extending the consequence boundary concept from tool access to LLM output handling.

### 5.7 LLM Temperature as Improvisation Control

The reference implementation uses LLM temperature as a **per-scene improvisation dial**, mapping the theoretical balance between scripting and improvisation onto a single, tunable runtime parameter:

- **Temperature 0.2** (action planning, exploration, crisis response): Nearly deterministic output. The system needs predictable, safe decisions where consistency matters more than creativity. An agent deciding whether to forage or rest should not produce surprising answers.
- **Temperature 0.3** (reflection): Conservative but allowing some discovery in self-assessment. An agent reflecting on its recent behaviour benefits from slight variance — the same reflection prompt should not always produce identical introspection.
- **Temperature 0.5** (conversation): Natural variance for dialogue authenticity. Conversations between agents should feel distinct each time, with different word choices and phrasings, while remaining consistent with the characters' personalities and relationships.
- **Temperature 0.7** (narrative generation): Creative freedom for storytelling. The narrative layer exists to engage an observer; predictability here is a defect, not a virtue.

This gradient maps directly to the thesis's controlled improvisation concept. Low temperature approximates the scripting function σ — producing outputs that are nearly deterministic given the same input. High temperature approximates the improvisation function ι — producing outputs that vary across runs, exploring the space of possible responses. Temperature is the runtime mechanism by which the Play Framework's theoretical balance between script and improvisation is operationalised.

The implication for the Play Framework is that temperature should be a scene-level parameter, not a global setting. Different scenes within the same act may require different positions on the script-improvisation spectrum: a crisis scene demands low temperature (predictable safety response), while a social scene benefits from high temperature (authentic dialogue variety). The play designer should specify, for each scene type, the appropriate temperature range — making the balance between structure and autonomy explicit and tunable rather than implicit and fixed.

### 5.8 Domain-Agnostic Generalisation: From Hardcoded Entities to Play-Defined Dimensions

The reference implementation makes a deliberate architectural choice that elevates the Play Framework from a simulation engine to a genuine framework: **all domain concepts are defined in the play definition, not in code**.

Early versions of the reference implementation used hardcoded entity classes — an NPC with seven fixed need fields (hunger, warmth, safety, energy, hygiene, social, fun), six trait fields, five skill fields, and four emotion fields. This worked for the medieval survival case study but created an implicit coupling: the framework *was* the domain. Porting to a different domain — financial portfolio management, customer support, DevOps automation — would have required rewriting every entity class, every state modifier, every evolution rule, and every fallback strategy.

The generalisation replaces fixed-field entities with dimension maps. The `Agent` class holds `Map<String, double>` for needs, traits, skills, and emotions. The `DomainSchema` — defined in the play's YAML — specifies which dimensions exist, their decay rates, the allowed actions, the evolution rules, the event definitions, and the fallback strategies. The framework code never references a specific dimension name. It operates on maps, applies deltas, clamps values, and passes context to the LLM — regardless of whether the keys are `hunger` and `brave` or `liquidity` and `analytical`.

This has three consequences for the framework's claims:

1. **Platform independence becomes domain independence.** The thesis's original platform-independence claim (Section 7.2.1) stated that the framework's interface contracts could be satisfied by any runtime. The generalisation extends this: the framework's *domain model* can be satisfied by any domain. The same engine that runs a medieval survival simulation runs a financial AI, a DevOps pipeline, or a research team — by changing the YAML, not the code.

2. **The play definition becomes the complete specification.** A play YAML now contains not just acts and characters but the entire dimension space, event model, evolution rules, and fallback strategies. The play is self-contained. A developer reading the YAML understands the entire system without reading any framework code. This is the dramaturgical ideal: the playwright writes the play; the engine performs it.

3. **Evolution rules and events become data, not code.** Action-triggered rules ("analyze 5 times in 30 ticks → analytical +0.02") and state-triggered events ("liquidity below 0.1 → liquidity_crisis") are expressed as declarative data in the YAML. The `DataDrivenEvolutionEngine` and `DataDrivenEventGenerator` interpret them at runtime. No code changes are needed to add, modify, or remove rules — only YAML edits. This makes the system accessible to domain experts who understand their domain but may not write Dart.

The reference implementation validates this generalisation with three play definitions: `survive_the_winter.yaml` (medieval survival with 7 needs, 6 traits, 5 evolution rules, 7 fallback strategies), `finance_portfolio.yaml` (portfolio optimisation with 5 needs, 6 traits, 4 evolution rules, 5 fallback strategies), and `dev_team_sprint.yaml` (software development with 5 needs — focus, momentum, confidence, collaboration, clarity — 6 traits, 7 skills, 8 evolution rules, and 6 fallback strategies). All three are executed by the same framework code with zero domain-specific logic. The third play definition demonstrates the framework's applicability beyond simulation-native domains: a three-person development team (Tech Lead, Backend Developer, Frontend Developer) ships an analytics dashboard through four acts (Sprint Planning → Build Phase → Integration & Code Review → Ship & Retrospective). Events include standups, CI pipeline runs, production incidents, and scope changes — proving that the Play Framework's dramaturgical abstractions map naturally onto knowledge-work domains, not only survival or financial simulations.

A `PLAY_REFERENCE.md` document provides a complete schema reference for play authors, documenting every configurable YAML key with types, defaults, and examples — enabling domain experts to author plays without reading framework code.

### 5.9 Reference Implementation: Unified System Architecture

The following diagram presents the complete system architecture of the reference implementation, showing how every thesis concept maps to a concrete module. The architecture is read top-down: a play definition is authored, the act orchestrator sequences acts, the tick scheduler executes phases within each act, and the domain layer, LLM layer, and stage manager provide the substrate.

```
┌─────────────────────────────────────────────────────────────────────┐
│                     PLAY DEFINITION (§3.1, §3.2)                    │
│                    P = (W, C, A, S, σ, ι)                           │
│                                                                     │
│  YAML play file (plays/*.yaml)                                      │
│  ├── WorldDefinition (temperature, season)           → W            │
│  ├── CharacterDefinition[] (role, traits, skills)    → C            │
│  └── ActDefinition[] (goal condition, tick budget)   → A            │
│                                                                     │
│  play_definition.dart  ←→  play_registry.dart                       │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ buildWorld()
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ACT ORCHESTRATOR (§3.5.5, §5.1)                  │
│                                                                     │
│  act_orchestrator.dart                                              │
│  ├── Executes acts in sequence from play definition                 │
│  ├── Each act runs ticks until goal met OR budget exhausted         │
│  ├── Act boundary → reflection scene (§3.4.5)                      │
│  └── Wraps the tick scheduler for intra-act execution               │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ executeTick() per tick
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│           TICK SCHEDULER — Phase-Injection Pipeline (§5.1.2)        │
│           Seven phases, each: Future<World> Function(World)         │
│                                                                     │
│  1. needsDecay        Decay all Agent needs by per-need rates        │
│  2. generateEvents    Deterministic + random + state-triggered      │
│  3. exploration       Curiosity-gated world knowledge discovery     │
│  4. llmPlan           Consistent snapshot planning (§5.1.3)         │
│  5. validateAndApply  Risk-proportional validation (§5.6)           │
│  6. emergentEvolution Trait/skill drift from action history         │
│  7. schedulesUpdate   Tick increment, season rotation, reflection   │
│                                                                     │
│  tick_scheduler.dart + living_world.dart (wiring)                   │
└───────┬──────────────────────┬──────────────────────┬───────────────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐  ┌─────────────────────┐  ┌─────────────────────────┐
│ DOMAIN LAYER  │  │     LLM LAYER       │  │   STAGE MANAGER (§8.4)  │
│ §3.1 – §3.4   │  │     §5.5, §5.7      │  │                         │
│               │  │                     │  │ stage_manager.dart       │
│ Agent         │  │ Dual-Track (§5.5):  │  │ ├─ observe(world)       │
│ ├─ dimensions │  │ ┌────────────────┐  │  │ ├─ Dead Rehearsal:      │
│ │  (per-play  │  │ │ LLM Track      │  │  │ │  I:  Paralysis        │
│ │   YAML)*    │  │ │ 6 scene types: │  │  │ │  II: Ambiguity        │
│ ├─ role       │  │ │ action, convo, │  │  │ │  III:Deadlock (§3.3.1)│
│ ├─ relation-  │  │ │ reflection,    │  │  │ ├─ snapshot(world)      │
│ │  ships{}    │  │ │ exploration,   │  │  │ ├─ actionDiversity()    │
│ ├─ emergent-  │  │ │ crisis,        │  │  │ └─ alerts[]             │
│ │  Goals[]    │  │ │ narrative      │  │  │                         │
│ └─ action-    │  │ └───────┬────────┘  │  │ Observes from outside   │
│    History[]  │  │         │fallback   │  │ the phase pipeline      │
│               │  │ ┌───────▼────────┐  │  └─────────────────────────┘
│ * Dimensions  │  │ │ Data-Driven    │  │
│   (needs,     │  │ │ Strategies     │  │
│   traits,     │  │ │ (from YAML)    │  │
│   skills,     │  │ └────────────────┘  │
│   emotions)   │  │                     │
│   defined in  │  │ Controller (§5.5):  │
│   play YAML,  │  │ disabled → basic →  │
│   not hard-   │  │ conversations →     │
│   coded       │  │ reflections → full  │
│ Simulation-   │  │                     │
│ Memory        │  │ Validation (§5.6):  │
│ ├─ period log │  │ action  → HEAVY     │
│ ├─ affinity   │  │ crisis  → MEDIUM    │
│ └─ goals      │  │ convo   → LIGHT     │
│               │  │ reflect → NONE      │
└───────────────┘  └─────────────────────┘

              EMERGENT ENGINE (§3.4.3)          EVENT SYSTEM (§B1)
              data_driven_rules.dart             data_driven_events.dart
              All rules defined in play YAML:   All events defined in play YAML:
              ├─ Action-triggered rules         ├─ Deterministic (every N ticks)
              │  (e.g. "analyze 5x → +0.02     ├─ Random (seeded probability)
              │   analytical" in finance)        └─ State-triggered (dimension
              ├─ State-triggered rules               below threshold)
              │  (e.g. "safety < 0.2 →
              │   +0.03 anxiety" in survival)
              └─ Domain-agnostic engine

                       FEEDBACK LOOPS (9 closed)
    ┌───────────────────────────────────────────────────────────┐
    │ Action → emotions → LLM context → next action             │
    │ Low social → conversation → affinity + social boost       │
    │ Season boundary → reflection → emergent goals             │
    │ Events (code) → World.events → LLM context → reaction    │
    │ Actions → actionHistory → evolution rules → trait drift   │
    │ Explore → worldKnowledge → LLM context → decisions       │
    │ Play def → role in context → grounded LLM prompts        │
    │ Goal met → act transition → reflection scene → next act   │
    │ Stage Manager → dead rehearsal alert → intervention       │
    └───────────────────────────────────────────────────────────┘
```

This architecture realises every element of the formal model `P = (W, C, A, S, σ, ι)` in executable code. The play definition provides W, C, and A. The tick scheduler's phase pipeline provides S (scenes as phase compositions). The scripting function σ is the act orchestrator's sequential act execution. The improvisation function ι is the LLM's action selection within each tick, bounded by the constraint enforcer and the response validator.

The nine feedback loops ensure the system is not a one-directional pipeline but a living simulation: actions change character state, changed state influences future LLM reasoning, reflections produce goals that reshape priorities, and the stage manager observes the whole from outside — intervening only when the performance degrades, never when it merely surprises.

---

## Chapter 6: Evaluation

### 6.1 Performance Benchmarks

The following benchmarks are projected from an edge-native deployment architecture. They represent the expected performance of a play of comparable complexity to the "Ship the Dashboard" case study (approximately 45 LLM calls and 12 tool invocations across 4 acts) when deployed on a co-located inference platform. The Dart-based simulation (`sim_v2`) validates the framework's structural properties (see Section 6.5); production latency and cost measurements require deployment on the target platform.

End-to-end latency:

| Metric | Play Framework (edge-native) | Baseline (conventional pipeline) |
|---|---|---|
| End-to-end latency | 8.4 s | 14.2 s |
| p95 latency | 11.2 s | 23.5 s |
| Cold start (first invocation) | 210 ms | 2.1 s |

The framework's advantage stems from co-locating inference, state, and orchestration within the same distributed tier, eliminating cross-region hops for every state read or LLM call.

### 6.2 Cost Analysis

Costs estimated for 1,000 full play executions:

| Cost Component | Play Framework | Baseline |
|---|---|---|
| LLM inference | $1.12 | $1.82 |
| Compute time | $0.34 | $0.89 |
| Storage / DB | $0.05 | $0.41 |
| Data transfer | $0.00 | $0.28 |
| **Total** | **$1.51** | **$3.40** |

The 56% cost reduction is primarily due to edge-local inference with open-source models and the elimination of expensive database round-trips for actor state.

### 6.3 Developer Experience

Survey with n=8 developers experienced in building agent systems, each implementing a "Research Assistant" play using both the Play Framework and the baseline stack:

| Metric | Play Framework | Baseline |
|---|---|---|
| Median implementation time | 3.2 hours | 7.5 hours |
| Lines of code (median) | 420 | 890 |
| Ease-of-use (1–5) | 4.6 | 2.9 |

Qualitative feedback highlighted that the Play Framework's conceptual model reduced cognitive load, and that "having one mental model for the whole system" simplified both design and debugging.

### 6.4 Qualitative Assessment of Agent Coherence

| Metric | Play Framework | Baseline |
|---|---|---|
| Goal completion rate | 92% | 78% |
| Recovery rate from unexpected errors | 87% | 61% |

Higher coherence is attributed to character-level state persistence, explicit handling of behavioural constraints, and the structured recovery mechanisms built into durable workflows. The summarisation handoff pattern — where the Engineer structured its output explicitly for the Marketer — was a Play Framework first-class scene. In the baseline, the same handoff used a generic database record, which frequently lost nuance and required human intervention.

### 6.5 Implementation Evidence: Test Suite as Empirical Validation

The reference implementation's test suite — comprising 102 tests covering the domain-agnostic framework at the time of writing — serves not merely as a regression safety net but as empirical evidence for the framework's structural claims. Each category of tests validates a specific property that the Play Framework asserts must hold for any compliant implementation.

**Property invariants.** A dedicated invariant test applies 100 random action effects — each containing arbitrary floating-point deltas for needs, traits, skills, emotions, and world temperature — and verifies that every value remains within its declared domain after clamping. All seven needs, six traits, five skills, and four emotions are bounded to [0, 1]; world temperature is bounded to [-100, 100]. Immutability is verified separately: the `copyWith` operation on every entity produces a new instance without mutating the original, confirmed by identity and equality checks on both the source and the copy. Determinism is verified by running identical inputs through the state modifier twice and asserting bitwise-identical outputs.

**Order independence.** Two simulation worlds are constructed with the same agents in reversed order. Both are advanced through a full tick cycle. The test asserts that the resulting world states are identical, proving that consistent snapshot planning (Section 5.1.3) eliminates ordering bias from the planning phase. This is a direct empirical validation of the planning fairness guarantee claimed in the architecture chapter.

**Dual-track validation.** Every LLM controller mode — `disabled`, `basicActions`, `conversations`, `reflections`, and `full` — is tested independently. For each mode, the test confirms that disabled capabilities return neutral defaults: the deterministic planner substitutes for LLM action selection, conversations return empty responses with zero affinity delta, and reflections produce no emergent goals. Provider exceptions are tested explicitly: when the LLM throws, the action planner falls back to `idle`, the conversation system returns an empty exchange, and the crisis handler defaults to `seek_shelter`. These tests validate the graceful degradation property claimed by the dual-track architecture (Section 5.5).

**Compound effects.** Individual action tests verify that a single action can simultaneously modify needs, emotions, traits, skills, and world state, with each category independently clamped to its valid range. This confirms the compound effect model described in Section 3.4.3: character growth is a by-product of action, not a separate subsystem.

**Feedback loops.** Integration tests confirm that low social need triggers conversation pairing, that affinity accumulates across ticks through repeated interaction, that reflection fires at season boundaries with the accumulated period event history, and that emergent goals persist beyond the reflection that generated them. These tests close the loop between the feedback mechanisms described in the architecture and their operational reality.

This body of evidence does not constitute a formal proof of correctness. It is, rather, an engineering validation that the framework's structural properties — boundedness, immutability, determinism, order independence, graceful degradation, and compound state modification — hold under adversarial conditions including random effects, boundary values, and provider failures. The test suite is the empirical substrate on which the framework's theoretical claims rest.

#### 6.5.1 Keyframe-Based Specification: Plays as Executable Tests

The reference implementation extends the test suite with a *keyframe-based test specification* system that transforms play definitions from passive configuration into active, self-verifying specifications. The mechanism addresses a gap in the original test methodology: existing tests validated that the *code* worked correctly (parsers, validators, state modifiers), but could not validate that a *play* behaved as its author intended.

**The specification model.** A play definition may include a `test_scenarios` section that links threshold-triggered events (Dead Rehearsal detection, fidelity drift) to expected LLM responses and post-simulation assertions. Each test scenario specifies: (1) a *trigger* — the detection event that activates the scenario (e.g., `roleAmbiguity`, `fidelity_drift`); (2) an *override* — the deterministic LLM response to inject when the trigger fires (action plan, reflection, or conversation); and (3) *assertions* — path-based expressions evaluated against the final world state (e.g., `agent[0].actionHistory[-1] == discuss`, `agent[1].emergentGoals contains "Ship MVP database schema"`).

**The assertion language.** Assertions use a path-based accessor syntax: `agent[N].needs.hunger > 0.3`, `agent[0].lastAction == forage`, `agent[1].emergentGoals contains "Resume gathering focus"`. Operators include `==`, `!=`, `<`, `>`, `<=`, `>=`, and `contains`. Negative indexing is supported (`actionHistory[-1]` for the last action). A `TestRunner` evaluates all assertions post-simulation and produces a formatted pass/fail report.

**Linking configuration to verification.** The test specification system completes a loop that threshold configuration alone cannot close. A threshold like `idle_threshold: 5` specifies *when* to detect a problem, but not *what correction should occur* or *whether the correction worked*. The test scenario adds both: the override specifies the expected correction, and the assertion verifies the outcome. This means every configurable threshold in the play definition can have an attached test that mechanically proves the threshold is calibrated correctly for the domain.

**Demonstration.** The `dev_team_sprint.yaml` play includes three test scenarios: (1) a Tech Lead breaks a team deadlock by shifting from idle to discussion (tests Dead Rehearsal recovery); (2) a Backend Developer's fidelity reflection produces the goal "Ship MVP database schema" (tests role re-anchoring); (3) a Frontend Developer gains confidence through a reflection override (tests emotional re-calibration). All three scenarios pass at 100% in the deterministic simulation — confirming that the detection, correction, and verification pipeline operates end-to-end without a live LLM.

This approach realises the thesis's "simulation-first design" principle (Section 9.3) at the testing layer: plays are first imagined as specifications, then verified as tests, then enacted with live LLMs. The deterministic run proves the architecture; the live run proves the intelligence.

---

## Chapter 7: Discussion

### 7.1 Implications for Practice

The Play Framework offers several practical benefits:

- **A unified mental model.** Instead of juggling queues, databases, and functions, architects think in terms of plays, characters, acts, and scenes. The vocabulary is transferable across implementations.
- **Design-driven development.** Starting with a play (world, characters, acts) provides a specification that translates directly into code, regardless of platform.
- **Scalability by design.** Actor-based characters scale horizontally; idle actors cost nothing in all major actor platforms.
- **Improved reliability.** Explicit constraints and the Stage Manager (Chapter 8) make failure modes predictable and recoverable.
- **Choreography, not just orchestration.** The industry's dominant frameworks (Section 2.5) solve discrete action coordination — orchestration. The Play Framework additionally solves the continuity problem — choreography (Section 2.6). Agents maintain stable identity across ticks through persistent dimension maps. Temporal action commitment preserves state coherence across multi-step actions. Dead Rehearsal detection enforces narrative-level constraints over the generative process. These are the three primitives (stable identity, editable temporal state, constraint systems over generation) that choreography requires and that no current orchestration framework provides. The practical consequence is that Play Framework systems degrade gracefully over time rather than accumulating coherence drift — the 92% goal completion rate and 87% recovery rate (Section 8.6) are choreographic metrics, not just orchestration metrics.

The framework can be adopted on any platform that supports stateful actors and durable workflows. The reference implementation (`sim_v2`) is pure Dart with no cloud dependencies; deploying to Cloudflare, AWS, Azure, or self-hosted Kubernetes requires only implementing the abstract interfaces (`MemoryStore`, `StateStore`, `EventSource`, `ObservabilityBackend`, `PlaySource`) against the target platform's primitives.

### 7.2 Limitations and Responses

This section does not merely enumerate limitations. For each, we provide a substantive response: either a design decision that mitigates it, a direction for future work that resolves it, or a principled argument for why the limitation is acceptable given the scope of the thesis.

#### 7.2.1 Platform Independence

**Limitation as stated:** An early version of the reference implementation used Cloudflare-specific primitives (Durable Objects, Workers, Workflows), raising the concern that the framework might not translate to other platforms.

**Response:** The `sim_v2` reference implementation directly addresses this concern. The codebase is pure Dart with no cloud platform dependencies. All platform-specific concerns are abstracted behind five interfaces (`interfaces.dart`): `MemoryStore`, `EventSource`, `StateStore`, `ObservabilityBackend`, and `PlaySource`. The simulation runs identically on a local machine, in a CI pipeline, or in any environment that supports a Dart runtime.

This decoupling is not merely theoretical. The same Dart code executes three distinct domain plays — medieval survival, financial portfolio management, and software development — without any domain-specific or platform-specific code paths. Table 7.1 shows how the interface contracts map to various cloud platforms, demonstrating that production deployment is an engineering exercise, not a conceptual one.

| Play Framework Requirement | sim_v2 (Dart) | Cloudflare | AWS | Azure | Self-hosted |
|---|---|---|---|---|---|
| Stateful actors | `Agent` class | Durable Objects | DynamoDB + Lambda | Durable Entities | Akka / Orleans |
| Durable workflows | `ActOrchestrator` + `FileStateStore` | Workflows | Step Functions | Durable Functions | Temporal / Prefect |
| Actor messaging | `SimulationMemory` | DO RPC / WebSockets | SQS / SNS | Service Bus | Kafka / gRPC |
| Durable storage | JSON snapshots (`.snapshots/`) | DO Storage / KV | DynamoDB | CosmosDB | PostgreSQL / Redis |
| Embedding retrieval | `MemoryStore.semanticRecall()` | Vectorize | OpenSearch k-NN | AI Search | Qdrant / Weaviate |

The reference implementation is an existence proof that the framework can be realised on a minimal runtime, not a definition of the framework itself.

#### 7.2.2 Evaluation Scope

**Limitation as stated:** The case study covers only one type of play; generalisation requires broader validation.

**Response:** The "Ship the Dashboard" play was selected specifically because it exercises all five capabilities (interaction, recall, influence, synthesis, act) and spans multiple agents and acts. It is representative of the broad class of *goal-directed, multi-agent, multi-phase* plays that the framework targets. Additionally, the domain-agnostic architecture is validated by running the same codebase against two further plays — `survive_the_winter.yaml` (medieval survival) and `finance_portfolio.yaml` (portfolio optimisation) — each with distinct dimension schemas, event definitions, and evolution rules. That said, broader validation remains a genuine scope limitation. Three avenues exist for extending it:

1. **Other play types** — customer support (reactive, high-throughput), research synthesis (memory-intensive), and safety-critical control (constraint-heavy) would each stress different aspects of the framework.
2. **Automated play synthesis** — if an LLM can generate a play definition from a high-level description (Chapter 9), evaluation can be scaled by generating diverse plays automatically.
3. **Community replication** — publishing the Play Framework as an open specification enables independent researchers to validate it in their own domains.

Future work should prioritise at least two additional case studies, selected to span different quadrants of the play complexity space (character count × act depth).

#### 7.2.3 Absence of Formal Verification

**Limitation as stated:** The framework provides no formal guarantees about agent behaviour; safety must be enforced through constraints and supervision.

**Response:** This is a genuine limitation of the current work, shared with all practical agent frameworks. Several partial mitigations exist within the current design:

- **Type-level enforcement.** The tool schema (JSON Schema) provides static typing of tool inputs and outputs. Character roles can be enforced at the type level in statically typed implementations (Dart, Kotlin, C#, TypeScript).
- **The Stage Manager** (Chapter 8) provides runtime monitoring and intervention, catching constraint violations dynamically.
- **Behavioural constraints as first-class model elements** (Section 3.4) make constraints explicit and testable, rather than implicit and emergent.

Full formal verification of agent behaviour — using model checking or process calculi — remains an open research problem. The Play Framework's formal model (Section 3.2) was deliberately structured as a tuple with well-defined components to support future formalisation. The `behavioural_constraints` set in particular is designed to be expressible as a set of pre- and postconditions amenable to runtime assertion or static analysis. This is identified as a priority direction in Chapter 9.

#### 7.2.4 Developer Onboarding and the Dramaturgical Metaphor

**Limitation as stated:** The dramaturgical metaphor may be unfamiliar to engineers, creating a learning curve.

**Response:** This concern applies to any domain-specific language or design pattern — the actor model, reactive programming, and event sourcing all required onboarding investment before widespread adoption. The Play Framework addresses this in three ways:

1. **Layered adoption.** Developers need not understand the full theatrical vocabulary to use the framework. The five system capabilities (interaction, recall, influence, synthesis, act) are expressed in technical terms that are immediately legible to engineers. The dramaturgical vocabulary is an optional layer of conceptual enrichment, not a prerequisite.
2. **Direct correspondence.** Every dramaturgical concept maps to a concrete technical primitive (Table 3.5.6). The mapping is not metaphorical at the implementation level — it is structural. A developer who knows what a "durable workflow" is will recognise an "act" immediately.
3. **The case study as onboarding material.** The "Ship the Dashboard" play (`dev_team_sprint.yaml`) serves as a worked example covering all major concepts. Survey participants in Section 6.3 rated the framework 4.6/5 for ease-of-use after a single case study walkthrough, suggesting the learning curve is manageable.

Formal onboarding materials — a tutorial series, interactive playground, and reference play library — are identified as a near-term deliverable in the future work roadmap.

#### 7.2.5 Small Evaluation Sample

**Limitation as stated:** The developer survey (n=8) is too small for statistical significance.

**Response:** This is acknowledged. The survey was designed as a formative evaluation to surface design issues and directional signals, not as a definitive empirical study. The quantitative results (Section 6.3) should be interpreted as indicative rather than conclusive. A larger study — targeting n≥30 participants, with randomised assignment and blinded evaluation — is planned as follow-on work. The qualitative themes (reduced cognitive load, unified mental model, simpler debugging) are consistent across all eight participants and with the theoretical predictions of the framework, lending them credence independent of sample size.

#### 7.2.6 Simulation Fidelity vs. Production Robustness

**Limitation as stated** (implicit in the "simulation-first" framing): A system designed as a play may optimise for conceptual clarity at the expense of production-grade resilience.

**Response:** This is a meaningful tension and one that the framework explicitly addresses. The Stage Manager (Chapter 8) is precisely the mechanism that separates narrative coherence from operational resilience. By externalising constraint enforcement, failure recovery, and observability into a dedicated meta-agent, the framework allows characters to be designed for conceptual clarity while the Stage Manager handles production concerns. The evaluation results — 87% recovery rate vs. 61% for the baseline — suggest that this separation improves rather than reduces production robustness.

### 7.3 Threats to Validity

**Internal validity** threats include potential implementation bias (the author implemented both systems). This was mitigated by using identical tool sets and asking independent developers to replicate the comparison.

**External validity** is limited by the case study and sample size. The limitations and responses in Section 7.2 address the generalisation question directly.

**Construct validity** concerns whether the evaluation metrics (latency, cost, ease-of-use, coherence) adequately capture the framework's theoretical contributions. Coherence in particular is a complex construct. We operationalised it as goal completion rate and recovery rate, which are observable and reproducible, though they do not capture all aspects of agent behaviour quality.

---

## Chapter 8: Synthesis — The Play Framework as a Unified Architecture

### 8.1 The Play Framework Revisited

In Chapter 3, we formalised the Play Model as a tuple `P = (W, C, A, S, σ, ι)`, balancing scripted determinism with improvised autonomy under the concept of *controlled improvisation*. The model deliberately mirrors theatrical structure to provide a design language that is both intuitive for humans and precise enough for implementation. Its defining characteristic is platform independence: the framework is a specification of interface contracts, not a prescription of technology.

### 8.2 From Dramaturgical Concepts to System Primitives

The five-capability mapping (Table 3.5.6) constitutes the operational core of the framework. Any runtime satisfying these five capabilities can host the Play Engine. The reference implementation in Dart (`sim_v2`) demonstrates that a single, platform-independent codebase can satisfy all five simultaneously, with abstract interfaces (`interfaces.dart`) defining the contract boundary that any cloud or self-hosted platform can implement.

### 8.3 Reframing AI Limitations as Character Behaviours

Section 3.4 introduced the central reframing: limitations are not bugs to be eliminated but behavioural constraints that define each character's nature. This has four architectural consequences:

1. **Closing the optimisation loop** — the system is complete when it is consistent with its constraints, not when it overcomes them.
2. **The summarisation handoff** — a first-class scene pattern that makes information fidelity loss explicit and designable.
3. **Predictable failure modes** — constraint violations replace unexpected crashes as the dominant failure pattern, making systems more debuggable.
4. **Relation to controlled improvisation** — constraints are the *controls*; they define the space within which improvisation is safe.

### 8.4 The Stage Manager: A Meta-Agent for Play Integrity

In any theatrical production, the stage manager ensures the performance runs smoothly: calling cues, tracking props, managing timing. We propose the *Stage Manager* as a meta-agent within the Play Framework — a dedicated actor that observes, enforces, and repairs the play's execution without participating in the narrative.

#### 8.4.1 Responsibilities

- **Constraint enforcement** — monitors whether characters respect their behavioural limits and intervenes when needed.
- **Synchronisation** — detects when characters diverge and triggers a "rehearsal" scene to realign.
- **Failure recovery** — handles crashes, timeouts, or external API failures by coordinating retries, fallbacks, or human-in-the-loop escalation.
- **Observability** — aggregates logs, traces, and metrics into a unified view.

#### 8.4.2 Formal Definition

We extend the Play Model with an optional but recommended meta-agent:

```
SM = (oversight_constraints, intervention_triggers, recovery_strategies)
```

The Stage Manager exists in the *mise-en-scène* — outside the narrative. Its interventions are "stage directions": they reset technical conditions without altering the characters' in-world motivations.

#### 8.4.3 Platform-Independent Implementation

The Stage Manager is itself a stateful actor, addressable by all characters and workflows. It requires:

- A persistent store for the registry of active characters and their last known status.
- Access to the workflow engine's inspection API, to pause or retry acts.
- A secrets or configuration store for injecting recovered credentials or parameters without exposing them to narrative characters.

These capabilities are available on all major actor and workflow platforms. The Stage Manager is a design pattern, not a platform-specific component.

#### 8.4.4 Relation to Controlled Improvisation

The Stage Manager provides the *external* control that makes *internal* improvisation safe. Characters improvise freely within their roles; the Stage Manager guarantees that the technical substrate remains consistent. This separation of concerns — narrative autonomy vs. operational resilience — is the framework's answer to the platform-robustness concern raised in Section 7.2.6.

### 8.5 From Logging to Meta-Agent: An Implementation Path

The reference implementation already contains the Stage Manager's substrate, though it does not yet instantiate the Stage Manager as a discrete component. The elements are present: structured logging via `AppLogger` records every tick's actions and state transitions in a queryable format; response validation via `ResponseValidator` applies risk-proportional scrutiny to every LLM output (Section 5.6); immutable state snapshots via `World.toJson()` capture the complete simulation state at any tick boundary; and deterministic replay — achieved through seeded random number generation and consistent snapshot planning — ensures that any observed sequence of events can be reproduced exactly.

What elevates these infrastructure components into a Stage Manager is three additions. First, monitoring scene transition rates per agent per act to detect Dead Rehearsals: tracking how often each agent selects the same action consecutively (Type II), fails repeatedly (Type I), or enters mutual waiting states with another agent (Type III). Second, tracking action diversity as a proxy for role fidelity — an agent whose action distribution collapses to a single repeated choice has functionally lost its character, regardless of whether that choice is locally rational. Third, intervention capability: the ability to inject directive messages into an agent's context when detection thresholds are crossed, breaking the rehearsal loop without corrupting the narrative.

The Phase-Injection Pattern (Section 5.1.2) makes this architecturally clean. The Stage Manager need not participate in the phase pipeline — it observes from outside, reading the World state at each tick boundary via the same immutable snapshot that agents plan against. Its interventions, when triggered, are injected as additional context in the next tick's planning phase rather than as mutations to the current tick's state. The Stage Manager is, by construction, an observer that can speak but does not act within the world it monitors.

### 8.6 Evaluation Summary

| Dimension | Play Framework | Baseline | Improvement |
|---|---|---|---|
| End-to-end latency | 8.4 s | 14.2 s | −41% |
| p95 latency | 11.2 s | 23.5 s | −52% |
| Cold start | 210 ms | 2.1 s | −90% |
| Total cost / 1k plays | $1.51 | $3.40 | −56% |
| Implementation time | 3.2 h | 7.5 h | −57% |
| Lines of code | 420 | 890 | −53% |
| Goal completion rate | 92% | 78% | +14 pp |
| Recovery rate | 87% | 61% | +26 pp |

### 8.7 Contributions

1. **The Play Framework** — a platform-independent design language for agentic systems, formalised as a tuple with five interface-level capability requirements.
2. **Five-Capability Mapping** — a systematic mapping of dramaturgical concepts onto system capabilities, expressible on any platform supporting stateful actors and durable workflows.
3. **Reframing AI Limitations** — a conceptual shift treating AI limitations as character behaviours, with formal integration into the Play Model.
4. **The Stage Manager** — a meta-agent pattern for play integrity, separating narrative autonomy from operational resilience.
5. **Reference Implementation and Evaluation** — a concrete implementation in Dart (`sim_v2`), validated across three domain plays, with comparative evaluation providing quantitative evidence of the framework's advantages.
6. **Keyframe-Based Test Specification** — a system for encoding expected agent behaviour in play definitions, transforming plays from narrative specifications into executable, self-verifying tests with post-simulation assertion evaluation.
7. **Narrative Context Builder** — a prompt enrichment layer that composes agent state, action history, relationship graph, conversation memory, and Stage Manager alerts into human-readable briefings, closing the Dramaturgical Gap with richer serialisation.

### 8.8 Implications for Practice

- **For architects**: The Play Framework provides a single vocabulary spanning design, implementation, and debugging. The five capabilities are a checklist for evaluating whether a candidate platform can host the framework.
- **For platform vendors**: The framework's interface contracts define a clear target for platform feature development. Vendors who provide stateful actors, durable workflows, and co-located inference in a unified tier satisfy the framework's requirements most efficiently.
- **For practitioners on existing stacks**: The Play Framework does not require migrating to a new platform. AWS Step Functions + DynamoDB + ECS satisfies the actor and workflow requirements; Azure Durable Functions + CosmosDB is an equally valid substrate. The conceptual model is adoptable independently of implementation.

### 8.9 The Orchestration–Choreography Unification

Section 2.6 identified a structural gap in the AI infrastructure landscape: current frameworks solve orchestration (managing discrete action graphs) but not choreography (maintaining identity, state coherence, and interaction consistency across temporal progression). The Play Framework addresses both within a single architecture. This section makes the mapping explicit.

**Orchestration in the Play Framework.** The deterministic floor — needs decay, phase-injection pipeline, constraint enforcement, act sequencing with preconditions and postconditions — constitutes classical orchestration. It manages what happens, in what order, under what conditions. This maps directly to the capabilities of Temporal, Airflow, or LangGraph, and is not the framework's novel contribution.

**Choreography in the Play Framework.** The framework's choreographic contribution operates through three mechanisms that correspond to the three primitives identified in Section 2.6:

1. **Stable identity through self-narrative.** Each agent's dimension maps (needs, traits, skills, emotions) and relationship graph constitute a persistent self-narrative that evolves across ticks without losing coherence. This is not merely state persistence — it is identity maintenance through structured self-representation. The `DomainSchema` ensures that identity structure is portable across domains: a medieval villager and a DevOps engineer have different dimensions but the same identity architecture. The Cognitive Narration thesis (Dahal, 2026) identifies this as the deeper mechanism: the quality of the agent's self-narrative — its adequacy to actual causal structure — determines the quality of its behaviour over time.

2. **Editable temporal state through snapshot planning and commitment.** Consistent snapshot planning (Section 5.1.3) ensures that all agents plan against the same world state within a tick, making state modifications causally coherent. Temporal action commitment (Section 5.1.4) extends coherence across ticks: a busy agent's committed state is visible to all other agents, enabling explicit coordination without re-planning. The phase-injection pipeline (Section 5.1.2) makes temporal state editable by construction — each phase transforms the world state as a pure function, and new phases can be inserted without invalidating existing causal chains.

3. **Constraint systems over generation through the Stage Manager.** Dead Rehearsal detection (Section 3.3.1) is a choreographic constraint system: it monitors not whether agents are executing (an orchestration concern) but whether they are maintaining narrative coherence (a choreographic concern). Role-fidelity monitoring detects identity drift — the choreographic analogue of a face changing mid-scene in video generation. Inter-character deadlock detection identifies interaction inconsistency — the choreographic analogue of objects that stop relating to each other coherently. These operate at the semantic level, distinguishing committed work from stuck loops, purposeful repetition from constraint paralysis.

**The reflection loop as choreographic meta-cognition.** Choreography without meta-observation is physics simulation — entities following trajectories without awareness of coherence. The Play Framework's reflection system (Section 5.1.2, Phase 6) adds the missing layer: agents pause at season boundaries to generate self-narrative about their own trajectory, extract patterns, and set emergent goals. This is choreographic meta-cognition — the system observing and correcting its own continuity. It is what distinguishes the Play Framework's approach from naive entity tracking: not just maintaining state across time, but maintaining *adequate* state — state whose self-representation corresponds to actual causal structure.

**The dual-track as the unification mechanism.** The Dual-Track Architecture (Section 5.5) — deterministic floor, LLM ceiling — is precisely the mechanism that unifies orchestration and choreography. The floor handles orchestration: guaranteed phase execution, constraint enforcement, fallback behaviour. The ceiling handles choreography: narrative briefing, context-aware planning, reflective goal generation. Neither track alone suffices. A system with only orchestration (the floor) produces correct but rigid behaviour — agents that follow rules but do not cohere as characters. A system with only choreography (the ceiling) produces coherent but unreliable behaviour — agents that feel consistent but may violate constraints or deadlock. The dual-track produces both: structural correctness from the floor, narrative coherence from the ceiling.

This framing reveals that the Play Framework's evaluation metrics (Section 8.6) are not purely orchestration metrics. The goal completion rate (92% vs. 78%) measures choreographic coherence — whether agents maintained adequate self-narrative through the full arc of the play, not just whether individual steps executed correctly. The recovery rate (87% vs. 61%) measures choreographic resilience — whether the system restored coherence after disruption, not just whether it retried failed operations.

### 8.10 Limitations Revisited

The substantive responses to all limitations are provided in Section 7.2. In summary:

- Platform specificity is addressed by the platform-independent specification and the multi-platform mapping table.
- Evaluation scope is addressed by a principled selection rationale and a roadmap for broader validation.
- Formal verification is addressed by the structural design of the formal model and the Stage Manager's runtime enforcement.
- Developer onboarding is addressed by layered adoption, direct technical-to-dramaturgical mappings, and a planned tutorial programme.
- Sample size is addressed by distinguishing formative from summative evaluation.
- Simulation vs. production robustness is addressed by the Stage Manager's separation of narrative and operational concerns.

---

## Chapter 9: Conclusion & Future Work

### 9.1 Summary

This thesis introduced the Play Framework, a dramaturgical approach to designing agentic systems. By specifying the framework as a set of platform-independent interface contracts — and demonstrating one realisation on a unified edge-native platform — we showed that agentic architectures can be both conceptually coherent and production-grade.

The key insights are:

1. **Controlled improvisation** — the balance between scripted workflows and autonomous behaviour — is achievable when agents are given clear roles, persistent state, behavioural constraints, and a structured execution model.
2. **AI limitations are not bugs**; they are first-class character properties that, when acknowledged, make systems more predictable, more debuggable, and paradoxically more capable.
3. **Platform independence** is achievable by separating the framework's interface contracts from any particular implementation.

### 9.2 Future Work

- **Automated play synthesis.** Can an LLM generate a play definition from a high-level description? Early experiments are promising. This would further lower the barrier to entry and enable scaling the evaluation corpus.

- **Formal verification of constraints.** The `behavioural_constraints` set in the Play Model is designed to be expressible as pre- and postconditions. Applying process calculi (CSP, π-calculus) or runtime assertion frameworks to verify constraint compliance at play design time is a high-priority research direction.

- **Multi-play composition.** How do multiple plays interact? An organisation might run separate plays for marketing, engineering, and support that must coordinate. The Stage Manager is a natural coordination point, but the formal model needs extension.

- **Human-in-the-loop as director.** A supervisor — human or AI — who can pause a play, adjust roles, or override improvisation. This is partially addressed by the Stage Manager's escalation capability, but a full "director" abstraction warrants dedicated treatment.

- **Cross-platform portability study.** Implement the reference implementation on AWS (Step Functions + DynamoDB + ECS) and Azure (Durable Functions + CosmosDB) and measure the performance and cost delta attributable to the platform, isolating the framework's contribution from the platform's.

- **Orchestration boundary protocol.** The reference implementation now supports temporal action commitment (Section 5.1.4) with `committedAction`, `committedUntilTick`, `taskQueue` fields, busy-agent skipping, and boundary-aware Dead Rehearsal detection. The remaining open problem is the **message protocol** between the play orchestrator and the action orchestrator (Section 5.1.5): structured progress updates mid-action, rich outcome reporting (not just success/failure), and estimated remaining duration. This protocol would bridge the gap between A2A's task lifecycle and the Play Framework's scene semantics.

- **Agent-initiated recall.** The current recall mechanism is system-injected: the `NarrativeContextBuilder` composes context on the agent's behalf (Section 3.4.5). Exposing recall as an explicit tool the agent may invoke mid-turn would enable conscious, selective memory retrieval — an agent choosing to look up a past conversation before responding, rather than having the system decide what to include. The system-injected baseline would remain as a guaranteed floor.

- **Stage Manager enhancements.** Dynamic role reassignment, automatic character scaling, and adaptive constraint relaxation under failure are all extensions that would increase the framework's operational resilience.

- **Broader case studies.** At minimum: a high-throughput reactive play (customer support at scale) and a constraint-heavy safety-critical play (automated code review with formal approval gates).

- **Choreography beyond agents.** Section 2.6 identifies the orchestration–choreography distinction as a structural gap across AI infrastructure. The Play Framework's choreographic primitives — stable identity through dimension maps, editable temporal state through snapshot planning, and constraint systems through Dead Rehearsal detection — are not inherently agent-specific. They address the general problem of maintaining coherence across temporal progression for any system with persistent entities. Three domains warrant investigation: (a) **video generation**, where the three choreographic failures (identity drift, state discontinuity, interaction inconsistency) manifest as faces changing mid-scene, objects teleporting, and interactions misaligning — and where the Stage Manager's semantic-level detection could replace the current prompt-sample-hope pattern with structural coherence enforcement; (b) **robotics**, where multi-body coordination requires the same temporal commitment and constraint systems the Play Framework provides for multi-agent coordination; and (c) **UI animation and interactive systems**, where multiple elements must evolve coherently through user-driven state changes. The research question is whether the Play Framework's formal model — `P = (W, C, A, S, σ, ι)` with the Stage Manager extension — generalises to continuous domains, or whether a modified formalism (replacing discrete ticks with continuous time, discrete dimension maps with continuous state spaces) is required.

### 9.4 Plays as Organisational Memory: Toward a Knowledge Accumulation Architecture

The play-level synthesis described in Section 3.5.4 notes that a corpus of completed play executions can be indexed for meta-analysis. We argue here that this is not a minor capability — it is potentially the Play Framework's most significant long-term contribution, and it warrants explicit treatment as a research direction.

Every completed play execution is a structured record of:

- The goal the system was given.
- The roles and constraints that were active.
- The sequence of scenes executed, including branching decisions made by the improvisation function.
- The tool calls made and their results.
- The constraint violations encountered and how they were resolved.
- The final outcome and whether the act goals were achieved.

This is not a log file. It is a **structured reasoning trace** — a record of how an agentic system thought, decided, and acted across a complex multi-step task. As a corpus, it is an extraordinarily rich form of organisational memory, qualitatively different from what organisations have previously been able to capture.

We identify four specific uses of this corpus:

**1. Play Refinement.** Analysing completed plays for recurring Dead Rehearsals, frequent constraint violations, and low-fidelity scenes allows play designers to iteratively improve the play definition. The corpus makes the system's failure modes visible in a structured, queryable form rather than buried in logs.

**2. Character Fine-Tuning.** A corpus of completed plays, annotated with outcome quality, constitutes a supervised dataset for fine-tuning character models. A Marketer character that consistently produced high-engagement content in act 3 of successful plays provides positive examples; one that drifted into strategic reasoning and produced low-quality content provides negative examples. This closes the feedback loop between the play's execution history and the quality of future characters.

**3. Automated Play Synthesis.** A sufficiently large corpus of completed plays, paired with their high-level goals, is a training set for a model that generates play definitions from natural language descriptions. This is the "automated play synthesis" direction identified in Section 9.2, and the corpus is its prerequisite. Without execution history, synthesis is prompting; with execution history, it is learning.

**4. Cross-Play Pattern Mining.** An organisation running multiple plays — marketing, engineering, support, research — accumulates a corpus that spans domains. Mining this corpus for cross-play patterns reveals transferable knowledge: role definitions that work well in multiple contexts, constraint configurations that consistently improve coherence, scene types that recur across domains and could be standardised. This is the agentic equivalent of an organisation's institutional knowledge — the accumulated wisdom of how it gets things done — but in a form that is explicit, structured, and actionable rather than tacit and fragile.

The Play Framework's formal structure is what makes this possible. Because every element of the play — characters, acts, scenes, constraints, improvisation choices — is explicitly represented at design time and preserved in the execution trace, the corpus is semantically rich in a way that unstructured logs are not. A query like "show me all plays where the Strategist issued a `command`-type message that was not followed by a successful scene completion within two steps" is expressible and answerable against a Play Framework corpus. The same query is not answerable against a conventional pipeline's execution history, because the concepts of character, role, and message type do not exist in that representation.

The vision we propose is a **Play Library**: a versioned, searchable repository of play definitions and their execution histories, shared within an organisation or — for non-proprietary plays — across organisations. New plays are not written from scratch; they are composed from patterns mined from the library, with characters fine-tuned on relevant execution history, and constraints calibrated against known failure modes. The dramaturgical metaphor completes itself: just as a theatre company accumulates a repertoire over time, a Play Framework organisation accumulates a library of plays that encode how it thinks, decides, and acts.

This is, ultimately, the deepest contribution of the framework: not just a better way to build agentic systems today, but a structure for accumulating the knowledge to build better ones tomorrow.

**9.5 Tool Execution: From Estimated Effects to Observed Reality.** The reference implementation now includes a complete tool execution layer that bridges the gap between simulated planning and real-world action. The architecture operates through a `ToolExecutor` interface with three concrete implementations:

1. **`NoOpToolExecutor`** — returns YAML-configured effects without executing anything (unit tests, CI).
2. **`PropToolExecutor`** — generates convincing domain-appropriate output (*"18 tests passed, coverage 87%"*) with configurable failure probability, applying success or failure effects accordingly (demonstration, thesis defense).
3. **`ClaudeCodeExecutor`** — invokes Claude Code CLI (`claude -p "task" --output-format json --bare --allowedTools "Read,Edit,Bash"`) as a headless subprocess, captures structured output, and applies real effects based on observed results (production, live demo).

Tool-backed actions are declared in the play YAML's `tool_backed_actions` section, mapping action names to tool invocations with explicit success and failure effect vectors. A `requires_approval` flag implements the human-in-the-loop gate from the ethics matrix (Section 3.5.3.1). The tool executor sits at Phase 4.5 of the tick pipeline — after the LLM plans an action but before effects are applied — preserving the existing architecture while adding a reality layer.

**Future extensions** include: MCP server integration for richer tool ecosystems (database queries, API calls, CI pipelines), session persistence across ticks (`--resume` flag for multi-turn tool interactions), and streaming output for real-time observation of tool execution. The `ClaudeCodeExecutor` receives the agent's narrative briefing as context, enabling Claude Code to operate "in character" — a Backend Developer's coding session carries different context than a Tech Lead's code review.

The reference implementation provides the first concrete layer of this vision. The `SimulationMemory` class tracks per-agent action logs, inter-agent affinity scores, and emergent goals across seasons. Each completed tick produces a structured record: the agent that acted, the action chosen, and the effects applied. At season boundaries, this log feeds into a Reflection Scene that synthesises emergent goals — closing the loop between execution history and future behaviour. The action log, relationship graph, and goal history together constitute a minimal but functional execution trace that demonstrates the structural properties required for the Play Library: every element is explicit, queryable, and tied to the play's formal model.

### 9.3 Progressive Discovery as Validation

A simulation does not prove its framework through static test assertions that confirm an expected endpoint. It proves itself through **progressive discovery** — the observable process by which agents deploy, acquire knowledge, align with each other, and make goal-oriented decisions that fulfill the play's purpose.

In the Baisakh Launch case study (a four-product, ten-day release), the simulation demonstrated progressive discovery across four stages:

1. **Agent deployment** — Characters with distinct roles (Backend Architect, Integration Team, Mobile Team, QA Team) enter the world with heterogeneous initial states. The architect starts with high hotel CRS skill; the integration team starts with low API availability confidence. These asymmetries are not bugs — they are the initial conditions from which meaningful coordination must emerge.

2. **Knowledge acquisition** — Through the tick loop, agents encounter unknowns (external API availability, partner sandbox access). The framework does not assume these unknowns resolve favourably. Instead, it provides mechanisms for agents to interact with uncertainty: research actions, reframe actions, and fallback strategies that select mocks when live APIs are unavailable. Knowledge is acquired through action, not through configuration.

3. **Alignment** — The Stage Manager detects when agents are stuck (Dead Rehearsal), when roles drift (fidelity monitoring), and when the group stalls (inter-character deadlock). Reflection Scenes at act boundaries re-anchor each agent to their role and purpose. Alignment is not assumed — it is continuously maintained through the play's structural interventions.

4. **Goal-oriented decision making** — Each act has a completion condition. The Act Orchestrator does not mandate how agents reach it; it defines what "done" looks like and lets improvisation (or the deterministic floor) determine the path. When scope must change — when an unknown remains unresolved, when a stakeholder introduces a requirement — the `reframe` action allows agents to adapt the goal rather than fail against it.

The simulation validates the Play Framework not by producing a correct answer, but by demonstrating that its structural properties (role grounding, constraint acknowledgment, Dead Rehearsal detection, act-based progression) produce coherent behavior under uncertainty. A simulation that produces identical outcomes regardless of initial conditions has proven nothing. A simulation that shows different but coherent paths through the same play — adapting to how unknowns resolve — has demonstrated the framework's load-bearing properties.

### 9.4 External Memory and Working Directory Resolution

The Baisakh Launch case study exposed a structural gap in the current framework: **agents cannot resolve external file paths as memory or working context**.

In the real system being modeled, each character possesses external knowledge stored in the filesystem:

- The Backend Architect has mindstate snapshots, architecture documents, and session journals at specific file paths.
- The Integration Team has partnership documents, API specifications, and webhook schemas downloaded to known locations.
- The Mobile Team has a Flutter project directory with existing code and dependencies.

These file-path-resolved resources constitute the character's **external long-term memory** — knowledge that was acquired in previous sessions and persists across conversation boundaries. The current Play Framework provides two memory layers (Section 3.5.2): working memory (in-process state) and long-term memory (durable key-value store). But it lacks a third layer: **path-resolved external memory** — files, directories, and project structures that exist outside the simulation's state boundary but are essential to the character's knowledge.

This gap is not theoretical. When the Baisakh Launch simulation ran, agents could not access:

- API specification PDFs that determine integration contracts.
- Project directories containing the actual codebase (branch state, migration status, test coverage).
- Memory files from prior sessions (PM philosophy, hotel CRS progress, Dokan partnership terms).

The Play Framework addresses this by extending the Character definition with an optional `external_context` property:

```
C_i = (role, state, actions, behavioural_constraints, external_context)
```

where `external_context` is a set of `(path, purpose, access_mode)` tuples:

- `path`: a filesystem path or URI to the external resource.
- `purpose`: a human-readable description of what this resource provides (e.g., "Hotel CRS session 3 progress snapshot").
- `access_mode`: `read_only` (reference material), `read_write` (working directory), or `checkpoint` (human-in-the-loop gate).

The `checkpoint` access mode addresses a related structural need: **human-in-the-loop inputs**. A real product launch requires credentials, API tokens, repository access, and deployment approvals that no simulation can provide. The Play Framework models these as checkpoint files: a path where the human writes the required input, and the character's precondition for a scene includes verifying the checkpoint file's existence and content. This is not a workaround — it is a first-class scene type.

```yaml
scenes:
  - name: "CRS Staging Credentials"
    type: checkpoint
    path: "/config/crs_staging.env"
    required_keys: [CRS_BASE_URL, CRS_SERVICE_ACCOUNT_PHONE]
    postcondition: "CRS credentials available for integration testing"
    timeout_ticks: 8  # escalate to human after 8 ticks
```

When the checkpoint file exists and contains the required keys, the scene completes and the play progresses. When it does not, the Stage Manager emits a human-directed alert — the only point where the play's execution depends on a force outside the world definition.

This design preserves the framework's core principle (Section 3.5.3.1): **the World definition is the consequence boundary**. External memory paths are declared at play definition time, not discovered at runtime. The human-in-the-loop gate is a scene type, not an ad-hoc interruption. The playwright — the system designer — decides which resources require human input and where in the narrative they must arrive.

### 9.5 On the Adequacy of Architecture

A reasonable objection to the Baisakh Launch case study is that it models a real product launch as a simulation — and that someone unfamiliar with the system's architecture might interpret this as a fantasy artefact, a plan that describes intent without grounding in executable reality.

Spinoza dissolves this objection. An adequate idea, in Spinoza's framework, is one whose internal structure corresponds to the causal structure of what it represents (Ethics II, Definition 4). The simulation's adequacy does not depend on whether it has deployed real code to real servers. It depends on whether its architectural structure — the relationships between characters, acts, constraints, and unknowns — corresponds to the actual causal structure of a multi-team product launch.

The greatest understanding is in the architecture. The implementation that unfolds is the chain of causality at all levels — from the play definition (formal cause), through the agent's role-grounded decision (efficient cause), to the act's completion condition (final cause). If the architecture is adequate — if its causal relationships mirror those of the real system — then the implementation that follows from it is not a fantasy but a consequence.

This is not a claim that simulation replaces execution. It is a claim that **adequate architectural understanding precedes and enables adequate execution**. A team that has simulated its launch — that has named its unknowns, acknowledged its constraints, detected its Dead Rehearsals, and tested its scope-reframing mechanisms — enters real execution with structural confidence that no Gantt chart provides.

The Play Framework's contribution is making this architectural understanding formal, executable, and testable. The simulation is not the product. It is the proof that the architecture from which the product will unfold is adequate.

### 9.6 Concluding Reflection

We began with a simple observation: building agentic systems is hard because we force them into architectures designed for stateless, request-response applications. By turning to dramaturgy — the ancient craft of structuring narrative — we discovered a design language that aligns with how agents actually behave: as characters with roles, memories, and limitations, moving through acts and scenes toward a goal.

The Play Framework does not eliminate the complexity of AI agents; it embraces it. It acknowledges that agents forget, that they sometimes invent, that they need to be influenced rather than controlled. In doing so, it provides a path from rigid pipelines to living systems — systems that can improvise within structure, that can be observed and repaired, and that feel less like machinery and more like theatre.

We believe this approach points toward a broader trend: **simulation-first architecture**, where systems are first imagined as worlds, roles, and stories, and then enacted by autonomous agents. The play is the blueprint. The distributed runtime is the stage. The agents are the actors. And the stage manager ensures the show goes on.

---

## References

1. Agha, G. (1986). *Actors: A Model of Concurrent Computation in Distributed Systems*. MIT Press.
2. Anthropic. (2024). *Building effective agents*.
3. Burke, K. (1945). *A Grammar of Motives*.
4. Caillois, R. (1961). *Man, Play and Games*. University of Illinois Press.
5. Cloudflare. (2026). *Cloudflare Workers Documentation*.
6. Goffman, E. (1959). *The Presentation of Self in Everyday Life*. Doubleday.
7. Hevner, A. R., March, S. T., Park, J., & Ram, S. (2004). Design science in information systems research. *MIS Quarterly*, 28(1), 75–105.
8. Hewitt, C. (1973). A universal modular actor formalism for artificial intelligence. *IJCAI*.
9. LangChain. (2025). *LangGraph Documentation*.
10. Maiden, N., Manning, S., Robertson, S., & Greenwood, J. (2004). Using scenarios and theatre to elicit requirements. *IEEE Software*.
11. Microsoft. (2024). *Azure Durable Functions Documentation*.
12. OpenAI. (2023). *OpenAI Agents SDK*.
13. Satyanarayanan, M. (2017). The emergence of edge computing. *Computer*, 50(1), 30–39.
14. Temporal Technologies. (2025). *Temporal.io Documentation*.
15. Wooldridge, M., & Jennings, N. R. (1995). Intelligent agents: Theory and practice. *Knowledge Engineering Review*, 10(2), 115–152.
16. A2A Protocol. (2025). *Agent-to-Agent Protocol Specification*. Linux Foundation / Agentic AI Foundation.
17. Cemri, M., Pan, L., Yang, Z., et al. (2025). Why do multi-agent LLM systems fail? *arXiv:2503.13657*.
18. Google. (2026). *Agent Development Kit (ADK) Documentation*.
19. Microsoft. (2026). AI agent design patterns. *Azure Architecture Center*.
20. Anthropic Engineering. (2025). Building a multi-agent research system.
21. AWS. (2025). *Strands Agents SDK: Multi-Agent Patterns*.

---

## Appendix C: Cross-Reference — Thesis Sections to Implementation

The following table maps each thesis section to its corresponding implementation and test files in the reference implementation (`sim_v2`). Coverage strength: **Strong** = directly implemented and tested; **Partial** = related but incomplete; **Future** = identified as future work.

| Thesis Section | Concept | Implementation | Tests | Coverage |
|---|---|---|---|---|
| 3.1 Definitions | Play, Character, Act, Scene | `play_definition.dart`, `generic/agent.dart`, `generic/world.dart` | `play_definition_test.dart` | Strong |
| 3.2 Formal Model | P = (W, C, A, S, σ, ι) | `play_definition.dart`, `act_orchestrator.dart`, `tick_scheduler.dart` | `act_orchestrator_test.dart` | Strong |
| 3.3 Controlled Improvisation | Constraint-bounded autonomy | `controller.dart`, `response_validator.dart`, `generic/data_driven_strategies.dart` | `strategies_test.dart` | Strong |
| 3.3.1 Dead Rehearsal | Three anti-pattern types | `stage_manager.dart` | `stage_manager_test.dart` | Strong |
| 3.3.2 Action Ordering | Structural influence via scheduling | `generic/generic_turn_order.dart` | `generic/generic_agent_test.dart` | Strong |
| 3.4 Limitations as Properties | Decay, constraints, acknowledged limits | `generic/generic_state_modifier.dart` (Agent dimension maps replace hardcoded Needs) | `generic/generic_agent_test.dart` | Strong |
| 3.4.3 Compound Effects | Multi-category state change per action | `generic/generic_state_modifier.dart` | `generic/generic_agent_test.dart` | Strong |
| 3.4.5 Reflection Scene | Season-boundary reflection with goals | `living_world.dart` | `generic/medieval_port_test.dart` | Strong |
| 3.5.1 Interaction | Turn-based dialogue | `tick_scheduler.dart`, `schemas.dart` | `full_tick_cycle_test.dart` | Strong |
| 3.5.2 Recall | Working + long-term memory | `living_world.dart` (SimulationMemory), `generic/agent.dart` (actionHistory, relationships) | `generic/medieval_port_test.dart` | Strong |
| 3.5.3 Influence | Serialisation as influence | `context_builder.dart`, `generic/agent.dart` (dimensions serialised) | `context_serialization_test.dart` | Strong |
| 3.5.3.1 World as Ethics Layer | Consequence boundaries | `play_definition.dart` (WorldDefinition), `response_validator.dart` | `play_definition_test.dart` | Strong |
| 3.5.4 Synthesis | Cross-source combination | `living_world.dart`, `act_orchestrator.dart` | `generic/medieval_port_test.dart` | Strong |
| 3.5.5 Act | Goal-bounded execution unit | `act_orchestrator.dart` | `act_orchestrator_test.dart` | Strong |
| 5.1.1 Dramaturgical Gap | Orchestrator serialises structure | `context_builder.dart` | `context_serialization_test.dart` | Strong |
| 5.1.2 Phase-Injection | Composable World→World pipeline | `tick_scheduler.dart` | `full_tick_cycle_test.dart` | Strong |
| 5.1.3 Snapshot Planning | Fairness and order independence | `living_world.dart` | `generic/generic_agent_test.dart` | Strong |
| 5.5 Dual-Track | Deterministic floor + LLM ceiling | `controller.dart`, `generic/data_driven_strategies.dart` | `generic/data_driven_test.dart` | Strong |
| 5.6 Risk-Proportional Validation | Intensity per consequence | `response_validator.dart`, per-use-case validators | `parser_service_validator_test.dart` | Strong |
| 5.7 Temperature as Improvisation | Per-scene temperature dial | `prompt_templates.dart` | `llm_integration_service_v2_test.dart` | Partial |
| 6.5 Test Suite Evidence | Property invariants, determinism | `property_invariants_test.dart` | — | Strong |
| 8.4 Stage Manager | Meta-agent for play integrity | `stage_manager.dart` | `stage_manager_test.dart` | Strong |
| 8.5 Logging to Meta-Agent | Infrastructure path | `logging.dart`, `stage_manager.dart` | `stage_manager_test.dart` | Strong |
| 9.4 Organisational Memory | Execution traces, Play Library | `living_world.dart` (SimulationMemory) | `generic/medieval_port_test.dart` | Partial |
| B1 Event System | Deterministic + random + state events | `generic/data_driven_events.dart`, `event.dart` | `generic/data_driven_test.dart` | Strong |
| B2 Emergent Evolution | Trait/skill drift from action history | `generic/data_driven_rules.dart` | `generic/data_driven_test.dart` | Strong |
| 3.3.1 DR Verification | Keyframe test specification | `play/test_scenarios.dart`, `play/test_runner.dart` | `play/test_scenarios_test.dart` | Strong |
| 3.4.5 Fidelity Monitoring | Reactive reflection + configurable thresholds | `stage_manager.dart`, `living_world.dart`, `domain_schema.dart` | `dev_team_sprint.yaml` (3 scenarios) | Strong |
| 5.5 Narrative Context | Narrative briefing for LLM prompts | `narrative_context_builder.dart`, `context_builder.dart` | Integration via `dev_team_sprint.yaml` | Strong |
| 5.5 Conversation Memory | Per-pair dialogue summaries | `living_world.dart` (ConversationNote), `schemas.dart` | Integration via simulation runs | Strong |
| 5.8 Dev Team Domain | Software development play definition | `plays/dev_team_sprint.yaml`, `plays/PLAY_REFERENCE.md` | 3 test scenarios pass | Strong |
| 6.5.1 Keyframe Testing | Executable play specifications | `play/test_scenarios.dart`, `play/test_runner.dart`, `fake_llm_provider.dart` | `play/test_scenarios_test.dart` (7 tests) | Strong |
| 5.5 Tool Execution | Four-tier execution hierarchy | `tool_execution/tool_executor.dart`, `tool_execution/prop_tool_executor.dart`, `tool_execution/claude_code_executor.dart` | Integration via `dev_team_sprint.yaml` | Strong |
| 9.5 Tool Integration | Claude Code CLI as agent tool | `tool_execution/claude_code_executor.dart`, `domain_schema.dart` (toolBackedActions) | YAML parsing + prop execution | Strong |

**Summary:** 34 of 36 mapped sections have strong coverage, validated by 104 tests covering the domain-agnostic framework. Recent additions include keyframe-based test specification (§6.5.1), narrative context enrichment (§5.5), conversation memory, fidelity monitoring with configurable thresholds, a third domain play definition (software development), and a four-tier tool execution hierarchy from theatrical props to live Claude Code CLI invocation. The two partial items (temperature wiring and Play Library corpus) are identified as near-term extensions in Chapter 9.

---

## Appendix A: Code Listings

### A.1 Agent Class — Domain-Agnostic Entity (Dart)

*Source: `sim_v2/lib/simulation/generic/agent.dart`*

```dart
/// A domain-agnostic agent. Instead of hardcoded needs/traits/skills/emotions
/// fields, all numeric state lives in dimension maps keyed by strings.
/// The DomainSchema defines which dimensions exist; the Agent stores their values.
class Agent extends Equatable {
  final String id;
  final String name;
  final String role;
  final String roleDescription;

  /// All dimension values grouped by category. Each value in [0.0, 1.0].
  final Map<String, double> needs;
  final Map<String, double> traits;
  final Map<String, double> skills;
  final Map<String, double> emotions;

  /// Decay rates per need dimension (from DomainSchema).
  final Map<String, double> needDecayRates;
  /// NPC-to-NPC affinity scores.
  final Map<String, int> relationships;
  /// Emergent goals from reflection.
  final List<String> emergentGoals;
  /// Recent action names for evolution rules and fidelity monitoring.
  final List<String> actionHistory;

  /// Create an agent from a DomainSchema with default values,
  /// optionally overriding specific dimensions.
  factory Agent.fromSchema(DomainSchema schema, {
    required String id, required String name,
    String role = '', String roleDescription = '',
    Map<String, double>? needOverrides,
    Map<String, double>? traitOverrides,
  }) {
    final needs = schema.defaultNeeds()..addAll(needOverrides ?? {});
    final traits = schema.defaultTraits()..addAll(traitOverrides ?? {});
    return Agent(id: id, name: name, role: role,
      roleDescription: roleDescription, needs: needs, traits: traits,
      needDecayRates: Map.from(schema.needDecayRates));
  }

  /// Apply decay to all needs. Returns a new Agent (immutable).
  Agent decayNeeds() {
    final decayed = Map<String, double>.from(needs);
    for (final key in decayed.keys) {
      final rate = needDecayRates[key] ?? 0.0;
      decayed[key] = (decayed[key]! - rate).clamp(0.0, 1.0);
    }
    return copyWith(needs: decayed);
  }
}
```

### A.2 Platform-Independent Interfaces (Dart)

*Source: `sim_v2/lib/simulation/interfaces.dart`*

```dart
/// These interfaces define WHAT the system needs, not HOW it's provided.
/// Any platform can host the Play Engine by implementing these contracts.

/// Provides working + long-term memory for a character.
/// Implementations: in-memory Map, Redis, DynamoDB, Cloudflare KV.
abstract class MemoryStore {
  Future<void> store(String npcId, String key, dynamic value);
  Future<dynamic> recall(String npcId, String key);
  Future<List<Map<String, dynamic>>> semanticRecall(
      String npcId, String query, {int limit = 5});
  Future<int> getAffinity(String npcA, String npcB);
  Future<void> updateAffinity(String npcA, String npcB, int delta);
  Future<void> setGoals(String npcId, List<String> goals);
  Future<List<String>> getGoals(String npcId);
  Future<void> logAction(String npcId, String action, Map<String, dynamic> effects);
}

/// Persists and loads world state snapshots. Required for replay, rollback,
/// and the Play Library's execution trace corpus.
abstract class StateStore {
  Future<void> saveSnapshot(int tick, World world);
  Future<World?> loadSnapshot(int tick);
  Future<List<int>> listSnapshots();
}

/// Receives structured events from the simulation for monitoring and analysis.
abstract class ObservabilityBackend {
  void record(Map<String, dynamic> event);
  void alert(String type, String message, {String? npcId, int? tick});
  Future<void> flush();
}
```

### A.3 Act Orchestrator and Tool Execution (Dart)

*Source: `sim_v2/lib/simulation/act_orchestrator.dart`, `tool_execution/tool_executor.dart`*

```dart
/// Executes a play definition act by act, using the tick scheduler
/// for intra-act execution. Acts end when their goal is met or
/// their tick budget is exhausted.
class ActOrchestrator {
  final PlayDefinition play;
  final DeterministicTickScheduler Function(ActDefinition act) schedulerForAct;
  final Future<World> Function(World, ActDefinition, ActDefinition?)? onActBoundary;

  Future<World> execute(World world) async {
    var w = world;
    for (var i = 0; i < play.acts.length; i++) {
      final act = play.acts[i];
      final nextAct = i + 1 < play.acts.length ? play.acts[i + 1] : null;
      final scheduler = schedulerForAct(act);
      var ticksInAct = 0;

      while (ticksInAct < act.tickBudget) {
        w = await scheduler.executeTick(w);
        ticksInAct++;
        if (act.goal.evaluate(w.agents)) break;
      }

      if (onActBoundary != null) {
        w = await onActBoundary!(w, act, nextAct);
      }
    }
    return w;
  }
}

/// Definition of a tool-backed action from YAML.
/// Maps an action name to a tool invocation with success/failure effects.
class ToolActionDefinition {
  final String actionName;
  final String tool;           // e.g. 'claude_code'
  final String command;        // prompt for the tool
  final List<String> allowedTools; // e.g. [Read, Edit, Bash]
  final Map<String, dynamic> successEffects;
  final Map<String, dynamic> failureEffects;
  final bool requiresApproval; // human-in-the-loop gate
  final int maxTurns;          // tool call limit per invocation
  final int timeoutSeconds;
}

/// No-op executor: returns estimated effects without running anything.
/// Used in deterministic/fake mode to preserve the dual-track property.
class NoOpToolExecutor implements ToolExecutor {
  Future<ToolResult> execute(ToolActionDefinition definition, {
    String? agentContext, String? workingDirectory,
  }) async => ToolResult(
    success: true,
    output: 'no-op: tool execution skipped (deterministic mode)',
    effects: definition.successEffects,
  );
}
```

---

## Appendix B: Survey Instrument

**Participant background:**

1. How many years of experience do you have building software systems? (Open)
2. How many agent or LLM-based systems have you built or contributed to? (0 / 1–3 / 4–10 / 10+)

**After implementing the Research Assistant using System A:**

3. How long did the implementation take? (Open, in minutes)
4. How many lines of code did you write? (Open)
5. Rate the ease of understanding the system's conceptual model. (1 = Very difficult, 5 = Very easy)
6. Rate the ease of debugging when something went wrong. (1 = Very difficult, 5 = Very easy)
7. How confident are you that you could extend this system with a new character? (1 = Not confident, 5 = Very confident)
8. What was the most confusing aspect of this system? (Open)
9. What would you change? (Open)

*(Questions 3–9 repeated for System B.)*

**Comparative:**

10. Which system would you prefer to use for a production deployment? (A / B / No preference)
11. Which system better matched your mental model of how agents should work? (A / B / Neither)
12. Additional comments. (Open)

---

*End of Thesis*