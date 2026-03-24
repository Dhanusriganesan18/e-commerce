# Database Setup

This project now supports a MySQL backend.

Files:
- `database/mysql-schema.sql`: creates the MySQL tables
- `database/mysql-seed.sql`: inserts the current product catalog
- `database/schema.sql`: older SQLite schema
- `database/seed.sql`: older SQLite seed

MySQL tables included:
- `products`
- `customers`
- `orders`
- `order_items`
- `payments`

How to connect MySQL:
1. Create a MySQL server or use an existing one.
2. Copy `.env.example` to `.env`.
3. Fill in your MySQL credentials in `.env`.
4. Run `npm install`.
5. Run `npm start`.

Example `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=techstore
```

What happens on startup:
- the app creates the database if it does not exist
- it runs `mysql-schema.sql`
- it seeds products from `mysql-seed.sql` if the `products` table is empty

What this schema supports:
- product catalog storage
- customer checkout details
- order summary and total storage
- order line items with quantity
- COD and UPI/bank payment records
