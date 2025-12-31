import { configureStore } from '@reduxjs/toolkit';

// Reducers will be added here
export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // subscriptions: subscriptionsReducer,
    // analytics: analyticsReducer,
    // notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
