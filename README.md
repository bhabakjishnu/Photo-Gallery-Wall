# Lumina - Photo Gallery Wall

## Overview
Lumina is a premium, modern architectural photography gallery built to practically demonstrate advanced CSS Grid architectures. The project uses 100% semantic HTML5 and vanilla CSS3 to create complex, magazine-style editorial layouts without relying on JavaScript, CSS frameworks (like Bootstrap or Tailwind), or masonry libraries.

## Features
- **Editorial Explicit Grid:** A rigidly defined main feature layout using strict columns and row spanning.
- **Dynamic Implicit Grid:** A masonry-style continuous feed powered by CSS auto-flow and auto-rows.
- **Fully Responsive Layout:** Fluidly scales typography and grid properties from 320px mobile screens to large desktop monitors.
- **Hardware-Accelerated CSS Animations:** Staggered load-ins and smooth interactive hover states.
- **Accessibility (WCAG) Compliant:** Keyboard navigation support, visible focus states, ARIA roles, and strict adherence to `prefers-reduced-motion`.

## Concepts Demonstrated
- **CSS Grid:** The primary 2D layout module utilized for the entire structural architecture.
- **Explicit Grid:** Using `grid-template-columns` and `grid-template-rows` to explicitly declare a layout blueprint.
- **Implicit Grid:** Using `grid-auto-rows` and `grid-auto-flow: dense` to let the browser dynamically generate grid tracks based on content volume.
- **fr units:** Fraction units for dynamic proportional space distribution between columns.
- **Grid gaps:** Utilizing `gap` (shorthand for `row-gap` and `column-gap`) for consistent whitespace management without margin collapsing issues.
- **Grid placement:** Fine-grained control using `grid-column` and `grid-row` to span items across multiple tracks.
- **Responsive Grid:** Redefining track counts and spans across `@media` queries.
- **CSS Animations & Transitions:** `@keyframes` and `transition` for non-layout-shifting UI embellishments.
- **CSS clamp():** Fluid typography that mathematically scales between boundaries.

## Tech Stack
- HTML5 (Semantic Document Structure)
- CSS3 (Grid, Custom Properties, Media Queries, Transitions/Animations)

## Project Structure
```text
photo-gallery-wall/
│
├── index.html
├── README.md
│
└── css/
    └── style.css