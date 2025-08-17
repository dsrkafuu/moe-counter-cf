# Moe Counter CF

[English](https://github.com/dsrkafuu/moe-counter-cf#readme) | [中文](https://github.com/dsrkafuu/moe-counter-cf/blob/master/README.zh.md)

Fork of Moe Counter for fast global access powered by Cloudflare Workers.

[Original Project](https://github.com/journey-ad/Moe-counter) | [Cloudflare Workers](https://workers.cloudflare.com/) | [Cloudflare Workers KV](https://www.cloudflare.com/products/workers-kv/)

**⚠️ To keep the project simple, this repo will not provide as much themes as the original project by default and will not receive theme contributions. Please fork this repo to add your own themes for your usage.**

Upstream themes: [journey-ad/Moe-Counter](https://github.com/journey-ad/Moe-Counter/tree/master/assets/theme)

## Demo

[![Gelbooru](https://count.dsrkafuu.net/dsrkafuu:demo)](https://count.dsrkafuu.net/dsrkafuu:demo)

<details>
<summary>More Themes and Customizations</summary>

**A-SOUL (with `theme=asoul&length=10`)**

[![A-SOUL](https://count.dsrkafuu.net/dsrkafuu:demo?theme=asoul&length=10&add=0)](https://count.dsrkafuu.net/dsrkafuu:demo?theme=asoul&length=10)

**Moebooru (with `theme=moebooru&length=auto`)**

[![Moebooru](https://count.dsrkafuu.net/dsrkafuu:demo?theme=moebooru&length=auto&add=0)](https://count.dsrkafuu.net/dsrkafuu:demo?theme=moebooru&length=auto)

**Rule 34 (with `theme=rule34&render=auto`)**

[![Rule 34](https://count.dsrkafuu.net/dsrkafuu:demo?theme=rule34&render=auto&add=0)](https://count.dsrkafuu.net/dsrkafuu:demo?theme=rule34)

</details>

## Usage

**Public Counter**

```
https://count.dsrkafuu.net/{id}
https://count.dsrkafuu.net/{id}?theme={asoul,gelbooru,moebooru,rule34}&render={auto,pixelated}&length={1-10,auto}&add={0,1}
```

1. `{id}`: Any custom string between 1-256 chars (`a-zA-Z0-9:.@_-` allowed)
2. `{&theme}`: `gelbooru`, `moebooru`, `rule34` and other themes (default: `gelbooru`)
3. `{&length}`: Number between `1-10` (default: `7`) or string `auto`
4. `{&render}`: `auto` or `pixelated` (default: `pixelated`)
5. `{&darkmode}`: Dark mode support, `light`, `dark` or `auto` (default: `auto`)
6. (Uncommon) `{&add}`: Controls whether make the counter count or not (default: `1`)

You can custmize the default bahaviors by [self-hosting the counter](#self-hosting).

Make a pull request to add your id in `settings.json` to use the free public counter. Recommend to use `user:usage` like string as ID for better management and potential issue tracking.

**API Endpoints**

```
GET https://count.dsrkafuu.net/api/{id}
PUT https://count.dsrkafuu.net/api/{id}
DELETE https://count.dsrkafuu.net/api/{id}
```

PUT/DELETE is not enabled in public counter.

All endpoints need `Authorization: {secret}` in header configured in `settings.json`.

**HTML and Markdown**

```
<img src="https://count.dsrkafuu.net/{id}" alt="{id}" />
![{id}](https://count.dsrkafuu.net/{id})
[![{id}](https://count.dsrkafuu.net/{id})](https://count.dsrkafuu.net/{id})
```

## Self-hosting

1. Create a Cloudflare Workers worker
2. Create a Cloudflare Workers KV store
3. Create your own `wrangler.json` based on the `wrangler.example.json`
4. Modify `settings.json` in your preferred way
5. Build the worker and publish it using `npm run build && npx wrangler login && npx wrangler deploy`

## Credits

- [A-SOUL](https://space.bilibili.com/703007996)
- [Moebooru](https://github.com/moebooru/moebooru)
- [Rule 34 **(❗NSFW❗)**](https://rule34.xxx/)
- [Gelbooru **(❗NSFW❗)**](https://gelbooru.com/)

## License

This project and all contributors shall not be responsible for any dispute or loss caused by using this project.

This project is released under the `MIT` License, for more information read the [License](https://github.com/dsrkafuu/moe-counter-cf/blob/master/LICENSE).

**Copyright (c) 2020 journey-ad, 2022 DSRKafuU**
