# Gemina AI - Full Stack AI Image SaaS Platform

Gemina AI is a modern SaaS application that allows users to transform images using AI-powered tools. The platform features a robust credit system, secure payments, and seamless user authentication.

## 🚀 Live Demo
**Check out the live application:** [https://gemina-chi.vercel.app](https://gemina-chi.vercel.app)

---

## ✨ Features

* **AI Image Transformation:** Advanced image processing capabilities (Inpainting, Object Removal, Color Restoration, etc.).
* **Secure Authentication:** User management and social login integration via **Clerk**.
* **Credit System:** A secure, usage-based credit system managed through a database.
* **Payment Integration:** Fully functional payment gateway using **Stripe** for credit top-ups.
* **Responsive Design:** Optimized for all devices using **Tailwind CSS**.
* **Robust Database:** Scalable data management with **MongoDB**.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Authentication:** Clerk
* **Payments:** Stripe
* **Database:** MongoDB
* **Styling:** Tailwind CSS / Shadcn UI
* **Deployment:** Vercel

---

## 📦 Getting Started

### 1. Clone the repository:
```bash
git clone [https://github.com/SemraGunaydin/Gemina.git](https://github.com/SemraGunaydin/Gemina.git)
cd Gemina

# 2. Install dependencies:
npm install

# 3. Set up Environment Variables:
Create a .env.local file in the root directory and add your keys:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# 4. Run the development server:
npm run dev


# 📝 License
Distributed under the MIT License. See LICENSE for more information.

Developed by Semra Günaydın





