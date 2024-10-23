import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: ["http://your-allowed-domain.com"], // Replace with your actual domain
		optionsSuccessStatus: 200,
	})
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

const connection = new sqlite3.Database("./db/aplikasi.db", (err) => {
	if (err) {
		console.error("Error opening database:", err);
	} else {
		console.log("Connected to SQLite database");
	}
});

// subdomain restrict
app.use((req, res, next) => {
	const allowedSubdomain = "dzaky";
	const hostParts = req.headers.host.split(".");
	const subdomain = hostParts[0];

	if (subdomain !== allowedSubdomain) {
		return res.status(403).send("Access denied");
	}
	next();
});

app.get("/api/user/:id", (req, res) => {
	const query = `SELECT * FROM users WHERE id = ?`;
	console.log(query);
	connection.all(query, [req.params.id], (error, results) => {
		if (error) throw error;
		res.json(results);
	});
});

app.post("/api/user/:id/change-email", (req, res) => {
	const newEmail = req.body.email;
	const query = `UPDATE users SET email = ? WHERE id = ?`;

	connection.run(query, [newEmail, req.params.id], function (err) {
		if (err) throw err;
		if (this.changes === 0) res.status(404).send("User not found");
		else res.status(200).send("Email updated successfully");
	});
});

app.get("/api/file", (req, res) => {
	const filePath = path.join(__dirname, "files", req.query.name);
	res.sendFile(filePath);
});

// Fallback route for SPA
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
