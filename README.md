# Agro-Budget — an AI budget manager for Credit Agricole

**Hackathon track:** *Credit Agricole: The Bank of the Future*
**Team deliverable:** a clickable prototype of a new banking product (not another app screen)

> Synthetic data only. All names, amounts, farms and transactions in this prototype are fictional and used solely to demonstrate the product logic.

---

## One-liner

Agro-Budget is an AI budget manager built into the bank's app that shows a small farmer their cash-flow gap *months before it happens*, and immediately offers three honest ways to cover an equipment need: **buy it, take a season-shaped loan, or rent it from a neighbour who is also a bank client.**

## Try it

Open `index.html` in a browser (all three files — `index.html`, `style.css`, `script.js` — must sit in the same folder). No build step, no backend: every number on screen is computed in the browser from the data set at the top of `script.js`.

| Page | What it demonstrates |
|---|---|
| **Overview** | The core insight: a forecasted cash gap is surfaced on the home screen, not buried in a report |
| **Cash flow** | 12-month forecast chart + an AI chat that answers budget questions in plain language |
| **Purchase** | The three-option decision engine (buy / credit / rent) with live numbers |
| **Rent nearby** | The neighbour-matching and escrow flow |
| **Analytics** | Expense breakdown and seasonality |
| **Farm** | Client profile and data-consent toggles |

---

## 1. Customer

**Owner of a small Ukrainian farm or agricultural FOP** — working hypothesis: simplified taxation (group 4), 1–5 employees, sells the harvest to a handful of buyers, 50–200 hectares. Not "farmers" in general and not "18–35 year-olds."

Why this fits Credit Agricole specifically: the bank already serves thousands of agribusiness clients, including small farms, and already has working-capital, guarantee and equipment-financing products for this segment. Agro-Budget is not a new customer segment — it is a missing layer of *intelligence* on top of products the bank already sells.

## 2. Problem

A farmer's income arrives a few times a year; expenses are constant and come in seasonal spikes (sowing, equipment, wages). As a result:

- **The cash-flow gap is discovered too late** — usually when the account balance is already negative.
- **The client doesn't know how much debt they can safely carry.** Doing this by hand requires monthly cash-flow accounting with seasonality baked in, which most small farms don't have the tooling for.
- **Buying equipment is the single largest one-off expense**, and it's exactly what breaks the budget in the months with no incoming revenue.
- From our (synthetic) client interview: farmers pick a bank for a credit line with no upfront fee and are constantly trying to patch potential gaps — but a credit line *covers* the gap, it doesn't *predict* it.

**Problem statement:** *A small farmer sees the cash-flow gap too late and doesn't know how to safely finance equipment.*

## 3. Product

Agro-Budget has three connected parts inside the bank's app:

**a) Budget & forecast.** The client asks a question in plain language ("how much will sowing cost me"), and the AI computes average income/expenses, shows seasonality, and forecasts the gap based on the farm's own transaction history. It flags unusual spikes and asks what they were — the client confirms, the AI never decides on its own.

**b) Purchase need.** The client states what they want to buy. The system estimates a market price range and checks it against the forecasted budget, then shows three options: buy outright, credit/lease shaped to the season, or rent.

**c) Rent from a neighbour.** The bank already knows which of its clients nearby have idle equipment. With consent from both sides, the bank acts as guarantor: payment through escrow, insurance, a digital agreement. The equipment owner earns income on an idle asset and services their own loan more easily.

This is not "one more feature" — it combines analytics, lending, insurance and payments, and it creates a new revenue line for the bank.

### Customer Journey

| Step | Client does | Bank does |
|---|---|---|
| 1 | Opens the app, sees the forecasted gap on the home screen | Runs the forecast from existing transaction data, no manual input required |
| 2 | Asks the AI a question or taps a suggested chip | Answers with numbers and the reasoning behind them |
| 3 | Enters an equipment need (what / when / area) | Prices the market range and checks it against the safe borrowing limit |
| 4 | Compares buy / credit / rent side by side | Shows the effect of each option on the worst month of the forecast |
| 5 | Picks credit → submits application, or picks rent → sends a request to a neighbour | Routes credit to the account manager; for rent, opens escrow and insurance |
| 6 | Confirms an unusual transaction when asked | Excludes one-off spikes from the recurring forecast |

## 4. WOW moment

Within two minutes, the client sees a cash gap months in advance and gets three honest options to close it — including renting from a neighbour, an option they never had before.

## 5. Business Model

**Revenue:** interest on the season-shaped credit/lease, an escrow and settlement fee on rentals *(bank tariff — to be set)*, insurance commissions on rental agreements, float on client balances during the off-season.

**Costs:** product development, credit risk-scoring, agro-relationship managers, loan-loss reserves, insurance partnerships.

**Effect on the bank:** higher client retention, cross-sell across lending/insurance/payments, and *lower credit risk* — the equipment owner on the other side of a rental gets an extra income stream that makes their own loan easier to service.

**Scale — assumption, needs internal data:** pilot on a limited group of existing agro-clients (assumption: 100–200 farms). Real volumes require the bank's own portfolio data, which we don't have access to for this prototype.

## 6. Marketing

**Positioning:** *"Don't cover cash gaps — see them coming."*

**Channels:** the bank's existing agro-relationship managers, branches, farmer associations and agri-fairs, equipment dealers, farmer chat communities.

**First clients:** a pilot among existing agro-clients, a free trial season for the AI budget manager *(assumption)*.

**Launch plan:** pilot in one region → measure gap-prediction accuracy and rental take-up → expand region by region.

## 7. IT & Security

**Systems involved:** core banking (accounts & transactions), credit scoring, the agro-relationship-manager CRM, the mobile/web banking app, a payments module for escrow, and insurance-partner integrations.

**Data used:** the client's own account transactions, land-plot data from state registries with client consent *(needs legal verification)*, a reference price list for equipment.

**Role of AI:** every number and calculation is done by deterministic code — the model's job is to understand the client's question and explain the result in plain language. This keeps the risk of a hallucinated figure out of anything financial.

**Security is part of the product, not a footnote:** explicit client consent before using their data; bank secrecy is preserved — a neighbour's contact details are shown only after both sides agree; data minimisation; an access log; role-based access for agro-managers. This prototype uses only synthetic data.

## 8. MVP & Roadmap

**MVP:**
- 12-month cash-flow forecast from existing transaction history
- Gap alert on the home screen
- Buy / credit / rent comparison for one equipment category (sprayer)
- AI chat limited to a fixed set of budget questions

**Pilot:**
- Full equipment catalogue and neighbour-matching by GPS radius
- Escrow-backed rental flow with a real insurance partner
- Anomaly detection tuned per region and crop type

**Scale:**
- Automatic seasonal cash reservation ("set aside part of the harvest payout for next spring")
- Open the rental marketplace across regions
- Scoring model that uses land and weather data to refine the safe-borrowing limit

---

## Prototype notes

- Static front end: `index.html` + `style.css` + `script.js`, no backend, no network calls.
- All financial figures (cash-flow forecast, the buy/credit/rent comparison, escrow totals) are computed from the data objects at the top of `script.js` (`MONTHS`, `EQUIPMENT`, `NEIGHBOURS`), so changing those numbers recalculates the whole interface.
- The "AI chat" on the Cash Flow page is a scripted Q&A for the demo; in production this maps to an LLM call constrained to read-only financial functions, per the "AI explains, code calculates" principle above.
- Every specific figure in this document (the safe-borrowing limit, pilot size, pricing) is a stated assumption for the pitch, not a claim about Credit Agricole's actual portfolio.
