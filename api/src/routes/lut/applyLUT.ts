import * as ndarray from 'ndarray';
import * as linearInterpolation from 'ndarray-linear-interpolate';
import { ILut } from './parseLUT';

const flatten = (data: Array<Array<number> | number>) =>
  data.reduce((cumul: number[], [r, g, b]: number[]) => {
    cumul.push(r, g, b);
    return cumul;
  }, []);

const applyLUT = (img: any, lut: ILut, percentage = 1) => {
  let shape = [];
  if (lut.type === '1D') {
    shape = [lut.size, 3];
  } else {
    // lut.type === '3D'
    shape = [lut.size, lut.size, lut.size, 3];
  }

  const flattenLut = flatten(lut.data);
  const lutThreeD = ndarray(flattenLut, shape);
  const dmin = lut.domain[0];
  const dmax = lut.domain[1];

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, idx) => {
    let ri = img.bitmap.data[idx + 0] / 255;
    let gi = img.bitmap.data[idx + 1] / 255;
    let bi = img.bitmap.data[idx + 2] / 255;

    // map to domain
    ri = (ri - dmin[0]) / (dmax[0] - dmin[0]);
    gi = (gi - dmin[1]) / (dmax[1] - dmin[1]);
    bi = (bi - dmin[2]) / (dmax[2] - dmin[2]);

    // map to grid units
    ri *= lut.size - 1;
    gi *= lut.size - 1;
    bi *= lut.size - 1;

    // clamp to grid bounds
    ri = ri < 0 ? 0 : ri > lut.size - 1 ? lut.size - 1 : ri;
    gi = gi < 0 ? 0 : gi > lut.size - 1 ? lut.size - 1 : gi;
    bi = bi < 0 ? 0 : bi > lut.size - 1 ? lut.size - 1 : bi;

    if (lut.type === '1D') {
      const ro = linearInterpolation(lutThreeD, ri, 0) * 255;
      const go = linearInterpolation(lutThreeD, gi, 1) * 255;
      const bo = linearInterpolation(lutThreeD, bi, 2) * 255;
    } else {
      const ro = linearInterpolation(lutThreeD, bi, gi, ri, 0) * 255;
      const go = linearInterpolation(lutThreeD, bi, gi, ri, 1) * 255;
      const bo = linearInterpolation(lutThreeD, bi, gi, ri, 2) * 255;
    }

    img.bitmap.data[idx + 0] =
      ro * percentage + (1 - percentage) * img.bitmap.data[idx + 0];
    img.bitmap.data[idx + 1] =
      go * percentage + (1 - percentage) * img.bitmap.data[idx + 1];
    img.bitmap.data[idx + 2] =
      bo * percentage + (1 - percentage) * img.bitmap.data[idx + 2];
  });
};

export default applyLUT;
