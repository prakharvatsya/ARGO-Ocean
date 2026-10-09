import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import TerrainWorld from "./components/TerrainWorld";
import SuspendedParticles from "./components/SuspendedParticles";
import "./App.css";


function UnderwaterWorld() {
  return (
    <>
      {/* Soft overall underwater illumination */}
      <ambientLight intensity={0.4} color="#8bcbd8" />

      {/* Natural blue-green light from above */}
      <hemisphereLight
        args={["#72d7ed", "#514735", 1.0]}
      />

      {/* Directional light adds shape to the seabed */}
      <directionalLight
        position={[8, 15, 5]}
        intensity={1.4}
        color="#c4f0ff"
      />

      {/* Subtle focused illumination */}
      <spotLight
        position={[0, 12, 0]}
        intensity={1.5}
        color="#a6eaff"
        angle={0.65}
        penumbra={1}
        distance={45}
      />
    </>
  );
}


function App() {
  return (
    <div className="ocean-app">
      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: [0, 5, 14],
          fov: 55,
          near: 0.1,
          far: 250,
        }}
      >
        {/* Deep ocean color */}
        <color attach="background" args={["#073642"]} />

        {/* Distance haze blends the terrain into the water */}
        <fog attach="fog" args={["#0b3d4a", 35, 150]} />

        <UnderwaterWorld />

        <TerrainWorld />

        <SuspendedParticles />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={65}
          maxPolarAngle={Math.PI * 0.49}
        />

        <Stats />
      </Canvas>
    </div>
  );
}

export default App;
