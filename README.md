# 🚀 SaleTrack API (Backend)

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![NestJS](https://img.shields.io/badge/NestJS-Framework-red)
![TypeScript](https://img.shields.io/badge/TypeScript-Strongly%20Typed-blue)
![Supabase](https://img.shields.io/badge/BaaS-Supabase-3ECF8E)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-success)

**SaleTrack API** is the backend service powering the **SaleTrack .NET MAUI mobile application**.  
It is built with **NestJS** and **TypeScript**, using **Supabase as a Backend-as-a-Service (BaaS)** for database, authentication, and storage.

The API is responsible for authentication, sales management, analytics, reporting, and secure communication with the MAUI frontend.

---

## 🔗 Related Repositories

- 📱 **SaleTrack Mobile App (MAUI)** – Frontend client
- 🌐 **SaleTrack API (This Repo)** – Backend service

---

## 🚀 Features (Aligned with MAUI App)

- 🔐 Authentication (Supabase Auth + JWT)
- 👤 User & role management (Cashier / Admin)
- 🧾 Sales CRUD operations
- 📶 Offline-first sync support
- 📊 Sales analytics & reports
- 📄 Report data for PDF / HTML generation
- 📅 Date-range filtering
- 🛡️ Guards, validation & role-based access
- 🌍 RESTful API for mobile & web clients

---

## 🛠️ Tech Stack

### Backend
- **Node.js**
- **NestJS**
- **TypeScript**

### Backend-as-a-Service (Supabase)
- **PostgreSQL**
- **Authentication**
- **Storage**
- **Row Level Security (RLS)**

### Other Tools
- **JWT**
- **class-validator & class-transformer**
- **Swagger (OpenAPI)**

---

## 📂 Project Structure

```text
sale-track-api/
│
├── src/
│   ├── auth/          # Auth guards, JWT validation, Supabase auth
│   ├── users/         # User profiles & roles - (Not Uploaded Yet)
│   ├── sales/         # Sales records & logic
│   ├── reports/       # Analytics & reporting
│   ├── mail/          # Mailing Services
│   ├── pdf/           # PDF generation and storage
│   ├── common/        # Guards, interceptors, decorators
│   ├── config/        # App & Supabase configuration
│   ├── supabase/      # Supabase client & helpers
│   ├── app.module.ts
│   └── main.ts
│
├── test/              # Unit & e2e tests
├── .env.example       # Environment variables template
├── package.json
└── README.md
```

---

🔐 Authentication Flow (Same as MAUI App)

User logs in from the MAUI app

Supabase Auth authenticates the user

Supabase issues a JWT

MAUI app stores the token securely

Token is sent with every API request:
```curl
Authorization: Bearer <token>
```

---

🧾 Sale Data Format (Shared with MAUI)

The API accepts and returns sales data in the exact format used by the MAUI app:

```json
{
  "sale_date": "2024-06-15T14:30:00Z",
  "item_name": "Shawarma",
  "price_per_item": 99.99,
  "quantity": 2,
  "total_amount": 199.98,
  "notes": "Customer requested black color"
}
```

---
⚙️ Environment Variables

Create a .env file using .env.example:

```md
PORT=3000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

JWT_SECRET=your_jwt_secret
# And more
```

---

🚀 Getting Started
Install Dependencies
```bash
npm install
```

Run in Development
```bash
npm run start:dev
```

Build for Production
```bash
npm run build
npm run start:prod
```

🧪 Testing
```bash
npm run test
npm run test:e2e
```

📘 API Documentation

Swagger documentation is available at:
```bash
http://localhost:3000/api
```

---

🗺️ Roadmap (Backend)

 -Refresh token support

 -Multi-branch isolation

 -Rate limiting

 -Audit logs

 -Webhooks

 -Admin dashboard endpoints

 ---

 🤝 Contributing

Fork the repository

Create a feature branch

Commit your changes

Open a Pull Request

---

📄 License

This project is licensed under the MIT License.

---

👤 Author

Ibrahim Tajudeen
Software Developer

GitHub: https://github.com/ibrahimtajudeen

Email: donslice6@gmail.com

---

Built with ❤️ to power the SaleTrack .NET MAUI App

```md
### ✅ What’s aligned now
- Same **sale JSON**
- Same **auth flow**
- Same **offline sync concept**
- Same **roles**
- Same **reporting model**
- Same **terminology**

```
