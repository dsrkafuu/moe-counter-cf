import settings from '../settings.json';
import themes from '../themes';
import { HTTPException } from 'hono/http-exception';

export function minify(str: string) {
  return str
    .replace(/[\r\n]/g, ' ')
    .replace(/> +</g, '><')
    .replace(/ +/g, ' ')
    .trim();
}

export function validateID(id: string) {
  if (!/^[a-z0-9:.@_-]{1,256}$/i.test(id)) {
    throw new HTTPException(400, { message: 'Invalid Counter ID' });
  }
  if (!(settings.ids as Record<string, string>)[id]) {
    throw new HTTPException(400, { message: 'Unregistered Counter ID' });
  }
  return id;
}

export function validateTheme(theme?: string) {
  if (!theme) {
    theme = settings.defaults.theme;
  }
  if (!themes[theme as keyof typeof themes]) {
    throw new HTTPException(400, { message: 'Invalid Theme' });
  }
  return theme;
}

export function validateLength(length?: number | string) {
  if (!length) {
    length = settings.defaults.length;
  }
  if (length === 'auto') {
    return 'auto';
  } else if (!+length || +length <= 0 || +length > 10) {
    throw new HTTPException(400, { message: 'Invalid Length' });
  }
  return +length;
}

export function validateRender(render?: string) {
  if (!render) {
    render = settings.defaults.render;
  }
  if (render !== 'auto' && render !== 'pixelated') {
    throw new HTTPException(400, { message: 'Invalid Render' });
  }
  return render;
}

export function validateDarkmode(darkmode?: string) {
  if (!darkmode) {
    darkmode = settings.defaults.darkmode;
  }
  if (darkmode !== 'auto' && darkmode !== 'light' && darkmode !== 'dark') {
    throw new HTTPException(400, { message: 'Invalid Darkmode' });
  }
  return darkmode;
}
