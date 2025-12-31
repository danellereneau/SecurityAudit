# Analytics Metrics & Calculations

## Core Metrics

### 1. Monthly Recurring Revenue (MRR) Equivalent
**Description**: Total monthly subscription cost

**Calculation**:
```javascript
function calculateMonthlyTotal(subscriptions) {
  return subscriptions
    .filter(sub => sub.status === 'active')
    .reduce((total, sub) => {
      switch(sub.billing_cycle) {
        case 'monthly':
          return total + sub.price;
        case 'yearly':
          return total + (sub.price / 12);
        case 'quarterly':
          return total + (sub.price / 3);
        case 'weekly':
          return total + (sub.price * 4.33); // avg weeks per month
        case 'custom':
          return total + (sub.price / sub.custom_cycle_days * 30);
        default:
          return total;
      }
    }, 0);
}
```

**Display**: `$XXX.XX/mo`

**Trend Indicator**: Compare to previous month
- Green: Decreased or same
- Red: Increased
- Show percentage change

---

### 2. Annual Recurring Revenue (ARR) Equivalent
**Description**: Total yearly subscription cost

**Calculation**:
```javascript
function calculateYearlyTotal(monthlyTotal) {
  return monthlyTotal * 12;
}
```

**Display**: `$X,XXX.XX/yr`

---

### 3. Active Subscriptions Count
**Description**: Number of currently active subscriptions

**Calculation**:
```sql
SELECT COUNT(*) FROM subscriptions
WHERE user_id = ? AND status = 'active';
```

**Segmentation**:
- By status: Active, Trial, Paused, Cancelled
- By category
- By price tier: <$10, $10-$50, $50-$100, >$100

---

### 4. Average Subscription Cost
**Description**: Mean cost per subscription

**Calculation**:
```javascript
const avgCost = monthlyTotal / activeCount;
```

**Display**: `$XX.XX per subscription`

**Insights**:
- Compare to median (detect outliers)
- Show distribution histogram

---

### 5. Total Spent to Date
**Description**: Historical total spent on all subscriptions

**Calculation**:
```javascript
function calculateTotalSpent(subscription) {
  const startDate = new Date(subscription.start_date);
  const endDate = subscription.end_date
    ? new Date(subscription.end_date)
    : new Date();

  const monthsActive = differenceInMonths(endDate, startDate);

  // Account for price changes
  let total = 0;
  subscription.price_history.forEach((change, idx) => {
    const nextChange = subscription.price_history[idx + 1];
    const monthsAtPrice = nextChange
      ? differenceInMonths(nextChange.changed_at, change.changed_at)
      : differenceInMonths(endDate, change.changed_at);

    const monthlyPrice = normalizeToMonthly(change.new_price, subscription.billing_cycle);
    total += monthlyPrice * monthsAtPrice;
  });

  return total;
}
```

---

## Trend Metrics

### 6. Spending Trend Over Time
**Description**: Month-by-month spending history

**Data Structure**:
```javascript
[
  { month: '2023-08', total: 234.50, subscriptions: 15 },
  { month: '2023-09', total: 245.00, subscriptions: 16 },
  { month: '2023-10', total: 239.00, subscriptions: 15 },
  // ...
]
```

**Calculations**:
- Month-over-month change
- 3-month moving average
- Peak and valley months
- Growth rate percentage

**Visualizations**:
- Line chart (primary)
- Area chart with gradient
- Bar chart for discrete comparisons

---

### 7. Subscription Churn Rate
**Description**: Rate of subscription cancellations

**Calculation**:
```javascript
const churnRate = (cancelledThisMonth / totalAtStartOfMonth) * 100;
```

**Display**: `X% monthly churn`

**Insights**:
- Reasons for cancellation (if tracked)
- Seasonal patterns
- Category-specific churn

---

### 8. Net Subscription Change
**Description**: New subscriptions added vs. cancelled

**Calculation**:
```javascript
const netChange = newSubscriptions - cancelledSubscriptions;
```

**Display**:
- `+5 subscriptions this month` (positive)
- `-2 subscriptions this month` (negative)

---

## Category Analytics

### 9. Spending by Category
**Description**: Breakdown of spending across categories

**Calculation**:
```sql
SELECT
  c.name,
  c.color,
  COUNT(s.id) as subscription_count,
  SUM(
    CASE s.billing_cycle
      WHEN 'monthly' THEN s.price
      WHEN 'yearly' THEN s.price / 12
      WHEN 'quarterly' THEN s.price / 3
      ELSE s.price / 30 * s.custom_cycle_days
    END
  ) as monthly_total,
  ROUND(
    SUM(...) / (SELECT SUM(...) FROM subscriptions WHERE user_id = ?) * 100,
    1
  ) as percentage
FROM subscriptions s
JOIN categories c ON s.category_id = c.id
WHERE s.user_id = ? AND s.status = 'active'
GROUP BY c.id, c.name, c.color
ORDER BY monthly_total DESC;
```

**Display**:
- Pie/donut chart
- Horizontal bar chart
- Data table

**Insights**:
- Top spending category
- Most subscriptions in category
- Underutilized categories

---

### 10. Category Trend Over Time
**Description**: How category spending changes

**Use Cases**:
- "Entertainment spending increased 25% this year"
- "Productivity tools decreased after consolidation"

---

## Payment Analytics

### 11. Spending by Payment Method
**Description**: Which cards/methods are used most

**Calculation**:
```sql
SELECT
  pm.name,
  pm.type,
  COUNT(s.id) as subscription_count,
  SUM([monthly normalization]) as monthly_total
FROM subscriptions s
JOIN payment_methods pm ON s.payment_method_id = pm.id
WHERE s.user_id = ? AND s.status = 'active'
GROUP BY pm.id
ORDER BY monthly_total DESC;
```

**Insights**:
- Overused payment methods
- Distribute subscriptions across cards
- Expired or inactive methods

---

## Optimization Metrics

### 12. Unused Subscription Score
**Description**: Likelihood a subscription is unused

**Calculation** (example algorithm):
```javascript
function calculateUnusedScore(subscription) {
  let score = 0;

  // High cost relative to others
  if (subscription.monthly_price > avgMonthlyPrice * 1.5) {
    score += 30;
  }

  // User flagged as low priority
  if (subscription.tags.includes('low-priority')) {
    score += 25;
  }

  // No notes or tags (suggests not engaged)
  if (!subscription.notes && subscription.tags.length === 0) {
    score += 15;
  }

  // In redundant category
  if (categoryCount[subscription.category] > 3) {
    score += 20;
  }

  // Old subscription (might be forgotten)
  const monthsOld = differenceInMonths(new Date(), subscription.start_date);
  if (monthsOld > 24) {
    score += 10;
  }

  return Math.min(score, 100);
}
```

**Display**:
- `High likelihood unused` (score > 70)
- `Possibly unused` (score 40-70)
- `Likely in use` (score < 40)

---

### 13. Price Increase Impact
**Description**: Total additional cost from price increases

**Calculation**:
```javascript
function calculatePriceIncreaseImpact(priceHistory) {
  const increases = priceHistory.filter(h => h.new_price > h.old_price);

  return increases.reduce((total, increase) => {
    const monthlyIncrease = normalizeToMonthly(
      increase.new_price - increase.old_price,
      increase.subscription.billing_cycle
    );
    const monthsSinceIncrease = differenceInMonths(
      new Date(),
      increase.changed_at
    );
    return total + (monthlyIncrease * monthsSinceIncrease);
  }, 0);
}
```

**Display**: `$XXX extra paid due to price increases`

---

### 14. Potential Savings
**Description**: Amount that could be saved by cancelling flagged subscriptions

**Calculation**:
```javascript
const potentialSavings = {
  monthly: flaggedSubscriptions.reduce((sum, sub) =>
    sum + normalizeToMonthly(sub.price, sub.billing_cycle), 0
  ),
  yearly: this.monthly * 12
};
```

**Display**:
- `Save $XX/month`
- `($XXX/year)` if cancelled

---

### 15. Trial Conversion Cost
**Description**: Total cost when trials convert to paid

**Calculation**:
```javascript
const trialSubs = subscriptions.filter(s =>
  s.is_free_trial &&
  s.trial_end_date <= addDays(new Date(), 30)
);

const conversionCost = trialSubs.reduce((sum, sub) =>
  sum + normalizeToMonthly(sub.price, sub.billing_cycle), 0
);
```

**Display**: `$XX/mo increase when trials convert`

---

## Advanced Analytics

### 16. Billing Calendar Heatmap
**Description**: Visual representation of billing dates

**Data Structure**:
```javascript
{
  '2024-01-15': { subscriptions: ['Netflix', 'Spotify'], total: 25.98 },
  '2024-01-22': { subscriptions: ['Adobe CC'], total: 54.99 },
  // ...
}
```

**Visualization**: Calendar heatmap
- Color intensity = amount
- Hover shows details

---

### 17. Spending Forecast
**Description**: Predict future spending based on trends

**Calculation**:
```javascript
function forecastSpending(historicalData, months = 6) {
  // Simple linear regression
  const trend = calculateTrend(historicalData);
  const seasonal = calculateSeasonality(historicalData);

  const forecast = [];
  for (let i = 1; i <= months; i++) {
    const predicted = trend.slope * i + trend.intercept + seasonal[i % 12];
    forecast.push({
      month: addMonths(new Date(), i),
      predicted: Math.max(0, predicted),
      confidence: calculateConfidenceInterval(historicalData, i)
    });
  }

  return forecast;
}
```

**Display**: Dotted line on spending chart

---

### 18. Subscription Lifecycle Analysis
**Description**: Average lifespan of subscriptions

**Metrics**:
- Average months active before cancellation
- Survival rate by category
- Churn by price tier

**Calculation**:
```sql
SELECT
  category_id,
  AVG(EXTRACT(MONTH FROM AGE(cancelled_at, start_date))) as avg_lifetime_months,
  COUNT(*) as total_cancelled
FROM subscriptions
WHERE status = 'cancelled' AND user_id = ?
GROUP BY category_id;
```

---

### 19. Cost Per Day/Week/Month
**Description**: Normalize subscription costs to different time units

**Calculation**:
```javascript
function calculateCostBreakdown(subscription) {
  const monthly = normalizeToMonthly(subscription.price, subscription.billing_cycle);

  return {
    perDay: monthly / 30,
    perWeek: monthly / 4.33,
    perMonth: monthly,
    perYear: monthly * 12
  };
}
```

**Use Case**: "Netflix costs you $0.53 per day"

---

### 20. Subscription Density
**Description**: How concentrated are your subscriptions in certain categories

**Calculation**:
```javascript
const herfindahlIndex = categories.reduce((sum, cat) => {
  const marketShare = cat.count / totalSubscriptions;
  return sum + Math.pow(marketShare, 2);
}, 0);

// 0 = perfectly distributed, 1 = all in one category
```

**Insights**:
- Diversification score
- Over-reliance on one category

---

## Dashboard-Specific Metrics

### 21. Upcoming Renewals (Next 30 Days)
**Query**:
```sql
SELECT * FROM subscriptions
WHERE user_id = ?
  AND status = 'active'
  AND next_billing_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
ORDER BY next_billing_date ASC
LIMIT 10;
```

---

### 22. Top 5 Most Expensive Subscriptions
**Query**:
```sql
SELECT
  *,
  CASE billing_cycle
    WHEN 'monthly' THEN price
    WHEN 'yearly' THEN price / 12
    WHEN 'quarterly' THEN price / 3
    ELSE price / 30 * custom_cycle_days
  END as monthly_equivalent
FROM subscriptions
WHERE user_id = ? AND status = 'active'
ORDER BY monthly_equivalent DESC
LIMIT 5;
```

---

### 23. Notification Summary
**Counts**:
- Unread notifications
- Pending renewals (within 7 days)
- Price increase alerts
- Trial endings

---

## Comparison Metrics

### 24. Year-over-Year Comparison
**Calculation**:
```javascript
const thisYearTotal = calculateSpending(thisYear);
const lastYearTotal = calculateSpending(lastYear);
const yoyChange = ((thisYearTotal - lastYearTotal) / lastYearTotal) * 100;
```

**Display**: `+15% vs last year` or `-8% vs last year`

---

### 25. Benchmark Comparisons (Future)
**Description**: Compare to average user or industry benchmarks

**Examples**:
- "You spend 20% less than average users"
- "Your entertainment spending is 30% above average"

**Note**: Requires aggregated anonymous data

---

## Export Metrics

### PDF Report Contents
1. Executive Summary
   - Total spending (monthly/yearly)
   - Active subscription count
   - Top categories
   - Optimization opportunities

2. Detailed Breakdown
   - All subscriptions table
   - Category charts
   - Spending trends
   - Price increase history

3. Recommendations
   - Flagged subscriptions
   - Savings potential
   - Action items

---

## Performance Considerations

### Caching Strategy
- Cache dashboard metrics for 5 minutes
- Invalidate on subscription changes
- Pre-calculate monthly totals

### Database Optimization
- Materialized views for complex aggregations
- Indexes on frequently queried fields
- Periodic analytics table updates

### Real-time vs Batch
- Real-time: Current totals, active count
- Batch (daily): Trends, forecasts, insights
- On-demand: Detailed reports, exports
