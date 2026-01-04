# Research & Design Decisions

## UI/UX Decisions

### GitHub Link Placement
- **Decision**: Place the GitHub icon in the top-right corner of the page (absolute/fixed position).
- **Rationale**: Standard pattern for single-page tools and "open source showcase" pages. Keeps the main header clean while ensuring the source code is always accessible.
- **Alternatives**: inline in header (cluttered), footer (hard to find).

### Icon Strategy
- **Decision**: Use an inline SVG for the GitHub logo.
- **Rationale**: Avoids adding a new dependency (like `lucide-react` or `react-icons`) just for one icon. Keeps bundle size minimal.

### Visual Style ("Beautification")
- **Decision**: Leverage and extend the existing `globals.css` "premium" theme.
    - Use `glass` class for the button container if floating.
    - Add hover effects consistent with `.card-hover` or `button` styles.
- **Rationale**: The codebase already has a high-quality design system defined in CSS variables and utility classes. Consistency is key.

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **State**: React 19 (Hooks)
