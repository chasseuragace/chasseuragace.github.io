---
title: Governance as a Feature: The Retail System That Can't Lie About Itself
date: 2026-06-24
excerpt: Three weeks ago I called vibe-coded software a liability. This is the counter-proof — a multi-store retail platform AI wrote most of, built so its permissions, its documentation, and its money can't silently drift from reality. Including an honest account of what's still broken.
---

# Governance as a Feature: The Retail System That Can't Lie About Itself

**Published:** June 24, 2026  
**From the Lead's notebook**

---

Three weeks ago I wrote that vibe-coded software is a liability — twenty thousand lines nobody can explain, waiting to collapse the moment reality touches it.

A fair question came back: *so show us the opposite.*

This is the opposite.

It's a multi-store retail platform — point of sale, inventory and transfers across outlets, procurement, returns, expenses, and Nepal's VAT/IRD fiscal rules. AI wrote most of the code. I can account for every line of it.

The distance between those two sentences — *AI wrote it* and *I can account for it* — is the entire subject of this post.

---

## The thing that actually rots

People debate AI code as if the risk were bad syntax. It isn't. The model writes syntactically fine code all day. The risk is subtler, and it's the same risk that kills systems humans write by hand — it just arrives faster.

As a system grows — more outlets, more staff, more rules, more obligations — the failures that hurt are rarely crashes. They're **silent divergences**:

- A permission the UI offers that the API doesn't actually enforce.
- A diagram of who-can-do-what that stopped matching the code two sprints ago.
- A sale total that quietly disagrees with the ledger.

None of these throw an error. A bug announces itself. A divergence just waits — until a cashier reaches data they shouldn't, or an audit finds the books and the screen telling different stories.

So the organising principle of this system is narrow and stubborn: **make the divergences that matter structurally impossible, instead of relying on discipline to prevent them.** Discipline is exactly what doesn't scale when an AI is generating code faster than any human reviews it.

---

## Correctness as a property, not a habit

AI-assisted code fails in one characteristic way: locally plausible, globally wrong. A guard that reads fine but checks the wrong permission. An adapter that returns a subtly malformed shape. A diagram that no longer matches the routes it claims to describe.

You cannot out-review this. Catching every bad diff by eye is the very habit that doesn't survive velocity. So I stopped trying to make each change correct and started making whole categories of mistake impossible to express. Four decisions carry most of that weight.

### 1. The documentation is generated from the code

A multi-role system's most-asked question is *who can do what, through which screens and endpoints?* — and that answer is the first thing to rot. So nobody writes it. The in-app role/process flowchart is **generated** from the structures the app already enforces: the permission policy, the navigation model, a build-time scan of every route's guard, and the state machines. A test fails the build if the generated model and those structures disagree.

The honest scope matters: this guarantees the picture matches the *policy it's drawn from* — not that every guard fires correctly at runtime. It closes the gap that actually rots (the policy changes, the diagram doesn't), not all gaps. Within that scope, it's documentation that cannot lie.

### 2. One source of truth for who-can-do-what

Every permission has to agree in two places: the client, which shows or hides an action, and the server, which allows or denies it. When they drift you get the two classic failures — a button that 403s on click, or, worse, an action the UI hides while the API still permits it.

So there is one permission object, imported by both the client and the server. Affordance and enforcement are the same fact. Adding a capability is a single edit that propagates everywhere — including into the generated diagram above.

I tested this the day I split discounts out of a generic "manage products" permission into a first-class "manage discounts" action. One edit to the policy object moved through the client gate, all three discount endpoints, and the flowchart at once, with a single test run confirming nothing was left orphaned. That is the design paying rent, not a promise about it.

### 3. Money is server-owned and append-only

Two mistakes haunt anything that touches money. Mutating the original sale on a return — which destroys the audit trail and makes a partial return ambiguous (refund two of five units of a discounted line, and what's owed?). And trusting the client with the numbers — letting the browser send a figure the user can edit.

Both are designed out. The sale write path snapshots the real per-line economics — cost of goods, and the net price actually charged after the line's share of any discount, which the code calls *the truth a refund reads*. Returns are append-only credit-notes that read that frozen figure, with exact-remainder arithmetic so partial refunds sum to the original to the paisa. And the point of sale never sends a price: it sends a discount *id*, and the server reloads the scheme and recomputes the amount, re-validating every rule before it touches the total.

Here's the part I won't dress up: this is append-only and server-authoritative by design, but it is **not transactional**. The stack has no multi-statement database transactions, so a crash mid-write can leave a partial effect. That is precisely why reconciliation is a tracked, deliberately-unfinished gap rather than an afterthought — more on that below.

### 4. AI over a verification scaffold

This is the decision the other three exist to enable. AI is the throughput; the scaffold is what makes the throughput trustworthy. Single-source permissions mean a wrong inline check has nowhere to exist. The drift test catches a diagram that wandered from the policy. The append-only model means a careless write can't quietly rewrite history. And verifying against the *real* stack rather than mocks surfaces malformed output immediately.

It did. Testing the live database — not a unit test — surfaced a bug a mock would have hidden: a result-unwrap heuristic that false-positived on any record with its own `value` field, so discount updates saved correctly but returned a garbage object. It was caught because the real system was exercised, then fixed everywhere the pattern lived. The work is in the verification scaffold, not the generation. That is the whole craft of building with AI: not typing less, but knowing exactly where it fails and standing structure in the way.

---

## I audit before reality does

None of this came from getting it right the first time. I run an adversarial pass over my own systems before I trust them — and on this one, an audit logged fifty-seven findings, the largest of which was blunt: authorization was living only in the frontend. The API didn't validate the token. Anyone could read or write any location's data.

I'm telling you that on purpose. The governance above isn't abstract good taste — it's the response to a real, named failure my own process caught. That's the point of auditing your own work: not to perform rigor, but to find the hole before reality does. The fix wasn't a patch. It was the single-source, server-authoritative architecture this whole post describes.

---

## What isn't done

A clean-wins-only story reads like marketing, and you've learned to distrust it for good reason. So here is what's actually true:

- **There is no paying customer and no production users yet.** This is a reference build. It shows the system can be built and reasoned about; it does not show a business got a return.
- **It's single-tenant by design.** Multi-tenant was researched and deferred — the product is sold per business, self-hosted or managed, so one tenant per deployment is a deliberate fit.
- **Several features are deferred, and the real work was deciding which kind each is.** Offline POS is pure infrastructure — the domain rules already exist, only the client queue is missing. Supplier management, adjustment approval, and reconciliation are *domain* gaps that touch the append-only ledger, so the first deliverable for each is a product decision, not code. Knowing the difference is the judgment; guessing it at 2am is the liability.
- **Write atomicity is the known weak point** — the fail-soft, transactionless write path is the weakest load-bearing assumption here, which is why reconciliation ships with a *deliberately failing test* in the suite, so the gap can never be quietly forgotten.
- **UI consistency is an open workstream**, tracked, not hidden.

And one I found while writing this. Reviewing the system to describe it honestly, I noticed the discount product picker was prefetching up to a thousand products and filtering them in memory — fine in a demo, would buckle on a real catalog. I rebuilt it to search the database directly before this post shipped. That's the standard turned on its own author: hold the system against reality, including the parts no one had complained about yet.

Every gap here is named and tracked — in the audit log, in the deferred-features docs, in a failing test. The system is built to surface its own gaps. That is the same property as everything above, pointed inward.

---

## Why I'm showing you this

The thing a piece of work like this is evidence of isn't the feature list. It's how the next system will be built — which is what anyone hiring or contracting is actually buying.

What this one demonstrates is a single discipline: build the structures that keep a system honest as it grows, and hold your own claims to the same standard. Permissions that can't diverge. Documentation generated from the code instead of maintained beside it. Money that's server-owned and append-only. AI run over a scaffold that catches its failure modes. And a gap found and fixed *because* the system was being written up honestly.

The most useful forward statement I can make: the next thing to harden is write atomicity. The transactionless write path is the weakest assumption in here, and it's why reconciliation isn't optional. Knowing that — and saying it out loud — is the job.

The retail platform is the worked example. The way it was reasoned about is the thing on offer.

---

*The system is live — try it yourself:* [retail-268.netlify.app](https://retail-268.netlify.app)
