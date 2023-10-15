import { Hono } from 'hono';
import { Database } from 'bun:sqlite';
const db = new Database('mydb.sqlite');
db.run(
  'CREATE TABLE IF NOT EXISTS tenants (id INTEGER PRIMARY KEY AUTOINCREMENT,tenantName TEXT,phoneNumber INTEGER)'
);

const hono = new Hono();

const port = process.env.PORT || 3000;

const home = hono.get('/', (c) => {
  return c.json({ message: 'Hello World !!!' });
});

hono.get('/tenants', (c) => {
  const stmt = db.query('select * from tenants ');
  return c.json({ tenants: stmt.all() });
});

hono.post('/tenants', async (c) => {
  const body = await c.req.json();
  const tenantName = body['tenantName'];
  const phoneNumber = body['phoneNumber'];
  const params = [tenantName, phoneNumber];
  const insertTenant =
    'InSERT into tenants (tenantName,phoneNumber) VALUES (?,?)';
  db.run(insertTenant, params);
  return c.json({ tenantName: tenantName, phoneNumber: phoneNumber });
});

console.log('Inserted $tenant.$name');
console.log('Running at http://localhost:' + port);

export default {
  port,
  fetch: home.fetch,
};
