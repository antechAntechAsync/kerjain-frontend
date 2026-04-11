# Design System: Editorial Neo

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Atelier."** 

This is not a standard utility dashboard; it is a high-end digital gallery designed for elite productivity. We move away from the "template" look by embracing a bespoke, editorial layout inspired by premium print journalism and Awwwards-winning interactive experiences. The aesthetic balances the structural rigidity of a **Bento Grid** with the fluid elegance of "Kinetic" movement—where whitespace is as functional as the content itself.

The system relies on **extreme weight contrast** and **tonal layering** to create a sense of deep, ink-like space. By prioritizing "Deep Ink" surfaces and "Electric Blue" accents, we create a high-contrast environment that feels both authoritative and cutting-edge.

---

## 2. Colors & Surface Architecture
The color palette is engineered for a high-contrast dark mode that maintains legibility while feeling atmospheric.

### Core Palette
- **Background (`#0b1326`):** The "Deep Ink" foundation. All layouts begin here.
- **Primary (`#adc6ff` / `#4c8eff`):** "Electric Blue." Use for high-action touchpoints.
- **Secondary (`#5de6ff` / `#00cbe5`):** "Cyber Cyan." Use for accents, data visualization, and micro-interactions.
- **Surface Tiers:** Use `surface-container-lowest` (`#060e20`) to `surface-container-highest` (`#2d3449`) to define hierarchy.

### The "No-Line" Rule
Prohibit the use of 1px solid, opaque borders for sectioning content. Boundaries must be defined through **Background Color Shifts**. For example, a `surface-container-low` card sitting on a `surface` background creates a clear, sophisticated boundary without the visual "noise" of a stroke.

### The "Glass & Gradient" Rule
Floating elements (Modals, Navigation Bars, Hover States) must utilize **Glassmorphism**.
- **Specs:** `surface` color at 40-60% opacity with a `backdrop-blur` of **30px+**. 
- **Border:** Use a 1px "Ghost Border" (`#ffffff10`) to catch highlights and simulate the edge of a glass pane.
- **Gradients:** Avoid multi-hue "rainbow" gradients. Use monochromatic transitions (e.g., `primary` to `primary_container`) to add "soul" to CTA buttons and hero typography.

---

## 3. Typography: The Editorial Scale
We use **Plus Jakarta Sans** exclusively. The brand identity is conveyed through extreme weight juxtaposition.

- **Display & Headlines:** Must use **ExtraBold (800)** or **Bold (700)**. Tighten letter-spacing (`-0.02em`) for a compact, "headline" feel. 
    - *Scale:* `display-lg` (3.5rem) down to `headline-sm` (1.5rem).
- **Body & Labels:** Must use **Light (300)** or **Regular (400)**. Increase letter-spacing slightly (`0.01em`) and line-height for maximum breathability.
    - *Scale:* `body-lg` (1rem) to `label-sm` (0.6875rem).
- **The "Editorial Hook":** Use `title-lg` in uppercase with wide tracking for "category" headers to mimic high-end magazine layouts.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural scaffolding.

- **The Layering Principle:** Stack containers to imply importance. A `surface-container-highest` element feels "closer" to the user than a `surface-container-low` element.
- **Ambient Shadows:** Standard drop shadows are forbidden. If an element must float, use an **Ambient Shadow**:
    - `blur: 40px`, `spread: -5px`, `color: #00000060`.
- **The Ghost Border Fallback:** For accessibility in forms, use the `outline_variant` token at **15% opacity**. This provides a "hint" of a container without breaking the ink-bleed aesthetic.

---

## 5. Component Guidelines

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `roundness-md`, ExtraBold text.
- **Secondary:** Glassmorphic background (blur 20px) with a 1px `Ghost Border`.
- **Tertiary:** Pure text with an underline that expands on hover.

### Bento Cards
- Forbid divider lines. Separate content using **Spacing Scale 6 (2rem)** or **8 (2.75rem)**.
- Use `surface-container-low` for card backgrounds. On hover, transition to `surface-container-high`.

### Input Fields
- **Base:** `surface-container-lowest` with a subtle `outline-variant` (10% opacity).
- **Active State:** Border glows with `secondary` (Cyber Cyan) and a 4px outer glow of the same color at 20% opacity.

### Navigation (The Kinetic Bar)
- Position as a floating "dock" at the bottom or top.
- Use **Ultra-frosted glass** (Blur 40px, `surface-bright` at 30% opacity).

---

## 6. Do's and Don'ts

### Do
- **DO** use generous whitespace (Spacing 12+). If it feels too empty, add more space.
- **DO** use "Kinetic Atelier" movement: subtle parallax on scroll and staggered entrance animations for bento cells.
- **DO** treat data as art. Use `secondary` (Cyber Cyan) for thin-stroke sparklines and charts.

### Don't
- **DON'T** use generic 3D illustrations or emojis. Use high-grain photography or abstract vector geometric shapes.
- **DON'T** use 100% white text for body copy. Use `on-surface-variant` (`#c2c6d6`) to reduce eye strain against the Deep Ink background.
- **DON'T** clutter the UI. If a feature isn't essential, hide it behind a glassmorphic "More" menu.