# Database Setup

This project is currently a frontend-only shop, so the database is prepared as a starter backend schema.

Files:
- `database/schema.sql`: creates the core tables
- `database/seed.sql`: inserts the current product catalog

Tables included:
- `products`
- `customers`
- `orders`
- `order_items`
- `payments`

Suggested flow:
1. Create a SQLite database, for example `store.db`
2. Run `schema.sql`
3. Run `seed.sql`
4. Build an API layer later to connect the frontend cart and checkout form to these tables

SQLite example:

```sql
.read database/schema.sql
.read database/seed.sql
```

What this schema supports:
- product catalog storage
- customer checkout details
- order summary and total storage
- order line items with quantity
- COD and UPI/bank payment records

Next backend endpoints you will likely want:
- `GET /products`
- `POST /customers`
- `POST /orders`
- `POST /payments`
- `GET /orders/:id`
