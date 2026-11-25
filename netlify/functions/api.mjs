import mysql from 'mysql2/promise';
export default async (req) => {
  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: 'test',
    ssl: { rejectUnauthorized: true }
  });
const url = new URL(req.url);
  if (req.method === 'GET') {
    const [rows] = await conn.execute('SELECT * FROM notes ORDER BY id DESC');
    await conn.end();
    return Response.json(rows);
  }
  if (req.method === 'POST') {
    const { name } = await req.json();
    await conn.execute('INSERT INTO notes (name) VALUES (?)', [name]);
    await conn.end();
    return Response.json({ ok: true });
  }
  if (req.method === 'DELETE') {
    const id = url.searchParams.get('id');
    await conn.execute('DELETE FROM notes WHERE id = ?', [id]);
    await conn.end();
    return Response.json({ ok: true });
  }
  await conn.end();
  return new Response('OK');
};
