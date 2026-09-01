import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { TransitionShaderMaterial } from './shaders/TransitionShader';
import { scrollBridge } from './core/ScrollBridge';

extend({ TransitionShaderMaterial });

function ShaderPlane({ sourceCanvas }) {
  const materialRef = useRef();
  const { size } = useThree();
  
  // Create a CanvasTexture from the 2D canvas
  const canvasTexture = useMemo(() => {
    if (!sourceCanvas) return null;
    const tex = new THREE.CanvasTexture(sourceCanvas);
    
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter; // Keep pixel art sharp
    tex.generateMipmaps = false;
    return tex;
  }, [sourceCanvas]);

  // Hook into the frame loop to update texture and uniforms
  useFrame((state) => {
    if (materialRef.current) {
      // Calculate scroll velocity in a larger scale for the shader
      const velocity = (scrollBridge.target - scrollBridge.current) * 50.0;

      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uScroll = scrollBridge.current;
      materialRef.current.uVelocity = THREE.MathUtils.lerp(materialRef.current.uVelocity, velocity, 0.1);
      materialRef.current.uResolution.set(size.width, size.height);
      
      // We must flag the texture for update if the 2D canvas changed
      if (canvasTexture && window.__triggerTextureUpdate) {
        canvasTexture.needsUpdate = true;
        window.__triggerTextureUpdate = false;
      }
    }
  });

  if (!canvasTexture) return null;

  return (
    <mesh>
      {/* Full screen plane in Orthographic camera is 2x2 */}
      <planeGeometry args={[2, 2]} />
      <transitionShaderMaterial 
        ref={materialRef} 
        uTexture={canvasTexture} 
        transparent={true} 
      />
    </mesh>
  );
}

export default function ThreeWorld({ sourceCanvas }) {
  if (!sourceCanvas) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, left: -1, right: 1, top: 1, bottom: -1 }}
        gl={{ alpha: true, antialias: false }}
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
      >
        <ShaderPlane sourceCanvas={sourceCanvas} />
      </Canvas>
    </div>
  );
}
