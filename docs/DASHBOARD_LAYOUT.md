# Dashboard Layout & UI Design

## Overall Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Header / Navigation                                         │
├────────────┬─────────────────────────────────────────────────┤
│            │                                                  │
│  Sidebar   │  Main Content Area                              │
│            │                                                  │
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
```

---

## Header / Navigation Bar

**Position**: Fixed top, full width

**Content**:
- Left: Logo + "Subscription Manager"
- Center: Search bar (global subscription search)
- Right:
  - Notification bell icon (with badge for unread count)
  - User avatar/menu dropdown
  - Settings icon

**Mobile**: Hamburger menu, collapsible search

---

## Sidebar Navigation

**Width**: 240px (collapsible to 60px icon-only)

**Menu Items**:
1. 📊 **Dashboard** (default view)
2. 📦 **All Subscriptions**
3. 🔔 **Notifications**
4. 📈 **Analytics**
5. 💡 **Insights**
6. ⚙️ **Settings**
7. ➕ **Add Subscription** (primary action button)

**Bottom Section**:
- Monthly total: **$XXX.XX/mo**
- Yearly total: **$X,XXX.XX/yr**
- Active subs count

---

## Main Dashboard View

### Section 1: Quick Stats (Top)
**Layout**: 4-column grid (responsive: 2x2 on tablet, 1x4 on mobile)

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  💰 Monthly │  📅 Yearly  │  ✓ Active   │  ⏰ Upcoming│
│   $XXX.XX   │  $X,XXX.XX  │     24      │      5      │
│   +$12 from │  +$144/yr   │ subscriptions│  renewals   │
│   last month│             │             │  (30 days)  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Styling**:
- Cards with subtle shadows
- Icons with brand colors
- Trend indicators (up/down arrows with percentages)
- Tooltips on hover

---

### Section 2: Insights & Recommendations
**Layout**: Full-width dismissible banner or card

**Content** (examples):
```
┌─────────────────────────────────────────────────────────┐
│  💡 Optimization Insights                               │
│  ────────────────────────────────────────────────────   │
│  • You could save $29/mo by cancelling 3 unused subs   │
│  • Netflix increased price by 15% - Review now →        │
│  • 2 free trials ending soon - Decide before charged   │
│  [View All Insights]                                    │
└─────────────────────────────────────────────────────────┘
```

**Features**:
- Color-coded by priority (green=savings, yellow=warning, red=urgent)
- Clickable actions
- Dismiss button
- Expand/collapse

---

### Section 3: Spending Overview
**Layout**: 2-column grid (full-width on mobile)

#### Left: Spending Trends Chart
```
┌───────────────────────────────────────────────┐
│  Spending Trends                   [⋮ Menu]  │
│  ─────────────────────────────────────────    │
│                                               │
│  [Line/Area Chart: Last 6 months]            │
│  X-axis: Months                               │
│  Y-axis: $ Amount                             │
│  Legend: Monthly • Projected                  │
│                                               │
│  [3M] [6M] [1Y] [All] ← time range selector  │
└───────────────────────────────────────────────┘
```

#### Right: Category Breakdown
```
┌───────────────────────────────────────────────┐
│  Spending by Category          [⋮ Menu]      │
│  ─────────────────────────────────────────    │
│                                               │
│  [Donut Chart]                                │
│                                               │
│  • Entertainment  $89  (35%)                  │
│  • Productivity   $62  (24%)                  │
│  • Cloud Storage  $45  (18%)                  │
│  • Utilities      $31  (12%)                  │
│  • Other          $28  (11%)                  │
└───────────────────────────────────────────────┘
```

---

### Section 4: Subscription Lists
**Layout**: Tabbed interface or segmented control

**Tabs**:
1. **Upcoming Renewals** (default)
2. **All Active**
3. **Free Trials**
4. **Recently Cancelled**

#### Upcoming Renewals Tab
```
┌──────────────────────────────────────────────────────────┐
│  Upcoming Renewals (Next 30 Days)          [Filter ▼]    │
│  ──────────────────────────────────────────────────────  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [🎬] Netflix                      Renews in 3 days │  │
│  │      Entertainment • $15.99/mo                     │  │
│  │      [View] [Remind Me] [Cancel]                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [💼] Adobe Creative Cloud        Renews in 8 days  │  │
│  │      Productivity • $54.99/mo                      │  │
│  │      [View] [Remind Me] [Cancel]                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [☁️] Dropbox                      Renews in 12 days│  │
│  │      Cloud Storage • $11.99/mo                     │  │
│  │      [View] [Remind Me] [Cancel]                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  [Load More]                                              │
└──────────────────────────────────────────────────────────┘
```

**Subscription Card Design**:
- Icon/logo (category icon or custom)
- Subscription name (bold)
- Category and price (secondary text)
- Days until renewal (color-coded: green >7 days, yellow 3-7, red <3)
- Quick action buttons
- Hover: Show additional details (payment method, start date)

---

### Section 5: Quick Actions
**Layout**: Horizontal button row

```
[+ Add Subscription]  [📥 Import CSV]  [📊 View Full Analytics]  [💡 Get Insights]
```

---

## All Subscriptions View

**Layout**: Data table with filters and search

```
┌──────────────────────────────────────────────────────────────────┐
│  All Subscriptions                                               │
│  ──────────────────────────────────────────────────────────────  │
│  🔍 [Search...]        Filters: [Status ▼] [Category ▼]         │
│                                 [Payment Method ▼] [Sort ▼]      │
│  ────────────────────────────────────────────────────────────    │
│                                                                   │
│  ☑ Select All  [Bulk Actions ▼]                                 │
│                                                                   │
│  ┌───┬──────────────┬──────────┬────────┬──────────┬─────────┐  │
│  │ ☐ │ Name         │ Category │ Price  │ Next Due │ Actions │  │
│  ├───┼──────────────┼──────────┼────────┼──────────┼─────────┤  │
│  │ ☐ │ Netflix      │ 🎬 Ent   │ $15.99 │ Jan 15   │ ⋮       │  │
│  │ ☐ │ Adobe CC     │ 💼 Prod  │ $54.99 │ Jan 22   │ ⋮       │  │
│  │ ☐ │ Spotify      │ 🎵 Music │ $9.99  │ Jan 18   │ ⋮       │  │
│  │ ☐ │ Dropbox      │ ☁️ Cloud │ $11.99 │ Jan 27   │ ⋮       │  │
│  └───┴──────────────┴──────────┴────────┴──────────┴─────────┘  │
│                                                                   │
│  [1] [2] [3] ... [10]  Showing 1-20 of 243                      │
└──────────────────────────────────────────────────────────────────┘
```

**Features**:
- Sortable columns
- Multi-select checkboxes
- Bulk actions (edit category, add tags, export, delete)
- Inline editing (future)
- Pagination or infinite scroll

---

## Subscription Detail View (Modal/Slide-out)

```
┌─────────────────────────────────────────────────────┐
│  Netflix                                    [✕ Close]│
│  ─────────────────────────────────────────────────  │
│  🎬 Entertainment                                    │
│                                                      │
│  Basic Information                                   │
│  • Price: $15.99/month                              │
│  • Next billing: January 15, 2024 (in 3 days)      │
│  • Started: March 1, 2022                           │
│  • Payment: Chase Visa (...4567)                    │
│  • Status: ✓ Active • Auto-renew ON                │
│                                                      │
│  Statistics                                          │
│  • Total spent: $647.58 (43 months)                │
│  • Average monthly: $15.06                          │
│  • Cost per day: $0.53                              │
│                                                      │
│  Price History                                       │
│  • Sep 2023: $11.99 → $15.99 (+33%)                │
│  • Mar 2022: Started at $11.99                      │
│                                                      │
│  Tags                                                │
│  [streaming] [family] [essential]  [+ Add tag]      │
│                                                      │
│  Notes                                               │
│  [Premium plan, shared with family]                 │
│  [+ Add note]                                        │
│                                                      │
│  Actions                                             │
│  [Edit Details] [Cancel Subscription] [Delete]      │
└─────────────────────────────────────────────────────┘
```

---

## Analytics Deep Dive Page

### Filters & Controls (Top)
```
[Date Range: Last 6 Months ▼]  [Category: All ▼]  [Export Report ▼]
```

### Content Sections (Scrollable)

1. **Spending Summary**
   - Total spent (period)
   - Average monthly
   - Highest month
   - Trend direction

2. **Detailed Spending Chart**
   - Stacked area/bar chart
   - Breakdown by category over time
   - Interactive legend (toggle categories)

3. **Category Deep Dive**
   - Table: Category | Count | Total | Avg per sub | % of total
   - Click category to see subscription list

4. **Payment Method Analysis**
   - Which cards/methods are used most
   - Spending per method
   - Suggestions for consolidation

5. **Renewal Calendar**
   - Calendar view showing all renewals
   - Total charges per day/week/month
   - Color intensity based on amount

6. **Historical Trends**
   - New subscriptions added over time
   - Cancellations over time
   - Net change in monthly spending

---

## Insights & Optimization Page

```
┌──────────────────────────────────────────────────────┐
│  💡 Optimization Insights                            │
│  ──────────────────────────────────────────────────  │
│                                                       │
│  Potential Savings: $87/month ($1,044/year)          │
│  ══════════════════════════════════════════════════  │
│                                                       │
│  ⚠️ REVIEW RECOMMENDED                               │
│  ┌────────────────────────────────────────────────┐  │
│  │ 🔴 High Priority                                │  │
│  │ • Hulu & Disney+ - Consider bundle (-$5/mo)    │  │
│  │ • Adobe CC - Not used in 60 days (-$55/mo)     │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ 🟡 Medium Priority                              │  │
│  │ • Dropbox - Duplicate with Google Drive        │  │
│  │ • Spotify Family - Switch to annual (-$24/yr)  │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  📈 PRICE INCREASES                                  │
│  ┌────────────────────────────────────────────────┐  │
│  │ • Netflix: +$4/mo in Sept 2023 (+33%)          │  │
│  │ • YouTube Premium: +$2/mo in Nov 2023 (+20%)   │  │
│  │ Total impact: +$72/year                         │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  🆓 TRIALS ENDING SOON                               │
│  ┌────────────────────────────────────────────────┐  │
│  │ • Grammarly Premium - Ends in 2 days           │  │
│  │   First charge: $12/mo                          │  │
│  │   [Keep] [Cancel]                               │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## Mobile Responsive Adaptations

### Mobile Dashboard
- Stack all sections vertically
- Stats: 2x2 grid instead of 1x4
- Charts: Full width, scrollable
- Subscription cards: Full width
- Bottom navigation bar (tab bar style)

### Mobile Navigation
```
┌─────────────────────────────────────────┐
│  [☰] Subscription Manager    [🔍] [🔔] │
└─────────────────────────────────────────┘

[Bottom Tab Bar]
┌─────┬─────┬─────┬─────┬─────┐
│ 📊  │ 📦  │  ➕ │ 📈  │ ⚙️  │
│Home │Subs │ Add │Stats│More │
└─────┴─────┴─────┴─────┴─────┘
```

---

## Color Scheme & Design Tokens

### Light Mode
- Background: #F5F7FA
- Cards: #FFFFFF
- Primary: #2196F3 (blue)
- Secondary: #FF9800 (orange)
- Success: #4CAF50 (green)
- Warning: #FFC107 (yellow)
- Danger: #F44336 (red)
- Text: #212121 (dark gray)
- Text Secondary: #757575 (medium gray)

### Dark Mode
- Background: #121212
- Cards: #1E1E1E
- Primary: #64B5F6 (light blue)
- (Similar adjustments for all colors)

### Typography
- Headings: Inter/Poppins (Bold, 24-32px)
- Body: Inter/Roboto (Regular, 14-16px)
- Numbers: Tabular figures for alignment

### Spacing
- Card padding: 24px
- Section gaps: 32px
- Element gaps: 16px
- Tight gaps: 8px

---

## Interactive Elements

### Buttons
- Primary: Filled, brand color
- Secondary: Outlined
- Text: No background
- Icon buttons: Circular or square
- States: Hover, active, disabled

### Forms
- Clean inputs with floating labels
- Inline validation
- Helper text below fields
- Error states in red

### Loading States
- Skeleton screens for initial load
- Spinners for actions
- Progress bars for imports

### Animations
- Smooth transitions (200-300ms)
- Page transitions: Fade in
- Card hover: Slight elevation increase
- Charts: Animate on load

---

## Accessibility Features

- High contrast mode toggle
- Keyboard shortcuts (documented in help)
- Focus indicators on all interactive elements
- ARIA labels on icons and buttons
- Semantic HTML structure
- Skip to content link
