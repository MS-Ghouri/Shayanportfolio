# Muhammad Shayan Ghouri — Personal Portfolio Hub

## Project Identity
- **Name**: Muhammad Shayan Ghouri
- **Role**: Web & Mobile Application Developer & Computer Science Student at UBIT (University of Karachi)
- **Purpose**: High-credibility professional personal portfolio and technical services hub

---

## Architecture & Technology Stack
- **Structure**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- **Styling**: Modular Modern CSS (CSS custom properties, native Flexbox, CSS Grid, fluid clamp typography)
- **Logic**: Vanilla Modern JavaScript (ES6 modules, zero runtime frameworks)
- **Zero-Bloat Principles**:
  - No bloated frameworks (No React, Next.js, Tailwind, Bootstrap, or jQuery)
  - Zero heavy third-party CDN scripts
  - Sub-50KB initial payload target
  - WCAG 2.2 Level AA compliance (100% keyboard navigable, high-contrast readable palette, full `prefers-reduced-motion` support)

---

## Directory Hierarchy

```text
├── index.html              # Starter semantic HTML5 shell
├── robots.txt              # Search crawler discovery instructions
├── sitemap.xml             # XML sitemap
├── .gitignore              # Standard web ignores & defense
├── README.md               # Project documentation & commit conventions
├── AGENTS.md               # Portfolio Engineering Team persona & system registry
└── assets/
    ├── css/
    │   ├── variables.css   # Color palette, spacing scale, typography clamp tokens
    │   ├── reset.css       # Modern accessible CSS reset & focus states
    │   ├── layout.css      # Responsive containers, header, grid/flex primitives
    │   └── components.css  # Buttons, badges, and modular UI component styles
    ├── js/
    │   ├── main.js         # Entry JavaScript module
    │   └── modules/        # Isolated ES6 functional modules
    ├── img/
    │   ├── projects/       # Verified project case study screenshots & assets
    │   └── icons/          # Technical and navigation SVG icons
    └── resume/             # Verified resume documents
```

---

## Git Commit Conventions

All commits follow the Conventional Commits standard:

- `feat:` Introduces a new feature or user-facing capability (e.g., `feat: implement accessible mobile nav drawer`)
- `fix:` Patches a bug, layout glitch, or accessibility defect (e.g., `fix: resolve tab order in mobile navigation`)
- `chore:` Maintenance tasks, workspace initialization, or tooling configuration (e.g., `chore: initialize portfolio workspace skeleton`)
- `docs:` Documentation updates in markdown files (e.g., `docs: update case study outline`)
- `perf:` Performance enhancements and asset optimizations (e.g., `perf: optimize vector icons and font loading`)

---

## Local Development

Run with any local static HTTP server (to support ES modules):

```bash
# Python
python -m http.server 3000

# Node.js
npx serve .
```

Open `http://localhost:3000` in your browser.
