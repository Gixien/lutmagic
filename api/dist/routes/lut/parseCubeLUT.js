"use strict";
exports.__esModule = true;
var parseCubeLUT = function (str) {
    var title = '';
    var type = '';
    var size = 0;
    var domain = [
        [0.0, 0.0, 0.0],
        [1.0, 1.0, 1.0],
    ];
    var data = [];
    var lines = str.split('\n');
    lines.map(function (l) {
        var line = l.trim();
        if (line[0] === '#' || line === '') {
            // Skip comments and empty lines
            return;
        }
        var parts = line.split(/\s+/);
        switch (parts[0]) {
            case 'TITLE':
                title = line.slice(7, -1);
                break;
            case 'DOMAIN_MIN':
                domain[0] = parts.slice(1).map(Number);
                break;
            case 'DOMAIN_MAX':
                domain[1] = parts.slice(1).map(Number);
                break;
            case 'LUT_1D_SIZE':
                type = '1D';
                size = Number(parts[1]);
                break;
            case 'LUT_3D_SIZE':
                type = '3D';
                size = Number(parts[1]);
                break;
            default:
                data.push(parts.map(Number));
        }
    });
    return {
        title: title,
        type: type,
        size: size,
        domain: domain,
        data: data
    };
};
exports["default"] = parseCubeLUT;
