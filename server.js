const fs = require("fs");
const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const DB_DIR = path.join(__dirname, "database");

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "techstore",
    multipleStatements: true
};

let pool;

async function ensureDatabase() {
    const adminConnection = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        multipleStatements: true
    });

    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await adminConnection.end();

    pool = mysql.createPool(dbConfig);

    const schemaSql = fs.readFileSync(path.join(DB_DIR, "mysql-schema.sql"), "utf8");
    await pool.query(schemaSql);

    const [productRows] = await pool.query("SELECT COUNT(*) AS count FROM products");
    if (productRows[0].count === 0) {
        const seedSql = fs.readFileSync(path.join(DB_DIR, "mysql-seed.sql"), "utf8");
        await pool.query(seedSql);
    }
}

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/products", async (_req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT
                id,
                name AS nome,
                category AS categoria,
                price AS preco,
                original_price AS precoOriginal,
                discount_percent AS desconto,
                image_url AS imagem,
                description AS descricao
            FROM products
            WHERE is_active = 1
            ORDER BY id
        `);

        res.json(products);
    } catch (error) {
        console.error("Failed to load products:", error);
        res.status(500).json({ error: "Failed to load products." });
    }
});

app.post("/api/orders", async (req, res) => {
    const {
        customerName,
        mobileNumber,
        address,
        paymentMethod,
        bankName,
        upiId,
        accountHolder,
        accountLast4,
        items,
        subtotal,
        shipping,
        total
    } = req.body;

    if (!customerName || !mobileNumber || !address || !paymentMethod) {
        return res.status(400).json({ error: "Missing customer or payment details." });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Cart is empty." });
    }

    if (paymentMethod === "upi" && (!bankName || !upiId || !accountHolder || !accountLast4)) {
        return res.status(400).json({ error: "Missing bank or UPI details." });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [customerResult] = await connection.execute(`
            INSERT INTO customers (full_name, mobile_number, address)
            VALUES (?, ?, ?)
        `, [customerName, mobileNumber, address]);

        const customerId = customerResult.insertId;

        const [orderResult] = await connection.execute(`
            INSERT INTO orders (customer_id, payment_method, subtotal, shipping_amount, total_amount)
            VALUES (?, ?, ?, ?, ?)
        `, [customerId, paymentMethod, subtotal, shipping, total]);

        const orderId = orderResult.insertId;

        for (const item of items) {
            await connection.execute(`
                INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, line_total)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                orderId,
                item.id,
                item.nome,
                item.quantity,
                item.unitPrice,
                item.lineTotal
            ]);
        }

        await connection.execute(`
            INSERT INTO payments (
                order_id,
                payment_method,
                payment_status,
                bank_name,
                upi_id,
                account_holder,
                account_last4,
                paid_amount
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            orderId,
            paymentMethod,
            paymentMethod === "cod" ? "pending" : "paid",
            bankName || null,
            upiId || null,
            accountHolder || null,
            accountLast4 || null,
            total
        ]);

        await connection.commit();

        return res.status(201).json({
            message: "Order placed successfully.",
            orderId
        });
    } catch (error) {
        await connection.rollback();
        console.error("Order creation failed:", error);
        return res.status(500).json({ error: "Failed to place order." });
    } finally {
        connection.release();
    }
});

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`TechStore server running at http://localhost:${port}`);
        console.log(`Connected to MySQL database: ${dbConfig.database}`);
    });

    server.on("error", error => {
        if (error.code === "EADDRINUSE") {
            console.warn(`Port ${port} is in use. Trying port ${port + 1}...`);
            startServer(port + 1);
            return;
        }

        throw error;
    });
}

async function bootstrap() {
    try {
        await ensureDatabase();
        startServer(DEFAULT_PORT);
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

bootstrap();
