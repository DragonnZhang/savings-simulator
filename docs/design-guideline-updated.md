# Design Guidelines: Savings Simulator

_Generated: 2026-01-06_

## Design Style

**Modern Financial Dashboard** - Combining glassmorphism with premium dark UI aesthetics, emphasizing data clarity and sophisticated visual hierarchy.

## Color Palette

### Primary Colors

- **Emerald**: `#10b981` / `#14F195` - Growth, success, savings (primary action)
- **Cyan**: `#06b6d4` / `#22d3ee` - Investment, trust, clarity
- **Purple**: `#a855f7` / `#c084fc` - Premium features, highlights

### Accent Colors

- **Sky Blue**: `#0ea5e9` / `#38bdf8` - Information, navigation
- **Amber**: `#f59e0b` / `#fbbf24` - Warnings, investment returns
- **Rose**: `#f43f5e` / `#fb7185` - Expenses, alerts
- **Pink**: `#ec4899` - Secondary accents

### Neutral Colors

- **Background**: `#0F1419` - Deep space black (main bg)
- **Surface**: `#1A1D29` - Elevated surfaces
- **Surface Alt**: `#1f2937` - Cards, containers
- **Border**: `rgba(96, 165, 250, 0.15)` - Subtle cyan borders
- **Text**: `#E5E7EB` - Primary text (gray-200)
- **Text Muted**: `#9CA3AF` - Secondary text (gray-400)

### Color Psychology

Deep dark backgrounds create focus and reduce eye strain. Emerald represents financial growth and positive momentum. Cyan/blue builds trust and stability. Purple adds premium sophistication. Strategic use of warm colors (amber, rose) for expenses and warnings.

## Typography System

### Font Families

- **Primary**: Inter, Plus Jakarta Sans - Clean, highly legible
- **Display**: Inter (heavier weights) - Hero text, numbers
- **Monospace**: SF Mono, Consolas - Financial data, metrics

### Font Hierarchy

- **H1**: 72px-96px / ExtraBold (800-900) / 1.1 - Hero titles
- **H2**: 30px-36px / Bold (700) / 1.2 - Section headers
- **H3**: 20px-24px / Bold (700) / 1.3 - Card titles
- **Body**: 16px / Medium (500) / 1.6 - General content
- **Small**: 13-14px / Medium (500) / 1.5 - Labels, captions
- **Micro**: 11-12px / SemiBold (600) / 1.4 - Uppercase labels

### Typography Guidelines

- Large numbers: Use tabular figures for alignment
- Financial amounts: Bold weight, generous spacing
- Letter spacing: Wider for uppercase labels (0.05em - 0.1em)
- Gradient text for emphasis on key metrics

## Layout Principles

### Grid System

- Columns: 12-column flexible grid
- Gutter: 24px (desktop), 16px (mobile)
- Max width: 1440px container
- Responsive: 2 columns tablet, 1 column mobile

### Spacing Scale (Tailwind-based)

- xs: 4px (gap-1)
- sm: 8px (gap-2)
- md: 16px (gap-4)
- lg: 24px (gap-6)
- xl: 32px (gap-8)
- 2xl: 48px (gap-12)
- 3xl: 64px (gap-16)

### Responsive Breakpoints

- Mobile: 640px (sm)
- Tablet: 768px (md)
- Desktop: 1024px (lg)
- Wide: 1280px (xl)

## Component Styling

### Cards (Glass Effect)

- **Background**: `linear-gradient(135deg, rgba(26, 29, 41, 0.4), rgba(15, 20, 25, 0.5))`
- **Backdrop Filter**: `blur(24px) saturate(180%)`
- **Border**: 1px solid with colored glow (emerald/purple/cyan)
- **Border Radius**: 24px (rounded-3xl) - More organic, modern
- **Padding**: 40px (p-10) for major cards
- **Shadow**: Layered shadows with colored glow
- **Hover**: `translateY(-6px) scale(1.015)` with enhanced glow

### Buttons

- **Primary**: Gradient background (emerald to teal), bold text, rounded-xl
- **Height**: 48px standard, 40px compact
- **Padding**: 20px-32px horizontal
- **States**: Ripple effect on click, lift on hover (-2px), scale(0.96) on active
- **Animation**: 300ms cubic-bezier(0.34, 1.56, 0.64, 1) - Spring bounce

### Forms

- **Input Height**: 48px
- **Border Radius**: 12px (rounded-xl)
- **Border**: 2px solid with gradient on focus
- **Background**: Subtle gradient (gray-800 to gray-900)
- **Focus State**: Emerald glow, 3px shadow, scale(1.005)
- **Label**: Small, medium weight, gray-200

### Navigation

- Fixed top-right positioning
- Floating glass effect
- Smooth transitions between pages
- Language switcher + GitHub link

## Visual Hierarchy

### Emphasis Techniques

1. **Size**: Large gradient headings (72-96px)
2. **Color**: Gradient text for primary elements
3. **Glow**: Colored shadows for depth (emerald/purple/cyan)
4. **Animation**: Pulse for key metrics, stagger for entry
5. **Contrast**: Dark backgrounds, light text, vibrant accents

### Content Flow

- **F-Pattern**: Form left, results right (desktop)
- **Vertical Stack**: Mobile-first approach
- **Animated Entry**: Sequential stagger (0.1s-0.5s delays)
- **Focus Points**: Large metrics with pulse animation

### Visual Indicators

- **Section Indicators**: Colored vertical bars (1px width, 24px height)
- **Status Dots**: Animated ping effect for live data
- **Progress**: Gradient fills for visual feedback

## Micro-Interactions

### Animation Timing

- **Fast**: 150-200ms - Hover states, small transitions
- **Normal**: 250-300ms - Buttons, form elements
- **Slow**: 400-500ms - Cards, page transitions
- **Entry**: 500-600ms - Staggered slide-up entrance

### Easing Curves

- **Ease-out**: Button clicks, form submissions - `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring)
- **Ease-in-out**: Modals, overlays - `ease-in-out`
- **Linear**: Continuous animations - `linear`

### Interactive States

- **Hover**: Lift + glow + scale
- **Active**: Scale down (0.96)
- **Focus**: Colored ring + glow
- **Loading**: Shimmer gradient animation
- **Success**: Pulse + color shift

### Key Animations

- **Card Entrance**: `slideUp` - translateY(30px) to 0, opacity 0 to 1
- **Number Counter**: Smooth counting animation
- **Chart Draw**: Animated line/area reveal
- **Modal**: Backdrop fade + content spring

## Glassmorphism Implementation

### Glass Cards

```css
background: linear-gradient(135deg, rgba(26, 29, 41, 0.4) 0%, rgba(15, 20, 25, 0.5) 100%);
backdrop-filter: blur(24px) saturate(180%);
border: 1px solid rgba(96, 165, 250, 0.15);
box-shadow: 
  inset 0 1px 1px 0 rgba(255, 255, 255, 0.08),
  0 8px 32px rgba(0, 0, 0, 0.4);
```

### Gradient Borders

- Use pseudo-element (::before) with gradient background
- Mask-composite for border effect
- Animate opacity on hover

### Glow Effects

- Multiple box-shadows with color
- Emerald: `0 0 40px rgba(20, 241, 149, 0.3)`
- Purple: `0 0 40px rgba(192, 132, 252, 0.3)`
- Cyan: `0 0 40px rgba(96, 165, 250, 0.3)`

## Background Treatment

### Animated Background

- Base: `#0F1419` (deep black)
- Large gradient orbs: Emerald, purple, blue (20-50% size)
- Pulse animation: 8-10s duration, staggered delays
- Grid overlay: Subtle white lines with radial mask
- Fixed attachment for parallax effect

## Accessibility

### Contrast Ratios

- **Body Text**: 12:1 (#E5E7EB on #0F1419) - Exceeds WCAG AAA
- **Headings**: 14:1 with gradient overlays
- **Buttons**: 7:1 minimum for all states
- **Links**: Underline on focus, 4.5:1 contrast

### Focus Indicators

- 2px solid outline with color
- 2px offset for breathing room
- Glow effect for enhanced visibility
- Visible on keyboard navigation only

### Touch Targets

- Minimum: 44x44px for all interactive elements
- Buttons: 48px height standard
- Adequate spacing between clickable items

### Motion

- Respect `prefers-reduced-motion`
- Disable animations if requested
- Ensure functionality without animations

## Design Highlights

### What Works Well

1. **Deep contrast**: Dark backgrounds create focus on data
2. **Glassmorphism**: Modern, premium feel
3. **Animated gradients**: Dynamic, alive interface
4. **Staggered animations**: Professional entrance
5. **Color-coded sections**: Clear visual organization
6. **Glowing effects**: Depth and dimensionality
7. **Smooth interactions**: Premium feel

### Unique Elements

- Large animated gradient orbs in background
- Ping indicators for live data
- Spring bounce animations (cubic-bezier)
- Gradient text on key metrics
- Multi-layered shadows with glow
- Decorative separator with pulse dot

### Brand Alignment

- Professional yet approachable
- Modern financial technology aesthetic
- Trustworthy (blues) + growth (emerald)
- Premium sophistication (purple, glass effects)

## Implementation Notes

### Technologies

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: Custom React components
- **Charts**: Recharts library
- **Animations**: CSS transitions + keyframes
- **i18n**: next-intl for translations

### Performance Considerations

- CSS animations (GPU-accelerated)
- Minimize backdrop-filter usage (performance cost)
- Lazy load images/charts
- Memoize chart data transformations
- Use CSS variables for theme consistency

### Browser Support

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Graceful degradation for backdrop-filter
- Fallback solid backgrounds if needed

## Key Improvements for Refactor

1. **Reduce border radius variance** - Stick to 3 sizes: 12px, 16px, 24px
2. **Simplify card structure** - More consistent padding/spacing
3. **Enhance data visualization** - Better chart colors and patterns
4. **Improve form layout** - Better grouping, clearer hierarchy
5. **Add loading states** - Skeleton screens, shimmer effects
6. **Refine animations** - More consistent timing, better easing
7. **Optimize glass effects** - Balance beauty with performance
8. **Better mobile experience** - Optimized spacing, touch targets
