---
title: The RAG System That Refuses to Go Stale
date: 2026-06-25
excerpt: Last month I built a RAG system that refuses to hallucinate. Then a simpler question broke my own design — what happens when a client has a hundred documents and forty of them change every day? "Clear and rebuild" doesn't survive contact with that. A journal entry about the slower kind of lie.
---

# The RAG System That Refuses to Go Stale

**Published:** June 25, 2026  
**From the Lead's notebook**

---

Last month I wrote about [a RAG system that refuses to hallucinate](https://chasseuragace.github.io/the-lead/blog/building-a-rag-pipeline). I was proud of it. It would not invent a river name. It would not place a fictional jungle in Nepal. It said *I don't know* gracefully, with citations, and I told you that is why I trust it.

I left one sentence in that post that I want to come back to:

> *Injections clear the store and re-index from scratch. No duplicates, no stale data.*

That was true. It was also the part of the system that did not survive contact with a real client.

This is the follow-up entry. It is not about a single answer being wrong. It is about the whole index quietly going wrong while every individual answer still *looks* right. That is a harder problem, and for a while my own design was on the wrong side of it.

---

## The Question That Broke My Design

The scenario is unglamorous. A client has roughly a hundred documents. Thirty to forty of them change every single day — edits, additions, a few deletions. They want the assistant to answer from *today's* documents, not yesterday's.

My ingestion model was: clear the vector store, re-chunk everything, re-embed everything, re-insert everything. Clean. Deterministic. No duplicates.

Run that every day against a corpus that changes by a third daily and look at what you are actually doing:

- You re-embed a hundred documents to capture changes in forty.
- Every embedding call costs money and latency you did not need to spend.
- And — this is the part that bothered me — there is a window, mid-rebuild, where the store is **empty**. You cleared it. You have not finished re-inserting. A query that lands in that window retrieves nothing, and a RAG system that retrieves nothing will happily tell you it found no relevant information. Your most confident "I don't know" is now a lie caused by your own maintenance job.

"Clear and rebuild" is a demo strategy. It is honest precisely because it throws everything away — but throwing everything away every day is not a strategy, it is an admission that the system has no memory of its own state.

---

## A Stale Citation Is Still a Lie

Here is the thread that connects this entry to the last one.

The first system's whole virtue was that it would not cite what was not there. But suppose I solve the rebuild cost the lazy way — I stop clearing, and I just re-embed the documents that changed, inserting the new chunks on top.

Now imagine a document **shrinks**. Yesterday it was four paragraphs and produced five chunks. Today an editor cut it to one paragraph — one chunk. I re-embed the new version and insert one fresh chunk. The other four chunks from yesterday are still sitting in the store. Nothing deleted them.

So now my constraint-aware, refusal-happy, *I-would-never-invent-a-river* system retrieves a paragraph that **no longer exists in the source document** and cites it. With a source link. Confidently.

That is worse than the invented river. The invented river is obviously fiction. The orphaned chunk *looks* exactly like ground truth — it was ground truth, yesterday — and the citation makes it more believable, not less. It is hallucination with paperwork.

I called the first system trustworthy because it knew the boundary between evidence and inference. But there is a second boundary it never had to think about: the boundary between *evidence* and *evidence that has since been deleted*. A system that holds the first line and not the second has not earned the trust I gave it.

The enemy in the first post was a system that says more than the document supports. The enemy here is a system that remembers more than the document still contains. Same lie. Slower fuse.

---

## What I Actually Built

I gave the system a memory of its own state, and I made every sync reason against that memory instead of bulldozing it.

**A registry as the source of truth.** Every document gets hashed — SHA-256 over its content — and the hash is recorded in a small JSON registry alongside its size, modification time, chunk count, and when it was last indexed. The registry is the system's answer to one question: *what do I currently believe is in the store, and what version of it?*

**A diff, not a rebuild.** When a sync runs, the system loads the current files, hashes each one, and compares against the registry. Every document falls into exactly one of four buckets:

- **added** — the registry has never seen this id
- **changed** — the id exists but the hash no longer matches
- **unchanged** — id and hash both match; do nothing
- **removed** — the registry has it, the folder no longer does

For the hundred-document, forty-change case, sixty documents land in *unchanged* and the system does not touch them. No re-embedding, no cost, no churn. Only the delta moves.

**Delete-before-insert, so shrinking files leave no ghosts.** This is the orphan problem from above, and the fix is an ordering discipline. Chunk ids are deterministic — `{docId}_chunk_{index}` — so a document's chunks are addressable as a set. When a document changes, the pipeline deletes *all* of its existing chunks first (a filtered delete: remove every chunk whose `original_id` is this document), and only then inserts the new ones. Four old chunks gone, one new chunk in. No survivors from the previous version. A removed document gets the same delete with no re-insert, and its registry entry is dropped.

**The store is never empty.** Because a sync only ever touches the delta, retrieval stays available the entire time. There is no window where the store is wiped. The maintenance job can no longer cause the false "I don't know."

I kept the old full-rebuild path — it is a legitimate escape hatch when you want to nuke and pave — but it is no longer the routine. The routine is the diff.

---

## The Bug I Want To Confess

There is a failure I caused and then caught, and the honest thing is to write it down.

The full rebuild and the incremental sync share one piece of truth: the registry. When I first wired them together, the rebuild path cleared the store, re-embedded everything — and *forgot to tell the registry what it had done*. The registry still reflected some earlier state, or nothing at all.

The consequence was quiet and expensive. You run a full rebuild. Everything is freshly embedded and correct. Then the nightly incremental sync runs, consults the registry, finds it does not match reality, and concludes that **every document is new** — and re-embeds the entire corpus a second time. The exact double-work I built the registry to prevent, triggered by the registry being out of sync with the store it is supposed to describe.

The fix is a principle, not a patch: *any operation that changes the store must leave the registry describing the new state.* So the full rebuild now repopulates the registry to mirror exactly what it embedded. I have a test that pins this down — full rebuild, then an immediate incremental sync — and asserts that the second pass re-embeds **nothing** and classifies every document as unchanged. If that assertion ever fails again, the double-work is back, and I will know.

The lesson generalizes past this codebase: the moment you keep a cache of "what I believe is true," you have signed up to keep it honest on every write path, not just the convenient one. A source of truth that drifts is worse than no source of truth, because you trust it.

---

## Proving the Part the Mock Can't

I test most of this with in-memory fakes — a deterministic embedder, an in-memory store — and they are fine for proving the *logic*: the diff buckets, the orphan removal, the no-double-embed guarantee. Six rounds of delta tests, all green, no external services required.

But there is one claim a fake cannot prove, and it happens to be the dangerous one: **does a filtered delete actually work against a real vector store?** "Delete every chunk where `original_id` equals this document" is a sentence I can make my mock obey trivially. Whether Chroma honors that same filtered delete — that is the thing the orphan fix *depends on*, and a mock that I wrote to pass will always tell me yes.

So I wrote a separate live test that stands up a real Chroma instance and exercises only that capability, using tiny deterministic dummy vectors so it needs no embedding API key at all. Store three chunks across two documents. Delete one document by id. Assert exactly the right chunks survive and the deleted document's chunks are gone. Then the orphan case directly: re-add a document with three chunks, delete-then-insert one, assert no orphans remain.

It passes. But the point is not that it passes — it is that I refused to let the comfortable test stand in for the uncomfortable one. The mock proves I wired the logic correctly. Only the live test proves the database agrees with me. Those are different claims, and the gap between them is exactly where production incidents live.

---

## The Quieter Work

Two things happened alongside the sync work that are worth a paragraph, not a section.

The system used to be a single file. It is now a set of modules — configuration, events, the core registry and chunker, loaders, embedders, stores, inference, pipelines, the server — each with one job. I did not do this for elegance. I did it because the single file had reached the size where I could no longer hold it in my head, and a system you cannot hold in your head is a system you stop reasoning about and start poking at. The split is for the next person who has to change one thing without fearing the other ten.

And the dashboard — the debugging tool I said I built for myself — grew an *Incremental Sync* button next to the full rebuild, so the delta path is something I can watch happen in the event stream rather than something I trust on faith. I also stripped it down: removed the decoration, tightened the layout, made it read like an instrument panel instead of a toy. If the first post's lesson was *if you are building RAG without telemetry you are flying blind*, this is me admitting the instruments themselves deserve to be legible.

---

## What I Learned

**1. Freshness is a correctness property, not an ops detail.**

I used to file "how do we keep the index up to date" under operations — a cron job, somebody else's problem. It is not. A stale index produces confidently-cited wrong answers, and that is the same category of failure as hallucination. If you care that the system does not lie, you have to care when it last told the truth.

**2. The dangerous bugs live between two components that each work.**

The registry worked. The store worked. The double-embed bug lived in the *handshake* between them — one changed state and did not tell the other. No single component was broken. Most of the failures that will actually hurt you look like this: not a broken part, but two correct parts that disagree about reality.

**3. Write the test you are afraid of, not the test that is easy.**

A mock I authored to pass is a mirror, not a witness. The filtered delete against a real Chroma is the only test in this whole effort that could have genuinely surprised me — which is exactly why it was the one worth writing. The comfortable test confirms your design. The uncomfortable test confirms reality.

---

## The Verdict

This is still a POC. I want to be precise about its limits, the way I was last time.

The sync is *triggered*, not automatic — there is no file-watcher yet. Today something has to call the incremental endpoint or press the button; the system does not yet notice a file changed on its own. The registry is a JSON file, which is fine for a hundred documents and would not be fine for a million. None of this is hidden; it is just not done.

But the thing I claimed last month is now actually true, instead of true-by-throwing-everything-away. The system can keep a changing corpus coherent without wiping itself every night, without re-embedding what did not change, without leaving a single orphaned chunk behind when a document shrinks, and without a window where it answers from an empty store.

Last month I built a system that refuses to invent what was never there. This month I taught it to refuse to remember what is no longer there. They turn out to be the same promise, kept twice.

That is why I still trust it.

---

*From the Lead's notebook. The river still has no name. But now, when a document loses a paragraph, the system loses it too — on purpose.*
