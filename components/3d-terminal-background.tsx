'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FloatingParticles({ count = 2000 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const light = useRef<THREE.PointLight>(null)

  // Generate random particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [count])

  // Animate particles
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05
      mesh.current.rotation.y = state.clock.elapsedTime * 0.075
    }
    if (light.current) {
      light.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 5
      light.current.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 5
      light.current.position.z = Math.sin(state.clock.elapsedTime * 0.4) * 5
    }
  })

  return (
    <>
      <pointLight ref={light} intensity={1.2} color="#22c55e" />
      <ambientLight intensity={0.4} />
      <Points ref={mesh} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#22c55e"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </>
  )
}

function TerminalGrid() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  const gridSize = 20
  const gridDivisions = 20

  return (
    <group ref={gridRef}>
      <gridHelper args={[gridSize, gridDivisions, '#22c55e', '#22c55e']} />
      <gridHelper
        args={[gridSize, gridDivisions, '#22c55e', '#22c55e']}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <gridHelper
        args={[gridSize, gridDivisions, '#22c55e', '#22c55e']}
        rotation={[0, 0, Math.PI / 2]}
      />
      {/* Additional grid lines for better visibility */}
      <gridHelper args={[gridSize, gridDivisions * 2, '#22c55e', '#22c55e']} />
      {/* Thicker main grid lines */}
      <gridHelper args={[gridSize, 4, '#22c55e', '#22c55e']} />
    </group>
  )
}

export default function Terminal3DBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-80 dark:opacity-60 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <FloatingParticles count={2000} />
        <TerminalGrid />
      </Canvas>
    </div>
  )
}

