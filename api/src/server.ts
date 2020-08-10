import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as koaBody from 'koa-body';

import lut from './routes/lut';

const app = new Koa();
const router = new Router({
  prefix: '/v1',
});

router.get('/', async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.body = {
    message: 'LutAPI v1.0',
  };
  await next();
});
router.get('/lut', lut.getList);
router.post('/lut', lut.apply);

app.use(json());
app.use(logger());
app.use(koaBody({ multipart: true }));
app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening to ${PORT}`);
});
