export const computeTextColor = (backgroundColor: string): string => {
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? `rgba(${r * 0.3},${g * 0.3},${b * 0.4}, 1)` : `rgba(${r + (255 - r) * 0.7},${g + (255 - g) * 0.7},${b + (255 - b) * 0.6}, 1)`;
};

export const adjustColorBrightness = (hex: string, factor: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const adjustedR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const adjustedG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const adjustedB = Math.min(255, Math.max(0, Math.round(b * factor)));

  return `#${adjustedR.toString(16).padStart(2, '0')}${adjustedG.toString(16).padStart(2, '0')}${adjustedB.toString(16).padStart(2, '0')}`;
};

export const generateColorTones = (hex: string): string[] => {
  const hsl = hexToHSL(hex);
  return [
    hslToHex(hsl.h, Math.max(hsl.s - 15, 0), Math.min(hsl.l + 40, 95)),  // 50
    hslToHex(hsl.h, Math.max(hsl.s - 10, 0), Math.min(hsl.l + 30, 90)),  // 100
    hslToHex(hsl.h, Math.max(hsl.s - 5, 0), Math.min(hsl.l + 20, 85)),   // 200
    hex,                                                                 // 300 (original color)
    hslToHex(hsl.h, Math.min(hsl.s + 5, 100), Math.max(hsl.l - 10, 25)), // 400
    hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 20, 20)),// 500
    hslToHex(hsl.h, Math.min(hsl.s + 15, 100), Math.max(hsl.l - 35, 10)),// 600
  ];
};

const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  } else {
    s = 0;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};