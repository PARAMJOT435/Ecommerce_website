# Design System - fewofmany Hygiene Products

## Brand Overview

**Brand Name**: fewofmany  
**Tagline**: "Natural Strength of Gentle Ingredients"  
**Brand Voice**: Natural, Trustworthy, Health-focused, Accessible  
**Target Audience**: Health-conscious Indian consumers (18-45 years), primarily women, seeking natural hygiene products

---

## 1. Color Palette

### Primary Colors

```css
/* Brand Green - Main identity color from packaging */
--color-primary-50: #f0fdf4;
--color-primary-100: #dcfce7;
--color-primary-200: #bbf7d0;
--color-primary-300: #86efac;
--color-primary-400: #4ade80;
--color-primary-500: #16a34a;  /* Main brand green */
--color-primary-600: #15803d;
--color-primary-700: #166534;
--color-primary-800: #14532d;
--color-primary-900: #052e16;
```

### Neutral Colors (Clean, Professional)

```css
/* Grays - For text and backgrounds */
--color-neutral-50: #fafafa;
--color-neutral-100: #f5f5f5;
--color-neutral-200: #e5e5e5;
--color-neutral-300: #d4d4d4;
--color-neutral-400: #a3a3a3;
--color-neutral-500: #737373;
--color-neutral-600: #525252;
--color-neutral-700: #404040;
--color-neutral-800: #262626;
--color-neutral-900: #171717;
```

### Accent Colors (From Product Packaging)

```css
/* Teal - For intimate hygiene products */
--color-teal-400: #2dd4bf;
--color-teal-500: #14b8a6;
--color-teal-600: #0d9488;

/* Orange - For vitamin C, energizing products */
--color-orange-400: #fb923c;
--color-orange-500: #f97316;
--color-orange-600: #ea580c;

/* Gold - For premium products (24k Gold Face Wash) */
--color-gold-400: #fbbf24;
--color-gold-500: #f59e0b;
--color-gold-600: #d97706;

/* Lime - For natural/fresh products (Safe Life Pads) */
--color-lime-400: #a3e635;
--color-lime-500: #84cc16;
--color-lime-600: #65a30d;
```

### Semantic Colors

```css
/* Success - Order confirmation, in stock */
--color-success: #16a34a;

/* Warning - Low stock, pending */
--color-warning: #f59e0b;

/* Error - Out of stock, validation errors */
--color-error: #dc2626;

/* Info - Product information, certifications */
--color-info: #0ea5e9;
```

---

## 2. Typography

### Font Families

```css
/* Primary Font - Clean, modern, professional */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Headings Font - Slightly more personality */
--font-headings: 'DM Sans', 'Inter', sans-serif;

/* Numbers/Price - Tabular for alignment */
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### Font Sizes (Tailwind v4 Compatible)

```css
/* Type Scale */
--text-xs: 0.75rem;      /* 12px - Small labels, badges */
--text-sm: 0.875rem;     /* 14px - Body text small, captions */
--text-base: 1rem;       /* 16px - Body text */
--text-lg: 1.125rem;     /* 18px - Large body, small headings */
--text-xl: 1.25rem;      /* 20px - H4 */
--text-2xl: 1.5rem;      /* 24px - H3 */
--text-3xl: 1.875rem;    /* 30px - H2 */
--text-4xl: 2.25rem;     /* 36px - H1 */
--text-5xl: 3rem;        /* 48px - Hero heading */
--text-6xl: 3.75rem;     /* 60px - Landing page hero */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.25;    /* Headings */
--leading-snug: 1.375;    /* Subheadings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.625; /* Long-form content */
```

---

## 3. Spacing System

```css
/* Spacing Scale (rem-based for consistency) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

---

## 4. Layout & Grid

### Container Widths

```css
--container-sm: 640px;   /* Mobile landscape */
--container-md: 768px;   /* Tablet */
--container-lg: 1024px;  /* Desktop */
--container-xl: 1280px;  /* Large desktop */
--container-2xl: 1536px; /* Extra large */
```

### Breakpoints

```css
/* Mobile first approach */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Product Grid

- **Desktop (lg+)**: 3 columns
- **Tablet (md)**: 2 columns  
- **Mobile (sm)**: 1 column
- **Gap**: --space-6 (24px)

---

## 5. Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px - Badges */
--radius-base: 0.25rem;  /* 4px - Buttons, inputs */
--radius-md: 0.375rem;   /* 6px - Cards */
--radius-lg: 0.5rem;     /* 8px - Larger cards */
--radius-xl: 0.75rem;    /* 12px - Modals */
--radius-2xl: 1rem;      /* 16px - Product images */
--radius-full: 9999px;   /* Pills, circular badges */
```

---

## 6. Shadows

```css
/* Subtle, clean shadows for hygiene/medical aesthetic */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Colored shadows for special elements */
--shadow-green: 0 10px 15px -3px rgb(22 163 74 / 0.3);
```

---

## 7. Component Patterns

### Buttons

**Primary Button** (Call-to-action: "Add to Cart", "Buy Now")
```css
background: var(--color-primary-500);
color: white;
padding: var(--space-3) var(--space-6);
border-radius: var(--radius-base);
font-weight: var(--font-semibold);
transition: all 0.2s ease;

hover:
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
```

**Secondary Button** (Less emphasis: "View Details")
```css
background: white;
color: var(--color-primary-600);
border: 1px solid var(--color-primary-300);
padding: var(--space-3) var(--space-6);
border-radius: var(--radius-base);
font-weight: var(--font-medium);

hover:
  background: var(--color-primary-50);
  border-color: var(--color-primary-500);
```

**Ghost Button** (Minimal: "Learn More")
```css
background: transparent;
color: var(--color-neutral-700);
padding: var(--space-3) var(--space-6);

hover:
  background: var(--color-neutral-100);
```

### Cards (Product Cards)

```css
background: white;
border: 1px solid var(--color-neutral-200);
border-radius: var(--radius-lg);
padding: var(--space-4);
box-shadow: var(--shadow-sm);
transition: all 0.3s ease;

hover:
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
  border-color: var(--color-primary-300);
```

### Badges (Certifications: "Sulfate Free", "No Animal Testing")

```css
display: inline-flex;
align-items: center;
gap: var(--space-2);
padding: var(--space-1) var(--space-3);
background: var(--color-primary-100);
color: var(--color-primary-700);
border-radius: var(--radius-full);
font-size: var(--text-xs);
font-weight: var(--font-medium);
```

### Product Image Containers

```css
aspect-ratio: 1 / 1; /* Square */
border-radius: var(--radius-2xl);
overflow: hidden;
background: var(--color-neutral-50);
position: relative;
```

---

## 8. Iconography

### Icon Style
- **Style**: Outlined (Lucide React icons)
- **Stroke width**: 1.5px (clean, not too bold)
- **Size scale**: 16px (sm), 20px (base), 24px (lg), 32px (xl)

### Common Icons Needed
- Shopping cart, heart (wishlist), user, search
- Check mark (certifications), leaf (natural), shield (protection)
- Star (ratings), truck (shipping), lock (secure)

---

## 9. Certification Badge Design

Based on your product packaging badges:

```css
/* Badge container */
display: inline-flex;
flex-direction: column;
align-items: center;
gap: var(--space-1);
padding: var(--space-2);

/* Icon */
width: 32px;
height: 32px;
color: var(--color-primary-600);

/* Label */
font-size: var(--text-xs);
font-weight: var(--font-medium);
color: var(--color-neutral-700);
text-align: center;
```

**Certification Types:**
1. ✓ Paraben Free
2. ✓ Sulfate Free  
3. ✓ No Animal Testing
4. ✓ GMP Certified
5. ✓ Natural Ingredients

---

## 10. Design Principles

### Visual Hierarchy
1. **Clean & Spacious**: Generous white space communicates purity/cleanliness
2. **Green First**: Primary color used for CTAs and emphasis
3. **Certification Prominence**: Trust badges visible on every product
4. **Image Quality**: High-res product photos (like your PDF images)

### Accessibility
- **WCAG AA compliant** color contrast ratios
- **Minimum text size**: 16px for body text
- **Focus states**: Clear 2px outline in primary color
- **Alt text**: Descriptive for all product images

### Responsive Design
- **Mobile-first**: Design for mobile, enhance for desktop
- **Touch targets**: Minimum 44x44px for buttons/links
- **Readable line length**: Max 75 characters per line

---

## 11. Animation & Micro-interactions

### Transitions
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

### Common Animations
- **Button hover**: Slight lift (translateY -1px) + shadow
- **Card hover**: Lift + shadow + border color change
- **Add to cart**: Brief scale animation on button
- **Image hover**: Gentle zoom (scale 1.05)

---

## 12. Product Category Color Coding (Subtle)

Use accent colors subtly in category badges/tags:

- **Hair Care**: Primary Green
- **Intimate Hygiene**: Teal
- **Skin Care**: Orange  
- **Sanitary Products**: Lime
- **Handmade Soaps**: Gold

---

## Implementation in Tailwind v4

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary-*: [as defined above];
  --color-neutral-*: [as defined above];
  /* ... all other colors */
  
  /* Typography */
  --font-sans: var(--font-primary);
  --font-heading: var(--font-headings);
  
  /* Spacing */
  --spacing-*: [as defined above];
  
  /* Radius */
  --radius-*: [as defined above];
}
```

---

## Next Steps

This design system provides:
1. ✅ Brand-aligned color palette (green-focused)
2. ✅ Professional typography scale
3. ✅ Consistent spacing system
4. ✅ Component patterns for all UI elements
5. ✅ Certification badge styling
6. ✅ Responsive grid guidelines
7. ✅ Accessibility standards

**Ready to implement?** This can now be translated into your Tailwind v4 configuration and used to build all components consistently.
