export interface ILut {
  title: string;
  type: string;
  size: number;
  domain: Array<Array<number>>;
  data: Array<Array<number> | number>;
}

const parseCubeLUT = (str: string): ILut => {
  let title = '';
  let type = '';
  let size = 0;
  const domain = [
    [0.0, 0.0, 0.0],
    [1.0, 1.0, 1.0],
  ];
  const data: Array<Array<number> | number> = [];

  const lines = str.split('\n');

  lines.map((l) => {
    const line = l.trim();

    if (line[0] === '#' || line === '') {
      // Skip comments and empty lines
      return;
    }

    const parts = line.split(/\s+/);

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
    title,
    type,
    size,
    domain,
    data,
  };
};
export default parseCubeLUT;
