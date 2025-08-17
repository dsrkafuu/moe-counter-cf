import pkg from '../../package.json';
import settings from '../../settings.json';
import { Hono } from 'hono';
import { cache } from 'hono/cache';
import { minify } from '../utils';
import index from './index.html?raw';

export default (app: Hono) => {
  if (settings.index) {
    app.get(
      '/',
      cache({
        cacheName: 'index',
        cacheControl:
          import.meta.env.MODE === 'development'
            ? 'no-cache'
            : 'public, max-age=3600',
      }),
      (c) => {
        const rendered = index.replace('${version}', pkg.version);
        return c.html(minify(rendered));
      }
    );
  }
};
