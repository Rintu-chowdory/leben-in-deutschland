# 🇩🇪 Leben in Deutschland - Life Navigation Platform

A comprehensive, beautifully designed platform to guide newcomers through all aspects of German bureaucracy and administrative processes.

## ✨ Features

- **Landing Page** - Vibrant, animated hero section with feature overview
- **Anmeldung Module** - German registration guidance with office locator
- **Bank Account Setup** - Bank comparison with affiliate links
- **Health Insurance** - GKV vs PKV comparison tool
- **Visa & Permits** - Residence permit guidance and application steps
- **Integration Courses** - Course finder with BAMF resource links
- **Tax ID Help** - Steueridentifikationsnummer walkthrough with checklist
- **User Dashboard** - Progress tracking across all modules
- **User Authentication** - Manus OAuth integration
- **Responsive Design** - Mobile, tablet, and desktop optimized

## 🎨 Design

- Vibrant gradient backgrounds and animations
- Premium color palette (deep blue-gray + warm amber)
- Smooth CSS animations and transitions
- Accessible and user-friendly interface

## 🚀 Quick Start

### Enable GitHub Pages (30 seconds)

1. Go to your repository: https://github.com/Rintu-chowdory/leben-in-deutschland
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under "Source":
   - Select Branch: **gh-pages**
   - Select Folder: **/ (root)**
5. Click **Save**

Your site will be live at: **https://rintu-chowdory.github.io/leben-in-deutschland/**

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## 📁 Project Structure

```
client/              # React frontend
  src/
    pages/          # Page components
    components/     # Reusable UI components
    lib/            # Utilities and hooks

server/              # Express backend
  routers.ts        # tRPC procedures

drizzle/            # Database schema and migrations

shared/             # Shared types and constants
```

## 🛠 Tech Stack

- **Frontend**: React 19 + Tailwind 4 + shadcn/ui
- **Backend**: Express 4 + tRPC 11
- **Database**: MySQL with Drizzle ORM
- **Auth**: Manus OAuth
- **Deployment**: GitHub Pages

## 📊 Database

The platform includes 8 tables:
- `users` - User authentication
- `subscriptions` - Subscription management
- `moduleProgress` - User progress tracking
- `anmeldungOffices` - Registration offices
- `bankRecommendations` - Bank data
- `healthInsuranceProviders` - Insurance providers
- `integrationCourses` - Course listings
- `visaPermitTypes` - Visa information

## 🔐 Authentication

Uses Manus OAuth for secure user authentication. Protected routes require login.

## 📝 License

MIT

## 👤 Author

Created with ❤️ for newcomers in Germany

---

**Ready to deploy?** Follow the GitHub Pages setup instructions above!
