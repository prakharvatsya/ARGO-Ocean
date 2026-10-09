import type { ChunkCoordinate } from "./chunk";

export type ChunkManagerConfig = {
  chunkSize: number;
  renderDistance: number;
};

export function worldToChunk(
  worldX: number,
  worldZ: number,
  chunkSize: number
): ChunkCoordinate {
  return {
    x: Math.floor(worldX / chunkSize),
    z: Math.floor(worldZ / chunkSize),
  };
}

export function getRequiredChunks(
  center: ChunkCoordinate,
  config: ChunkManagerConfig
): ChunkCoordinate[] {
  const chunks: ChunkCoordinate[] = [];

  const distance = config.renderDistance;

  for (
    let z = center.z - distance;
    z <= center.z + distance;
    z++
  ) {
    for (
      let x = center.x - distance;
      x <= center.x + distance;
      x++
    ) {
      chunks.push({ x, z });
    }
  }

  return chunks;
}