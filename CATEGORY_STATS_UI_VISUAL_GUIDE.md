# CategoryStatsCards - UI Visual Guide

## 🎨 Card Layout & Components

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ╔═════════════════════════════════════════════╗   │
│  ║ LAUNCH VEHICLES (LV)              ⚡       ║   │  ← Header Section
│  ║                                             ║   │
│  ╚═════════════════════════════════════════════╝   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │  📊 Total Projects                          │   │
│  │  ╔═════════════╗                             │   │  ← Total Badge
│  │  ║      5      ║                             │   │
│  │  ╚═════════════╝                             │   │
│  │                                             │   │
│  ├─────────────────────────────────────────────┤   │
│  │                                             │   │
│  │  ┌──────────────┬──────────────┐            │   │
│  │  │✓ On Track    │⏱️ Delayed    │            │   │  ← Status Grid (2 cols)
│  │  │    3         │    2         │            │   │
│  │  │   60%        │   40%        │            │   │
│  │  └──────────────┴──────────────┘            │   │
│  │                                             │   │
│  ├─────────────────────────────────────────────┤   │
│  │                                             │   │
│  │  💰 Sanctioned: ₹5.00 Cr                   │   │  ← Cost Section
│  │  ✓ Cum Exp:     ₹2.50 Cr                   │   │
│  │                                             │   │
│  ├─────────────────────────────────────────────┤   │
│  │                                             │   │
│  │  Utilization: 50%                           │   │  ← Progress Section
│  │  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │  (Green for >=80%, Yellow 50-79%, Red <50%)│   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Color Schemes (6 Variations)

### Color Set 1
```
Background: from-blue-500/20 to-blue-600/20
Border: border-blue-400/30
Header: bg-blue-500/10
Accent: text-blue-300
```

### Color Set 2
```
Background: from-purple-500/20 to-purple-600/20
Border: border-purple-400/30
Header: bg-purple-500/10
Accent: text-purple-300
```

### Color Set 3
```
Background: from-green-500/20 to-green-600/20
Border: border-green-400/30
Header: bg-green-500/10
Accent: text-green-300
```

### Color Set 4
```
Background: from-orange-500/20 to-orange-600/20
Border: border-orange-400/30
Header: bg-orange-500/10
Accent: text-orange-300
```

### Color Set 5
```
Background: from-pink-500/20 to-pink-600/20
Border: border-pink-400/30
Header: bg-pink-500/10
Accent: text-pink-300
```

### Color Set 6
```
Background: from-indigo-500/20 to-indigo-600/20
Border: border-indigo-400/30
Header: bg-indigo-500/10
Accent: text-indigo-300
```

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
```
┌─────────────┐
│ Category 1  │
├─────────────┤
│ Category 2  │
├─────────────┤
│ Category 3  │
└─────────────┘

Grid: 1 column
Gap: 1rem (4 units)
```

### Tablet (768px - 1024px)
```
┌─────────────┬─────────────┐
│ Category 1  │ Category 2  │
├─────────────┼─────────────┤
│ Category 3  │ Category 4  │
└─────────────┴─────────────┘

Grid: 2 columns (md:grid-cols-2)
Gap: 1rem (4 units)
```

### Desktop (> 1024px)
```
┌─────────────┬─────────────┬─────────────┐
│ Category 1  │ Category 2  │ Category 3  │
├─────────────┼─────────────┼─────────────┤
│ Category 4  │ Category 5  │ Category 6  │
└─────────────┴─────────────┴─────────────┘

Grid: 3 columns (lg:grid-cols-3)
Gap: 1rem (4 units)
```

---

## 🎬 Animation States

### Default State
```
opacity: 100%
scale: 1
shadow: shadow-md
```

### Hover State
```
opacity: 100%
scale: 105% (hover:scale-105)
shadow: shadow-lg (hover:shadow-lg)
background: slightly brighter
transition: 300ms (duration-300)
```

### Active/Click State
```
opacity: 100%
scale: 103%
shadow: shadow-xl
```

---

## 📊 Data Display Format

### Numbers
```
Total Projects:    Integer (5, 10, 23)
On Track Count:    Integer (3)
Delayed Count:     Integer (2)
Percentage:        Integer with % (60%, 40%)
```

### Currency
```
Input:     500000000 (Paisa)
Display:   ₹5.00 Cr (Crores)
Formula:   value / 10,000,000
Decimals:  2 places
```

### Status Indicators
```
✓ On Track    → Green (#10B981)    Percentage shown
⏱️ Delayed     → Red (#EF4444)      Percentage shown
```

### Progress Bar
```
Utilization >= 80%:   bg-green-500   ✓ Good
Utilization 50-79%:   bg-yellow-500  ⚠️ Medium
Utilization < 50%:    bg-red-500     ✗ Low

Bar fills from left to right
Max width: 100% when utilization >= 100%
Capped at 100%: Math.min(utilizationRate, 100)
```

---

## 🎯 Component Hierarchy

```
CategoryStatsCards
│
├─ Section Title & Description
│  └─ "📊 Project Categories Overview"
│     "On Track • Delayed • Sanctioned Cost • Cumulative Expenditure"
│
└─ Cards Grid (Responsive)
   │
   ├─ Card 1: Category Data
   │  │
   │  ├─ Header Section
   │  │  ├─ Category Full Name (Large, Bold)
   │  │  ├─ Category Short Name (Small, Muted)
   │  │  └─ Icon (Zap)
   │  │
   │  ├─ Total Projects Badge
   │  │  └─ Large Number Display
   │  │
   │  ├─ Status Grid (2 columns)
   │  │  ├─ On Track Box (Green)
   │  │  │  ├─ Count
   │  │  │  └─ Percentage
   │  │  └─ Delayed Box (Red)
   │  │     ├─ Count
   │  │     └─ Percentage
   │  │
   │  ├─ Cost Information
   │  │  ├─ Sanctioned Cost (Formatted)
   │  │  └─ Cumulative Expenditure (Formatted)
   │  │
   │  └─ Utilization Progress
   │     ├─ Percentage Label
   │     └─ Colored Progress Bar
   │
   ├─ Card 2...
   └─ Card N...
```

---

## 🎨 Typography

| Element | Style | Size | Weight | Color |
|---------|-------|------|--------|-------|
| Section Title | Uppercase | 18px | 900 | white |
| Section Desc | Regular | 12px | 400 | slate-400 |
| Category Name | Uppercase | 14px | 900 | white |
| Category Code | Regular | 12px | 400 | slate-300 |
| Total Count | Bold | 24px | 900 | accent |
| Label | Regular | 12px | 600 | slate-300 |
| Count | Bold | 18px | 900 | accent |
| Percentage | Bold | 12px | 700 | muted |
| Amount | Bold | 14px | 700 | accent |

---

## 🔄 Interaction Flows

### Card Hover
```
User hovers over card
  ↓
Scale effect (105%)
Shadow effect (enhance)
Icon opacity (60% → 100%)
Duration: 300ms
  ↓
Visual feedback: Elevated, emphasized card
```

### Card Click
```
User clicks card
  ↓
Check if projectCount > 0
  ↓
If yes:
  Navigate to 'all-projects' page
  Pass category code as parameter
  ↓
If no:
  No action (cursor default)
```

### Data Loading
```
Initial state: Loading spinner
  ↓
Spinner rotates (infinite animation)
Message: "Loading..." (if shown)
  ↓
Data arrives from backend
  ↓
Spinner disappears
Cards render
```

---

## 💡 Feature Highlights

✨ **Visual Polish:**
- Glassmorphism effect (backdrop blur)
- Gradient backgrounds
- Smooth animations
- Color-coded status
- Icon indicators

🎯 **User Experience:**
- Clear hierarchy
- Easy scanning
- Status at a glance
- Cost transparency
- Utilization insights

📱 **Responsive:**
- Mobile-first design
- Adapts to all screen sizes
- Touch-friendly cards
- Readable on any device

♿ **Accessibility:**
- Sufficient color contrast
- Clear labels
- Semantic HTML
- Icon + text labels
- Keyboard navigable (onClick handlers)
