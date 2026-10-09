
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sampleTerrainHeight } from "../systems/terrain/terrainGenerator";

const ROCK_COUNT = 60;
const WORLD_SIZE = 100;
const SEED = 42;
const HEIGHT_SCALE = 2;

function SeabedRocks() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const rocks = useMemo(() => {
    let seed = 42;

    function random() {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    }

    const generated: {
      id: number;
      x: number;
      z: number;
      scale: number;
      rotation: number;
    }[] = [];

    const clusterCount = 10;
    const rocksPerCluster = 6;
    const clusterRadius = 5;

    for (let cluster = 0; cluster < clusterCount; cluster++) {
      const centerX = (random() - 0.5) * WORLD_SIZE;
      const centerZ = (random() - 0.5) * WORLD_SIZE;

      for (let i = 0; i < rocksPerCluster; i++) {
        const angle = random() * Math.PI * 2;
        const distance = Math.sqrt(random()) * clusterRadius;

        generated.push({
          id: generated.length,
          x: THREE.MathUtils.clamp(
            centerX + Math.cos(angle) * distance,
            -WORLD_SIZE / 2 + 1,
            WORLD_SIZE / 2 - 1
          ),
          z: THREE.MathUtils.clamp(
            centerZ + Math.sin(angle) * distance,
            -WORLD_SIZE / 2 + 1,
            WORLD_SIZE / 2 - 1
          ),
          scale: random() < 0.15
            ? 0.65 + random() * 0.35
            : 0.12 + Math.pow(random(), 1.7) * 0.4,
          rotation: random() * Math.PI * 2,
        });
      }
    }

    return generated;
  }, []);


  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();

    for (const rock of rocks) {
      const terrainHeight = sampleTerrainHeight(
        rock.x,
        rock.z,
        SEED,
        HEIGHT_SCALE
      );

      // The terrain mesh itself is positioned at y = -1.
      const groundY = terrainHeight - 1;

      dummy.position.set(
        rock.x,
        groundY + rock.scale * 0.55,
        rock.z
      );

      dummy.rotation.set(
        rock.rotation * 0.15,
        rock.rotation,
        rock.rotation * 0.1
      );

      dummy.scale.set(
        rock.scale * 1.2,
        rock.scale * 0.8,
        rock.scale
      );

      dummy.updateMatrix();
      mesh.setMatrixAt(rock.id, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [rocks]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, ROCK_COUNT]}
      frustumCulled
    >
      <dodecahedronGeometry args={[1, 0]} />
     <meshStandardMaterial
  color="#77766d"
  roughness={0.95}
  metalness={0}
  flatShading
/>
    </instancedMesh>
  );
}

export default SeabedRocks;
