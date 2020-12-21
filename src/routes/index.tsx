import * as React from 'react';
import { Router, Response } from 'express';
import { Html } from '~/ssr/html';
import * as ReactDOMServer from 'react-dom/server';
import { promises as fs } from 'fs';
import * as path from 'path';

const getAssets = (() => {
  const assets = {
    scripts: [] as string[],
    stylesheets: [] as string[],
  };
  return async () => {
    if (assets.scripts.length > 0) {
      return assets;
    }
    const rawData = await fs.readFile(path.join(__dirname, 'client-assets.json'), 'utf8');
    const data = Object.values(JSON.parse(rawData as unknown as string)) as {js?: string; css?: string}[];
    data.forEach(({js, css}) => {
      if (js) {
        assets.scripts.push(js);
      }
      if (css) {
        assets.stylesheets.push(css);
      }
    });
    console.log('built!');
    console.log(assets);
    return assets;
  };
})();

const routes = Router();
routes.use('/', async (_, res: Response, __) => {
  const { scripts, stylesheets } = await getAssets();
  const test = <div>Noor and Amal run the world</div>;
  const html = ReactDOMServer.renderToStaticMarkup(
    <Html {...{scripts, stylesheets}}>{test}</Html>
  );
  res.send(`<!doctype html>${html}`);
});

export default routes;
