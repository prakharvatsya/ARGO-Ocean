export type TerrainConfig = {
  size: number;
  segments: number;
  seed: number;
  heightScale: number;
  worldX: number;
  worldZ: number;
};

function hash(x: number, y: number, seed: number) {
  const value = Math.sin(
    x * 127.1 +
      y * 311.7 +
      seed * 74.7
  ) * 43758.5453;

  return value - Math.floor(value);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function valueNoise(
  x: number,
  y: number,
  seed: number
) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);

  const x1 = x0 + 1;
  const y1 = y0 + 1;

  const tx = x - x0;
  const ty = y - y0;

  const sx = smoothstep(tx);
  const sy = smoothstep(ty);

  const n00 = hash(x0, y0, seed);
  const n10 = hash(x1, y0, seed);
  const n01 = hash(x0, y1, seed);
  const n11 = hash(x1, y1, seed);

  const nx0 = n00 + (n10 - n00) * sx;
  const nx1 = n01 + (n11 - n01) * sx;

  return nx0 + (nx1 - nx0) * sy;
}

function fractalNoise(
  x: number,
  y: number,
  seed: number
) {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let totalAmplitude = 0;

  for (let octave = 0; octave < 4; octave++) {
    value +=
      valueNoise(
        x * frequency,
        y * frequency,
        seed + octave * 100
      ) * amplitude;

    totalAmplitude += amplitude;

    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / totalAmplitude;
}

export function generateTerrain(
  config: TerrainConfig
) {
  const {
  size,
  segments,
  seed,
  heightScale,
  worldX,
  worldZ,
} = config;

  const vertexCount =
    (segments + 1) * (segments + 1);

  const heights = new Float32Array(vertexCount);

  for (let z = 0; z <= segments; z++) {
    for (let x = 0; x <= segments; x++) {
      const index =
        z * (segments + 1) + x;

      const localX =
  (x / segments - 0.5) * size;

const localZ =
  (z / segments - 0.5) * size;

const worldPositionX =
  worldX + localX;

const worldPositionZ =
  worldZ + localZ;

      const largeTerrain =
  fractalNoise(
    worldPositionX * 0.08,
    worldPositionZ * 0.08,
    seed
  );

 const mediumTerrain =
  fractalNoise(
    worldPositionX * 0.18,
    worldPositionZ * 0.18,
    seed + 500
  );

const smallTerrain =
  fractalNoise(
    worldPositionX * 0.4,
    worldPositionZ * 0.4,
    seed + 1000
  );

      const height =
        (
          largeTerrain * 0.65 +
          mediumTerrain * 0.25 +
          smallTerrain * 0.10
        ) * heightScale;

      heights[index] = height;
    }
  }

  return {
    heights,
    size,
    segments,
  };
}

export function sampleTerrainHeight(
  worldX: number,
  worldZ: number,
  seed = 42,
  heightScale = 2
): number {
  const largeTerrain = fractalNoise(
    worldX * 0.08,
    worldZ * 0.08,
    seed
  );

  const mediumTerrain = fractalNoise(
    worldX * 0.18,
    worldZ * 0.18,
    seed + 500
  );

  const smallTerrain = fractalNoise(
    worldX * 0.4,
    worldZ * 0.4,
    seed + 1000
  );

  return (
    largeTerrain * 0.65 +
    mediumTerrain * 0.25 +
    smallTerrain * 0.1
  ) * heightScale;
}
