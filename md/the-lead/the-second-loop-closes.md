---
title: The Second Loop Closes: When the Observed Talks Back
date: 2026-07-03
excerpt: The sequel to the Balcony Pattern. The observer used to fire verdicts into the void and never learn if it was right. Closing that loop meant designing a protocol between minds of unequal ability — and discovering that the schema is a prompt, feedback must inform but never override, and a loop that labels its own output can start to grade itself.

---

# The Second Loop Closes: When the Observed Talks Back

*The sequel to [The Balcony Pattern](https://chasseuragace.github.io/the-lead/blog/the-balcony-pattern). If you haven't read that one, the one-line version: Piper is a voice layer for coding agents, and its "balcony" is a zero-token git observer that watches what the agent actually changed and holds its narration accountable to ground truth.*

---

## The debt I left myself

The last post ended on an unpaid debt. I'd built an observer that watched the agent's git ground truth and caught it drifting — *said small, did large; claimed done, committed nothing* — but the loop ran in one direction only. The agent spoke, the balcony judged, the verdict returned **to the agent**. The balcony itself got nothing back. It fired a verdict into the void and never learned whether it was right, redundant, or wrong.

The concrete pain was a nag. When I made a deliberate copy-only change with no tests, the balcony said *"source changed without tests"* — correctly, by its lights — and then said it again, and again, because git facts don't carry intent and I had no way to tell it *"that one's on purpose."* A human pair says a thing once and then reads your face. The balcony had no face to read.

I said the fix was to close the second loop: let the agent pass a small structured feedback signal back — *"that concern? intentional, here's why"* — and let the gate and judge take it into account. I also said, and this was the whole point, that **it wasn't mainly an engineering problem.** The schema had to make sense to whatever model was *using* the tool, and the producer of the signal is non-deterministic, so the signal would sometimes be absent, late, or wrong.

Three weeks later the loop is closed. Here's what actually happened when I tried to design a protocol between a smart mind and the dumb ones watching it.

## Designing the feedback signal

The feedback signal is four fields, and it looks like nothing:

```dart
feedback: {
  "re":   "missing-tests",   // which concern — copied verbatim
  "ack":  "intentional",     // one of four kinds
  "why":  "regenerated lockfile"
}
```

In classical engineering this is a trivial DTO. Here, every field is a latent prompt — the naming summons different behavior from different models — and I got it wrong twice before I got it right.

The `re` field was the first mistake. My instinct was to let the agent describe the concern in its own words and fuzzy-match on my end. That's a trap: you're asking a non-deterministic producer to reconstruct a key, and it paraphrases, and the match misses. I didn't see how badly until I ran the eval — with no concern ids shown in the tool's return, exactly one of eight weak agents echoed the id I needed. So the balcony now emits the exact concern ids in its return, and the field says *copy one id from the previous return, verbatim.* Same eval, second run: five of five. The tool's output became the crib sheet for its own input; the producer never has to remember anything, it only has to echo.

The `why` field taught the other half. A single worked example in the field description — `{ "re": "large-churn", "ack": "intentional", "why": "regenerated lockfile" }` — did more than three sentences of schema prose ever managed; a weak model imitates far better than it abstracts. That held for the *speak* tool in post one, and it held again here. The payload being JSON doesn't change it.

## Four acks, one per kind of silence

The interesting part wasn't the plumbing. It was realizing that an acknowledgement carries a *duration*: "stop bothering me" means something different depending on why. So `ack` is a small vocabulary rather than a boolean, and each word sets how long the silence should last:

- **`intentional`** — *I meant it and I own it.* Holds until the change grows materially larger.
- **`addressing`** — *I'm fixing it right now.* Holds only briefly — a couple of minutes — then resurfaces if the fix never lands. This one is deliberately impatient: a promise to fix is not a fix.
- **`not-applicable`** — *the signal doesn't fit here.* Holds until escalation.
- **`disagree`** — *I think you're wrong.* Also holds until escalation — but, quietly, it's also counted against the balcony (more on that below).

The load-bearing word in all four is **escalation**. A dismissal is not a permanent blindfold. The balcony snapshots the magnitude of the change *at the moment you dismissed it*, in coarse buckets, and if the work later jumps a bucket — three files becomes twelve, fifty lines becomes five hundred — the concern breaks through the ack and speaks again:

```dart
// A jump in the coarse file- or churn-bucket beats a standing dismissal;
// small follow-on edits do not, so one extra line never undoes it.
bool _ackEscalated(ack, obs) =>
    fileBucket(obs) > fileBucket(ack) || churnBucket(obs) > churnBucket(ack);
```

This little function is the whole ethic. You can tell the observer *"I've got this"* and it takes you at your word — until the change jumps a bucket, at which point the evidence outvotes the dismissal. The buckets are what keep it from nagging on one more line while still catching a tenfold blow-up: forgiving of noise, but not gullible.

## Inform, never override — and degrade to correct

The rule I set myself in post one was: *let agent feedback inform the observer, never override it; and the easiest thing for a confused model to do — omit the feedback — must degrade gracefully to today's correct behavior.*

That rule held, and it shaped the wiring. An ack does two calm things, neither of which is a veto:

1. It **suppresses** the acked concern at the deterministic gate for this turn (pure key-matching — no model, no "trust" to reason about).
2. It's handed to the LLM judge as **settled intent** — "the developer already answered this; don't re-raise it" — so even on a turn that judges for other reasons, the judge doesn't relitigate a closed question.

And if the `feedback` field is absent — which is exactly what a confused or forgetful model produces — nothing happens, and the system behaves precisely as it did before the loop existed. The worst a confused producer can do is fail to improve things; its misunderstanding never becomes load-bearing, because omission lands right back on the old, correct behavior.

## Teaching the observer to listen

Closing the loop turned out to have a mirror image I didn't expect. The agent can now talk back to the observer — but I also taught the observer to listen to what the agent *says*, not only watch what it *does*.

Post one's balcony judged intent from git facts alone. But the richest claims about intent are sitting right there in the narration: *"tests pass," "committed it," "this is done."* Those are the formulaic tics of an assisted-coding session, and they're checkable. So there's now a second deterministic detector that reads the agent's freshest utterance and fires **only when a claim collides with a contradicting fact:**

```dart
// A claim alone never fires. Reality must disagree.
if (saysTestsPass && srcTouched && !anyTestChangedInWindow)  fire('test-claim');
if (saysCommitted && noCommitLanded && !hasFreshCommit)      fire('completion-claim');
```

The discipline is in the second half of each line. Keyword-matching "tests pass" on its own would be a nag factory. But *"tests pass" while no test file moved in the whole window* is a real, specific, grounded contradiction — the kind worth a word. I guard the phrases against negation and questions (*"I have **not** verified," "should I commit?"*) with a small window of context around each hit, because the surest way to make a detector hated is to have it fire on someone saying the opposite of what it matched.

So the loop ended up bidirectional in a deeper sense than I'd planned: the observed talks back through acks, and the observer reads the narration forward through claims. Both halves are deterministic, and both wake the expensive judge only when a claim and a fact actually collide.

## The ground truth had a blind spot

Here's the bug that taught me the most, because it hid inside the thing I trusted.

The original balcony read the working tree — `git diff HEAD`. But the working tree goes blank the instant you commit. And when does an agent announce "done, shipped, tests pass"? Right after it commits. So my ground truth went dark at the exact moment the narration made its biggest claims. In a live session I watched it fire a confident **high**-severity intervention against a freshly-clean tree — the model inventing drift by comparing an empty diff to stale narration still sitting in the log window. A second bug made that worse: the fact-check meant to drop substance-free lines let *"Zero files altered, yet the narrative expands…"* through, because the string happened to contain the word "files." A persona rambling about nothing had passed for a grounded warning.

The fix was to stop treating the working tree as the whole truth. The balcony now also reads the last several commits *by count*, tags each as inside or outside the current narration window, and folds them into ground truth — so "I committed it" is satisfied by a commit *existing*, not by the tree being dirty.

But that opened a subtler trap, and it's my favorite detail in the whole system. A commit **subject** is not evidence. When the log says `fix: all tests passing`, that is the developer's own claim, sitting in the ground-truth channel wearing a disguise. So the judge is told, in as many words: a subject saying "verified" or "all green" is *not* proof; a "tests pass" claim is satisfied **only** by a commit that actually shows test files changed, never by the wording of the message. The observer had to learn to distrust the one part of git that a human writes by hand. Ground truth is only ground truth where a human's narration can't reach it.

## The loop starts grading itself

The last piece is the one I'm most fond of, because it's almost free and it changes what the system *is*.

Every ack is a label on the balcony's own output. A `disagree` or `not-applicable` is the agent saying *"this concern was wrong here."* An `intentional` or `addressing` is *"right, and I own it."* Aggregate those per concern and you have a labeled dataset of the observer's own false-positive rate — generated, for free, by the thing being observed:

```dart
// The cheap loop generating the data to improve the cheap loop.
final fpRate = falsePositives / total;             // disagree + not-applicable
if (total >= 5 && fpRate >= 0.6)
  advise('$concern is noisy — dismissed $falsePositives/$total times; raise its bar');
```

This is the eval I promised — the one that decides tuning "by evidence instead of intuition." It doesn't auto-silence anything; auto-tuning from a non-deterministic label stream is how you build a system that trains itself into deafness. It *surfaces* the noisy concern so the bar gets raised deliberately, by me, watching the numbers. The model produces the labels; a human still turns the knob. That division — machine gathers evidence, human sets policy — is the same line the whole architecture is drawn along, just pointed inward at the observer itself.

## What the pattern became

Post one drew a line between the deterministic core you *control* and the cognitive edge you *cultivate*, and said systems in this regime are never "done," only **robust-and-improving.** Closing the loop didn't move that line. It made the loop cross it in both directions.

The shape now is a genuine protocol between minds of unequal ability:

- The **smart** mind (the agent) narrates intent and answers concerns.
- The **dumb, deterministic** core (git, ledgers, buckets, key-matching) holds the bedrock and never lies.
- The **cheap cognitive** layer (on-device gates, the tiered judge) spends intelligence only where the bedrock says it's earned.
- And the whole thing **learns from its own disagreements** — not by retraining, but by handing a human the evidence to tune it.

Every field is still a latent prompt; feedback still informs without overriding; an omitted signal still lands on the old, correct behavior. The bedrock stayed dumb on purpose — a thing that can't reason is a thing that can't be argued out of the truth. None of the post-one rules broke under the second loop, which is the best evidence I have that they were the right ones.

The dance floor and the balcony can talk to each other now. The dancer can say *"I meant that step";* the balcony can say *"you said you landed it — the floor is empty";* and when the balcony is wrong too often, the shrugs pile up into a number that tells me to lower its voice.

Which is a good place to admit what didn't close. Wiring up the claim detector, I gave it a probe to tell "skipped the tests" apart from "there's no test harness here" — and then noticed it matches the `_test.dart` suffix but not the `test_` prefix. Piper's own tests use the prefix. So the observer I point at every other repo currently reports that *its own* repo has no tests. The tool is blind in its own house, and I haven't fixed it yet. That's the honest shape of this work: the loop closes, and the same commit that closes it opens a smaller one. I don't think that ever really stops — and I've stopped expecting it to. 🙂

---

*Piper is built in Dart: an MCP server, a zero-token git "balcony" observer that now reads commits as well as the working tree, a claim detector that fires only on narration-vs-reality contradictions, a stateful trip ledger with a bidirectional ack loop, a three-pass tiered judge (cloud diagnose + on-device route and voice) anchored to a deterministic severity pre-score, a co-change coupling miner that tells coherent spread from shotgun scatter, and a calibration pass that turns the agent's own acknowledgements into a false-positive eval. The core stays deterministic and dumb-proof; the cognitive layer is tuned by evidence. If the seam between deterministic and cognitive is where your work lives too, this whole series is really one long note about that seam.*
