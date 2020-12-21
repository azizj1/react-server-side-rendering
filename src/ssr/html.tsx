import * as React from 'react';

interface HtmlProps {
  children: JSX.Element;
  scripts: string[];
  stylesheets: string[];
}

export const Html = ({ children, scripts, stylesheets }: HtmlProps) => (
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
    <body>
      <h1>HELLO WORLD</h1>
      {children}
      {scripts.map((src, i) => <script type='text/javascript' src={src} key={i}></script>)}
    </body>
  </html>
);
