"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* A full-screen fragment shader that draws an animated guilloché — the
   interfering rosette line-work printed on banknotes, passports and official
   certificates. Rendered as ink-on-paper at low opacity: a living watermark. */

const VERT = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec3  uInk;
  uniform vec3  uSeal;
  uniform float uOpacity;

  mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  // one rosette: thin anti-aliased contour lines whose radius is modulated
  // by an angular harmonic — the essence of guilloché.
  float rosette(vec2 p, float petals, float amp, float freq, float phase){
    float r = length(p);
    float a = atan(p.y, p.x);
    float v = r * freq + amp * sin(petals * a + phase);
    float w = fwidth(v) * 1.1;
    float d = abs(fract(v) - 0.5);
    return smoothstep(0.5, 0.5 - w, d);
  }

  void main(){
    // aspect-correct, centred coordinates
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    float t = uTime * 0.05;

    vec2 p1 = rot(t) * uv;
    vec2 p2 = rot(-t * 0.7) * (uv + vec2(0.06, -0.02));
    vec2 p3 = uv * 1.04;

    float g1 = rosette(p1, 16.0, 0.10, 30.0,  t * 2.0);
    float g2 = rosette(p2, 23.0, 0.075, 35.0, -t * 1.4);
    float g3 = rosette(p3, 6.0,  0.20, 18.0,  t * 0.8);

    // interference: where two systems overlap, the line-work intensifies
    float guilloche = max(g1, g2) * 0.65 + g3 * 0.35 + g1 * g2 * 0.5;

    // colour: mostly ink, greener toward the centre rosette
    vec3 col = mix(uInk, uSeal, g3 * 0.6);

    // radial vignette so it reads as a centred watermark and fades to clean paper
    float fade = smoothstep(1.25, 0.12, length(uv));

    float a = guilloche * fade * uOpacity;
    gl_FragColor = vec4(col, a);
  }
`;

function Field() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uInk: { value: new THREE.Color("#23201a") },
      uSeal: { value: new THREE.Color("#15623d") },
      uOpacity: { value: 0.16 },
    }),
    []
  );

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uRes.value.set(
      size.width * state.viewport.dpr,
      size.height * state.viewport.dpr
    );
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function GuillocheCanvas() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Field />
    </Canvas>
  );
}
