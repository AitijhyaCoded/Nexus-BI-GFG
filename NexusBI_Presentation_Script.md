# NEXUS BI — GFG HACKFEST PRESENTATION SCRIPT
### Aitijhya Roy | Kolkata
#### Read this once before sleeping. Read it again before walking up.

---

## GOLDEN RULE BEFORE YOU START

> Do NOT wait for silence. Do NOT say "good morning everyone."
> Walk up, open the laptop, and START TYPING the first query.
> Let the chart appear BEFORE you say a single word.
> Then turn to the judges and begin.

---

---

## THE OPENING — First 45 Seconds
### (Chart is already loading on screen behind you)

*[Type: "Show total revenue by product category" — then turn to face judges]*

---

**"That question I just typed?**

**A data analyst would take 20 minutes to answer it.**
**A BI tool would need you to know SQL.**
**Nexus BI answered it in 3 seconds — in plain English.**

I didn't write a query.
I didn't configure a chart.
I didn't touch a filter.

I just... asked."

*[pause — let them look at the screen]*

"That's the entire point of what we built."

---

---

## THE PROBLEM SETUP — 60 Seconds
### (Keep it sharp. No boring backstory.)

---

"Every company today has data. Terabytes of it.

But here's the dirty secret —
**90% of the people who need that data can't access it.**

Not because it doesn't exist.
Because it's locked behind SQL.
Behind dashboards that take days to configure.
Behind a data team that has a ticket queue 40 requests deep.

The CEO wants to know why revenue dropped in Asia last quarter.
She sends a message to the data team.
The data team gets back to her on Friday.
It's Tuesday.

**That's not a data problem. That's a communication problem.**

Nexus BI is the translator."

---

---

## THE DEMO — The Heart of Everything
### (This is where you win. Slow down here. Let each result breathe.)

---

### DEMO QUERY 1 — The Quick Win

*[Type: "What is the average discount percentage for each product category?"]*

"I asked that in English. Watch what happened underneath."

*[Click to expand the SQL reveal]*

"It wrote the SQL itself.
It picked the right chart type itself.
And look here —"

*[Point to confidence badge]*

"**High confidence.** It's telling you how certain it is about its own answer.
When was the last time a BI tool was honest with you about its uncertainty?"

*[Beat.]*

"Most tools just... give you a number and hope you don't question it.
We show you the query. We show you the confidence.
**Full transparency. No black box.**"

---

### DEMO QUERY 2 — The Time Series

*[Type: "Show monthly revenue trend for 2022 and 2023 side by side"]*

"This is where most teams' projects break.
Multi-dimensional. Time-series. Two years.

Watch."

*[Chart renders]*

"Multi-line chart. Correct axes. Correct date parsing.
And look down here —"

*[Point to the Predictions panel]*

"The AI didn't just chart the data.
It read the data and told us what it means for the business.
A narrative. An actual business takeaway.

Because a chart without context is just a picture."

---

### DEMO QUERY 3 — THE SHOWSTOPPER
### (Slow down the most here. This is your winning moment.)

*[Type: "Which customer regions have the highest discount percentage but the lowest revenue per order?"]*

"This is the question every CFO is actually asking.
Are we over-discounting somewhere?
Are we spending money on discounts that aren't generating revenue?

This isn't a simple GROUP BY.
This requires the AI to reason about two metrics simultaneously,
find the tension between them,
and surface the answer."

*[Chart renders]*

*[Pause 3 full seconds. Let them read it.]*

"Now watch this."

*[Type in follow-up chat: "Now filter this to only show Asia and Europe"]*

"I didn't reload the page.
I didn't change any settings.
I just continued the conversation.

**The dashboard has memory.
It knows what we were talking about.
And it updated only what needed to change.**

This is what we mean by conversational BI.
Not query-response.
**Conversation.**"

---

### DEMO QUERY 4 — The Hallucination Guard
### (This one surprises judges every time. Most teams skip it.)

*[Type: "What is the profit margin for each product category?"]*

*[Show the cannot-answer response]*

"It said no.

Not a wrong answer.
Not a made-up number.
**No.**

Because this dataset has revenue data. It doesn't have cost data.
Without cost, you cannot calculate profit margin.
And Nexus BI knows that.

Every other team's project right now?
If you ask them this question —
they'll give you a number.
A confident, beautifully formatted, completely wrong number.

**We built the system to know what it doesn't know.**

That's not a limitation. That's integrity."

*[Beat. Let it land.]*

"Now watch — I'll rephrase it to something the data CAN answer."

*[Type: "Which product category has the highest revenue per unit sold?"]*

"And now it answers perfectly."

---

### DEMO QUERY 5 — Anomaly Detection
### (Only use this if an anomaly badge appeared earlier — if not, skip)

*[Point to the amber anomaly alert if visible]*

"One more thing I want to show you.
That amber warning appeared automatically.
We didn't ask for it.

That's IQR-based statistical outlier detection —
running on every single query result,
with zero extra AI calls,
flagging data points that fall outside the expected range.

It's the system proactively telling you:
**'Hey, something looks unusual here. You should investigate.'**

A junior analyst would miss that.
Nexus BI doesn't."

---

---

## THE TECH SECTION — 90 Seconds Max
### (Frame as decisions, not a list of buzzwords)

---

"Let me quickly talk about how we built this —
not what we used, but *why* we made the choices we made.

**The biggest engineering challenge wasn't the AI.**
It was making sure the AI didn't lie.

When you send a natural language query to an LLM,
it will do its absolute best to give you an answer —
even when the answer doesn't exist.
That's called hallucination, and in a business context,
a hallucinated revenue number can cost someone their job.

We solved this three ways:

One — **the cannot_answer flag.**
Every prompt instructs Gemini to explicitly return false
if the question can't be answered from available columns.
Not a guess. A refusal.

Two — **self-healing SQL.**
If the generated query fails on the database,
we automatically send the error back to Gemini,
ask it to fix specifically what broke,
and retry once.
The user never sees a crash.

Three — **confidence scoring.**
Every response returns high, medium, or low confidence
based on how cleanly the question maps to available data.
It's displayed on every chart, every time.

We also collapsed what could have been 4 separate AI calls
into a single structured JSON prompt —
so each user query costs exactly one Gemini API call.
That's how we stay fast and stay within rate limits."

---

---

## THE CLOSING — Final 45 Seconds
### (Memorize this. Say it without looking at notes.)

---

"The problem we're solving isn't technical.

It's human.

There are brilliant people in every company
who have never written a line of SQL in their life —
and they shouldn't have to.

The VP of Sales shouldn't need a data engineer
to answer the question:
'Why did we lose revenue in Europe last month?'

She should be able to just ask.

**Nexus BI makes that possible.**

Not by simplifying data.
Not by dumbing down analysis.
But by putting a conversation layer
between the human and the database —
one that's transparent, honest,
and fast enough to keep up with how people actually think.

We didn't build a demo.
We built something we'd actually use."

*[Close laptop halfway. Look up.]*

"Thank you."

---

---

## JUDGE Q&A — Likely Questions & How to Answer

---

**Q: "What happens if someone uploads a sensitive dataset?"**

"Great question — we don't store uploaded data beyond the session.
The CSV is loaded into a temporary Neon table,
and the schema and sample rows — never the full dataset —
are what goes into the AI prompt.
The actual data never leaves the database."

---

**Q: "How do you handle very large CSV files?"**

"Pandas handles the parsing and we load it into PostgreSQL,
so the actual query execution scales with the database, not the AI.
Gemini only ever sees the schema and 3 sample rows —
the data volume doesn't affect prompt size or cost."

---

**Q: "Why Gemini and not GPT-4?"**

"Two reasons — Gemini 2.5 Flash has a 1 million token context window,
which gives us room to grow,
and Google AI Studio made it the natural choice for this hackathon stack.
The architecture is model-agnostic though — swapping the model is one line of config."

---

**Q: "How is this different from just using ChatGPT with a spreadsheet?"**

"ChatGPT with a spreadsheet gives you a conversation.
We give you a dashboard.
The output isn't text — it's interactive, exportable visualizations
with confidence scoring, anomaly detection,
and a follow-up chat that mutates specific charts without resetting the whole view.
That's a product, not a prompt."

---

**Q: "What would you add if you had more time?"**

"Three things — user authentication so teams can share dashboards,
scheduled query reports sent by email,
and multi-table joins so you can upload multiple CSVs
and ask questions that span both.
The architecture already supports it."

---

---

## FINAL REMINDERS — Read Before Walking Up

```
✓  Start by typing. Talk second.
✓  Point at things on screen when you mention them.
✓  Pause after each chart loads. Let them read it.
✓  Say "most teams won't show you this" before the hallucination demo.
✓  Never apologize if something is slow. Say "and this is live, no mocks."
✓  If it crashes — laugh, say "that's why we have self-healing SQL", and retype.
✓  End on the closing speech. No "any questions?" — let the MC handle that.
```

---

*Built for GFG Hackfest Kolkata — go win it.*
