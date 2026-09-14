# Lumina — Photo Gallery Wall

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![CSS Grid](https://img.shields.io/badge/CSS_Grid-Advanced_Architecture-7952B3?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1_AA-Accessible-008080?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Zero JS](https://img.shields.io/badge/JavaScript-0%20KB%20(No_JS)-yellow?style=for-the-badge)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> **Lumina** is a minimalist, editorial architectural photography gallery engineered to demonstrate advanced **CSS Grid architectures** using **100% semantic HTML5 and vanilla CSS3**.
> 
> Zero JavaScript. Zero frameworks. Zero external dependencies. Built strictly on modern native web standards.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture & Core Concepts](#architecture--core-concepts)
  - [1. CSS Cascade Layers (`@layer`)](#1-css-cascade-layers-layer)
  - [2. Explicit Grid Architecture](#2-explicit-grid-architecture)
  - [3. Implicit Grid & Dense Packing](#3-implicit-grid--dense-packing)
  - [4. Grid Stacking Context (No `position: absolute`)](#4-grid-stacking-context-no-position-absolute)
  - [5. Fluid Typography & Spacing System (`clamp()`)](#5-fluid-typography--spacing-system-clamp)
- [Accessibility (a11y) & Performance](#accessibility-a11y--performance)
- [Project Directory Structure](#project-directory-structure)
- [Getting Started](#getting-started)
- [Browser Compatibility](#browser-compatibility)
- [License](#license)

---

## Overview

Modern web design frequently relies on heavy JavaScript libraries (Masonry, Isotope, Packery) to build complex asymmetrical layouts. **Lumina** demonstrates that native modern CSS—specifically **CSS Grid Level 2**, **CSS Cascade Layers (`@layer`)**, and **CSS Math Functions (`clamp()`)**—can natively replace these runtimes with zero overhead, superior performance, and native accessibility.

```
┌────────────────────────────────────────────────────────────────────────┐
│  Lumina.                                      Featured  Discover  About│
│                                                                        │
│  Seeing the world                     ┌───────────────┐ ┌────────────┐ │
│  through a grid.                      │ Top Spanning  │ │ Tall Block │ │
│                                       ├───────┬───────┤ │ (Spans 2R) │ │
│  An architectural exploration of      │ Col 1 │ Col 2 │ │            │ │
│  light, space, and modern web layouts.└───────┴───────┘ └────────────┘ │
│  [ View Gallery ]                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

- 🏛️ **Magazine-Style Editorial Grid:** Handcrafted explicit grid tracks with deliberate asymmetrical visual weight and hierarchy.
- 🧱 **Self-Organizing Dense Implicit Grid:** Auto-flowing masonry grid with automated gap-filling via `grid-auto-flow: dense`.
- 📐 **Asymmetrical Architectural Hero Visual:** Pure CSS Grid composition inspired by architectural forms and modernist Swiss graphic design.
- ⚡ **Zero JavaScript Overhead (0 KB Bundle):** Lightning-fast First Contentful Paint (FCP) and zero Cumulative Layout Shift (CLS).
- 📱 **Fluid Responsiveness:** Seamless scaling across all viewports (from 320px mobile to 4K ultra-wide monitors) without rigid breakpoint snaps.
- ♿ **WCAG 2.1 AA Compliant:** Semantic landmarks, high-contrast typography, custom focus rings (`:focus-visible`), and automated fallbacks for `prefers-reduced-motion`.
- 🎨 **Modular `@layer` Architecture:** Predictable CSS cascade priority eliminating specificity wars and `!important` hacks.

---

## Architecture & Core Concepts

### 1. CSS Cascade Layers (`@layer`)

The stylesheet employs modern CSS cascade layers to organize rules by responsibility and guarantee deterministic specificity ordering:

```css
/* main.css */
@layer base, layouts, components;

@import 'base/tokens.css' layer(base);
@import 'base/reset.css' layer(base);
@import 'base/accessibility.css' layer(base);
@import 'layouts/container.css' layer(layouts);
@import 'layouts/gallery.css' layer(layouts);
@import 'components/button.css' layer(components);
@import 'components/header.css' layer(components);
@import 'components/hero.css' layer(components);
@import 'components/footer.css' layer(components);
```

By defining `@layer base, layouts, components;`, components can safely override layout rules, and layouts override base defaults, irrespective of source order or selector complexity.

---

### 2. Explicit Grid Architecture

The **Featured Editorial** gallery is orchestrated via a deterministic 2-dimensional grid blueprint where items are pinned to exact row and column coordinates:

```css
/* layouts/gallery.css */
.gallery--explicit {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 400px);
    gap: var(--grid-gap);
}

/* Hero card occupies a prominent 2x2 coordinate space */
.gallery__card--hero {
    grid-column: 1 / 3;
    grid-row: 1 / 3;
}

/* Secondary editorial item spans two horizontal tracks */
.gallery__card:nth-child(2) {
    grid-column: 3 / 5;
    grid-row: 1 / 2;
}

/* Vertical portrait card spans bottom-right track */
.gallery__card--tall {
    grid-column: 4 / 5;
    grid-row: 2 / 3;
}
```

---

### 3. Implicit Grid & Dense Packing

The **Discover** section leverages implicit track generation and the browser's native dense packing algorithm to dynamically create an organic, balanced gallery:

```css
/* layouts/gallery.css */
.gallery--implicit {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    grid-auto-rows: 300px;
    grid-auto-flow: dense;
    gap: var(--grid-gap);
}

/* Asymmetrical spanning utility classes */
@media (min-width: 768px) {
    .span-col-2 { grid-column: span 2; }
    .span-row-2 { grid-row: span 2; }
}
```

> **Why `grid-auto-flow: dense`?**  
> If an upcoming card is too large to fit in the current row track, the browser normally leaves an empty void. With `dense`, the browser scans forward and back-fills smaller 1x1 cards into earlier gaps, delivering a cohesive masonry feel without JavaScript layout calculations.

---

### 4. Grid Stacking Context (No `position: absolute`)

Rather than resorting to classic `position: relative` / `position: absolute` hacks for card overlays, Lumina stacks the photo and caption overlay inside a unified 1x1 Grid cell:

```css
.gallery__card {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    overflow: hidden;
}

/* Both elements occupy the exact same coordinate track */
.gallery__image,
.gallery__overlay {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
}
```

This guarantees:
1. Natural dimensional parity without height synchronization issues.
2. Hardware-accelerated transitions on `transform` and `opacity`.
3. Cleaner DOM layering without parent coordinate detachment.

---

### 5. Fluid Typography & Spacing System (`clamp()`)

All core typography and spatial dimensions are calculated fluidly via CSS mathematical functions:

```css
/* base/tokens.css */
:root {
    --text-xs: clamp(0.75rem, 1vw, 0.875rem);
    --text-sm: clamp(0.875rem, 1.5vw, 1rem);
    --text-base: clamp(1rem, 2vw, 1.125rem);
    --text-lg: clamp(1.5rem, 3vw, 2rem);
    --text-xl: clamp(2.5rem, 5vw, 4.25rem);
}
```

This ensures proportional visual scaling between mobile viewports and large desktop monitors without arbitrary breakpoint jumps.

---

## Accessibility (a11y) & Performance

| Category | Implementation Detail |
| :--- | :--- |
| **Semantic HTML5** | Built using `<header>`, `<nav>`, `<main>`, `<section>`, `<figure>`, `<figcaption>`, and `<footer>` landmarks for full assistive technology parsing. |
| **Keyboard Navigation** | Accessible navigation with prominent, high-contrast `:focus-visible` outlines (`outline: 3px solid var(--color-text); outline-offset: 4px;`). |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` globally disables all keyframes, transitions, and transforms, providing fully visible static captions. |
| **Image Optimization** | Images implement `loading="lazy"` to defer off-screen loading and optimize First Input Delay (FID) and bandwidth. |
| **Asset Preconnection** | Google Fonts utilize `preconnect` to optimize TLS handshake times and eliminate font render-blocking. |

---

## Project Directory Structure

```text
Photo-Gallery-Wall/
│
├── index.html                     # Semantic HTML5 root document
├── README.md                      # Engineering documentation & architecture guide
│
└── styles/
    ├── main.css                   # Root stylesheet defining CSS @layer hierarchy
    │
    ├── base/
    │   ├── tokens.css             # Design tokens: typography clamp(), colors, spacing, transitions
    │   ├── reset.css              # Modern CSS reset & base element normalization
    │   └── accessibility.css      # Focus states, keyframe animations, & prefers-reduced-motion
    │
    ├── layouts/
    │   ├── container.css          # Responsive container width constraints
    │   └── gallery.css            # Explicit (editorial) & implicit (auto-flow) grid engines
    │
    └── components/
        ├── header.css             # Sticky navigation bar & interactive underline transitions
        ├── hero.css               # Architectural hero section & 2D asymmetrical visual grid
        ├── button.css             # Action buttons with micro-interactions
        └── footer.css             # Semantic dual-column responsive footer
```

---

## Getting Started

### Prerequisites
No Node.js, package manager, or build step is required. Any modern web browser (Chrome, Edge, Firefox, Safari) can render the project directly.

### Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Photo-Gallery-Wall.git
   cd Photo-Gallery-Wall
   ```

2. **Open with a local development server:**

   - **Using VS Code Live Server:**  
     Right-click `index.html` and select **"Open with Live Server"**.

   - **Using `npx serve`:**
     ```bash
     npx serve .
     ```

   - **Using Python 3:**
     ```bash
     python -m http.server 8000
     ```

3. Navigate to `http://localhost:8000` (or the port specified by your server).

---

## Browser Compatibility

| Browser | Minimum Version | Supported Features |
| :--- | :---: | :--- |
| **Google Chrome** | 99+ | CSS Grid Level 2, `@layer`, `clamp()`, Native Nesting |
| **Mozilla Firefox** | 97+ | CSS Grid Level 2, `@layer`, `clamp()`, Native Nesting |
| **Apple Safari** | 15.4+ | CSS Grid Level 2, `@layer`, `clamp()`, Native Nesting |
| **Microsoft Edge** | 99+ | CSS Grid Level 2, `@layer`, `clamp()`, Native Nesting |

---

## License

This project is open-source and available under the [MIT License](LICENSE). Designed and built with a focus on web platform standards and craft.