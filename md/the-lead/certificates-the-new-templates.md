---
title: On Agile, AI, and the One Engineering Problem That Refuses to Die
date: 2026-05-31
excerpt: The problem is whether the humans who can reason in a particular way are producing more humans who can reason the same way — or whether they are stepping into architectural roles, encoding their judgment, and quietly taking the generative structure of that judgment with them.

---


# Certificates Are the New Temples

## On Agile, AI, and the One Engineering Problem That Refuses to Die

---

There is a pattern so old it barely registers. A group of practitioners produce an insight — earned, precise, carrying the weight of failure inside it. And then the institution arrives. It extracts the symbol, builds ceremonies around it, creates credentials that confer the symbol on anyone willing to attend a weekend, and calls this preservation.

Buddha got temples. Gandhi got currency. The Agile Manifesto — two pages written by seventeen working programmers — got a certification industrial complex. A Scrum Master credential earns itself in a weekend, without a single debugged race condition, without having shipped something broken and lived with the consequences long enough to understand why the tests mattered.

Certificates are the new temples. Badges are the new statues. The craft is still waiting.

That is the diagnosis.
This is where it gets harder. cuz its not about PM anymore , at least not to me. 

---

## The Complication That AI Introduces

The standard defense of Uncle Bob's position — the one that has sustained it for twenty years — runs roughly like this: technical disciplines are non-negotiable, programmers must assert them as professional standards, and the Agile movement failed because it allowed non-technical actors to strip the engineering core while keeping the process shell.

The standard challenge to that position — the one AI now makes newly available — is this: the reason those disciplines were hard to maintain was never that people didn't understand them. It was that humans are inconsistent, political, tired, and subject to deadline pressure. Culture is a fragile enforcement mechanism. Persuasion fails under stress. Senior engineers who understood TDD deeply still watched it erode in their own teams because the enforcement layer was human, and humans drift.

AI breaks that constraint.

If a senior engineer who has spent fifteen years developing judgment about clean architecture, test coverage, and system boundaries steps into a product or architectural role — and encodes that judgment into prompts, guardrails, and CI harnesses rather than trying to maintain it through culture — something genuinely new becomes possible. The discipline doesn't depend on everyone on the team having internalized it. It gets embedded into the system itself. The gear and the chain both upgrade.

This is not the same situation as a weekend-certified Scrum Master who never understood the discipline in the first place stepping into a PM role. **That person has no discipline to encode**. The senior who crosses over carries the judgment with them, and AI gives them a new medium for expressing it — one that is consistent, scalable, and immune to the political erosion that killed discipline in the first generation of Agile.

The AGI boundary matters here. A well-constructed philosophical prompt — one grounded not just in rules but in the reasons behind the rules — holds until the AI develops the capacity to reason against its own constraints. That is a different problem. Short of that threshold, the guardrail holds. The human inconsistency that made discipline fragile is removed from the enforcement layer. What remains is execution fidelity, and on that dimension AI is simply better than humans.

The argument that programmers stepping into PM or architectural roles represents a repeat of the original co-option fails on this analysis. The co-option happened because non-technical actors captured technical territory. A senior engineer moving into strategic territory while encoding their technical judgment into the system is the opposite movement. It is not abandonment. It is elevation — of the function, not away from it.

**TLDR**: Seniors should be the ones stepping into the role of PM.

---

## The One Problem That Refuses to Dissolve

And yet.

There is one gear in this upgraded chain that the argument above does not fully account for. It is not a reason to reject the model. But it is the load-bearing problem that remains inside it after everything else resolves.

The philosophical prompt — the one grounded in reasons rather than just rules — requires a particular kind of epistemics to construct. Not technical knowledge in the narrow sense. Not familiarity with patterns and frameworks. Something more specific: the knowledge of why a constraint exists *at its edge cases*. The places where the rule breaks down, where following it blindly produces the wrong outcome, where the spirit and the letter diverge and someone has to hold the spirit.

Uncle Bob didn't arrive at "shipping without tests is negligence" from reading a manifesto. He arrived at it from watching systems collapse in specific, painful, traceable ways. From being the person who had to explain to a client why the feature that seemed done wasn't done. From living inside the consequences long enough that the discipline stopped feeling like a rule imposed from outside and became something understood from the inside — structurally, causally, in terms of what it was protecting against and what it cost when it failed.

That failure-derived wisdom is what makes a guardrail philosophically robust rather than syntactically correct. The difference between the two only shows up at the edges — in novel contexts, under pressures the original prompt author didn't anticipate, in situations where the system needs to generalize from principle rather than match against a pattern.

Spinoza's distinction is useful here. Adequate ideas are those where we understand not just the what but the causal chain that produces the what. Inadequate ideas are those where we hold the conclusion without the generative structure behind it. A prompt written from adequate ideas holds under novel pressure. A prompt written from inadequate ideas — inherited, syntactically correct, philosophically hollow — fails precisely in the situations where it matters most, and fails without warning, because it looked right until the moment it didn't.

### Now the unanswered questions : 
Can adequate ideas be transferred without the failure that produced them? Can the judgment a senior engineer accumulated over fifteen years of getting things wrong in specific, costly ways be compressed into documentation, post-mortems, structured mentorship — transferred to the next person without requiring them to repeat the same path?

Well, Maybe. The tools for this kind of transfer are better now than they have ever been. AI-assisted documentation, simulation environments, case-based reasoning — these are mechanisms for making earned judgment more portable. The answer is **not** "obviously no".

But the transfer problem is real. And it is the one problem that AI's execution fidelity does not solve, because the problem lives upstream of execution. It lives in the construction of the constraint itself.

---

## Where This Lands

AI changes the enforcement layer genuinely. A senior who understands the discipline and encodes it into a system is not repeating the original failure. They are doing something new — converting earned judgment into scalable constraint, removing the human inconsistency that made discipline fragile.

What remains — the one engineering problem left inside this — is the reproduction of the knowledge that makes the prompt philosophical rather than merely syntactic. It is a transfer problem. Solvable in principle. Not solved by default.

## What next?
The next generation of prompt authors needs access to compressed failure wisdom — not just the rules, but the causal history that produced the rules. Without it, the guardrails are philosophically fragile in exactly the ways that won't show up until something breaks at scale in a context nobody anticipated, and that , the weekend certified PM can never acknowledge.

The problem is not the AI's execution fidelity. Not the senior's ability to step up. Not the discipline's relevance in an AI-augmented world — which is higher than it has ever been, because when AI generates the code, the only thing standing between a working system and a plausible-looking disaster is the human's ability to reason about correctness from first principles.

>The problem is whether the humans who can reason that way are producing more humans who can reason that way — or whether they are stepping into architectural roles, encoding their judgment, and quietly taking the generative structure of that judgment with them.

Veneration without practice is a well-decorated abandonment.

The upgraded version of that failure is automation without understanding.

Both leave the next generation holding a symbol they did not earn and cannot defend at the edges.