
export default async (req) => {
  const conn = await mysql.createConnection({
    host: process.env.TIDB_HOST,
    port: 4000,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: 'test',
    ssl: { rejectUnauthorized: true }
  });
