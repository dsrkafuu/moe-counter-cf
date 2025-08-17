import settings from '../../settings.json';
import themes from '../../themes';
import { Hono, Context } from 'hono';
import { env } from 'hono/adapter';
import { KVNamespace } from '@cloudflare/workers-types';
import { validateID } from '../utils';

function genImage(
  count: number,
  theme: string,
  length: number | string,
  pixelated: boolean,
  darkmode: string
) {
  let nums;
  if (length === 'auto') {
    nums = count.toString().split('');
  } else {
    nums = count.toString().padStart(+length, '0').split('');
  }

  const { width, height, images } = themes[theme as keyof typeof themes];
  let x = 0; // x axis
  const parts = nums.reduce((pre, cur) => {
    const uri = images[+cur];
    const image = `<image x="${x}" y="0" width="${width}" height="${height}" href="${uri}"/>`;
    x += width;
    return pre + image;
  }, '');

  let style = '';
  if (pixelated) {
    style += 'svg{image-rendering:pixelated;}';
  }
  if (darkmode === 'light') {
    style += 'svg{filter:none;}';
  } else if (darkmode === 'dark') {
    style += 'svg{filter:brightness(.8);}';
  } else {
    style += '@media(prefers-color-scheme:dark){svg{filter:brightness(.8);}}';
  }

  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    `<svg width="${x}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
    `<style>${style}</style>` +
    `<title>Moe Counter</title><g>${parts}</g></svg>`
  );
}

export default (app: Hono) => {
  app.get('/:id', async (c: Context) => {
    // id
    const id = validateID(c.req.param('id'));
    const { KV } = env<{ KV: KVNamespace }>(c);
    let { theme } = c.req.query();
    const { length, add, render, darkmode } = c.req.query();
    // theme
    if (!theme || !themes[theme as keyof typeof themes]) {
      theme = settings.defaults.theme;
    }
    // length
    let _length = length || settings.defaults.length;
    if (length === 'auto') {
      _length = 'auto';
    } else if (!+length || +length <= 0 || +length > 10) {
      _length = 7;
    }
    // render
    let pixelated = true;
    if (settings.defaults.render === 'auto' || render === 'auto') {
      pixelated = false;
    }
    // darkmode
    const _darkmode = darkmode || settings.defaults.darkmode;

    // get times from KV and set time asynchronously (no await)
    const count = Number.parseInt((await KV.get(id)) || '0') || 0;
    let image: string;
    if (add !== '0') {
      image = genImage(count + 1, theme, _length, pixelated, _darkmode);
      // do not quit worker before setting time
      c.executionCtx.waitUntil(KV.put(id, (count + 1).toString()));
    } else {
      image = genImage(count, theme, _length, pixelated, _darkmode);
    }

    return c.body(image, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  });
};
