# KerjaIn (SkillMatch SMK) - HR Frontend Module

## Overview
Welcome to the HR Frontend Module for **KerjaIn (SkillMatch SMK)**! This repository contains the complete Minimum Viable Product (MVP) tailored specifically for HR professionals and Recruiters. The platform facilitates a streamlined, professional experience for managing the entire hiring pipeline.

### Core Features
- **Job Management**: Create and organize active job postings. Includes a dynamic, multi-row skill proficiency selector to designate exact technical requirements.
- **Candidate Discovery & Match Scoring**: Review applicants inside a sleek, responsive grid. Candidates are evaluated dynamically via a **Match Score** indicating how well their profile aligns with the job's defined skills. Includes integrated, interactive status workflows (Hire, Review, Reject).
- **Company Profile**: A dedicated form interface to manage crucial organizational data (Industry, Website, Description).
- **Dashboard Overview**: A high-level executive dashboard delivering quick statistical insights and month-over-month applicant growth rendered via interactive charts.

## Tech Stack
- **React** (Bootstrapped with Vite)
- **TailwindCSS** (For Professional Theming)
- **React Router** (Routing & Protected Logic)
- **Recharts** (Data Visualization)
- **Lucide React** (Iconography)

## Installation & Setup
To run this project locally, ensure you have Node.js or Bun installed, then execute the following steps:

1. Clone this repository and navigate to the project root directory.
2. Install the necessary dependencies:
   ```bash
   # Using Bun (recommended - faster)
   bun install

   # Or using npm
   npm install
   ```
3. Start the Vite development server:
   ```bash
   # Using Bun
   bun run dev

   # Or using npm
   npm run dev
   ```
4. Open your browser and navigate to the local host address (`http://localhost:5173/`).

> **Note on Authentication (Mock Credentials)**:
> This frontend currently utilizes a mock authentication pipeline for developmental purposes. You **do not** need a valid, registered email or password to access the dashboard. Simply navigate to the login page and click the **"Sign In"** button to automatically deploy a local mock session token and access the respective routes!

## UI Kit / Shared Components Documentation
**ATTN: Development Team (Student & Admin Modules)**

To maintain absolute visual consistency and strict compliance with our "Professional" design guidelines, a fully centralized UI Kit has been established in `src/components/ui`. 

You are highly encouraged to directly reuse these functional components for the Student and Admin portals rather than building new bespoke equivalents:
- `<Button />`: Supports structural variants (`primary`, `secondary`, `outline`, `ghost`) and varying sizes.
- `<Card />`, `<CardHeader />`, `<CardTitle />`, `<CardContent />`: Compositional responsive containers for forms, dataset lists, and statistical displays.
- `<Input />`, `<Select />`, `<Textarea />`: Native form controls equipped uniformly with standardized focus border states and active `ref` forwarding behaviors.

All components intrinsically respect the global Tailwind configuration (`Primary #1d283a`, `Secondary #3c83f6`) and established typography logic (`Plus Jakarta Sans` for Headings, `Inter` for Body text).
