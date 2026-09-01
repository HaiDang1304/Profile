import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const TransitionShaderMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uScroll: 0, // 0 to 1
    uResolution: new THREE.Vector2(1, 1),
    uVelocity: 0, // scroll velocity for dynamic effects
  },
  // Vertex Shader
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  /* glsl */ `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uScroll;
    uniform float uVelocity;
    uniform vec2 uResolution;
    
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Sample the pristine pixel texture without spatial distortion
      vec4 texColor = texture2D(uTexture, uv);

      // Soft Vignette effect to draw focus to center
      vec2 center = uv - 0.5;
      float dist = length(center);
      float vignette = smoothstep(1.1, 0.4, dist);
      
      // Extremely subtle CRT Scanlines to blend the pixels nicely (prevents harsh aliasing)
      float scanline = sin(uv.y * uResolution.y * 0.5) * 0.015;
      texColor.rgb -= scanline;

      gl_FragColor = vec4(texColor.rgb * vignette, texColor.a);
    }
  `
);
