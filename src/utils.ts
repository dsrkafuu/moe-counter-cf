import settings from '../settings.json';
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
