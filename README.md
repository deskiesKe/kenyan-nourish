**the prompt i used in lovable is as follows:**

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

 ** to see how this works check the video below
 
 https://drive.google.com/file/d/1BxQPAvEnherzhpndk2n_RQQYmaTgAxmg/view?usp=drivesdk







Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
