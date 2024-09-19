function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (value: number) => Math.max(0, Math.min(255, value));
  const toHex = (value: number) => clamp(value).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const colors = {
  brand: rgbToHex(248, 113, 113),
  brandAccent: rgbToHex(153, 27, 27),
};
