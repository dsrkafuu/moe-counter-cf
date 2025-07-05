import { Hono } from 'hono';
import { cache } from 'hono/cache';
import index from './routes/index';
import api from './routes/api';
import image from './routes/image';

const app = new Hono();

app.use(
  cache({
    cacheName: 'default',
    cacheControl: 'no-cache',
  })
);

index(app);
api(app);
image(app);

export default app;
