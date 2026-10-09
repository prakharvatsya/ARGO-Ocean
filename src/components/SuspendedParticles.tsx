import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 2000;
const AREA_SIZE = 120;

function SuspendedParticles() {
      const pointsRef = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const index = i * 3;

      positions[index] =
        (Math.random() - 0.5) * AREA_SIZE;

      positions[index + 1] =
        -2 + Math.random() * 12;

      positions[index + 2] =
        (Math.random() - 0.5) * AREA_SIZE;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    geometry.computeBoundingSphere();

    return geometry;
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      depthTest: false,
      fog: false,
    });
  }, []);
  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    pointsRef.current.position.x += delta * 0.01;
    pointsRef.current.position.z += delta * 0.006;

    if (pointsRef.current.position.x > 10) {
      pointsRef.current.position.x = -10;
    }

    if (pointsRef.current.position.z > 10) {
      pointsRef.current.position.z = -10;
    }
  });
  
  return (
   <points
  ref={pointsRef}
  geometry={geometry}
  material={material}
/>
  );
}

export default SuspendedParticles;