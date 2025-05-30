# Trustful Stellar

## Introduction

**Trustful Stellar** is a web application (dApp) focused on on-chain reputation built for the **Stellar** ecosystem. Its purpose is to turn user achievements (such as **Stellar Quest badges** and other ecosystem assets) into verifiable and transparent blockchain-based reputations. In short, the project assigns scores to user achievements and creates a verifiable on-chain profile that can be used in governance processes, resource allocation, and role assignments within communities. This makes reputation a data-driven tool to aid in decision-making within these communities.

In practice, Trustful Stellar allows users to prove their achievements on the Stellar network in a trustworthy way. For instance, someone who completed Stellar Quest challenges can connect their wallet, receive a score based on earned badges, and record that reputation on-chain. Other members or organizations can then verify that credential during votes, grant processes, or project applications.

## Main Features

- **Wallet Connection:** Connect a **Stellar wallet** (Albedo) to retrieve the user's achievements on the Stellar network, and connect an **Ethereum wallet** (via WalletConnect) to link an EVM address to the user's profile.
- **Reputation Verification:** Once wallets are connected, the user can verify and generate their reputation. The system collects badges from Stellar Quest and other user indicators, calculates a reputation score, and prepares a verifiable on-chain record.
- **On-Chain Reputation:** Trustful Stellar registers user reputation on a public blockchain using smart contracts or attestation services, making the credential publicly accessible and auditable.
- **Integrated Communities:** The platform supports multiple **communities** or reputation contexts. Users can view a list of available communities and how their reputation applies in each. Different communities may score various types of badges or achievements.
- **User-Friendly Interface:** Features a responsive and intuitive web UI. Users can navigate sections such as **"Communities"** and **"Verify Reputation"**. Feedback via toast notifications and tooltips help guide users.
- **UI Documentation via Storybook:** The project includes component documentation using **Storybook**, which helps contributors understand and test the UI without running the full application.

## Tech Stack

- **Next.js 15 App Router (React & TypeScript):** The frontend is built with Next.js App Router and fully typed with TypeScript, using modern Server Actions and Route Handlers.
- **Tailwind CSS:** Used for styling with utility-first classes and custom configurations via `tailwind.config.ts`.
- **Stellar SDK & Wallet Integration:** Integrates with Stellar using `@stellar/stellar-sdk`, **Albedo** (`@albedo-link/intent`), and `@creit.tech/stellar-wallets-kit`.
- **WalletConnect & Alchemy (EVM):** Integrates with WalletConnect v2 for Ethereum wallet support, using **Alchemy** APIs to read/write on EVM blockchains.
- **Native Fetch API:** All HTTP requests use the native fetch API with optimized caching and Next.js 15 features.
- **React Query:** For client-side data fetching, caching, and state management with `@tanstack/react-query`.
- **Support Libraries:** `react-hook-form`, `zod`, `react-hot-toast`, `react-tooltip`, `react-spinners`, `lucide-react`, `boring-avatars`, etc.
- **Storybook:** For developing and previewing UI components in isolation.

> The project depends on a separate backend (Trustful Stellar Backend) built with NestJS and PostgreSQL (via Prisma). Ensure the frontend points to this backend via `NEXT_PUBLIC_API_URL`.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- (Optional) The backend service running locally

### Installation

```bash
git clone https://github.com/blockful-io/trustful-stellar.git
cd trustful-stellar
cp .env.example .env.local
```

### Configure Environment Variables

Edit `.env.local` and provide values for:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_TESTNET_KEY=your_testnet_key
NEXT_PUBLIC_ALCHEMY_KEY=your_mainnet_key
NEXT_PUBLIC_USE_TESTNET=true
```

You must set up WalletConnect and Alchemy accounts to obtain the appropriate keys.

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` to view the app.

### Run Storybook (optional)

```bash
npm run storybook
```

Visit `http://localhost:6006` to view UI components.

## Environment Variables Reference

- **NEXT_PUBLIC_API_URL** – Base URL for the Trustful Stellar backend
- **NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID** – WalletConnect v2 project ID
- **NEXT_PUBLIC_ALCHEMY_TESTNET_KEY** – Alchemy key for testnet
- **NEXT_PUBLIC_ALCHEMY_KEY** – Alchemy key for mainnet
- **NEXT_PUBLIC_USE_TESTNET** – Set to `true` or `false` to toggle between testnet/mainnet

## Useful Development Commands

- `npm run dev` – Run Next.js dev server (http://localhost:3000)
- `npm run build` – Build production assets
- `npm run start` – Start production server (after build)
- `npm run lint` – Run ESLint
- `npm run storybook` – Run Storybook for UI components
- `npm run build-storybook` – Build static Storybook
