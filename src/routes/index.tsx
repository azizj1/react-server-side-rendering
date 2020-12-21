import * as React from 'react';
import { Router, Response } from 'express';
import {makePage} from '~/html';
import App from '~/client/components/App';

const routes = Router();
routes.use('/', async (_, res: Response, __) => {
  res.send(await makePage(<App />));
});

export default routes;
