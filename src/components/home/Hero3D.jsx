import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function AbstractMedicalShape() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        {/* Abstract futuristic shape, we'll use a Icosahedron for an atomic medical look */}
        <icosahedronGeometry args={[1.5, 3]} />
        <MeshDistortMaterial 
          color="#3B82F6" 
          envMapIntensity={1} 
          clearcoat={0.9} 
          clearcoatRoughness={0.1} 
          metalness={0.8} 
          roughness={0.2} 
          distort={0.3} 
          speed={2} 
          wireframe={false}
        />
        <mesh scale={[1.02, 1.02, 1.02]}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
        </mesh>
      </mesh>
    </Float>
  );
}

export function Hero3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#F0FDF4" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#3B82F6" />
        <AbstractMedicalShape />
      </Canvas>
    </div>
  );
}
