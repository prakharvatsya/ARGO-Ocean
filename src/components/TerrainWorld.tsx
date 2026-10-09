
import { useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import Seabed from "./Seabed";
import SeabedRocks from "./SeabedRocks";

import {
  getRequiredChunks,
  worldToChunk,
} from "../systems/terrain/chunkManager";

const CHUNK_SIZE = 30;
const RENDER_DISTANCE = 5;

function TerrainWorld() {
  const { camera } = useThree();

  const [centerChunk, setCenterChunk] = useState({
    x: 0,
    z: 0,
  });

  useFrame(() => {
    const nextChunk = worldToChunk(
      camera.position.x,
      camera.position.z,
      CHUNK_SIZE
    );

    if (
      nextChunk.x !== centerChunk.x ||
      nextChunk.z !== centerChunk.z
    ) {
      setCenterChunk(nextChunk);
    }
  });

  const chunks = getRequiredChunks(centerChunk, {
    chunkSize: CHUNK_SIZE,
    renderDistance: RENDER_DISTANCE,
  });

  return (
    <>
      <Seabed chunks={chunks} />
      <SeabedRocks />
    </>
  );
}

export default TerrainWorld;