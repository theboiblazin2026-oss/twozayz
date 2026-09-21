# Implementation Plan - TWOZAYZ Website (Pressure Washing, Car Detailing & Lawn Care)

This plan outlines the step-by-step development of a modern, high-converting website for **TWOZAYZ**, based on the provided promotional flyer. The website will translate the flyer's high-energy hydro dynamic dark aesthetic (neon cyan splashes, bold crown logo typography, polished imagery) into a responsive web application.

---

## User Preferences & Customization (Confirmed)

> [!IMPORTANT]
> - **Pricing**: Flexible / custom estimate requests (no hardcoded prices). The interactive Instant Quote tool will gather service details (driveway size, car type, yard acreage) and submit for a **FREE ESTIMATE**.
> - **Service Area**: Exclusively **Lake City, FL & Surrounding Areas**.
> - **Contact Details**: Phone/Text: `(386) 288-1483`, Email: `Twozayz@gmail.com`.
> - **Core Badges**: "FREE ESTIMATES", "Support Local (Lake City, FL)", "Call or Text Today".

---

## Proposed Changes

### Web Application Architecture

#### [NEW] [index.html](file:///Users/newguy/twozayz-website/index.html)
- Main HTML5 page structure.
- **Dynamic Header & Navigation**: Glowing TWOZAYZ crown logo, service nav links, Lake City FL badge, direct Call/Text CTA.
- **Hero Section**: Hydro splash backdrop, high-converting headline ("Lake City's Premier Exterior Care & Mobile Detailing"), free estimate CTA buttons, key trust badges ("Support Local Lake City", "Free Estimates").
- **3 Pillar Service Cards**:
  - **Pressure Washing**: Driveways, House Washing, Patios & Fences.
  - **Car Detailing**: Interior & Exterior, Vacuum & Windows, Tire Shine.
  - **Lawn Care**: Mowing, Edging, Yard Cleanup.
- **Interactive Free Estimate Generator**: Step-by-step service request builder tailored to Lake City residents.
- **Before & After Transformation Gallery**: Filterable visual showcase with interactive image comparison sliders.
- **Lake City Service Area & Contact Section**: Location badge, direct tap-to-call `(386) 288-1483`, tap-to-text (`sms:386-288-1483`), and quote request form.

#### [NEW] [styles.css](file:///Users/newguy/twozayz-website/styles.css)
- Dark Mode Hydro aesthetic:
  - Deep dark theme (`#0a0e17`), electric cyan splashes (`#00d2ff`), vibrant blue accents (`#0066ff`), emerald green lawn highlights (`#10b981`), glossy white typography.
  - Custom glassmorphic cards, metallic border effects, crown emblem styling, hover micro-animations.
  - Mobile-first responsive grid.

#### [NEW] [app.js](file:///Users/newguy/twozayz-website/app.js)
- Mobile drawer menu script.
- Free Estimate Form builder & submission handler with confirmation modal.
- Before/After image slider interactions & filter tab logic.
- Dynamic water droplet splash animation canvas background.

#### [NEW] Generated Image Assets
- High quality custom visuals generated for pressure washing driveway transformation, luxury black SUV detailing, and crisp edged lawn care.

---

## Step-by-Step Implementation Roadmap

### Step 1: Design System & Project Structure Setup
- Setup `index.html`, `styles.css`, and `app.js`.

### Step 2: Branding, Header & Hero Section
- Build TWOZAYZ logo with crown emblem and electric hydro glow.
- Highlight Lake City, FL local focus and instant Call/Text actions.

### Step 3: Interactive 3-Pillar Service Grid
- Create service cards matching flyer categories with checklists.

### Step 4: Interactive Free Estimate Generator
- Build step-by-step form for Lake City clients to request custom estimates.

### Step 5: Before & After Visual Showcase
- Implement interactive before/after sliders for pressure washing, car detailing, and lawn care.

### Step 6: Direct Mobile Actions & Lead Confirmation
- Floating mobile bar for Call `(386) 288-1483`, Text `(386) 288-1483`, Email `Twozayz@gmail.com`.
- Interactive modal dialogs for booking confirmation.

---

## Verification Plan

### Automated & Layout Checks
- Validate HTML5 and CSS markup.
- Test responsive layout across mobile, tablet, and desktop display widths.
- Test JS logic for quote builder and modal notifications.

### Manual Verification
- Test direct tap-to-call, tap-to-text, and mailto triggers.
- Verify user experience of estimate tool and before/after sliders.
