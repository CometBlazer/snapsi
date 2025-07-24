# Snapsi API: Domain Finder API Frontend

A modern domain suggestion tool with intelligent ranking and real-time availability checking. Built with SvelteKit and DaisyUI for developers and businesses looking for the perfect domain name.

## ✨ Features

- **📊 Intelligent Ranking** - Smart scoring system (0-10) considering memorability, brandability, and keyword relevance
- **⚡ Real-time Availability** - Instant domain availability checking across multiple registrars
- **🔄 API-First Design** - Built for agentic workflows with comprehensive API integration
- **💰 Live Pricing** - Real-time pricing from Name.com and Porkbun
- **🎯 Multiple Search Types** - Business ideas, base names, or exact domain checking
- **📋 JSON Output** - View complete API responses for developers
- **🎨 Modern UI** - Clean, responsive design with DaisyUI components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/CometBlazer/snappi-v0.5
cd snappi-v0.5

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [DaisyUI](https://daisyui.com/) + [Tailwind CSS](https://tailwindcss.com/)

## 📖 Usage

### Search Types

1. **Business Idea**: Enter your business concept (e.g., "AI startup platform")
2. **Base Name**: Check different TLDs for a specific name (e.g., "mycompany")
3. **Exact Domain**: Verify specific domain availability (e.g., "google123456.com")

### Advanced Options

- **Generation Style**: Choose from brandable, short, keyword, creative, or professional
- **TLD Preference**: Filter by domain extension (.com, .io, .ai, etc.)
- **Price Filtering**: Set maximum annual price
- **Provider Selection**: Choose between Name.com (fast) or Porkbun (different pricing)

## 🚦 Development

### Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run check
```

## 📦 Deployment

### Build for Production

```bash
npm run build
```