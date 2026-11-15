---
title: One Pattern Every Vibe Coder Should Know: Stop Duplicate Writes
date: 2026-07-12
excerpt: You're building the whole stack and most of it works — until two requests arrive in the same millisecond. The thing that breaks first is concurrency. Here's the one pattern that fixes it, and the exact keywords to drop into your prompt so your agent writes it for you.
---

# One Pattern Every Vibe Coder Should Know: Stop Duplicate Writes

**Published:** July 12, 2026  
**Author:** The Lead

---

You're building the full stack. Frontend, backend, database, all of it. Most of it works.

Until it doesn't. And the thing that breaks first is almost always **concurrency**.

Users double-click. APIs retry on a slow network. A background job fires twice. Your generated code handles the happy path perfectly — one request, one response. It does not handle two requests arriving at the same millisecond. So you get two orders. Two accounts. Two charges.

This post is not a lecture. It's one pattern and the four words that get your agent to write it for you.

---

## The pattern

```python
def create_order(checkout_id, payload):
    while True:
        try:
            row = db.execute(
                "INSERT INTO orders (checkout_id, payload) VALUES ($1, $2) "
                "ON CONFLICT (checkout_id) DO NOTHING "
                "RETURNING *",
                checkout_id, payload,
            )
            if row:
                return row  # we created it

            # someone else already created it — return theirs
            return db.execute(
                "SELECT * FROM orders WHERE checkout_id = $1",
                checkout_id,
            )
        except (ConnectionError, TimeoutError):
            continue  # transient — retry
        except Exception:
            raise     # real error — let it surface
```

That's it. One function. It does three things that matter.

**Idempotency.** The same request produces the same result. The first call creates the order. Every call after that returns the *existing* order. No duplicates, no error thrown at the user for clicking twice.

**Atomicity.** The database decides the winner in a single operation. There's no "check if it exists, then insert" — that gap between check and insert is the exact window where the race lives. `ON CONFLICT` closes it. The database, not your app, arbitrates.

**Retry.** A dropped connection or timeout doesn't fail the whole operation. The loop tries again until it succeeds or hits a real error.

Notice what you are **not** writing: no separate existence check, no application-level lock, no distributed-lock service, no error response for a duplicate submission. The `checkout_id` (a unique constraint in the schema) plus `ON CONFLICT` does the work that would otherwise take a page of defensive code.

---

## When to reach for it

Any operation a user — or a retry — can trigger more than once:

- Checkout and order creation
- Account / signup creation
- Payment capture
- "Submit application," "claim reward," "join waitlist"

If a double-click could cost someone money or make a duplicate row, this pattern belongs there.

---

## The part you actually came for: one word

You don't need to write this by hand. You need **one word** you'll actually remember — and, just as important, one the AI can't misread. Here it is:

> ### Make the write **idempotent**.

That's it. Not "double-click-safe," not "don't allow duplicates" — those point at the *button*, and the AI's cheapest guess for a button is a frontend debounce. You'll get a disabled button that still fires two requests, and the duplicate lands in your database anyway.

**Idempotent** has no frontend meaning. It's a server-and-database word, so the AI can only take it one way: make this operation safe to run more than once. Say it about the *write* — `create_order`, not the click — and there's nothing else it can mean.

**How to remember what it means:** *run it twice, get one row.* That's the whole idea. Same call, once or ten times, and the database ends up with exactly one order.

**What the AI does when it hears it.** "Idempotent write" unpacks to the pattern above — and you'll absorb these just by using the word:

- **atomic upsert** — one database operation decides the winner, no race window: `INSERT ... ON CONFLICT DO NOTHING` (MySQL: `INSERT ... ON DUPLICATE KEY`)
- **retry loop** — transient connection errors retry instead of failing
- **return the existing row on conflict** — don't throw an error at the user for clicking twice

If your agent is weak and needs it spelled out, paste this once, then go back to the one word forever:

> Make `create_order` **idempotent** on `checkout_id`: use an atomic `INSERT ... ON CONFLICT DO NOTHING` upsert (not check-then-insert), wrap it in a retry loop for transient errors, and return the existing row on conflict instead of erroring.

But most of the time, one word does it. Say **"make the write idempotent"** and the generated code changes shape — you get the pattern above instead of a disabled button and a prayer.

---

## Why this is the 20 percent

Vibe coding gets you 80 percent of the way — the screens, the routes, the happy path. It's genuinely fast and genuinely good at that.

The last 20 percent is the part that fails under load, and it fails quietly. No crash. Just a support ticket three weeks later: *"why was I charged twice?"* You don't close that gap with more prompting volume. You close it with one word you remember and the AI can't misread: **idempotent**. Run it twice, get one row.

Behind that word live the rest — atomicity, concurrency, retry. You don't have to recite them. You just have to name the guarantee, on the *write*, and let the agent expand it. That's the difference between a system that works in the demo and one that stays up when a thousand people hit it at once.

So keep the mantra. Say it out loud before you ship anything a user can trigger twice:

> **Make the write idempotent. Run it twice, get one row.**

That's it. Four words of intent, and the robust version writes itself.

---

*Vibe code the 80. Say the mantra for the 20.*
