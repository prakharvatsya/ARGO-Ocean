import * as THREE from "three";

const SIZE = 128;

function hash(x: number, y: number) {
  const value =
    Math.sin(x * 127.1 + y * 311.7) *
    43758.5453;

  return value - Math.floor(value);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function noise(x: number, y: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);

  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const tx = x - x0;
  const ty = y - y0;

  const sx = smoothstep(tx);
  const sy = smoothstep(ty);

  const n00 = hash(x0, y0);
  const n10 = hash(x1, y0);
  const n01 = hash(x0, y1);
  const n11 = hash(x1, y1);

  const nx0 = n00 + (n10 - n00) * sx;
  const nx1 = n01 + (n11 - n01) * sx;

  return nx0 + (nx1 - nx0) * sy;
}

export function createSedimentTexture() {
  const data = new Uint8Array(SIZE * SIZE * 4);

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const index = (y * SIZE + x) * 4;

      const large = noise(
        x * 0.035,
        y * 0.035
      );

      const small = noise(
        x * 0.12,
        y * 0.12
      );

      const value =
        large * 0.7 +
        small * 0.3;

      const base = 92 + value * 25;

      data[index] = base;
      data[index + 1] = base * 0.92;
      data[index + 2] = base * 0.72;
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(
    data,
    SIZE,
    SIZE,
    THREE.RGBAFormat
  );

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;

  texture.repeat.set(4, 4);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}