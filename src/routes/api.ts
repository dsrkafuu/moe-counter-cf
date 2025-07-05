import settings from '../../settings.json';
import { Hono, Context } from 'hono';
import { KVNamespace } from '@cloudflare/workers-types';
import { env } from 'hono/adapter';
import { validateID } from '../utils';
import { HTTPException } from 'hono/http-exception';

export default (app: Hono) => {
  const secret = settings.api.secret;

  const check = (c: Context) => {
    const auth = c.req.header('Authorization');
    if (secret && secret !== auth) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
  };

  if (settings.api.get) {
    app.get('/api/:id', async (c) => {
      check(c);
      const id = validateID(c.req.param('id'));
      const { KV } = env<{ KV: KVNamespace }>(c);
      const count = Number.parseInt((await KV.get(id)) || '0') || 0;
      return c.json({ count });
    });
  }

  if (settings.api.put) {
    app.put('/api/:id', async (c) => {
      check(c);
      const id = validateID(c.req.param('id'));
      const { KV } = env<{ KV: KVNamespace }>(c);
      const body = await c.req.json();
      const count = +body.count || 0;
      if (!count || count <= 0) {
        throw new HTTPException(400, { message: 'Invalid Request Count' });
      }
      await KV.put(id, `${count}`);
      return c.json({ count: count });
    });
  }

  if (settings.api.delete) {
    app.delete('/api/:id', async (c) => {
      check(c);
      const id = validateID(c.req.param('id'));
      const { KV } = env<{ KV: KVNamespace }>(c);
      await KV.delete(id);
      return c.body(null, { status: 204 });
    });
  }
};
