import { useMemo } from "react";
import * as THREE from "three";
import {
  generateTerrain,
  type TerrainConfig,
} from "../systems/terrain/terrainGenerator";


const CHUNK_SIZE = 30;
const SEGMENTS = 30;
const SEED = 42;
const HEIGHT_SCALE = 2;

type ChunkProps = {
  x: number;
  z: number;
};

function TerrainChunk({ x, z }: ChunkProps) {
  const geometry = useMemo(() => {
    const config: TerrainConfig = {
      size: CHUNK_SIZE,
      segments: SEGMENTS,
      seed: SEED,
      heightScale: HEIGHT_SCALE,
      worldX: x * CHUNK_SIZE,
      worldZ: z * CHUNK_SIZE,
    };

    const terrain = generateTerrain(config);

    const geometry = new THREE.PlaneGeometry(
      terrain.size,
      terrain.size,
      terrain.segments,
      terrain.segments
    );

    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      position.setZ(i, terrain.heights[i]);
    }

    position.needsUpdate = true;
geometry.computeVertexNormals();


return geometry;
       

  }, [x, z]);

  return (
    <mesh
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[
        x * CHUNK_SIZE,
        -1,
        z * CHUNK_SIZE,
      ]}
    >
<meshStandardMaterial
  color="#77745f"
  roughness={0.95}
  metalness={0}
/>
    </mesh>
  );
}

import type { ChunkCoordinate } from "../systems/terrain/chunk";

type SeabedProps = {
  chunks: ChunkCoordinate[];
};

function Seabed({ chunks }: SeabedProps) {
  return (
    <group>
      {chunks.map((chunk) => (
        <TerrainChunk
          key={`${chunk.x}-${chunk.z}`}
          x={chunk.x}
          z={chunk.z}
        />
      ))}
    </group>
  );
}

export default Seabed;