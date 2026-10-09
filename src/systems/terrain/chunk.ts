export type ChunkCoordinate = {
  x: number;
  z: number;
};

export type TerrainChunk = {
  coordinate: ChunkCoordinate;
  worldX: number;
  worldZ: number;
  size: number;
};

export function createTerrainChunk(
  coordinate: ChunkCoordinate,
  size: number
): TerrainChunk {
  return {
    coordinate,

    worldX: coordinate.x * size,
    worldZ: coordinate.z * size,

    size,
  };
}