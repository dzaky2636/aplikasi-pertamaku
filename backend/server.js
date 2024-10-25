import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
app.use(express.json());
// batasi CORS hanya untuk domain tertentu
app.use(
	cors({
		origin: "http://20.211.80.67/", // domain diizinkan, ip vm saya
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

// Perbaikan SQL Injection dengan prepared statements
app.get("/api/user/:id", (req, res) => {
	const query = `SELECT * FROM users WHERE id = ?`;
	connection.all(query, [req.params.id], (error, results) => {
		if (error) throw error;
		res.json(results);
	});
});

// Perbaikan SQL Injection pada endpoint update email
app.post("/api/user/:id/change-email", (req, res) => {
	const newEmail = req.body.email;
	const query = `UPDATE users SET email = ? WHERE id = ?`;

	connection.run(query, [newEmail, req.params.id], function (err) {
		if (err) throw err;
		if (this.changes === 0) res.status(404).send("User not found");
		else res.status(200).send("Email updated successfully");
	});
});

// perbaikan path traversal dengan path.basename
app.get("/api/file", (req, res) => {
	const filePath = path.join(__dirname, "files", path.basename(req.query.name));
	res.sendFile(filePath, (err) => {
		if (err) res.status(404).send("File not found");
	});
});

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
	console.log("Server running on port 3000");
});
