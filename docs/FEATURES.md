# Feature Specifications

## 1. Subscription Tracking

### 1.1 Add Subscription
**Description**: Users can add new subscriptions with comprehensive details.

**Input Fields**:
- **Required**:
  - Subscription name (e.g., "Netflix", "Adobe Creative Cloud")
  - Price
  - Billing cycle (monthly, yearly, quarterly, weekly, custom)
  - Start date
  - Next billing date
- **Optional**:
  - Vendor/company name
  - Category
  - Payment method
  - Website URL
  - Description/notes
  - Tags (comma-separated)
  - Auto-renewal toggle
  - Trial information (trial end date)
  - Custom reminder days

**Features**:
- Real-time validation
- Auto-suggest vendor names from existing subscriptions
- Currency selection
- Smart date picker (defaults to today + 1 month for monthly)
- Duplicate detection warning

**API Endpoint**: `POST /api/v1/subscriptions`

### 1.2 Edit Subscription
**Description**: Modify existing subscription details.

**Features**:
- Pre-filled form with current data
- Track price changes automatically → saves to price_history
- Update next billing date
- Change status (active, cancelled, paused)
- Add/edit notes

**API Endpoint**: `PUT /api/v1/subscriptions/:id`

### 1.3 Delete Subscription
**Description**: Remove subscription (soft delete with option to restore).

**Features**:
- Confirmation dialog
- Option to mark as cancelled instead of deleting
- Preserve history for analytics

**API Endpoint**: `DELETE /api/v1/subscriptions/:id`

### 1.4 View Subscription Details
**Description**: Detailed view of a single subscription.

**Display**:
- All subscription information
- Price history timeline
- Payment history (if integrated)
- Notes and tags
- Calculated metrics:
  - Total spent to date
  - Average monthly cost
  - Days until renewal
  - Cost per day/week

**API Endpoint**: `GET /api/v1/subscriptions/:id`

### 1.5 Duplicate Detection
**Description**: Automatically detect potentially duplicate subscriptions.

**Algorithm**:
- Fuzzy string matching on subscription names (Levenshtein distance)
- Check for similar vendors
- Compare billing amounts (within 10% tolerance)
- Flag subscriptions with same payment method and similar amounts

**Triggers**:
- On add new subscription
- Manual scan via dashboard button

**Display**:
- Warning banner during add
- Dedicated "Potential Duplicates" section in dashboard
- Side-by-side comparison view

### 1.6 Free Trial Tracking
**Description**: Identify and manage free trial subscriptions.

**Features**:
- Dedicated "Free Trials" filter view
- Visual indicator on subscription cards
- Days remaining countdown
- Auto-notification before trial ends
- One-click cancellation option

---

## 2. Smart Notifications

### 2.1 Renewal Reminders
**Description**: Alert users before subscriptions renew.

**Configuration**:
- Default: 7 days and 24 hours before renewal
- Customizable per subscription or globally
- Choose delivery method: in-app, email, or both

**Notification Content**:
- Subscription name
- Renewal date
- Amount to be charged
- Payment method
- Quick actions: View details, Snooze, Cancel subscription

**Implementation**:
- Cron job runs daily at midnight (user's timezone)
- Generates notifications for upcoming renewals
- Marks as sent to avoid duplicates

### 2.2 Price Increase Alerts
**Description**: Notify when subscription prices change.

**Detection Methods**:
1. User manual update (captures old price)
2. Email parsing (future enhancement)
3. API integrations (future enhancement)

**Notification Content**:
- Old vs new price
- Percentage increase
- Effective date
- Total impact on monthly/yearly budget
- Recommendation: Keep or cancel

### 2.3 Trial Ending Notifications
**Description**: Alert before free trials convert to paid.

**Configuration**:
- Default: 3 days before trial ends
- Customizable per trial

**Notification Content**:
- Trial end date
- Upcoming charge amount
- Decision options: Continue, Cancel, Remind me later

### 2.4 Cancellation Reminders (Optional)
**Description**: Remind users about subscriptions they marked for review.

**Features**:
- User can flag subscription "to review"
- Set reminder date
- Notification on reminder date with usage stats

### 2.5 Notification Center
**Description**: Central hub for all notifications.

**Features**:
- Unread count badge
- Filter by type
- Mark as read/unread
- Dismiss or take action
- Archive old notifications

**API Endpoints**:
- `GET /api/v1/notifications` - List notifications
- `PUT /api/v1/notifications/:id/read` - Mark as read
- `DELETE /api/v1/notifications/:id` - Dismiss

---

## 3. Spending & Analytics Dashboard

### 3.1 Overview Cards (Top Row)
**Metrics**:
1. **Monthly Spending**: Total monthly recurring cost
2. **Yearly Spending**: Total annual recurring cost
3. **Active Subscriptions**: Count of active subscriptions
4. **Upcoming Renewals**: Count in next 30 days

### 3.2 Spending Trends Chart
**Description**: Line/area chart showing spending over time.

**Features**:
- Time range selector: 3 months, 6 months, 1 year, all time
- Toggle between monthly and yearly view
- Annotations for major changes (new/cancelled subscriptions)
- Projected future spending (dotted line)

### 3.3 Category Breakdown
**Visualization**: Pie chart or donut chart

**Features**:
- Spending by category
- Percentage of total
- Click to filter subscription list
- Color-coded by category

### 3.4 Payment Method Analysis
**Visualization**: Horizontal bar chart

**Features**:
- Spending by payment method
- Number of subscriptions per method
- Identify overused cards

### 3.5 Highest Cost Subscriptions
**Visualization**: Sorted table or bar chart

**Features**:
- Top 5-10 most expensive subscriptions
- Monthly cost normalized (annual divided by 12)
- Percentage of total spending
- Quick actions: Edit, Cancel

### 3.6 Subscription Timeline
**Visualization**: Calendar or Gantt-style view

**Features**:
- Visual representation of renewal dates
- Color-coded by category
- Hover for details
- Click to view subscription

### 3.7 Spending Calendar
**Visualization**: Month calendar with daily totals

**Features**:
- See which days have renewals
- Total charges per day
- Filter by month/year

---

## 4. Optimization Insights

### 4.1 Unused/Rarely Used Subscriptions
**Description**: Flag subscriptions that might not be worth keeping.

**Detection Criteria**:
- High cost relative to usage (requires user input or integrations)
- Similar to other active subscriptions
- User-flagged as "low priority"

**Display**:
- Warning icon on subscription card
- Dedicated "Review These" section
- Potential savings if cancelled

### 4.2 Price Increase History
**Description**: Track and display all price changes.

**Features**:
- Timeline of price changes
- Percentage increases over time
- Total additional cost since original price
- Alert threshold: Flag increases > 20%

### 4.3 Redundancy Detection
**Description**: Identify overlapping or duplicate services.

**Examples**:
- Multiple streaming services with similar content
- Two cloud storage providers
- Redundant productivity tools (Google Workspace + Microsoft 365)

**Implementation**:
- Rule-based detection by category
- AI suggestions (future: GPT-based analysis)
- User can confirm or dismiss

**Display**:
- "Potential Redundancies" widget
- Side-by-side comparison
- Cost savings projection

### 4.4 Savings Projections
**Description**: Show how much could be saved.

**Calculations**:
- Total potential savings from flagged subscriptions
- Monthly vs yearly savings
- Percentage reduction
- Visual projection: Current spending vs optimized spending

### 4.5 Recommendations Engine
**Description**: AI-powered suggestions for optimization.

**Recommendations**:
1. **Switch to Annual**: "Save $XX by switching to annual billing"
2. **Bundle Opportunities**: "Combine these into a bundle"
3. **Alternatives**: "Consider cheaper alternative"
4. **Usage Alerts**: "You're paying for X but only using Y"
5. **Trial Conversions**: "You have 3 trials converting soon - review now"

**Display**:
- Insights panel on dashboard
- Actionable buttons
- Dismiss or save for later

---

## 5. Data Import & Organization

### 5.1 Manual Entry
**Description**: Primary method for adding subscriptions.

**Features**:
- Clean, intuitive form
- Progressive disclosure (basic → advanced fields)
- Real-time validation
- Save as draft

### 5.2 CSV Import
**Description**: Bulk import subscriptions from CSV file.

**CSV Format**:
```csv
name,vendor,price,currency,billing_cycle,start_date,next_billing_date,category,payment_method,status,description,tags
Netflix,Netflix Inc.,15.99,USD,monthly,2023-01-15,2024-02-15,Entertainment,Chase Visa,active,Premium plan,"streaming,entertainment"
```

**Features**:
- Template CSV download
- Drag-and-drop upload
- Column mapping interface
- Validation report before import
- Error handling (skip invalid rows or halt)
- Import summary with success/failure counts

**API Endpoint**: `POST /api/v1/import/csv`

### 5.3 Tags & Organization
**Description**: Flexible tagging system for custom organization.

**Features**:
- Add multiple tags per subscription
- Auto-suggest existing tags
- Tag-based filtering and search
- Tag cloud visualization
- Bulk tag operations

### 5.4 Notes System
**Description**: Add contextual notes to subscriptions.

**Features**:
- Markdown support
- Timestamps
- Edit/delete notes
- Notes visible in detail view

### 5.5 Search & Filtering
**Description**: Find subscriptions quickly.

**Search**:
- Full-text search across name, vendor, description, tags
- Fuzzy matching
- Search-as-you-type

**Filters**:
- Status (active, cancelled, trial, paused)
- Category
- Payment method
- Price range
- Billing cycle
- Date ranges
- Tags

**Sorting**:
- Name (A-Z)
- Price (high to low)
- Next billing date (soonest first)
- Date added (newest first)

### 5.6 Export Options
**Description**: Export data for backup or analysis.

**Formats**:
- CSV
- JSON
- PDF report (formatted overview)

**API Endpoint**: `GET /api/v1/export?format=csv`

---

## Additional Features

### Bulk Actions
- Select multiple subscriptions
- Bulk edit (category, tags, status)
- Bulk delete/cancel
- Bulk export

### Dark Mode
- Toggle between light/dark themes
- Persists preference

### Mobile Responsive
- Fully responsive design
- Touch-friendly interactions
- Mobile-optimized views

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

### Data Privacy
- Export all data (GDPR compliance)
- Delete account and all data
- Data encryption at rest
- No third-party data sharing
