# Database Schema

## Entity Relationship Diagram

```
User (1) ─────< (N) Subscription
User (1) ─────< (N) PaymentMethod
User (1) ─────< (N) Notification
User (1) ─────< (N) Category (optional custom categories)
Subscription (N) ─────> (1) Category
Subscription (N) ─────> (1) PaymentMethod
Subscription (1) ─────< (N) PriceHistory
Subscription (1) ─────< (N) SubscriptionNote
```

## Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(7), -- hex color
  is_default BOOLEAN DEFAULT false, -- system vs custom
  created_at TIMESTAMP DEFAULT NOW()
);

-- Default categories: Entertainment, Productivity, Utilities,
-- Cloud Storage, Security, Gaming, Education, Health, News, Music

CREATE INDEX idx_categories_user ON categories(user_id);
```

### payment_methods
```sql
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- e.g., "Chase Visa", "PayPal"
  type VARCHAR(50) NOT NULL, -- credit_card, debit_card, paypal, bank_account
  last_four VARCHAR(4), -- last 4 digits if applicable
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
```

### subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,

  -- Basic info
  name VARCHAR(255) NOT NULL,
  vendor VARCHAR(255),
  description TEXT,
  website_url VARCHAR(500),

  -- Billing
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  billing_cycle VARCHAR(20) NOT NULL, -- monthly, yearly, quarterly, weekly, custom
  custom_cycle_days INTEGER, -- for custom cycles

  -- Dates
  start_date DATE NOT NULL,
  next_billing_date DATE NOT NULL,
  end_date DATE, -- for cancelled subscriptions
  trial_end_date DATE,

  -- Status
  status VARCHAR(20) DEFAULT 'active', -- active, cancelled, trial, paused
  is_free_trial BOOLEAN DEFAULT false,
  auto_renewal BOOLEAN DEFAULT true,

  -- Metadata
  tags TEXT[], -- array of tags
  reminder_days INTEGER[] DEFAULT ARRAY[7, 1], -- days before to remind
  last_price_check TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  cancelled_at TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing ON subscriptions(next_billing_date);
CREATE INDEX idx_subscriptions_category ON subscriptions(category_id);
```

### price_history
```sql
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  old_price DECIMAL(10, 2),
  new_price DECIMAL(10, 2) NOT NULL,
  change_percentage DECIMAL(5, 2),
  changed_at TIMESTAMP DEFAULT NOW(),
  detected_by VARCHAR(20) DEFAULT 'user', -- user, auto_detect, import
  notes TEXT
);

CREATE INDEX idx_price_history_subscription ON price_history(subscription_id);
CREATE INDEX idx_price_history_date ON price_history(changed_at DESC);
```

### subscription_notes
```sql
CREATE TABLE subscription_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_subscription ON subscription_notes(subscription_id);
```

### notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,

  type VARCHAR(50) NOT NULL, -- renewal_reminder, trial_ending, price_increase,
                             -- payment_failed, cancellation_reminder
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,

  status VARCHAR(20) DEFAULT 'pending', -- pending, sent, read, dismissed
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent

  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  read_at TIMESTAMP,

  delivery_method VARCHAR(20) DEFAULT 'in_app', -- in_app, email, both
  email_sent BOOLEAN DEFAULT false,

  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for);
```

### user_preferences
```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- Notification preferences
  enable_email_notifications BOOLEAN DEFAULT true,
  enable_push_notifications BOOLEAN DEFAULT true,
  renewal_reminder_days INTEGER[] DEFAULT ARRAY[7, 1],
  notify_price_increases BOOLEAN DEFAULT true,
  notify_trial_endings BOOLEAN DEFAULT true,

  -- Display preferences
  dashboard_view VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly
  default_currency VARCHAR(3) DEFAULT 'USD',
  date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',

  -- Analytics preferences
  show_optimization_insights BOOLEAN DEFAULT true,
  spending_alert_threshold DECIMAL(10, 2),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### analytics_cache (optional, for performance)
```sql
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cache_key VARCHAR(100) NOT NULL,
  cache_data JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_cache_user_key ON analytics_cache(user_id, cache_key);
CREATE INDEX idx_analytics_cache_expires ON analytics_cache(expires_at);
```

### import_logs
```sql
CREATE TABLE import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255),
  total_rows INTEGER,
  successful_rows INTEGER,
  failed_rows INTEGER,
  errors JSONB,
  status VARCHAR(20) DEFAULT 'processing', -- processing, completed, failed
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_import_logs_user ON import_logs(user_id);
```

## Sample Data Population

### Default Categories
```sql
INSERT INTO categories (name, icon, color, is_default) VALUES
  ('Entertainment', '🎬', '#E91E63', true),
  ('Productivity', '💼', '#2196F3', true),
  ('Utilities', '⚡', '#FF9800', true),
  ('Cloud Storage', '☁️', '#9C27B0', true),
  ('Security', '🔒', '#F44336', true),
  ('Gaming', '🎮', '#4CAF50', true),
  ('Education', '📚', '#00BCD4', true),
  ('Health & Fitness', '💪', '#8BC34A', true),
  ('News & Magazines', '📰', '#607D8B', true),
  ('Music & Audio', '🎵', '#FF5722', true),
  ('Other', '📦', '#9E9E9E', true);
```

## Queries & Indexes

### Common Queries

1. **Monthly spending**:
```sql
SELECT SUM(
  CASE billing_cycle
    WHEN 'monthly' THEN price
    WHEN 'yearly' THEN price / 12
    WHEN 'quarterly' THEN price / 3
    ELSE price / 30 * custom_cycle_days
  END
) as monthly_total
FROM subscriptions
WHERE user_id = ? AND status = 'active';
```

2. **Upcoming renewals**:
```sql
SELECT * FROM subscriptions
WHERE user_id = ?
  AND status = 'active'
  AND next_billing_date BETWEEN NOW() AND NOW() + INTERVAL '30 days'
ORDER BY next_billing_date ASC;
```

3. **Category breakdown**:
```sql
SELECT c.name, c.color, COUNT(s.id) as count, SUM(s.price) as total
FROM subscriptions s
JOIN categories c ON s.category_id = c.id
WHERE s.user_id = ? AND s.status = 'active'
GROUP BY c.id, c.name, c.color
ORDER BY total DESC;
```

## Data Retention & Cleanup

- Cancelled subscriptions: Keep indefinitely for analytics
- Notifications: Archive after 90 days
- Price history: Keep all records
- Import logs: Retain for 1 year
- Analytics cache: Auto-expire based on TTL
