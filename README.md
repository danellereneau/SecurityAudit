# 💰 AI-Powered Subscription Manager

> Track, analyze, and optimize all your digital subscriptions in one place

## 🎯 Overview

An intelligent subscription management platform that helps users take control of their recurring expenses. Track subscriptions across streaming services, software, cloud storage, memberships, and more while getting AI-powered insights to optimize spending.

## ✨ Key Features

### 📊 **Subscription Tracking**
- Comprehensive subscription management (add, edit, delete)
- Track price, billing cycle, renewal date, payment method
- Automatic duplicate detection
- Free trial monitoring with countdown timers

### 🔔 **Smart Notifications**
- Renewal reminders (7 days + 24 hours before)
- Price increase alerts
- Trial ending notifications
- Customizable notification preferences

### 📈 **Analytics Dashboard**
- Monthly and yearly spending overview
- Category breakdown with visual charts
- Payment method analysis
- Spending trends over time
- Highest-cost subscriptions
- Renewal calendar view

### 💡 **Optimization Insights**
- Flag unused or redundant subscriptions
- Price increase tracking and impact analysis
- Potential savings calculator
- AI-powered recommendations
- Bundle opportunity detection

### 📥 **Data Import & Export**
- Manual entry with smart forms
- CSV import/export
- Flexible tagging system
- Notes and custom organization

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL with TimescaleDB
- Prisma ORM
- JWT Authentication
- Node-cron for scheduled tasks

**Frontend:**
- React 18+ with TypeScript
- Redux Toolkit
- Material-UI / Tailwind CSS
- Recharts for analytics
- React Hook Form + Zod validation

**Infrastructure:**
- Docker containerization
- Redis caching (optional)
- SendGrid/Nodemailer for emails

### Project Structure

```
subscription-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Prisma models
│   │   ├── middleware/      # Auth, validation, etc.
│   │   ├── utils/           # Helper functions
│   │   ├── cron/            # Scheduled jobs
│   │   └── routes/          # API routes
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── tests/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── store/           # Redux store
│   │   ├── services/        # API calls
│   │   ├── utils/           # Helper functions
│   │   └── types/           # TypeScript types
│   ├── public/
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md       # System design
│   ├── DATABASE_SCHEMA.md    # Database structure
│   ├── FEATURES.md           # Feature specifications
│   ├── DASHBOARD_LAYOUT.md   # UI/UX design
│   ├── ANALYTICS_METRICS.md  # Analytics specs
│   └── FUTURE_ENHANCEMENTS.md # Roadmap
│
└── README.md
```

## 📋 Database Schema

### Core Tables
- **users** - User accounts and preferences
- **subscriptions** - Subscription details
- **categories** - Subscription categories
- **payment_methods** - Payment sources
- **notifications** - Alert system
- **price_history** - Price change tracking
- **subscription_notes** - User notes

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for complete schema.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd subscription-manager
```

2. **Backend setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your database and other settings in .env
npx prisma migrate dev
npm run seed # Optional: Load default categories
npm run dev
```

3. **Frontend setup**
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoint in .env
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📊 Analytics Metrics

The platform calculates 20+ metrics including:
- Monthly/Yearly recurring costs
- Spending trends and forecasts
- Category breakdowns
- Payment method distribution
- Price increase impact
- Potential savings
- Unused subscription scoring

See [ANALYTICS_METRICS.md](./ANALYTICS_METRICS.md) for detailed calculations.

## 🎨 Dashboard Layout

The dashboard features:
- **Quick Stats Cards** - Monthly/yearly totals, active subs, upcoming renewals
- **Insights Panel** - AI-powered optimization suggestions
- **Spending Charts** - Trends over time, category breakdowns
- **Subscription Lists** - Upcoming renewals, all active, free trials
- **Calendar View** - Visual renewal timeline

See [DASHBOARD_LAYOUT.md](./DASHBOARD_LAYOUT.md) for complete UI specifications.

## 🔮 Future Enhancements

### Planned Features
- **Email Integration** - Auto-detect subscriptions from receipts
- **Browser Extension** - Capture subscriptions while browsing
- **Bank Sync** - Plaid integration for automatic detection
- **Usage Tracking** - Identify truly unused subscriptions
- **Comparison Engine** - Find cheaper alternatives
- **Shared Subscriptions** - Manage family plans
- **Voice Assistant** - Alexa/Google integration

See [FUTURE_ENHANCEMENTS.md](./FUTURE_ENHANCEMENTS.md) for full roadmap.

## 📚 Documentation

- [Architecture Overview](./ARCHITECTURE.md) - System design and tech stack
- [Database Schema](./DATABASE_SCHEMA.md) - Complete data model
- [Feature Specifications](./FEATURES.md) - Detailed feature descriptions
- [Dashboard Layout](./DASHBOARD_LAYOUT.md) - UI/UX design
- [Analytics Metrics](./ANALYTICS_METRICS.md) - Calculation methods
- [Future Enhancements](./FUTURE_ENHANCEMENTS.md) - Product roadmap

## 🔒 Security

- JWT-based authentication
- Password hashing (bcrypt)
- Row-level security
- Input validation and sanitization
- Rate limiting
- HTTPS enforced in production
- Encrypted sensitive data

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md for guidelines.

## 💬 Support

- Documentation: See `/docs` folder
- Issues: GitHub Issues
- Email: support@example.com

## 🎯 Quick Stats

- **25+ Metrics** tracked and analyzed
- **11 Default Categories** for organization
- **5 Notification Types** to keep you informed
- **3 Export Formats** (CSV, JSON, PDF)
- **Mobile-first** responsive design

---

**Built with ❤️ to help you save money and take control of your subscriptions**
