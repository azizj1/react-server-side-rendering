import * as React from 'react';
import { Router, Response, Request } from 'express';
import makePage from '~/ssr/html';
import App from '~/client/App';
import {addStateContext} from '~/ssr/StateContext';

const routes = Router();
routes.use('/', async (req: Request, res: Response, __) => {
  const summary = {
    data1: 'azizj1',
    data2: 4,
    data3: true,
  };
  console.log('baseurl', req.baseUrl);
  console.log('url', req.url);
  res.send(await makePage(addStateContext(<App />, summary), summary));
});

export default routes;
