### Market data notifications

Connect to `/graphql` using WebSockets and the `graphql-transport-ws` protocol:

```graphql
subscription {
  marketDataUpdated {
    updatedAt
    fields
  }
}
```

After a successful scheduled market sync, `fields` identifies the affected query fields (`indices` and `topNews`); clients can re-query them. The event indicates a refresh, not necessarily a change in values. Country-filtered news queries may return cached data for up to five minutes after the event.

Subscriptions use an in-memory provider: events are not durable and are not shared across server instances. Reconnecting clients should re-query current data.