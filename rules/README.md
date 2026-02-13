# Rules System

This folder contains all project rules and guidelines that AI agents (and developers) should follow.

## Why Rules in `/rules` Instead of `.agent/`?

**Key Reason**: AI agents can UPDATE files in `/rules`, but typically cannot update files in `.agent/` folder.

This means:
- ✅ Agents can update `03-components.md` when they create components
- ✅ Component inventory stays current automatically
- ✅ No duplicate components = no wasted credits
- ✅ Self-maintaining documentation

## File Structure

```
rules/
├── README.md               ← You are here
├── 01-stack.md             ← Tech stack (Next.js, Tailwind v4, Supabase, Razorpay)
├── 02-workflows.md         ← Development processes
├── 03-components.md        ← Component inventory (UPDATED BY AGENTS)
├── 04-architecture.md      ← Next.js patterns & structure
├── 05-conventions.md       ← Code standards
├── 06-design-system.md     ← Complete design system
└── 07-design-quick-ref.md  ← Quick styling reference
```

## How This Works

1. **Master rule** in `.agent/rules.md` tells agents to check `/rules`
2. **Agents read** the relevant rule files before coding
3. **Agents update** `03-components.md` after creating components
4. **Future agents** see what components exist and reuse them

## For Developers

### Adding New Rules

1. Create a new markdown file: `08-your-rule.md`
2. Follow the naming convention: `##-name.md`
3. Update this README with the new file
4. Optionally update `.agent/rules.md` if it needs special mention

### Editing Rules

Simply edit the markdown files directly. Changes take effect immediately for AI agents.

### Component Inventory Format

When documenting a component in `03-components.md`, use this format:

```markdown
#### `<ComponentName />`
- **Location**: `path/to/component.tsx`
- **Use Case**: Brief description
- **Props**:
  ```typescript
  interface ComponentProps {
    prop1: type
    prop2: type
  }
  ```
- **Example**:
  ```tsx
  <ComponentName prop1="value" prop2="value" />
  ```
```

## Benefits

### For AI Agents
- ✅ Know what components exist
- ✅ Follow design system consistently
- ✅ Use correct tech stack
- ✅ Write maintainable code
- ✅ Self-document as they work

### For Developers
- ✅ Onboard new team members faster
- ✅ Consistent codebase
- ✅ Less code review needed
- ✅ Component reusability
- ✅ Living documentation

## Rule Types

### Static Rules (Rarely Change)
- `01-stack.md` - Only changes when upgrading tech
- `06-design-system.md` - Only changes with rebrand
- `04-architecture.md` - Only changes with major refactors

### Dynamic Rules (Frequently Updated)
- `03-components.md` - Updated every time a component is created
- Maybe future: API endpoints, database schema changes, etc.

### Reference Rules (Helper Docs)
- `07-design-quick-ref.md` - Quick lookup for styling
- `02-workflows.md` - Process documentation

## Maintenance

### Weekly
- Review `03-components.md` for accuracy
- Remove components that were deleted
- Update examples if API changes

### Monthly
- Check if tech stack needs updating
- Review design system for consistency
- Update workflows if processes change

### On Major Changes
- Update all relevant rule files
- Test with AI agent to ensure rules are followed
- Document breaking changes

## Tips for Writing Good Rules

1. **Be Specific**: "Use primary-500" not "use green"
2. **Show Examples**: Code examples > descriptions
3. **Keep It Short**: Each rule file should be scannable
4. **Use Formatting**: Headers, lists, code blocks
5. **Think Like an Agent**: What would confuse an AI?

## Credits & Cost Optimization

By maintaining accurate component inventory:
- Agents don't rebuild existing components
- Less trial and error
- Fewer API calls
- Lower costs
- Faster development

**Example**: Without rules, agent might create `ProductCard` 3 times. With rules, it creates it once and reuses it.

---

**Last Updated**: February 2026  
**Maintained By**: Development Team + AI Agents