import * as React from 'react';
import { Router, Response } from 'express';
import makePage from '~/ssr/html';
import App from '~/client/App';
import {addStateContext} from '~/ssr/StateContext';

const routes = Router();
routes.use('/', async (_, res: Response, __) => {
  const prefetchedData = {
    data1: 'azizj1',
    data2: 4,
    data3: true,
  };
  res.send(await makePage(addStateContext(<App />, prefetchedData), prefetchedData));
});

export default routes;
