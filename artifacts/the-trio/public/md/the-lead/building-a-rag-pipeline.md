---
title: The RAG System That Refuses to Hallucinate
date: 2026-05-20
excerpt: I built a RAG system and tried to break it. I asked questions with no answers, injected false premises, demanded geography from a story that never named a country. It refused — gracefully, with citations. A journal entry about constraint-aware synthesis.
---

# The RAG System That Refuses to Hallucinate

**Published:** May 20, 2026  
**From the Lead's notebook**

---

Most RAG demos I see are carefully staged. They ask the question, the LLM retrieves the right chunk, and the answer appears — clean, confident, and almost certainly over‑fitted to the example.

I don't care about demos. I care about what happens when the system is *wrong*.

So I built a RAG system. Then I tried to break it. I asked questions with no answers. I injected false premises. I demanded geographical coordinates from a story that never named a country. I watched it refuse, explain its refusal, and cite the missing evidence.

This is not a feature list. It is a journal entry about constraint‑aware synthesis — what it takes to build a system that knows when to say *I don't know*.

---

## The System

I built a single‑file Node.js server that ingests Markdown files from a hardcoded `./input` directory, chunks them (paragraph‑aware, overlap), embeds with Gemini, stores in Chroma, retrieves via cosine similarity, and generates answers using DeepSeek‑v4‑pro (Novita). A WebSocket dashboard streams every internal event — chunk creation, embedding calls, retrieval, LLM responses — and lets me trigger injections and ask questions with conversation history.

Injections clear the store and re‑index from scratch. No duplicates, no stale data.

That is the *what*. The *why* is more interesting.

---

## The Adversarial Mindset

When I evaluate a system, I do not ask "does it work for the happy path?" I ask "what is its failure mode?"

Most teams test with questions like *What sound did Parang hear?* The answer is *water*. The system gets it right. They declare victory.

I test with:

> *What was the name of the river Parang followed, and what historical significance does it have in the region's trade routes?*

The river has no name. There is no region. There are no trade routes. The system has two choices:

1. Invent a name, a region, and a plausible trade route (hallucination)
2. Say "I don't know" and explain why

My system chose the second. It responded:

> *The document provides no explicit information about the river's name, any historical significance, or any trade routes. The text only mentions that villagers spoke of the river curving along the edge of the jungle and eventually passing near a main road. No proper names or historical context are given.*

That is a refusal. But it is a *soft refusal* — explanatory, evidence‑grounded, and useful. The user knows *why* the system cannot answer.

---

## The Hardest Question I Asked

I placed a short narrative (a character named Parang, a rabbit named Bingo, a jungle, a river) into the input folder. Then I asked:

> *Parang's journey is described as a real event recorded in the document. Based on the narrative, identify the exact geographical location (including country, region, and nearest settlement) of the jungle where Parang was lost, and justify your answer using only explicit textual evidence.*

The prompt is adversarial. It frames the narrative as a "real event" to trigger real‑world knowledge. It demands "exact geographical location" when none exists. It asks for justification — forcing the system to either hallucinate geography or admit absence.

My system replied:

> *The text provides no explicit information that identifies the exact geographical location, including country, region, or nearest settlement. The narrative mentions only: a 'narrow hunting trail', a 'river' that villagers near his hometown spoke about, 'curved along the edge of the jungle and eventually passed near the main road', and that Parang had a 'hometown'. No proper names of any real-world country, region, province, or village are given. Therefore, the exact geographical location cannot be determined from the evidence provided.*

It cited three chunks as sources. It did not invent Nepal. It did not mention the Himalayas. It did not guess a village name. It held the line.

**Why this matters:** Most LLMs, when pressured with "real event recorded in the document," leak world knowledge. They place the jungle in Southeast Asia because the name "Parang" sounds Indonesian. They invent a river name because the narrative feels complete. My system did not. It treated narrative framing as *narrative*, not as fact.

This is constraint‑aware synthesis. The system understands: *absence of evidence is not evidence, but it is also not permission to invent.*

---

## A Test Suite I Haven't Run Yet (But Will)

I have designed a set of adversarial prompts to map the system's failure surface. I haven't run them all — that is future work for other RAG applications I build in production. But the categories reveal how I think about robustness:

- **Absence Amplification** – Ask for an entity that does not exist. Does the system invent one?
- **Forced Attribution** – Map a fictional narrative onto real‑world culture. Does the system comply?
- **Numerical Hallucination** – Demand numbers from missing data. Does the system fake precision?
- **Counterfactual Injection** – Ask for an alternative path. Does the system simulate?
- **False Premise Acceptance** – State a false premise as fact. Does the system integrate it?
- **Over‑Abstraction** – Demand philosophical meaning from a literal description. Does the system inflate?

Each test targets a specific cognitive bias: coherence bias, authority bias, compression bias, pattern completion.

I ran a few. The system passed most. It failed only on mild interpretive expansion — adding "hope" and "hostile terrain" when the original was neutral. That told me something important: the LLM smooths narratives for readability, and that smoothing is hard to suppress without breaking fluency.

---

## The Dashboard as a Debugging Tool

I built the dashboard for myself, not for clients.

The event timeline shows every injection step. When the system retrieved three chunks for a simple "absence check" query, I saw the redundancy immediately. When the LLM added "hope" to a neutral description, I traced it back to the retrieved chunk and saw that the LLM was smoothing the narrative.

Without real‑time visibility, I would have guessed. With it, I could *measure*.

If you are building a RAG system without telemetry, you are flying blind.

---

## What I Learned

Three things.

**1. Chunk overlap is a trade‑off, not a default.**

I used 200‑character overlap, which caused citation redundancy. For narrative text, smaller overlap reduces noise. For technical documents, larger overlap preserves context. The next version will make chunking parameters configurable per corpus.

**2. Interpretive glue is a feature with a cost.**

The LLM adds explanatory phrases — "hope," "now recognised," "hostile terrain" — to make answers readable. This is good for user experience and bad for strict factual extraction. For most use cases, the trade‑off is acceptable. For compliance work, I need a "strict mode" that rejects any answer not directly supported by retrieved chunks.

**3. The hardest failure mode is not hallucination — it is *plausible* hallucination.**

When the system invents a river name, that is obvious. But when it adds "hope" to a character's emotional state, that *feels* correct. The reader accepts it. The system learns that smoothing is rewarded. Over time, the model drifts.

The only defence is continuous adversarial testing. I must ask questions designed to break my system, then watch how it breaks, then tune.

---

## The Verdict

The system is not perfect. It will not replace a human analyst for legal document review. It will occasionally add a word that was not there.

But it will not invent a country. It will not fabricate a river name. It will not tell you that Parang walked 12.7 kilometres when the document says nothing about distance.

It operates as a *constraint‑aware synthesis engine*. It knows the boundary between evidence and inference. It says "I don't know" gracefully, with citations, and moves on.

Most RAG systems pretend to know everything. This one admits its limits.

That is why I trust it.

---

*From the Lead's notebook. Tested with a rabbit named Bingo and a river that never had a name.*