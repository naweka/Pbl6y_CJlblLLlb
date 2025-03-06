const getCorrectIndex = (number: number): number => {
  if (number > 255) {
    return 255;
  }
  if (number < 0) {
    return 0;
  }
  return number;
};

const lightenColor = (r: number, g: number, b: number, percent: number): { r: number; g: number; b: number } => {
  const factor = 1 + percent / 100;
  return {
    r: Math.round(r * factor),
    g: Math.round(g * factor),
    b: Math.round(b * factor),
  };
};

const saturateColor = (r: number, g: number, b: number, percent: number): { r: number; g: number; b: number } => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const value = Math.round((delta / max) * percent);

  return {
    r: r + value,
    g: g + value,
    b: b + value,
  };
};

const toHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const generateColor = (hash: string): { color: string; colorLighten: string } => {
  const [r, g, b] = hash
    .substr(0, 3)
    .split('')
    .map((char) => getCorrectIndex(char.charCodeAt(0)));

  const color = lightenColor(r, g, b, 10);
  const saturatedColor = saturateColor(color.r, color.g, color.b, 10);

  const colorLighten = lightenColor(r, g, b, 30);
  const saturatedColorLighten = saturateColor(colorLighten.r, colorLighten.g, colorLighten.b, 100);

  return {
    color: toHex(saturatedColor.r, saturatedColor.g, saturatedColor.b),
    colorLighten: toHex(saturatedColorLighten.r, saturatedColorLighten.g, saturatedColorLighten.b),
  };
};