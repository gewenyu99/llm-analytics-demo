:wave: Helloooo, I've done a little bit of exploring and I think I have an outline for an angle I want to explore.

Posting for early feedback and a sanity check that this is possible.

- Question we're answering: How to set up LLM usage reporting
- The specific example: A simple chat app, generic answer response page on `/chat`, `/usage` page to show users their current usage/cost queried from PostHog.
- The intro: 
    - If you're building LLM-powered apps, pricing is usually associated with in-app usage. You can build LLM usage reports to help users understand their usage and their next bill. 
    - This tutorial shows you how to track LLM usage with PostHog, query usage data through PostHog's API, and report it to users in a simple Next.js chat app.
- Potential points to expand on/alternative posts
    - I plan on starting with just 1 model from OpenAPI, we can expand to many models and usage/model
    - I plan to start with just OpenAPI, we can expand to many platforms
    - I plan on just focusing on showing the **number of generations** and **cost in USD** to keep it simple. This breakdown can become more nuanced, such as cost of each chat session, cost from usage of specific features, cost per model, etc.
- Approximate outline
    - Creating a Next.js app
    - Setting up PostHog
    - Querying LLM usage data
    - Displaying a usage report
- Other notes: [This](https://posthog.com/docs/ai-engineering/observability) docs page has some comments/feedback, if I have extra time I might take a look to address any low-hanging fruit.