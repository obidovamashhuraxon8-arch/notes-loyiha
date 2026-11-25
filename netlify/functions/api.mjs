
import mysql from "mysql2/promise";

export default async (req) => {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
  });

  try {
    if (req.method === "POST") {
      const { name } = await req.json();
      const clean = String(name ?? "").trim().slice(0, 100);
      if (clean) {
        await db.execute("INSERT INTO notes (name) VALUES (?)", [clean]);
      }
    }
    const [rows] = await db.execute(
      "SELECT name, created_at FROM notes ORDER BY id DESC LIMIT 50"
    );
    return Response.json(rows);
  } catch (err) {
    return Response.json({ error: "Server xatosi" }, { status: 500 });
  } finally {
    await db.end();
  }
};

<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>MySQL demo</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 480px; margin: 40px auto; padding: 0 16px; }
    input { padding: 8px; width: 60%; }
    button { padding: 8px 14px; }
    li { margin: 6px 0; }
    small { color: #666; }
  </style>
</head>
<body>
  <h1>Ismingizni qoldiring</h1>
  <input id="name" placeholder="Ism" maxlength="100">
  <button onclick="add()">Saqlash</button>
  <ul id="list"></ul>

<script>
const API = "/.netlify/functions/api";

async function load() {
  const rows = await (await fetch(API)).json();
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  rows.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.name + " ";
    const s = document.createElement("small");
    s.textContent = "(" + new Date(r.created_at).toLocaleString() + ")";
    li.appendChild(s);
    ul.appendChild(li);
  });
}

async function add() {
  const input = document.getElementById("name");
  const name = input.value.trim();
  if (!name) return;
  await fetch(API, { method: "POST", body: JSON.stringify({ name }) });
  input.value = "";
  load();
}

load();
</script>
</body>
</html>

[build]
  publish = "."
  functions = "netlify/functions"

{
  "name": "mysql-demo",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "mysql2": "^3.11.0"
  }
}
