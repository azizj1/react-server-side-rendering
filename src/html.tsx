import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { promises as fs } from 'fs';
import * as path from 'path';

interface HtmlProps {
  children: string;
  scripts: string[];
  stylesheets: string[];
}

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
    return assets;
  };
})();

const Html = ({ children, scripts, stylesheets }: HtmlProps) => (
  <html>
    <head>
      <meta charSet='utf-8' />
      <meta name='keywords' content='Aziz,BJJ' />
      <meta name='Author' content='Aziz Javed' />
      <meta name='viewport' content='width=device-width, maximum-scale=1, initial-scale=1, user-scalable=0' />
      <style>{`
          .preloader {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              z-index: 9999;
              background: #fff;
          }
          .loader {
              border: 2px solid #f3f3f3; /* Light grey */
              border-top: 2px solid #3498db; /* Blue */
              border-radius: 50%;
              width: 20px;
              height: 20px;
              animation: spin 1s linear infinite;
              position: absolute;
              top: 20%;
              left: 50%;
              transform: translate(-50%, -50%);
          }

          @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }
      `}</style>
      <script dangerouslySetInnerHTML={{__html: `
          (function() {
              var redirect = sessionStorage.redirect;
              delete sessionStorage.redirect;
              if (redirect && redirect != location.href) {
                  history.replaceState(null, null, redirect);
              }
          })();
      `}}></script>
      <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
      <link rel='dns-prefetch' href='//fonts.googleapis.com' />
      <link href='https://fonts.googleapis.com/css?family=Roboto:100,300,400,700' rel='stylesheet' />
      {stylesheets.map((href, i) => <link href={href} key={i} rel='stylesheet' />)}
    </head>
    <body data-scroll-animation='true' className='dark-theme'>
        <div className='preloader' id='preloader'>
            <div className='loader'></div>
        </div>
        <div id='root' dangerouslySetInnerHTML={{__html: children}}></div>
        {scripts.map((src, i) => <script type='text/javascript' src={src} key={i}></script>)}
    </body>
  </html>
);

export const makePage = async (app: JSX.Element) => {
  const { scripts, stylesheets } = await getAssets();
  // `renderToString` is called on app but not html because `renderToString`
  // creates internal DOM attributes on the node, allowing you to call
  // hydrate() on it to attach event listeners on existing markup.
  // We don't care about that for the HTML.
  const appString = ReactDOMServer.renderToString(app);
  const html = ReactDOMServer.renderToStaticMarkup(
    <Html {...{scripts, stylesheets}}>{appString}</Html>);
  return `<!doctype html>${html}`;
};
