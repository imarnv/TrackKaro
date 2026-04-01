# Karo - Personal Finance Dashboard

Karo is a modern, responsive, and interactive frontend finance dashboard built as a demonstration of frontend development skills. It allows users to track financial activity, view comprehensive spending insights, maintain basic role-based UI states, and export data.

## 🚀 Live Demo
[View Live Demo](https://imarnv.github.io/TrackKaro)

## ✨ Features

- **Dashboard Overview**: Highly visual layout with summary cards, an area chart tracking balance trends, and a donut chart for category breakdowns.
- **Transactions Management**: Full data table with sorting capability, dynamic filtering (by category, type, date range), and live search.
- **Data Insights**: Automatically generated insights using bar and line charts, highest/lowest spending metrics, and textual observations.
- **Role-Based UI Simulation**: A toggle allows switching between `Viewer` (read-only) and `Admin` (can add/edit/delete transactions).
- **Dark Mode**: Built-in CSS variables enable seamless light and dark modes with `localStorage` persistence.
- **State Management**: Built completely via React Context API and `useReducer` to manage the complex unified state required for sorting, filtering, aggregations, and layout interactions.
- **Data Persistence & Export**: Saves transaction state to `localStorage` and provides a 1-click CSV Export functionality.

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS with CSS custom properties (Variables) for theming
- **Data Visualizations**: Recharts
- **Icons**: react-icons
- **Utilities**: date-fns
- **Deployment**: GitHub Pages (via `gh-pages`)

## 🎨 Design Philosophy & UX

The assignment stated, *"I do not want to make the UI feel like its made from AI so keep the elements a real professional looking individual has made it."* 

To achieve this:
1. **Color Language & Typography**: Avoided generic palettes. Used structured HEX codes with matching translucent background variations (`rgba` or HEX + `18` opacity) for category badges and highlight cards. Applied the *Inter* font for clear readability across dense data tables.
2. **Micro-interactions**: Added gentle 0.25s staggered fade-in animations for dashboard cards, hover interactions on table rows, and soft lifts with drop shadows on interactive elements.
3. **Empty States**: Specifically designed a warm empty state graphic to act gracefully when filters return no data.
4. **Data Aggregations**: The `Insights.jsx` logic computes "Average Daily Spend" and "Income vs Expense ratios" dynamically based on the active mock payload, making it feel alive rather than just a dummy table.

## 💻 Getting Started

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/imarnv/TrackKaro.git
   ```
2. Navigate into the directory:
   ```bash
   cd zoryvn
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Build for production (optional):
   ```bash
   npm run build
   ```

## 📦 Deployment Instructions

This project is configured for seamless deployment to GitHub pages using Vite's `base` config and the `gh-pages` npm package.

To deploy the app to your own GitHub Pages:

1. Create a public repository on GitHub named `zoryvn`.
2. Push your code to the `main` branch.
3. Simply run:
   ```bash
   npm run deploy
   ```
4. GitHub Pages will build the `dist` folder and push it to the `gh-pages` branch, making your site live instantly!

---

*Developed as a frontend evaluation assignment showcasing UI excellence, complex state interactions, and component-driven architecture.*
