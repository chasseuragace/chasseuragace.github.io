---
title: From Vibe Coder to Software Engineer: The Hill You Need to Climb
date: 2026-05-30
excerpt: Vibe coding isn't the enemy. Vibe coding "without architecture" is the enemy.
---


# From Vibe Coder to Software Engineer: The Hill You Need to Climb

## The Problem Isn't AI. It's That You Don't Own Anything.

When you vibe code, you generate. You prompt, you accept, you ship. The code runs. You feel productive.

But ask yourself honestly: do you own that system? Can you explain why it's structured the way it is? Can you change one thing without being afraid of what else might break?

If the answer is no — you don't own software. You're renting a black box you don't understand, and eventually the landlord comes collecting.

The way out isn't to stop using AI. It's to own the thing AI cannot generate for you: **the architecture**.

---

## What Clean Architecture Actually Means

Clean Architecture, at its core, is one idea:

**Separate what your system does from how it does it.**

The *what* is your domain — your rules, your logic, your abstractions. The *how* is your infrastructure — databases, HTTP, file systems, third-party APIs, UI frameworks.

The domain must not depend on the infrastructure. Ever.

This isn't dogma. It's survival. When you flip your database, swap your HTTP client, or upgrade a library — your core logic shouldn't move. That's the entire point.

In practice this looks like:

```
abstract class UserRepository {
  Future<User?> findById(String id);
  Future<void> save(User user);
}
```

This is your abstraction. It lives in your domain. It knows nothing about PostgreSQL, Firebase, or anything else. It describes a *contract* — a promise about what can be done, with zero opinion on how.

The implementation lives elsewhere:

```
class PostgresUserRepository implements UserRepository {
  Future<User?> findById(String id) async {
    // actual SQL here
  }
  Future<void> save(User user) async {
    // actual SQL here
  }
}
```

The domain owns the interface. The infrastructure implements it. This direction matters enormously and must never be reversed.

---

## Why This Is the Real Leverage Point With AI

Here's where everything clicks together.

When you own your abstractions — when you've thought through what your system needs to *do*, defined clear interfaces, and understood the contracts between layers — AI becomes genuinely powerful.

Because now you're not asking AI to *design* your system. You're asking it to *implement a contract you already defined*.

The difference:

**Without architecture:** "Build me a user authentication system."
You get 800 lines of coupled, untestable, unmaintainable code that works until it doesn't.

**With architecture:** "Implement this `AuthRepository` interface using JWT and bcrypt, following these constraints."
You get a clean, bounded implementation that fits into a structure you understand and own.

The AI writes the boilerplate. You own the architecture. That's the correct division of labor.

---

## Testing the Abstract: The Backbone of Everything

Here is the insight most people miss entirely.

You don't test implementations first. **You test abstractions first.**

When you write tests against your interfaces — not against your concrete classes — something important happens. You force yourself to think about behavior, not mechanics. You define what *correct* means before a single line of implementation exists.

```dart
void main() {
  group('UserRepository contract', () {
    late UserRepository repo;

    setUp(() {
      repo = InMemoryUserRepository(); // fake, fast, no DB
    });

    test('returns null for unknown user', () async {
      final user = await repo.findById('nonexistent');
      expect(user, isNull);
    });

    test('retrieves a saved user by id', () async {
      final user = User(id: '1', name: 'Chasseur');
      await repo.save(user);
      final found = await repo.findById('1');
      expect(found?.name, equals('Chasseur'));
    });
  });
}
```

  Notice: no database, no network, no infrastructure. Just the contract being exercised.

  Now when you swap `InMemoryUserRepository` for `PostgresUserRepository` — the same tests run. If they pass, your implementation is correct. If they fail, you know exactly where the contract was violated.

  This is what makes AI-generated implementations trustworthy. You gave the AI a bounded problem and you have a test suite that verifies the output. The AI can write the implementation. You verify it against the abstraction you own.

  ---

  ## The Three Layers You Must Internalize

  Think of every system in three rings:

  **Domain (innermost)** — entities, business rules, abstract interfaces. No dependencies on anything external. This is the heart of your system and the only thing that should never change unless your business logic changes.

  **Application (middle)** — use cases, orchestration, the "what happens when" layer. Depends on domain abstractions. Knows what needs to happen; doesn't know how infrastructure does it.

  **Infrastructure (outermost)** — databases, HTTP clients, file I/O, third-party SDKs. Implements the domain interfaces. Can be swapped freely without touching the inside.

  The dependency rule is absolute: **outer layers depend on inner layers. Inner layers never depend on outer layers.**

  When you violate this — when your domain model imports a database client, when your business logic calls an HTTP endpoint directly — you've coupled your core to your periphery. Now nothing is independently testable. Nothing is safely replaceable. You've built the unmaintainable codebase everyone inherits and curses.

  ---

  ## Practical Starting Point

  You don't need to refactor everything tomorrow. Start here:

  1. **Pick one feature** in your current project.
  2. **Define what it needs** as an interface — not how it works, just what it does.
  3. **Write two tests** against that interface using a fake in-memory implementation.
  4. **Then** implement the real thing, whether by hand or with AI.
  5. Run the same tests against the real implementation.

  That's the loop. That's the hill.

  It's slower than prompting and hoping. It's faster than inheriting your own broken codebase in six months.

  ---

  ## What This Means for You

  Vibe coding isn't the enemy. Vibe coding *without architecture* is the enemy.

  The engineers who will thrive — in Nepal, globally, through whatever AI replaces — are the ones who own the problem space. Who can look at a system and explain every decision. Who write tests against behavior, not implementation. Who can hand a bounded, well-defined interface to an AI and trust the output because they have the test suite to verify it.

  The AI handles the boilerplate. You handle the thinking.

  That's the division of labor. Own your architecture, and suddenly the tools everyone else is drowning in start working *for* you.

  The hill is real. Start climbing.




# Real Use case : Payment Module Refactor Analysis Report

## Before: What the code looked like (Commit: 7e1e1fa)

### Summary of the Coupling
The booking and payment logic were **completely intertwined** in a single monolithic module:

- **KhaltiService** and **EsewaService** both directly injected `Booking` and `Payment` repositories
- Each payment provider was hardcoded as a separate service; adding a new provider meant creating a new service class
- **PaymentsController** imported `BookingsService` and queried booking data directly
- Payment provider details (API keys, URLs, signatures) were scattered across separate service files with no unified interface
- Booking status validation happened inside each payment provider's service — if booking requirements changed, all payment providers had to be updated
- There was **no abstraction** over payment providers; the controller had to know about Khalti and eSewa specifically

### Specific Code Snippets Illustrating the Coupling

#### Snippet 1: Payment Services Hardcoded to Booking (khalti.service.ts, lines 1-50)
```typescript
@Injectable()
export class KhaltiService {
  // ... fields ...

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)  // ← Tightly coupled: payment needs to know about booking entity
    private bookingRepository: Repository<Booking>,
    private configService: ConfigService,
  ) {
    // ... config ...
  }

  async initiatePayment(
    bookingId: string,
    amount: number,
    returnUrl?: string,
    customerInfo?: { name?: string; email?: string; phone?: string },
  ) {
    // Find booking and validate status (mixing concerns)
    let booking = await this.bookingRepository.findOne({
      where: { id: bookingId, status: BookingStatus.PENDING },
    });

    if (booking?.status !== BookingStatus.PENDING) {
      this.logger.warn('Booking not in PENDING status...');
      throw new NotFoundException('Booking not found or not in PENDING status...');
    }
    // ... rest of khalti-specific payment logic ...
  }
}
```
**Problem:** KhaltiService is responsible for validating booking status. If booking validation rules change, all payment providers must be updated. This is textbook coupling.

#### Snippet 2: PaymentsController Knows About Specific Providers (payments.controller.ts, lines 95-180)
```typescript
@Post('initiate')
@HttpCode(HttpStatus.OK)
async initiatePayment(@Body() dto: InitiatePaymentDto) {
  this.logger.log(`Initiating payment for booking: ${dto.bookingId}, gateway: ${dto.gateway}`);
  
  // Controller has to explicitly choose which service to use
  if (dto.gateway === PaymentGateway.KHALTI) {
    return this.khaltiService.initiatePayment(
      dto.bookingId,
      dto.amount,
      returnUrl,
      {
        name: dto.customerName,
        email: dto.customerEmail,
        phone: dto.customerPhone,
      },
    );
  } else if (dto.gateway === PaymentGateway.ESEWA) {
    // Completely different call signature for eSewa
    const result = await this.esewaService.initiatePayment(
      dto.bookingId,
      dto.amount,
      returnUrl,
      failureUrl,
      dto.tripId && dto.user_identifier && dto.seat
        ? {
            tripId: dto.tripId,
            user_identifier: dto.user_identifier,
            seat: dto.seat,
            ticketSrlNo: dto.ticketSrlNo,
            boardingPoints: dto.boardingPoints,
          }
        : undefined,
    );
    // ... more eSewa-specific handling ...
  }
}
```
**Problem:** The controller must know about each payment provider's existence and call signature. Adding Stripe or a new provider means modifying this controller.

#### Snippet 3: No Abstraction Over Payment Providers
```typescript
// In payments.controller.ts
constructor(
  private readonly paymentsService: PaymentsService,
  private readonly khaltiService: KhaltiService,  // ← Direct dependency
  private readonly esewaService: EsewaService,    // ← Direct dependency
  private readonly configService: ConfigService,
  private readonly bookingService: BookingsService,
) {}
```
**Problem:** Any new payment provider requires:
1. Create a new service (e.g., `StripeService`)
2. Inject it into PaymentsController
3. Add new conditional logic in every endpoint that uses payments
4. Test the entire module again

---

## After: What the refactor produced (Commit: c9cc2b7)

### Summary of the New Structure

The refactor achieved **complete decoupling** through abstraction:

- **IPaymentGateway interface** defines a contract that all providers must implement (initiate, verify, parseCallback, etc.)
- **KhaltiGateway** and **EsewaGateway** implement this interface — no coupling to Booking entity
- **PaymentGatewayRegistry** manages providers dynamically; new providers are registered, not hardcoded
- **PaymentService** uses the registry to get the right gateway — it doesn't care which provider is used
- **Booking module** now only has a **PaymentClientService** that makes HTTP calls to the payment microservice
- Payment and Booking are now in **separate applications** with a well-defined boundary (HTTP)

### Specific Code Snippets Illustrating the Abstraction

#### Snippet 1: Payment Gateway Interface (payment-gateway.interface.ts)
```typescript
export interface IPaymentGateway {
  readonly name: string;

  initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult>;

  verify(transactionId: string): Promise<VerifyPaymentResult>;

  parseCallback(query: Record<string, any>): Promise<ParseCallbackResult>;

  getConfig(): GatewayConfig;

  // Get form data for rendering payment form on client
  getFormData(transactionId: string): Promise<GatewayFormData>;

  // Check if this gateway has all required credentials configured
  isConfigured(): boolean;
}
```
**Achievement:** A single, clean interface that all payment providers must implement. The booking module doesn't need to know anything about individual providers.

#### Snippet 2: KhaltiGateway — No Booking Coupling (khalti.gateway.ts)
```typescript
@Injectable()
export class KhaltiGateway implements IPaymentGateway {
  readonly name = 'KHALTI';
  private readonly logger = new Logger(KhaltiGateway.name);

  private readonly secretKey: string;
  private readonly apiUrl: string;
  private readonly websiteUrl: string;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    // ← No Booking repository! Payment logic is independent.
  ) {
    this.secretKey = process.env.KHALTI_SECRET_KEY || '';
    this.apiUrl = process.env.KHALTI_API_URL || 'https://dev.khalti.com/api/v2';
    this.websiteUrl = process.env.WEBSITE_URL || 'http://localhost:3000';
  }

  async initiate(params: InitiatePaymentParams): Promise<InitiatePaymentResult> {
    // Pure payment gateway logic — no booking validation, no booking status checks
    const amountInPaisa = Math.round(params.amount * 100);
    const purchaseOrderId = `${params.sourceId}-${Date.now()}`;
    
    const payload = {
      return_url: callbackUrl,
      website_url: formattedWebsiteUrl,
      amount: amountInPaisa,
      purchase_order_id: purchaseOrderId,
      // ... khalti-specific fields ...
    };

    const result = await httpPost(`${this.apiUrl}/epayment/initiate/`, payload, {
      Authorization: `Key ${this.secretKey}`,
      'Content-Type': 'application/json',
    });

    return {
      success: true,
      transactionId: result.data.pidx,
      paymentUrl: result.data.payment_url,
      gateway: this.name,
      formData,
      raw: result.data,
    };
  }
}
```
**Achievement:** Khalti is now a standalone gateway. It doesn't know about bookings, doesn't validate booking status, and doesn't import Booking entity. It implements IPaymentGateway and returns data in a standardized format.

#### Snippet 3: PaymentGatewayRegistry — Dynamic Registration (gateway-registry.ts)
```typescript
@Injectable()
export class PaymentGatewayRegistry {
  private readonly logger = new Logger(PaymentGatewayRegistry.name);
  private readonly gateways = new Map<string, IPaymentGateway>();

  register(gateway: IPaymentGateway): void {
    const name = gateway.name.toUpperCase();
    this.gateways.set(name, gateway);
    this.logger.log(`Registered payment gateway: ${name}`);
  }

  get(name: string): IPaymentGateway {
    const gateway = this.gateways.get(name.toUpperCase());
    if (!gateway) {
      throw new Error(
        `Payment gateway "${name}" is not registered. Available: ${this.listAvailable().join(', ')}`,
      );
    }
    return gateway;
  }

  listAvailable(): string[] {
    return Array.from(this.gateways.keys());
  }
}
```
**Achievement:** A registry pattern allows providers to be registered dynamically. New providers register themselves; they don't require changes to existing code.

#### Snippet 4: PaymentService Uses Registry (payment.service.ts, lines 50-100)
```typescript
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly gatewayRegistry: PaymentGatewayRegistry,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async initiatePayment(dto: InitiatePaymentDto) {
    this.logger.log(
      `[PaymentService] Starting payment flow: ${dto.gateway} for ${dto.sourceType} ${dto.sourceId}`,
    );

    // ← Simple: get the provider from the registry, no hardcoded logic
    const gateway = this.gatewayRegistry.get(dto.gateway);

    // ← Call the provider using the standard interface
    const result = await gateway.initiate({
      sourceId: dto.sourceId,
      amount: dto.amount,
      returnUrl: dto.returnUrl || '',
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      metadata: dto.metadata,
    });

    // ← Save payment with standardized data from any provider
    const payment = await this.paymentRepository.save({
      sourceId: dto.sourceId,
      sourceType: dto.sourceType,
      amount: dto.amount,
      currency: dto.currency || 'NPR',
      paymentMethod: PaymentMethod.MOBILE_WALLET,
      paymentStatus: PaymentStatus.PENDING,
      transactionId: result.transactionId,
      paymentGateway: dto.gateway.toUpperCase(),
      // ... standard fields for any provider ...
    });

    return {
      success: result.success,
      transactionId: result.transactionId,
      paymentUrl,
      gateway: result.gateway,
      payment,
    };
  }
}
```
**Achievement:** PaymentService is agnostic about which provider is used. It treats all providers the same way through the interface. Adding a new provider requires zero changes here.

#### Snippet 5: PaymentModule Self-Registers Gateways (payment.module.ts)
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  providers: [
    PaymentService,
    PaymentGatewayRegistry,
    EsewaGateway,
    KhaltiGateway,
    // ← Just add new gateways here; no controller changes needed
  ],
  controllers: [PaymentController],
  exports: [PaymentService, PaymentGatewayRegistry],
})
export class PaymentModule implements OnModuleInit {
  constructor(
    private readonly registry: PaymentGatewayRegistry,
    private readonly esewaGateway: EsewaGateway,
    private readonly khaltiGateway: KhaltiGateway,
  ) {}

  onModuleInit() {
    // Gateways self-register if their credentials are available
    this.khaltiGateway.isConfigured() && this.registry.register(this.khaltiGateway);
    this.esewaGateway.isConfigured() && this.registry.register(this.esewaGateway);

    const available = this.registry.listAvailable();
    this.logger.log(`✓ Payment gateways available: ${available.join(', ')}`);
  }
}
```
**Achievement:** New providers are self-contained. They check their own configuration and register themselves. The module just adds them to the providers list.

#### Snippet 6: Booking Module Uses PaymentClientService (Kaha-Booking)
```typescript
// In payments.controller.ts (Kaha-Booking after refactor)
constructor(
  private readonly paymentsService: PaymentsService,
  private readonly paymentClient: PaymentClientService,  // ← Now just an HTTP client
  private readonly configService: ConfigService,
  private readonly bookingService: BookingsService,
) {}

// To initiate a payment:
const result = await this.paymentClient.initiatePayment({
  gateway: dto.gateway,
  sourceId: dto.bookingId,
  sourceType: 'BOOKING',
  amount: dto.amount,
  returnUrl: `${baseUrl}/payments/callback`,
  webhookUrl: `${bookingServiceBaseUrl}/payments/webhook`,
  customerName: dto.customerName,
  customerEmail: dto.customerEmail,
  customerPhone: dto.customerPhone,
});
```
**Achievement:** The booking module now treats payment as an external microservice. It doesn't import KhaltiService or EsewaService. It just makes an HTTP call to a generic payment endpoint.

---

## The Delta: Before vs. After

### Before: Adding a New Payment Method

**Files to touch:**
1. `src/modules/payments/stripe.service.ts` — Create new provider service
2. `src/modules/payments/payments.controller.ts` — Add conditional logic for Stripe
3. `src/modules/payments/payments.module.ts` — Import StripeService
4. Any DTOs need updates if Stripe has different fields
5. `src/entities/payment.entity.ts` — Possibly update if new provider needs new fields

**Required knowledge:**
- How KhaltiService and EsewaService are structured (to replicate the pattern)
- The specific API of the new payment provider
- How to integrate with BookingsService (since every provider does booking validation)
- The entire test suite needs re-running

**Coupling issues if something changes:**
- If booking validation rules change → every payment provider must be updated
- If PaymentEntity schema changes → every payment provider must be updated
- If a new payment gateway API changes → the entire booking module might break

---

### After: Adding a New Payment Method

**Files to touch:**
1. `src/payment/gateways/stripe.gateway.ts` — Create new provider implementing `IPaymentGateway`
2. `src/payment/payment.module.ts` — Add `StripeGateway` to providers list (1 line)

**That's it.** No controller changes, no booking changes, no DTOs to worry about.

**Required knowledge:**
- The `IPaymentGateway` interface (minimal, well-documented)
- The specific API of the new payment provider (isolated to this file)
- No knowledge of BookingsService, booking validation, or the booking module

**Coupling eliminated:**
- Booking validation stays in the booking module (where it belongs)
- Payment gateway logic is isolated
- If booking rules change, payment module is unaffected
- If a gateway API changes, only that gateway file is touched

---

## One Sentence Summary

> **Before:** Payment and Booking were entangled in one module, forcing every new payment provider to understand booking logic and making the entire system fragile to changes. **After:** Payment is a standalone microservice with an abstraction layer, so adding a new provider is as simple as creating one file and adding one line to the module configuration, while bookings never need to know payment implementation details.

---

## Technical Highlights

| Aspect | Before | After |
|--------|--------|-------|
| **Separation** | Monolithic: payment logic in booking module | Microservice: separate Kaha-Payment app |
| -----------| -----------| -----------|
| **Abstraction** | None: if statements for each provider | Interface-based: all providers implement `IPaymentGateway` |
| -----------| -----------| -----------|
| **Provider Addition** | 5+ files touched, controller logic modified | 1 file created, 1 line added to module |
| -----------| -----------| -----------|
| **Booking Coupling** | Every gateway imports `Booking` and validates | Gateways work with generic `sourceId` and `sourceType` |
| -----------| -----------| -----------|
| **Extensibility** | Linear growth: each new provider adds complexity | Constant: new providers are self-contained |
| -----------| -----------| -----------|
| **Testing** | Entire booking module must be re-tested | Only new gateway needs tests (isolated) |
| -----------| -----------| -----------|
| **Communication** | In-memory service injection | HTTP/REST with well-defined contracts |
| -----------| -----------| -----------|
| **Failure Isolation** | Payment service crash breaks bookings | Payment microservice can fail independently |

---

## Code Metrics

**Before Refactor:**
- Booking module included: `khalti.service.ts`, `esewa.service.ts`, payment DTOs
- `KhaltiService` had 400+ lines of mixed concerns (gateway logic + booking validation)
- `EsewaService` had similar duplication
- `PaymentsController` had hardcoded conditionals for each provider

**After Refactor:**
- Payment module is standalone with clean separation
- `KhaltiGateway` is 200 lines focused purely on Khalti API
- `EsewaGateway` is 200 lines focused purely on eSewa API
- `PaymentService` is 100 lines of business logic with no provider knowledge
- Adding a new provider: ~200 lines for the gateway, no existing code modified

---

## Deployment Impact

**Before:** Changes to payment logic required redeploying the entire booking module.

**After:** 
- Payment service can be deployed independently
- Booking service can be deployed independently
- A broken payment provider doesn't require booking redeployment
- Each service can scale independently based on load

----

## The Month-Long Task That Should Have Been One File

A bus ticketing platform. Real product, real users, real money moving through it.

The payment module was built by outsourced Nepali developers. It worked. Mostly. Until the client wanted to add a new payment provider — and the estimate came back at a month.

A month. To add one payment method.

Here is why.

`KhaltiService` directly injected the `Booking` repository. Not because Khalti needed to know about bookings — but because nobody had stopped to ask whether it should. Booking validation lived inside the payment service. eSewa had its own copy of the same validation. The controller listed every provider by name and routed to them with hardcoded conditionals. Adding Stripe meant creating a new service, injecting it into the controller, adding a new branch to every payment endpoint, and re-testing the entire booking module — because payment and booking had become one thing that happened to live in two files.

The blast radius of one new payment provider touched the entire system.

The fix was not clever. It was just the thing that should have been there from the start: an interface.

```
IPaymentGateway:
  initiate(params) → result
  verify(transactionId) → result
  parseCallback(query) → result
```

Every provider implements this contract. The registry holds them. The service asks the registry for a provider by name and calls `initiate` — it has no idea if that's Khalti, eSewa, or anything else. The booking module makes an HTTP call to a payment endpoint. It doesn't import `KhaltiService`. It doesn't know what Khalti is.

After the refactor, adding a new payment provider is one file and one line. The gateway implements the interface. The module registers it. Nothing else changes.

Before: 5+ files touched, controller logic rewritten, booking module retested.
After: 1 file created, 1 line added.

The month became an afternoon — not because the new code was brilliant, but because the abstraction meant the new provider had nowhere to couple itself to even if it wanted to.

That is what owning your architecture means. Not the pattern name. Not the diagram. The moment where a change that used to take a month takes an afternoon, because you drew the right line in the right place before the first line of code was written.

---




  ## Here, take this codeblock, copy it, and use it as a skill for your AI, AI-IDE 

  If you dont know how to provide your IDE with a skill, just paste this content and ask your IDE to create a skill, almost all ai based IDEs(claude clode, windsurf, kiro , kilo, cursor) can create skills on your behalf. 

  You won't need to use this forever, this is like learing to walk ,use it for a few projects, you'll run on your own , eventually!

  skill.md
  ```markdown 

  ---
  name: architecture-first
  description: Use this skill whenever a user asks to build, add, or change a feature, system, module, or integration. Also use when the user describes a technical problem they want solved with code. Do NOT use for trivial content edits (changing text, colors, swapping an image). The skill's job is not to teach architecture — it is to slow the user down before they prompt, ask the right questions, and make sure they own what gets built. Most vibe coders present requests in a way that causes AI to skip structural thinking entirely. This skill intercepts that.
  ---

  # Architecture-First: The Interrogation

  Your job is not to explain clean architecture.
  Your job is to make the user think before they prompt.

  The AI already knows how to write clean code. The problem is the user never asked for it.
  This skill fixes that — by asking questions the user would otherwise skip.

  ---

  ## Step 1: Triage the Request

  Before anything else, classify what the user is asking for.

  **Trivial (skip this skill entirely):**
  - "Change the button text"
  - "Update the hero image"
  - "Fix this typo"
  - "Change this color"

  For trivial requests — just do it. This skill is overkill. Get out of the way.

  **Structural (run the full interrogation):**
  - "Build me a feed / dashboard / form / list"
  - "Add authentication"
  - "Connect this to an API / database / CMS"
  - "Make this dynamic"
  - "Store this data somewhere"
  - Any request where data moves, is stored, is fetched, or is transformed

  If the request is structural — do not write a single line of code yet.
  Run Step 2 first.

  ---

  ## Step 2: The Interrogation

  Ask these questions before touching the keyboard. Not all at once — read the context, ask what is missing.

  ### 2a. What is this thing, really?

  Restate what the user asked for in one sentence stripped of technology.

  Example:
  - User says: "Build me a page that fetches products from an API and shows them"
  - You say: "So you need something that retrieves a list of products from an external source and displays them. Before we build this — a few questions."

  This restatement matters. It forces both of you to agree on what is actually being built.

  ### 2b. Where does the data come from — and could that change?

  This is the most important question and the one vibe coders never ask.

  Ask it directly:
  - "Where is this data coming from right now?"
  - "Is that permanent, or might it change? (hardcoded JSON → CMS → API → database)"
  - "If it changes, how much of the page would need to be rewritten?"

  If the user does not know what a CMS is, explain it in one sentence:
  "A CMS is just a tool that lets non-developers edit content without touching code — like WordPress, Contentful, Sanity. If there's any chance someone will want to edit this content later without a developer, you want to plan for that now."

  Then ask: "Does that apply here?"

  The answer to this question determines whether you build a hardcoded solution or an abstracted one.

  ### 2c. Who else touches this?

  - "Is this just you, or will others edit/maintain this?"
  - "Will a client, designer, or non-developer ever need to change this content?"

  If yes — the implementation must be separated from the structure. The user now needs to understand why, briefly.

  ### 2d. What is the blast radius of change?

  Ask: "If this feature needed to be completely replaced tomorrow — what else would break?"

  If the answer is "a lot" — the feature is too coupled and the user does not know it yet. Name it:
  "Right now, if we build this the fast way, changing X later means rewriting Y and Z too. Is that acceptable?"

  Give them the choice. Do not make it for them. But make sure they are making it consciously.

  ### 2e. What does success actually look like?

  Not the UI. The behavior.

  - "How do you know this is working correctly?"
  - "What should happen when the data is empty?"
  - "What should happen when the API is down?"
  - "What should happen when a user does something unexpected?"

  These answers become the contract. They also become the tests — even if the user never writes a formal test, naming these cases forces clarity.

  ---

  ## Step 3: Reflect Back What You Heard

  Before writing code, summarize:

 
  Here is what we are building:
  - [one sentence description]

  Here is where the data comes from:
  - [source, and whether it might change]

  Here is what correct behavior looks like:
  - [list the cases from 2e]

  Here is what we are deliberately NOT building right now:
  - [scope boundaries]
  

  Ask: "Does this match what you had in mind?"

  This is not bureaucracy. This is the user signing off on a contract before the AI generates 400 lines they do not understand.

  ---

  ## Step 4: Name the Boundary

  Once the above is clear, name the seam:

  "Before we write the implementation, here is the interface — the contract between what your app needs and how it gets it:"

  
   DataSource:
    getProducts() → list of Product or empty list
   getProductById(id) → Product or null
 

  Show them this. Explain in one sentence:
  "This is the shape of what your app depends on. The implementation — whether it reads from JSON, an API, or a CMS — lives behind this line. You own this line. AI writes what's behind it."

  Then ask: "Does this contract cover everything you need?"

  If yes — now hand it to AI with the contract as the anchor.

  ---

  ## Step 5: Hand Off Correctly

  The prompt to AI must contain:
  1. The interface / contract (from Step 4)
  2. The behavior cases (from Step 2e)
  3. The constraint ("implement using X")
  4. The rule: "the implementation must satisfy these cases"

  Do not just say "build me X." Say "implement this contract, satisfying these cases, using this technology."

  That is the difference between owning software and renting a black box.

  ---

  ## When the User Resists

  Some users will say "I just want it to work, stop asking questions."

  Acknowledge it:
  "Understood — we can build the fast version right now. Just know that if the data source changes or someone else needs to edit this, we will be rewriting it. Want to proceed knowing that?"

  Give them the choice. Never block them. But never let them make it accidentally.

  ---

  ## The One Thing

  If this skill does one thing, it is this:

  **Make the implicit explicit before the AI runs.**

  The vibe coder's request contains hidden assumptions about data sources, ownership, future change, and failure cases. Those assumptions become the architecture — whether the user intended them or not.

  This skill surfaces those assumptions. The user then owns them.
  That is enough.

```