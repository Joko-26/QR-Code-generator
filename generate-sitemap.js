import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const sitemap = new SitemapStream({ hostname: 'https://qrcode-creator.orosemo.de/' });

sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
// ...weitere Seiten

sitemap.end();

streamToPromise(sitemap).then(data =>
  createWriteStream('./public/sitemap.xml').end(data)
);
