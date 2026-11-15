---
title: The RAG System That Finally Stopped Writing Code It Already Built
date: 2026-07-23
excerpt: I built a RAG system that refuses to hallucinate and another that refuses to go stale. Then I looked at the stack and realized I was about to write eighty percent of a framework that already exists. The engine was never the product. A journal entry about graduating the POC.
---

# The RAG System That Finally Stopped Writing Code It Already Built

**Published:** July 23, 2026  
**From the Lead's notebook**

---

If you've been following this journal, you know the story so far.

First, I built a RAG system that refused to hallucinate. It would not invent a river name. It would not place a fictional jungle in Nepal. It said *I don't know* gracefully, with citations, and I trusted it.

Then I built a RAG system that refused to go stale. It could keep a changing corpus coherent without wiping itself every night, without re-embedding what did not change, without leaving orphaned chunks behind when a document shrunk. I taught it to forget what was no longer there.

This entry is not about a new feature. It is about what happened when I stepped back and realized how much code I had written — and how much I was about to write again.

---

## The Quiet Accumulation

The project started as a single file. That was fine. A single file is easy to hold in your head. You can reason about it. You can change one thing without fearing the other ten.

Then it became modules. Configuration, events, registry, chunker, loaders, embedders, stores, rerankers, inference, pipelines, policies, server. Each with one job. The split was necessary — the single file had reached the size where I could no longer hold it in my head, and a system you cannot hold in your head is a system you stop reasoning about and start poking at.

Then came the golden dataset. The replay harness. The LLMPolicy with fallback. The diff-based sync. The registry with hashing. The delete-before-insert discipline. The live tests against real Chroma. The dashboard with incremental sync.

I had built something I was proud of. It was honest. It was fresh. It could be tested.

But somewhere in the middle of writing the thirteenth module — somewhere between "I need to handle OCR" and "I need to support file system watching" — I stopped and looked at the stack.

I had built a RAG system. A good one.

I had also built approximately eighty percent of a RAG framework. And the remaining twenty percent was going to take another three months — vaguely guessed, but real enough to feel heavy.

---

## The Pattern I Could Not Unsee

The moment I realized I was building a framework instead of a solution was when I started designing features I had already seen somewhere else.

**Query rewriting for multi-turn conversations.** I was about to write a module that takes the last few turns, resolves coreferences, and outputs a self-contained query. I sketched it out. It would need to be configurable. It would need different strategies — maybe a sliding window, maybe a rolling summary. It would need tests.

That is a solved problem. I was about to write it again.

**Document ingestion from different sources.** I had mock and real loaders. But I was going to need PDFs. And Word documents. And Confluence pages. And Google Drive. And a file system watcher to notice changes automatically. Each with their own parsing quirks, their own chunking strategies, their own metadata extraction. I was going to write connectors for all of them.

That is a solved problem. I was about to write them again.

**Observability and tracing.** I had serverEvents and WebSocket streaming. But I was going to need structured logging, trace visualization, cost tracking, latency breakdowns. I was going to need to understand *why* the system made a decision, not just *what* it decided — because those are the metrics that make sense of the flow at the end of the day. I was going to write all of them, because they all matter.

That is a solved problem. I was about to build my own telemetry system again.

I stopped and asked myself a question — for this is the right time to do it, at least I feel like it:

*If I continue down this path, what will I have built in three months?*

A bespoke RAG system with bespoke replacements for every component that already exists in open-source frameworks. It would work. It would be tailored to my needs. And it would be a maintenance burden that only I understood.

---

## The Solutions That Already Exist

I did what any reasonable engineer does when they suspect they are reinventing the wheel. I stopped writing code and started reading.

There are frameworks that have already solved every problem I was about to solve again. They handle chunking with configurable strategies — paragraph-aware, semantic, recursive. They integrate with dozens of embedding models and vector stores. They provide retrieval strategies that go beyond simple cosine similarity — hybrid search, reranking, metadata filtering, parent document retrieval. They have agentic workflows with tool calling, multi-step planning, and self-reflection. They have evaluation modules that measure faithfulness, relevance, and completeness. They have observability integrations that send traces to production platforms.

They do all of this with abstractions that are composable, testable, and well-documented. They have been battle-tested by thousands of developers. They have communities that report issues and contribute fixes. They have roadmaps that I do not have to maintain.

I was about to write all of that myself. Not because I needed something unique — but because I had not stopped to look at what already existed.

---

## What I Was Missing

I researched what else I was missing. The list was longer than I expected.

**Data ingestion pipelines** that handle incremental updates, deduplication, and metadata extraction — not just "clear and rebuild" or even "diff and sync," but proper lifecycle management for documents that change over time.

**Indexing strategies** beyond vector search — summary indexes for high-level queries, property graph indexes for relationship-based retrieval, tree indexes for hierarchical documents, each optimized for different query patterns.

**Query routing** that decides which index or data source to query based on the question — not just sending everything to the same retriever.

**Response synthesis** strategies beyond "stuffed context" — things like refine, map-reduce, and tree summarization for handling large contexts efficiently.

**Evaluation frameworks** that go beyond unit tests — continuous monitoring of retrieval quality, answer faithfulness, and latency, with the ability to detect drift over time.

I could build all of these on my own. Coding is a solved problem with AI agents by my side. All I need is the understanding — and I would eventually grasp those I had been missing. For now, I see them as steps in a ladder. Each one is learnable. Each one is implementable.

But building them all, one by one, is not the path to production. It is the path to a research project. And I needed to be honest about which one I was actually running.

---

## The Third Option

I had been treating frameworks as a compromise — a trade-off between control and convenience. You use a framework when you are willing to give up flexibility for speed. You build from scratch when you need total control.

But that is the wrong mental model for RAG.

The right mental model is this: **RAG is a composition of well-understood patterns.** Chunking, embedding, retrieval, reranking, synthesis — these are not novel. They are settled. The value is not in implementing them from scratch. The value is in *combining* them for your specific domain, your specific data, your specific users.

A framework is not a black box that limits your control. It is a set of **composable abstractions** that let you focus on the parts that are unique to your problem.

---

## The Question I Had Not Answered

There was another question, deeper than the technical ones, that had been lurking beneath the surface of every design decision.

*What is this system actually for?*

I am an engineer. I am more than happy to build the shape of the thing. The architecture. The abstractions. The elegant diff sync with its registry and its delete-before-insert discipline. The golden dataset with its replay harness. The dashboard with its event stream.

I built it because it was interesting. Because it taught me something. Because I could.

But I am also a potter creating a pot. And a pot — carefully made, hardened in the furnace, glazed with care — if it sits under the sun with someone never using it, that would be a waste.

The Japanese have a concept for this: *ikigai* — the intersection of what you love, what you are good at, what the world needs, and what you can be paid for.

The first two parts I had. I love building systems. I am good at it. But the last two were missing. Who needs this? What problem does it solve that someone actually has?

I had built a general-purpose RAG engine. A beautiful one. But general-purpose is not a use case. General-purpose is a toolkit. And a toolkit is not a solution — it is a collection of parts waiting for a purpose.

---

## The Decision

I am migrating the system to a production-grade framework.

But more importantly, I am giving it a use case.

The system will become a **document intelligence assistant for compliance teams** — specifically, for organizations that need to keep their RAG systems fresh against rapidly changing policy documents, regulations, and internal guidelines.

This is a real problem. Compliance teams spend hours manually verifying that their AI assistants are citing the *current* version of a policy, not yesterday's draft. They need to know that a citation is not just relevant but *active*. They need confidence that when a document is retired, the system stops citing it — immediately, without a manual cleanup job.

My system already solves this. The diff sync. The registry. The delete-before-insert. The golden dataset that verifies retrieval decisions against human judgment. All of it points toward a system that can be trusted not just to be accurate, but to be *current*.

This is the pot that someone will actually use. A flower pot, not a sculpture. A tool, not a showpiece. Though it will also be an aesthetic showpiece on my portfolio — because I have learned that craft and presentation are not opposites.

Now the migration has purpose. I am not just adopting a framework to save myself work. I am adopting it to build a product that someone needs, faster than I could build it from scratch, with fewer bugs, with production-ready observability, with connectors that already work, with abstractions that are already documented.

The framework is the wheel. My system is the cart. And the cart is going somewhere.

---

## What This Taught Me

1. **Build to understand; adopt to scale.**

The POC is the right way to learn. You cannot understand RAG by reading documentation. You have to build it, break it, and rebuild it. But once you understand the shape of the problem, continuing to build the same components is not learning — it is overhead.

2. **The hardest part of engineering is knowing what to build.**

I did not waste time building the POC. I wasted time *contemplating* building the production system from scratch. The moment I saw the pattern — "I am about to write a connector for Confluence" — I should have stopped and asked what I was actually adding. The answer was nothing. I was re-implementing.

3. **Frameworks are not a compromise; they are a division of labor.**

A framework handles the parts of RAG that are generic. My application handles the parts that are specific — the prompts, the evaluation, the domain logic. That is not a trade-off. That is a partnership.

4. **A system without a use case is a sculpture.**

I can build a beautiful engine. But a beautiful engine that never runs is just an art project. Art is valuable. But I am not an artist. I am an engineer. I build things that solve problems. And this system — fresh, honest, testable — solves a real problem for compliance teams. That is the difference between a pot under the sun and a pot holding flowers.

5. **Understanding is the real asset, not code.**

I can build any of those missing features on my own. I have the skills. I have the AI agents. The code is not the constraint — the understanding is. And now I have the understanding. The next step is to apply it at the right level of abstraction, not to re-implement every layer from first principles.

---

## The Verdict

The system is not going away. It is being reborn.

The golden dataset stays. The replay harness stays. The dashboard stays. The refusal to hallucinate stays. The refusal to go stale stays.

But the implementation moves to a foundation that thousands of developers have already tested, maintained, and improved.

And the purpose — the use case — is now clear. A document intelligence assistant for compliance teams. A system that tells you not just what is true, but what is *current*. A system that refuses to cite what was deleted, refuses to invent what was never there, refuses to guess when it does not know.

I wrote the first two posts about building a system I could trust.

This post is about trusting the ecosystem enough to let it carry the weight — and trusting myself enough to point it at something that matters.

From the Lead's notebook. Still no river name. But now there is a river to follow.

---

## Postscript: What I Keep, What I Release

| Keep | Release |
| :--- | :--- |
| Golden dataset & ReplayHarness | Custom chunking logic |
| Domain-specific prompts | Custom embedder wrappers |
| Adversarial test suite | Custom retrieval logic |
| Dashboard (event visualization) | Custom vector store abstraction |
| LLMPolicy fallback strategy | Custom inference provider integration |
| Registry + diff-based sync | Custom ingestion pipeline |
| Compliance use case | Generic "RAG engine" identity |

The registry stays. The sync stays. They are application logic, not framework-provided. But the *execution* of that sync — the actual embedding calls, the actual Chroma operations — will be orchestrated by the framework's ingestion pipeline, not my custom code.

I am not abandoning the POC. I am graduating it.

And I am putting it to work.