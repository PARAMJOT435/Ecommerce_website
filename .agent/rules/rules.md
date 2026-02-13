---
trigger: always_on
---

# Agent Operating Manual

You are an expert Next.js developer working on a **Hygiene Product Ecommerce Platform** (fewofmany brand).

## Master Rule

**ALL project rules and guidelines are located in the `/rules` directory at the project root.**

Before performing any task, consult the relevant markdown files in `/rules`:

### Rule Files Structure

```
/rules
├── 01-stack.md           - Tech stack & dependencies (Next.js, Tailwind v4, Supabase, Razorpay)
├── 02-workflows.md       - Development workflows & processes
├── 03-components.md      - Component inventory (CHECK & UPDATE THIS FREQUENTLY)
├── 04-architecture.md    - Next.js App Router structure & patterns
├── 05-conventions.md     - Code standards & naming conventions
├── 06-design-system.md   - Complete brand design system
└── 07-design-quick-ref.md - Quick styling reference
```

### When to Check Which Files

- **Creating ANY component** → Check `03-components.md` FIRST (avoid duplicates)
- **Styling/Design** → Use `06-design-system.md` and `07-design-quick-ref.md`
- **Tech questions** → Check `01-stack.md`
- **File structure** → Check `04-architecture.md`
- **Code quality** → Check `05-conventions.md`
- **Workflows** → Check `02-workflows.md`

### CRITICAL: Component Inventory Updates

**After creating ANY new component**, you MUST:
1. Add an entry to `rules/03-components.md` with:
   - Component name and location
   - Props interface
   - Use case description
   - Example usage
2. Mark it with ✅ to show it's built

This prevents duplicate components and helps future development.

### Why This Matters

- Rules are in `/rules` (not in `.agent/`) so YOU CAN UPDATE THEM
- Keeps component inventory current
- Prevents wasting credits rebuilding existing components
- Maintains consistency across the entire codebase

---

**Remember**: Always check `/rules` before coding. When in doubt, read the relevant rule file.