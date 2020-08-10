"use strict";
exports.__esModule = true;
var ndarray = require("ndarray");
var linearInterpolation = require("ndarray-linear-interpolate");
var flatten = function (data) {
    return data.reduce(function (cumul, _a) {
        var r = _a[0], g = _a[1], b = _a[2];
        cumul.push(r, g, b);
        return cumul;
    }, []);
};
var applyLUT = function (img, lut, percentage) {
    if (percentage === void 0) { percentage = 1; }
    var shape = [];
    if (lut.type === '1D') {
        shape = [lut.size, 3];
    }
    else {
        // lut.type === '3D'
        shape = [lut.size, lut.size, lut.size, 3];
    }
    var flattenLut = flatten(lut.data);
    var lutThreeD = ndarray(flattenLut, shape);
    var dmin = lut.domain[0];
    var dmax = lut.domain[1];
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
        var ri = img.bitmap.data[idx + 0] / 255;
        var gi = img.bitmap.data[idx + 1] / 255;
        var bi = img.bitmap.data[idx + 2] / 255;
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
            var ro = linearInterpolation(lutThreeD, ri, 0) * 255;
            var go = linearInterpolation(lutThreeD, gi, 1) * 255;
            var bo = linearInterpolation(lutThreeD, bi, 2) * 255;
        }
        else {
            var ro = linearInterpolation(lutThreeD, bi, gi, ri, 0) * 255;
            var go = linearInterpolation(lutThreeD, bi, gi, ri, 1) * 255;
            var bo = linearInterpolation(lutThreeD, bi, gi, ri, 2) * 255;
        }
        img.bitmap.data[idx + 0] =
            ro * percentage + (1 - percentage) * img.bitmap.data[idx + 0];
        img.bitmap.data[idx + 1] =
            go * percentage + (1 - percentage) * img.bitmap.data[idx + 1];
        img.bitmap.data[idx + 2] =
            bo * percentage + (1 - percentage) * img.bitmap.data[idx + 2];
    });
};
exports["default"] = applyLUT;
