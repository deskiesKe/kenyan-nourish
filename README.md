the prompt i used in lovable is as follows:

Build a full-stack web app called Nutriflavour.

Requirements:

Frontend: React + Tailwind CSS, mobile-first.

Backend: Node.js + Express.

Database: PostgreSQL with two tables:

users → id, name, email, password, subscription_tier

recipes → id, title, ingredients, steps, nutrition, category (free or premium)

AI Integration: Connect a chatbot route to OpenAI API for recipe Q&A and nutrition guidance.

Pages / Routes:

/ → Homepage introducing Nutriflavour with nav links (Recipes, Chatbot, Premium, Login, Signup).

/recipes → List at least 10 Kenyan recipes (hardcoded for now). Show: title, ingredients, steps, nutrition info. Include search/filter by dish type or ingredient.

/premium → Premium-only recipes (requires login). Categories: 0–5 yrs, Teenagers, Youth, Elderly. Each with age-appropriate recipes + nutrition info.

/chatbot → Simple chatbot UI connected to backend. Users can ask: “How do I cook ugali?” or “How much protein is in githeri?” etc.

/login + /signup → User authentication with JWT. Passwords hashed.

/profile → Shows user info + subscription tier.

Mock M-Pesa subscription: Add a “Subscribe with M-Pesa” button that simulates success and updates subscription_tier in database.

Functionality:

Free users → can see general recipes and nutrition info.

Premium users → can see age-specific recipes.

Chatbot works for all users.

Users can sign up, log in, and see their profile.

Deliverables:

React frontend with Tailwind styling.

Express backend with routes for recipes, premium recipes, chatbot, and auth.

PostgreSQL schema + sample seed data (10 free recipes, 1–2 per premium category).

Chatbot route integrated with OpenAI API (use environment variable for API key).

Mock M-Pesa subscription flow.

commit this changed at every stage

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/28546b9b-4f8f-4d50-acb2-c3640f684569

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/28546b9b-4f8f-4d50-acb2-c3640f684569) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/28546b9b-4f8f-4d50-acb2-c3640f684569) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
