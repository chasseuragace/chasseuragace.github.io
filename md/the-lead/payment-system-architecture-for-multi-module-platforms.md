---
title: Payment System Architecture for Multi-Module Platforms
date: 2026-04-09
excerpt: When multiple booking modules share a platform, payment cannot live inside any one of them. It must be extracted, made generic, and governed by a single contract. Here is how.
---

# Payment System Architecture for Multi-Module Platforms

**Published:** April 9, 2026  
**Author:** The Lead

---

Most payment integrations are written once, inside a single application, for a single gateway. Then a second module needs payments. Then a third. Each one re-implements the same gateway logic with slight variations, and within a year you have three implementations of Khalti, two of eSewa, and zero confidence that any of them handle edge cases the same way.

This is not a code problem. It is a domain modeling problem.

## The Domain, Not the Code

Let us start where we always start: what actually exists in this space?

A payment is not a "transaction." A payment is a **lifecycle** — it begins with an intent, moves through initiation, enters a gateway's domain (where you have no control), and returns as either a confirmation or a failure. Between initiation and confirmation, time passes. The user is somewhere else. The gateway is doing its own thing. Your system is waiting.

The entities are:

- **Payment Intent** — a booking module says "I need Rs. 1,200 collected from this customer for this purpose"
- **Payment Session** — the gateway's representation of that intent (Khalti calls it a `pidx`, eSewa calls it a `transaction_uuid`)
- **Verification** — your system asks the gateway: did this actually happen?
- **Confirmation** — the booking module is told: yes, proceed with your domain logic

These four stages exist regardless of whether the booking is for a bus seat, a hotel room, or a flight. The payment domain is **gateway-specific** but **module-agnostic**.

This is the insight that changes the architecture.

## The Extraction

If payment is module-agnostic, it does not belong inside any module. It belongs in its own service.

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Bus Booking      │    │  Hotel Booking    │    │  Airline Booking  │
│  Module           │    │  Module           │    │  Module           │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
         │    Same contract      │    Same contract      │
         │                       │                       │
         └───────────┬───────────┴───────────┬───────────┘
                     │                       │
              ┌──────▼───────────────────────▼──────┐
              │         Payment Service              │
              │   (Khalti, eSewa, future gateways)   │
              └──────────────────────────────────────┘
```

Every booking module speaks the same language to the payment service. The payment service speaks the gateway's language internally. No booking module ever imports a Khalti SDK or an eSewa signing library. They do not know and do not care.

## The Contract

The contract between a booking module and the payment service is small. Deliberately small. Four operations:

### 1. Initiate

```
POST /payments/initiate
{
  "gateway": "KHALTI",
  "sourceId": "booking-uuid-here",
  "sourceType": "BUS",
  "amount": 1200,
  "currency": "NPR",
  "returnUrl": "https://your-app.com/payment/callback",
  "customerName": "Aarav Sharma",
  "customerEmail": "aarav@gmail.com",
  "metadata": {
    "tripId": "TRIP-5001",
    "seatNumbers": "A1, A2"
  }
}
```

The payment service does not know what a trip is. It does not know what a seat is. It stores `sourceId` and `sourceType` so it can route callbacks back to the right module, and `metadata` so the module can reconstruct context later. That is all.

The response contains a `paymentUrl` — the gateway's hosted checkout page. The booking module redirects the user there.

### 2. Callback

The gateway redirects the user back to your `returnUrl` with query parameters. The payment service receives this, looks up the session, and determines success or failure.

This is where it gets interesting.

With Khalti, the callback includes a `pidx` and a `transaction_id`. You verify by calling Khalti's lookup API with your secret key:

```
POST https://dev.khalti.com/api/v2/epayment/lookup/
Authorization: Key live_secret_key_...
{ "pidx": "the-pidx-from-callback" }
```

With eSewa, the callback includes a base64-encoded `data` parameter. You decode it, then verify the HMAC-SHA256 signature using your secret key and the `transaction_uuid`:

```
Decode: base64(data) → { transaction_uuid, status, total_amount, ... }
Verify: HMAC-SHA256(signed_field_names, secret_key) === signature
```

Two completely different verification mechanisms. Two completely different security models. Both hidden behind the same payment service interface. The booking module sees none of this.

### 3. Verify

```
POST /payments/verify
{
  "bookingId": "booking-uuid-here",
  "gateway": "KHALTI",
  "transactionId": "txn-from-callback"
}
```

The payment service verifies with the gateway, updates its own records, and returns a status. The booking module then makes its domain decision: confirm the booking with the supplier, or cancel the seat reservation.

### 4. Webhook (Async)

Gateways also send server-to-server notifications. The payment service receives these at a webhook endpoint, correlates them with existing sessions, and forwards events to the booking module:

```
Event: payment.completed → Module confirms booking
Event: payment.failed    → Module releases seats
Event: payment.refunded  → Module processes cancellation
```

This is critical because callbacks depend on the user's browser. If the user closes the tab after paying, the callback never arrives — but the webhook does.

## The Golden Rule

There is one rule that governs the entire flow, and it is non-negotiable:

> **The supplier order is placed ONLY AFTER payment has been verified internally.**

Not after the callback. Not after the user says "I paid." After the payment service has independently verified with the gateway that funds were collected.

In practice:

1. User selects seats/flights/rooms → Module reserves with supplier
2. Module calls Payment Service → User pays via gateway
3. Payment Service verifies → Returns `COMPLETED`
4. **Only now:** Module confirms the order with the supplier

If verification fails or times out, the module cancels the reservation. No money collected, no order placed.

This seems obvious. But the number of systems that confirm orders optimistically — before payment verification — and then spend months reconciling mismatches is staggering.

## What This Enables

Once the payment service is extracted and the contract is stable, several things become possible:

**Adding a new gateway** is a change inside the payment service. No booking module is touched. When ConnectIPS or a card processor is added next quarter, it is a single pull request in one repository.

**Adding a new booking module** requires zero payment code. The airline team reads the contract, implements the four calls, and payments work. They never see a gateway secret key. They never handle signature verification. They never parse gateway-specific callback formats.

**Payment analytics** become centralized. Revenue, refund rates, gateway success rates — all queryable from one database. No stitching together data from three different implementations with three different schemas.

**Security surface** shrinks. Gateway credentials live in exactly one service. Signature verification logic exists in exactly one place. If Khalti changes their API, one team fixes it.

## The Uncomfortable Part

This architecture requires that the booking module trusts the payment service. It cannot verify with the gateway directly — it does not have the credentials. It must accept the payment service's word that funds were collected.

This is a feature, not a bug. It is the same principle that makes any service boundary work: you trust the service to do its job, and you verify through the contract, not by reaching around it.

If you cannot trust the payment service, the problem is not architectural. It is organizational. Fix the org, not the architecture.

## The Implementation Reality

In the system I have built and deployed, the concrete numbers look like this:

- **Contract surface:** 4 endpoints (initiate, callback, verify, webhook)
- **Gateway implementations:** 2 (Khalti, eSewa) — extensible to N
- **Booking modules consuming it:** 2 active, 1 in development
- **Lines of gateway-specific code in booking modules:** 0

The bus booking module was the first consumer. It took the architectural hit — the payment service was extracted from it. The hotel module was the second. It integrated in days, not weeks. The airline module is third. The integration guide is a single document, not a codebase tour.

That is the payoff of modeling the domain correctly before writing the code.

---

*Payment is a domain. Not a feature. Treat it accordingly, and every module you build afterward inherits the investment.*
