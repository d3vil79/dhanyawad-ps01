import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

// Animated rotating green health plus / cross shape
function HealthCross() {
  const groupRef = useRef();
  const glowRef  = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.006;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.06;
      glowRef.current.scale.set(s, s, s);
    }
  });

  const green    = '#22c55e';
  const greenDark = '#16a34a';

  return (
    <Float speed={1.8} rotationIntensity={0.25} floatIntensity={1.2}>
      <group ref={groupRef}>
        {/* Glow sphere behind cross */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshBasicMaterial color={green} transparent opacity={0.06} />
        </mesh>

        {/* Outer ring */}
        <mesh>
          <torusGeometry args={[1.55, 0.06, 16, 80]} />
          <meshStandardMaterial color={green} emissive={green} emissiveIntensity={0.5} metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Horizontal bar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.4, 0.55, 0.28]} />
          <meshStandardMaterial color={green} emissive={greenDark} emissiveIntensity={0.4} metalness={0.7} roughness={0.15} />
        </mesh>

        {/* Vertical bar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 2.4, 0.28]} />
          <meshStandardMaterial color={green} emissive={greenDark} emissiveIntensity={0.4} metalness={0.7} roughness={0.15} />
        </mesh>

        {/* Center gem / orb */}
        <mesh position={[0, 0, 0.18]}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={1.2} metalness={0.3} roughness={0.1} />
        </mesh>

        {/* Corner dots */}
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, y], i) => (
          <mesh key={i} position={[x * 0.95, y * 0.95, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

export function Hero3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }}>
        <ambientLight intensity={0.6} color="#bbf7d0" />
        <directionalLight position={[8, 10, 5]}  intensity={2.0} color="#4ade80" />
        <directionalLight position={[-8, -5, -5]} intensity={0.8} color="#166534" />
        <pointLight position={[0, 0, 3]} intensity={1.5} color="#22c55e" distance={8} />
        <HealthCross />
      </Canvas>
    </div>
  );
}
