const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ayurveda_db"
});

db.connect(err => {
    if (err) console.error("Database connection failed:", err);
    else console.log("✅ Connected to MySQL Database");
});

// WebSocket Server for Experts
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", ws => {
    console.log("🔗 Expert connected via WebSocket");
    ws.send("✅ Connected to WebSocket Server");
});

// Booking API
app.post("/book", (req, res) => {
    const { userName, email, expertName, date, time } = req.body;

    const sql = "INSERT INTO bookings (user_name, email, expert_name, booking_date, booking_time) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [userName, email, expertName, date, time], (err, result) => {
        if (err) {
            res.status(500).json({ message: "Database error" });
        } else {
            res.json({ message: "✅ Booking successful!" });

            // Notify all experts
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`🔔 New Booking: ${userName} booked ${expertName} on ${date} at ${time}`);
                }
            });
        }
    });
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
