import Koa from 'koa';
import { readFileSync, readdirSync } from 'fs';
import * as Jimp from 'jimp';
import parseCubeLUT from './parseCubeLUT';
import applyLUT from './applyLUT';

const getList = async (ctx: Koa.Context, next: Koa.Next) => {
  const luts: Array<string> = [];
  readdirSync('./src/luts/').forEach((file) => {
    if (file.includes('.cube')) {
      const [name] = file.split('.cube');
      luts.push(name);
    }
  });
  ctx.body = {
    luts,
  };
  await next();
};

const apply = async (ctx: Koa.Context, next: Koa.Next) => {
  const files = ctx.request.files || {};
  if (!ctx?.request?.body?.lut || !ctx?.request?.files?.image) {
    ctx.body = {
      message: 'missing fields.',
      error: 1,
    };
    ctx.res.writeHead(400);
    return;
  }
  try {
    const lutFile = readFileSync(`./src/luts/${ctx?.request?.body?.lut}.cube`);
    const lut = parseCubeLUT(lutFile.toString());
    if (
      !['image/jpeg', 'image/png'].includes(ctx?.request?.files?.image?.type)
    ) {
      ctx.body = {
        message: 'Image invalid.',
        error: 1,
      };
      ctx.res.writeHead(500);
      return;
    }
    const myimg = await Jimp.read(ctx?.request?.files?.image?.path);
    myimg.resize(800, Jimp.AUTO);
    applyLUT(myimg, lut, ctx?.request?.body?.percentage);

    ctx.body = await myimg.getBufferAsync(Jimp.MIME_JPEG);
    ctx.res.writeHead(200, {
      'Content-Type': 'image/jpg',
      'Content-Disposition': 'inline; filename=img.jpg',
    }); //  attachment
  } catch (e) {
    console.log(e);
    ctx.body = {
      message: 'LUT not found.',
      error: 1,
    };
    ctx.res.writeHead(500);
  }
  await next();
};

export default {
  getList,
  apply,
};
