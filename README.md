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
@import 'components/about.css' layer(components);
@import 'components/lightbox.css' layer(components);
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
    grid-template-columns: 1fr;
    gap: var(--grid-gap);
}

/* Intermediate Tablet Breakpoint: 2 Balanced Columns */
@media (min-width: 640px) and (max-width: 1023px) {
    .gallery--explicit {
        grid-template-columns: repeat(2, 1fr);
    }
    .gallery__card--hero {
        grid-column: 1 / -1;
        aspect-ratio: 16/9;
    }
}

/* Desktop Viewport: 4-Column 2-Row Explicit Blueprint */
@media (min-width: 1024px) {
    .gallery--explicit {
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(2, 380px);
    }
    .gallery__card--hero {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
    }
    .gallery__card:nth-child(2) {
        grid-column: 3 / 5;
        grid-row: 1 / 2;
    }
    .gallery__card--tall {
        grid-column: 4 / 5;
        grid-row: 2 / 3;
    }
    .gallery__card:nth-child(4) {
        grid-column: 3 / 4;
        grid-row: 2 / 3;
    }
}
```

---

### 3. Implicit Grid & Dense Packing

The **Discover** section leverages implicit track generation and the browser's native dense packing algorithm to dynamically create an organic, balanced gallery:

```css
/* layouts/gallery.css */
.gallery--implicit {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    grid-auto-rows: 290px;
    grid-auto-flow: dense;
    gap: var(--grid-gap);
}

/* Asymmetrical spanning utility classes */
@media (min-width: 768px) {
    .span-col-2 { grid-column: span 2; }
    .span-row-2 { grid-row: span 2; }
}
```

---

### 4. Accessible Native Lightbox Modal (`<dialog>`)

Lumina features a zero-dependency, fully accessible modal lightbox built on the native HTML5 `<dialog>` specification with:
- Native focus trapping and Escape key dismiss.
- Left / Right keyboard arrow navigation between images.
- Full high-resolution preview and metadata (Title, Category, Location, Counter).
- Restores focus to the triggering card element upon closure.

---

### 5. Grid Stacking Context (No `position: absolute`)

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

---

### 6. Fluid Typography & Spacing System (`clamp()`)

All core typography and spatial dimensions are calculated fluidly via CSS mathematical functions:

```css
/* base/tokens.css */
:root {
    --text-xs: clamp(0.72rem, 0.9vw, 0.82rem);
    --text-sm: clamp(0.85rem, 1.2vw, 0.95rem);
    --text-base: clamp(1rem, 1.6vw, 1.125rem);
    --text-md: clamp(1.2rem, 2vw, 1.45rem);
    --text-lg: clamp(1.5rem, 3vw, 2.15rem);
    --text-xl: clamp(2.35rem, 5.5vw, 4.25rem);
}
```

---

## Accessibility (a11y) & Performance

| Category | Implementation Detail |
| :--- | :--- |
| **Semantic HTML5** | Built using `<header>`, `<nav>`, `<main>`, `<section>`, `<figure>`, `<figcaption>`, and `<footer>` landmarks. |
| **Skip Link** | Dedicated `.skip-link` immediately shifts keyboard focus to `#main-content`. |
| **Keyboard Navigation** | Accessible buttons with custom `:focus-visible` indicators and full keyboard trapping in lightbox. |
| **Reduced Motion** | `@media (prefers-reduced-motion: reduce)` disables keyframe transforms and transitions globally. |
| **Touch Optimization** | `@media (hover: none)` presents permanent legible captions on mobile touchscreens without hover lock. |
| **Image Optimization** | Explicit `width` and `height`, `loading="lazy"`, `decoding="async"`, and `fetchpriority="high"` on LCP hero image. |
| **SEO & Social Graph** | Open Graph, Twitter Cards, Schema.org `ImageGallery` JSON-LD, and SVG Favicon. |

---

## Project Directory Structure

```text
Photo-Gallery-Wall/
│
├── index.html                     # Semantic HTML5 root document
├── README.md                      # Engineering documentation & architecture guide
│
├── scripts/
│   └── gallery.js                 # Zero-dependency interaction engine (lightbox, theme, filters)
│
└── styles/
    ├── main.css                   # Root stylesheet defining CSS @layer hierarchy
    │
    ├── base/
    │   ├── tokens.css             # Design tokens: fluid clamp(), dark mode, elevation, colors
    │   ├── reset.css              # Modern CSS reset & dialog/smooth-scroll normalization
    │   └── accessibility.css      # Skip link, sr-only, focus states, prefers-reduced-motion
    │
    ├── layouts/
    │   ├── container.css          # Fluid container width constraints
    │   └── gallery.css            # Explicit (editorial) & implicit (auto-flow) grid engines
    │
    └── components/
        ├── header.css             # Sticky glassmorphic nav & responsive mobile drawer
        ├── hero.css               # Architectural hero section & modernist 2D visual grid
        ├── button.css             # Button variants with micro-interactions
        ├── about.css              # Standards & architectural philosophy cards
        ├── lightbox.css           # Native HTML5 <dialog> modal viewer
        └── footer.css             # 3-column responsive footer & back-to-top action
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