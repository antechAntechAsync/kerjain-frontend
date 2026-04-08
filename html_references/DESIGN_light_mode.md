# Design System Specification: Editorial Futurity

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Atelier."** 

Moving beyond the generic utility of a marketplace, this system treats vocational talent as a high-end gallery. It rejects the "template" look of modern SaaS in favor of an editorial, high-fashion aesthetic. By combining the precision of Apple’s HIG with the depth of glassmorphism, we create a space that feels both surgically clean and tangibly premium. We achieve this through **intentional asymmetry**, where bento-grid layouts break rhythm to highlight featured content, and **tonal layering**, which replaces outdated borders with sophisticated depth.

---

## 2. Colors & Surface Architecture

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. Structural definition must be achieved through background shifts. For example, a `surface-container-low` card sitting on a `surface` background provides all the separation a premium user needs. 

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials.
*   **Base:** `surface` (#f7f9fb)
*   **Secondary Sections:** `surface-container-low` (#f2f4f6)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff)
*   **Floating Navigation:** Glassmorphic layers using `surface-variant` at 60% opacity with a `backdrop-blur: 20px`.

### Signature Textures
Avoid "AI Slop" (multicolored, muddy gradients). Instead, use **Monochromatic Depth**. Main CTAs should use a subtle transition from `secondary` (#0058bd) to `secondary-container` (#2071e3). This creates a "glow" effect that feels intentional and high-tech rather than generated.

---

## 3. Typography: Plus Jakarta Sans
We use **Plus Jakarta Sans** to bridge the gap between geometric precision and human warmth.

| Level | Size | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display-LG** | 3.5rem | 800 (Bold) | -0.04em | Hero headlines, value props |
| **Headline-MD** | 1.75rem | 700 (Bold) | -0.02em | Section headers, Bento titles |
| **Title-MD** | 1.125rem | 600 (Semi) | -0.01em | Card titles, Modal headers |
| **Body-LG** | 1rem | 400 (Reg) | 0 | Primary body copy, descriptions |
| **Label-MD** | 0.75rem | 600 (Semi) | 0.05em | Uppercase category tags |

*Director's Note:* Use `display` sizes aggressively. High-contrast scaling (pairing a `display-lg` headline with `body-md` text) creates the editorial "magazine" feel we are striving for.

---

## 4. Elevation & Depth

### The Layering Principle
Hierarchy is conveyed through **Tonal Stacking**. 
1.  **Level 0 (Background):** `surface`
2.  **Level 1 (Content Area):** `surface-container-low` (1.4rem padding)
3.  **Level 2 (Interactive Element):** `surface-container-lowest` with a `2rem` (xl) border radius.

### Ambient Shadows
Shadows must be invisible until noticed. 
*   **Color:** `on-surface` (#191c1e) at 4-6% opacity.
*   **Blur:** 40px to 60px.
*   **Spread:** -10px (to keep the shadow "tucked" under the element).

### The "Ghost Border" Fallback
If contrast ratios require a boundary (e.g., in Dark Mode), use a **Ghost Border**: `outline-variant` (#c5c6cd) at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components & Interaction

### Squircle Nodes & Bento Grids
All containers must use **Squircle** (continuous curvature) geometry with a minimum radius of `20px` (`md: 1.5rem`). Layouts should follow a Bento-grid logic: variable-width modules that "snap" together, prioritizing white space (`spacing-10` to `spacing-16`) over dense information.

### Buttons & Inputs
*   **Primary Button:** `secondary` background, `on-secondary` text. Shape: `full` (pill). Spring animation on hover: scale 1.02.
*   **Glass Action:** `surface-variant` at 40% opacity + `backdrop-blur: 20px`. 
*   **Input Fields:** Use `surface-container-high` background. No border. On focus, shift to `primary-fixed` with a subtle `secondary` ghost-border.

### Forbid Dividers
In lists or profile views, **forbid the use of divider lines**. Separate list items using `spacing-3` vertical gaps or alternating `surface-container-low` and `surface-container-lowest` backgrounds.

### Motion (The "Living" UI)
All transitions must use the **Vocational Spring**:
*   **Stiffness:** 300
*   **Damping:** 30
This ensures the UI feels "snappy" but organic—avoiding the robotic feel of linear eases.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. A 60/40 split is more "Editorial" than a 50/50 split.
*   **Do** use `primary-container` (#1d283a) for high-contrast dark sections in the light theme to create "visual anchors."
*   **Do** prioritize `spacing-20` (7rem) for hero section margins. Air is luxury.

### Don’t:
*   **Don’t** use pure black (#000000) or pure grey. Always use the tinted neutrals provided (`surface-dim`, `surface-bright`).
*   **Don’t** use standard 4px or 8px border radii. If it’s not `20px+`, it’s not this system.
*   **Don’t** use "AI Slop" gradients. If a gradient is used, it should be so subtle the user perceives it as "lighting" rather than "color."
*   **Don't** use icons with different line weights. Use a consistent 2pt rounded stroke to match the `Plus Jakarta Sans` weight.