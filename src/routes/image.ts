import themes from '../../themes';
import { Hono, Context } from 'hono';
import { env } from 'hono/adapter';
import { KVNamespace } from '@cloudflare/workers-types';
import {
  validateDarkmode,
  validateID,
  validateLength,
  validateRender,
  validateTheme,
} from '../utils';

function genImage(
  count: number,
  theme: string,
  length: number | string,
  render: string,
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
  if (render !== 'auto') {
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
    const { theme, length, add, render, darkmode } = c.req.query();
    const _theme = validateTheme(theme);
    const _length = validateLength(length);
    const _render = validateRender(render);
    const _darkmode = validateDarkmode(darkmode);

    // get times from KV and set time asynchronously (no await)
    const count = Number.parseInt((await KV.get(id)) || '0') || 0;
    let image: string;
    if (add !== '0') {
      image = genImage(count + 1, _theme, _length, _render, _darkmode);
      // do not quit worker before setting time
      c.executionCtx.waitUntil(KV.put(id, (count + 1).toString()));
    } else {
      image = genImage(count, _theme, _length, _render, _darkmode);
    }

    return c.body(image, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  });
};
