"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fs_1 = require("fs");
var Jimp = require("jimp");
var parseCubeLUT_1 = require("./parseCubeLUT");
var applyLUT_1 = require("./applyLUT");
var getList = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var luts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                luts = [];
                fs_1.readdirSync('./src/luts/').forEach(function (file) {
                    if (file.includes('.cube')) {
                        var name = file.split('.cube')[0];
                        luts.push(name);
                    }
                });
                ctx.body = {
                    luts: luts
                };
                return [4 /*yield*/, next()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var apply = function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var files, lutFile, lut, myimg, _a, e_1;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                files = ctx.request.files || {};
                if (!((_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.request) === null || _b === void 0 ? void 0 : _b.body) === null || _c === void 0 ? void 0 : _c.lut) || !((_e = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.request) === null || _d === void 0 ? void 0 : _d.files) === null || _e === void 0 ? void 0 : _e.image)) {
                    ctx.body = {
                        message: 'missing fields.',
                        error: 1
                    };
                    ctx.res.writeHead(400);
                    return [2 /*return*/];
                }
                _r.label = 1;
            case 1:
                _r.trys.push([1, 4, , 5]);
                lutFile = fs_1.readFileSync("./src/luts/" + ((_g = (_f = ctx === null || ctx === void 0 ? void 0 : ctx.request) === null || _f === void 0 ? void 0 : _f.body) === null || _g === void 0 ? void 0 : _g.lut) + ".cube");
                lut = parseCubeLUT_1["default"](lutFile.toString());
                if (!['image/jpeg', 'image/png'].includes((_k = (_j = (_h = ctx === null || ctx === void 0 ? void 0 : ctx.request) === null || _h === void 0 ? void 0 : _h.files) === null || _j === void 0 ? void 0 : _j.image) === null || _k === void 0 ? void 0 : _k.type)) {
                    ctx.body = {
                        message: 'Image invalid.',
                        error: 1
                    };
                    ctx.res.writeHead(500);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Jimp.read((_o = (_m = (_l = ctx === null || ctx === void 0 ? void 0 : ctx.request) === null || _l === void 0 ? void 0 : _l.files) === null || _m === void 0 ? void 0 : _m.image) === null || _o === void 0 ? void 0 : _o.path)];
            case 2:
                myimg = _r.sent();
                myimg.resize(800, Jimp.AUTO);
                applyLUT_1["default"](myimg, lut, (_q = (_p = ctx === null || ctx === void 0 ? void 0 : ctx.request) === null || _p === void 0 ? void 0 : _p.body) === null || _q === void 0 ? void 0 : _q.percentage);
                _a = ctx;
                return [4 /*yield*/, myimg.getBufferAsync(Jimp.MIME_JPEG)];
            case 3:
                _a.body = _r.sent();
                ctx.res.writeHead(200, {
                    'Content-Type': 'image/jpg',
                    'Content-Disposition': 'inline; filename=img.jpg'
                }); //  attachment
                return [3 /*break*/, 5];
            case 4:
                e_1 = _r.sent();
                console.log(e_1);
                ctx.body = {
                    message: 'LUT not found.',
                    error: 1
                };
                ctx.res.writeHead(500);
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, next()];
            case 6:
                _r.sent();
                return [2 /*return*/];
        }
    });
}); };
exports["default"] = {
    getList: getList,
    apply: apply
};
