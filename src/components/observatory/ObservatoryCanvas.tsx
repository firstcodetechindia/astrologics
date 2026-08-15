"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Line as ThreeLine,
  LineBasicMaterial,
  Points,
  Vector3,
} from "three";
import {
  queryObservatoryScene,
  type ObservatoryBody,
  type ObservatoryBodyId,
  type ObservatoryFrame,
} from "@/lib/astrology/observatory-ephemeris";
import { AMBIENT_SIM_MS_PER_SEC } from "@/lib/astrology/observatory-time";
import { BODY_COLOR } from "./observatory-colors";

const MESH_SIZE: Record<string, number> = {
  sun: 0.92,
  jupiter: 0.4,
  saturn: 0.34,
  uranus: 0.22,
  neptune: 0.21,
  earth: 0.18,
  venus: 0.16,
  mars: 0.15,
  mercury: 0.11,
  moon: 0.08,
};

const TRAIL_MAX = 96;
const TRAIL_MIN_DIST2 = 0.00035;
const PURPLE = new Color("#6c3cff");
const GOLD = new Color("#ffc857");
const FULL_VIEW_CAM = new Vector3(0, 7.5, 18);
const FULL_VIEW_TARGET = new Vector3(0, 0, 0);

const FOCUS_DISTANCE: Record<string, number> = {
  sun: 3.9,
  jupiter: 2.55,
  saturn: 3.2,
  uranus: 2.05,
  neptune: 2.0,
  earth: 2.15,
  venus: 2.05,
  mars: 2.0,
  mercury: 1.85,
  moon: 1.62,
};

function focusDistance(id: ObservatoryBodyId) {
  return FOCUS_DISTANCE[id] ?? 2.2;
}

export type ObservatoryHudLabel = {
  id: ObservatoryBodyId;
  x: number;
  y: number;
  visible: boolean;
};

type TrailBuf = {
  geo: BufferGeometry;
  pos: Float32Array;
  col: Float32Array;
  count: number;
  start: number;
  lastX: number;
  lastY: number;
  lastZ: number;
};

function publishFps(fps: number) {
  if (typeof window === "undefined") return;
  (window as Window & { __observatoryFps?: number }).__observatoryFps = fps;
  const host = document.querySelector("[data-observatory-canvas]");
  if (host instanceof HTMLElement) {
    host.dataset.observatoryFps = fps.toFixed(1);
  }
}

function originId(frame: ObservatoryFrame): ObservatoryBodyId {
  return frame === "heliocentric" ? "sun" : "earth";
}

function pushTrail(buf: TrailBuf, x: number, y: number, z: number, hex: string) {
  if (buf.count > 0) {
    const dx = x - buf.lastX;
    const dy = y - buf.lastY;
    const dz = z - buf.lastZ;
    if (dx * dx + dy * dy + dz * dz < TRAIL_MIN_DIST2) return;
  }
  buf.lastX = x;
  buf.lastY = y;
  buf.lastZ = z;

  const slot =
    buf.count < TRAIL_MAX
      ? buf.count
      : (buf.start + buf.count) % TRAIL_MAX;
  if (buf.count < TRAIL_MAX) buf.count += 1;
  else buf.start = (buf.start + 1) % TRAIL_MAX;

  buf.pos[slot * 3] = x;
  buf.pos[slot * 3 + 1] = y;
  buf.pos[slot * 3 + 2] = z;

  const planet = new Color(hex);
  planet.lerp(PURPLE, 0.32);
  buf.col[slot * 3] = planet.r;
  buf.col[slot * 3 + 1] = planet.g;
  buf.col[slot * 3 + 2] = planet.b;

  const { count, start, pos, col, geo } = buf;
  const attr = geo.getAttribute("position") as BufferAttribute;
  const cattr = geo.getAttribute("color") as BufferAttribute;
  const scratch = new Color();
  for (let k = 0; k < count; k++) {
    const i = (start + k) % TRAIL_MAX;
    const t = count < 2 ? 1 : k / (count - 1);
    attr.setXYZ(k, pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    scratch.setRGB(col[i * 3], col[i * 3 + 1], col[i * 3 + 2]);
    scratch.lerp(GOLD, t * 0.18);
    scratch.multiplyScalar(0.22 + 0.78 * t);
    cattr.setXYZ(k, scratch.r, scratch.g, scratch.b);
  }
  attr.needsUpdate = true;
  cattr.needsUpdate = true;
  geo.setDrawRange(0, count);
}

function clearTrail(buf: TrailBuf) {
  buf.count = 0;
  buf.start = 0;
  buf.geo.setDrawRange(0, 0);
}

function PerfAndHud({
  bodiesRef,
  onHud,
}: {
  bodiesRef: React.MutableRefObject<ObservatoryBody[]>;
  onHud?: (labels: ObservatoryHudLabel[], fps: number, simIso?: string) => void;
}) {
  const frames = useRef(0);
  const elapsed = useRef(0);
  const hudAge = useRef(0);
  const fps = useRef(0);
  const scratch = useRef(new Vector3());

  useFrame((state, delta) => {
    frames.current += 1;
    elapsed.current += delta;
    if (elapsed.current >= 0.5) {
      fps.current = frames.current / elapsed.current;
      frames.current = 0;
      elapsed.current = 0;
      publishFps(fps.current);
    }

    if (!onHud) return;
    hudAge.current += delta;
    if (hudAge.current < 0.08) return;
    hudAge.current = 0;
    const { camera, size } = state;
    const v = scratch.current;
    const bodies = bodiesRef.current;
    const labels: ObservatoryHudLabel[] = bodies.map((b) => {
      v.set(b.x, b.y, b.z);
      v.project(camera);
      const visible = v.z < 1;
      return {
        id: b.id,
        x: (v.x * 0.5 + 0.5) * size.width,
        y: (-v.y * 0.5 + 0.5) * size.height,
        visible,
      };
    });
    onHud(labels, fps.current);
  });
  return null;
}

function SunGlow({ radius }: { radius: number }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const g = ref.current;
    if (!g) return;
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 1.35);
    g.scale.setScalar(1 + 0.07 * pulse);
    const mesh = g.children[0] as { material?: { opacity: number } } | undefined;
    if (mesh?.material) mesh.material.opacity = 0.14 + 0.08 * pulse;
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[radius * 1.55, 24, 24]} />
        <meshBasicMaterial color="#ff8a3d" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

function PlanetMesh({
  body,
  selected,
  onSelect,
  groupMap,
}: {
  body: ObservatoryBody;
  selected: boolean;
  onSelect: (id: ObservatoryBodyId) => void;
  groupMap: React.MutableRefObject<Map<ObservatoryBodyId, Group>>;
}) {
  const group = useRef<Group>(null);
  const color = BODY_COLOR[body.id] ?? "#ffffff";
  const r = MESH_SIZE[body.id] ?? 0.12;
  const isSun = body.id === "sun";
  const hitR = Math.max(r * 2.4, 0.38);

  useLayoutEffect(() => {
    group.current?.position.set(body.x, body.y, body.z);
  }, [body.x, body.y, body.z]);

  useEffect(() => {
    const g = group.current;
    const map = groupMap.current;
    if (g) map.set(body.id, g);
    return () => {
      map.delete(body.id);
    };
  }, [body.id, groupMap]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(body.id);
  };

  return (
    <group ref={group}>
      <mesh onClick={onClick}>
        <sphereGeometry args={[r * (selected ? 1.12 : 1), isSun ? 32 : 24, isSun ? 32 : 24]} />
        {isSun ? (
          <meshBasicMaterial color={color} />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? 0.55 : body.isOuter ? 0.18 : 0.28}
            roughness={0.55}
            metalness={0.12}
          />
        )}
      </mesh>
      <mesh onClick={onClick} visible={false}>
        <sphereGeometry args={[hitR, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      {isSun ? <SunGlow radius={r} /> : null}
      {body.id === "saturn" ? (
        <mesh rotation={[Math.PI / 2.4, 0.15, 0]}>
          <ringGeometry args={[r * 1.35, r * 2.15, 48]} />
          <meshBasicMaterial
            color="#d4c4a8"
            transparent
            opacity={0.55}
            side={DoubleSide}
          />
        </mesh>
      ) : null}
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.018, radius + 0.018, 96]} />
      <meshBasicMaterial
        color="#6c3cff"
        transparent
        opacity={0.16}
        side={DoubleSide}
      />
    </mesh>
  );
}

function OrbitTrail({
  id,
  trails,
}: {
  id: ObservatoryBodyId;
  trails: React.MutableRefObject<Map<ObservatoryBodyId, TrailBuf>>;
}) {
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    const pos = new Float32Array(TRAIL_MAX * 3);
    const col = new Float32Array(TRAIL_MAX * 3);
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("color", new BufferAttribute(col, 3));
    g.setDrawRange(0, 0);
    return g;
  }, []);

  useEffect(() => {
    const buf: TrailBuf = {
      geo,
      pos: new Float32Array(TRAIL_MAX * 3),
      col: new Float32Array(TRAIL_MAX * 3),
      count: 0,
      start: 0,
      lastX: Number.NaN,
      lastY: Number.NaN,
      lastZ: Number.NaN,
    };
    trails.current.set(id, buf);
    return () => {
      trails.current.delete(id);
      geo.dispose();
    };
  }, [geo, id, trails]);

  const line = useMemo(() => {
    const mat = new LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const line = new ThreeLine(geo, mat);
    line.frustumCulled = false;
    return line;
  }, [geo]);

  useEffect(() => () => {
    (line.material as LineBasicMaterial).dispose();
  }, [line]);

  return <primitive object={line} />;
}

function TwinklingStars({ reduced }: { reduced: boolean }) {
  const ref = useRef<Points>(null);
  const count = 160;
  const { positions, phases, speeds, bases, amps } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const bases = new Float32Array(count);
    const amps = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 38 + Math.random() * 18;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.55 + Math.random() * 1.8;
      bases[i] = 0.28 + Math.random() * 0.35;
      amps[i] = 0.35 + Math.random() * 0.5;
    }
    return { positions, phases, speeds, bases, amps };
  }, []);

  const colors = useMemo(() => new Float32Array(count * 3).fill(0.7), []);
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    g.setAttribute("color", new BufferAttribute(colors, 3));
    return g;
  }, [positions, colors]);

  useFrame(({ clock }) => {
    if (reduced) return;
    const attr = geo.getAttribute("color") as BufferAttribute;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const a = bases[i] + amps[i] * (0.5 + 0.5 * Math.sin(t * speeds[i] + phases[i]));
      attr.setXYZ(i, a * 0.92, a * 0.9, a);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.18}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function SimulationDriver({
  dateIso,
  frame,
  includeOuter,
  trailEpoch,
  groupMap,
  trails,
  bodiesRef,
  onSimClock,
}: {
  dateIso: string;
  frame: ObservatoryFrame;
  includeOuter: boolean;
  trailEpoch: number;
  groupMap: React.MutableRefObject<Map<ObservatoryBodyId, Group>>;
  trails: React.MutableRefObject<Map<ObservatoryBodyId, TrailBuf>>;
  bodiesRef: React.MutableRefObject<ObservatoryBody[]>;
  onSimClock?: (iso: string) => void;
}) {
  const simMs = useRef(Date.parse(dateIso) || Date.now());
  const clockAge = useRef(0);

  useLayoutEffect(() => {
    simMs.current = Date.parse(dateIso) || Date.now();
    const instant = new Date(simMs.current);
    const next = queryObservatoryScene(instant, frame, includeOuter);
    bodiesRef.current = next;
    for (const b of next) {
      groupMap.current.get(b.id)?.position.set(b.x, b.y, b.z);
    }
  }, [dateIso, frame, includeOuter, bodiesRef, groupMap]);

  useEffect(() => {
    for (const buf of trails.current.values()) clearTrail(buf);
  }, [frame, includeOuter, trailEpoch, trails]);

  useFrame((_, delta) => {
    if (typeof document !== "undefined" && document.hidden) return;
    const dt = Math.min(delta, 0.05);
    simMs.current += dt * AMBIENT_SIM_MS_PER_SEC;
    const instant = new Date(simMs.current);
    const bodies = queryObservatoryScene(instant, frame, includeOuter);
    bodiesRef.current = bodies;
    const skip = originId(frame);
    for (const b of bodies) {
      const g = groupMap.current.get(b.id);
      if (g) g.position.set(b.x, b.y, b.z);
      if (b.id === skip) continue;
      const buf = trails.current.get(b.id);
      if (buf) pushTrail(buf, b.x, b.y, b.z, BODY_COLOR[b.id] ?? "#ffffff");
    }
    clockAge.current += dt;
    if (clockAge.current >= 0.2) {
      clockAge.current = 0;
      onSimClock?.(instant.toISOString());
    }
  });
  return null;
}

function CameraDirector({
  selectedId,
  viewReset,
  reduced,
  groupMap,
  controlsRef,
}: {
  selectedId: ObservatoryBodyId | null;
  viewReset: number;
  reduced: boolean;
  groupMap: React.MutableRefObject<Map<ObservatoryBodyId, Group>>;
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
}) {
  const { camera } = useThree();
  const follow = useRef<ObservatoryBodyId | null>(null);
  const flying = useRef(false);
  const t = useRef(1);
  const duration = useRef(1.2);
  const fromCam = useRef(new Vector3());
  const fromTarget = useRef(new Vector3());
  const toCam = useRef(new Vector3());
  const toTarget = useRef(new Vector3());
  const dir = useRef(new Vector3());
  const scratch = useRef(new Vector3());

  const beginFly = (
    target: Vector3,
    cam: Vector3,
    nextFollow: ObservatoryBodyId | null
  ) => {
    const c = controlsRef.current;
    fromCam.current.copy(camera.position);
    fromTarget.current.copy(c?.target ?? FULL_VIEW_TARGET);
    toCam.current.copy(cam);
    toTarget.current.copy(target);
    t.current = 0;
    duration.current = reduced ? 0.01 : 1.2;
    flying.current = true;
    follow.current = nextFollow;
    if (c) c.enabled = false;
  };

  const skipReset = useRef(true);

  useEffect(() => {
    if (skipReset.current) {
      skipReset.current = false;
      return;
    }
    beginFly(FULL_VIEW_TARGET.clone(), FULL_VIEW_CAM.clone(), null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- viewReset nonce
  }, [viewReset]);

  useEffect(() => {
    if (!selectedId) return;
    const g = groupMap.current.get(selectedId);
    const c = controlsRef.current;
    const target = g ? g.position.clone() : FULL_VIEW_TARGET.clone();
    dir.current.copy(camera.position).sub(c?.target ?? FULL_VIEW_TARGET);
    if (dir.current.lengthSq() < 0.0008) dir.current.set(0, 0.38, 1);
    dir.current.normalize();
    dir.current.y = Math.max(dir.current.y, 0.22);
    dir.current.normalize();
    const cam = target.clone().addScaledVector(dir.current, focusDistance(selectedId));
    beginFly(target, cam, selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fly on selection change
  }, [selectedId]);

  useFrame((_, delta) => {
    const c = controlsRef.current;
    if (!c) return;

    if (follow.current) {
      const g = groupMap.current.get(follow.current);
      if (g) {
        toTarget.current.copy(g.position);
        if (!flying.current) {
          const d = scratch.current.copy(g.position).sub(c.target);
          c.target.add(d);
          camera.position.add(d);
          c.update();
        } else {
          dir.current.copy(camera.position).sub(c.target);
          if (dir.current.lengthSq() < 0.0008) dir.current.set(0, 0.38, 1);
          dir.current.normalize();
          dir.current.y = Math.max(dir.current.y, 0.22);
          dir.current.normalize();
          toCam.current.copy(g.position).addScaledVector(dir.current, focusDistance(follow.current));
        }
      }
    }

    if (!flying.current) return;
    t.current += delta / duration.current;
    const u = 1 - Math.pow(1 - Math.min(1, t.current), 3);
    camera.position.lerpVectors(fromCam.current, toCam.current, u);
    c.target.lerpVectors(fromTarget.current, toTarget.current, u);
    c.update();
    if (t.current >= 1) {
      flying.current = false;
      c.enabled = true;
    }
  });
  return null;
}

function SceneContent({
  bodies,
  frame,
  selectedId,
  onSelect,
  onHud,
  dateIso,
  includeOuter,
  trailEpoch,
  viewReset,
  onSimClock,
  reducedMotion,
}: {
  bodies: ObservatoryBody[];
  frame: ObservatoryFrame;
  selectedId: ObservatoryBodyId | null;
  onSelect: (id: ObservatoryBodyId) => void;
  onHud?: (labels: ObservatoryHudLabel[], fps: number, simIso?: string) => void;
  dateIso: string;
  includeOuter: boolean;
  trailEpoch: number;
  viewReset: number;
  onSimClock?: (iso: string) => void;
  reducedMotion: boolean;
}) {
  const groupMap = useRef(new Map<ObservatoryBodyId, Group>());
  const trails = useRef(new Map<ObservatoryBodyId, TrailBuf>());
  const bodiesRef = useRef(bodies);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const rings = useMemo(() => {
    if (frame !== "heliocentric") return [];
    const seen = new Set<number>();
    const out: number[] = [];
    for (const b of bodies) {
      if (b.id === "sun" || b.id === "moon") continue;
      const r = Math.hypot(b.x, b.z);
      const key = Math.round(r * 8);
      if (seen.has(key) || r < 0.4) continue;
      seen.add(key);
      out.push(r);
    }
    return out;
  }, [bodies, frame]);

  const [autoRotate, setAutoRotate] = useState(true);
  const idleTimer = useRef<number>(0);

  useEffect(() => {
    const canvas = document.querySelector("[data-observatory-canvas] canvas");
    if (!(canvas instanceof HTMLElement)) return;
    const stop = () => {
      setAutoRotate(false);
      window.clearTimeout(idleTimer.current);
    };
    const resume = () => {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setAutoRotate(true), 2600);
    };
    canvas.addEventListener("pointerdown", stop);
    canvas.addEventListener("pointerup", resume);
    canvas.addEventListener("pointerleave", resume);
    canvas.addEventListener("wheel", stop, { passive: true });
    canvas.addEventListener("wheel", resume, { passive: true });
    return () => {
      canvas.removeEventListener("pointerdown", stop);
      canvas.removeEventListener("pointerup", resume);
      canvas.removeEventListener("pointerleave", resume);
      canvas.removeEventListener("wheel", stop);
      canvas.removeEventListener("wheel", resume);
      window.clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <>
      <color attach="background" args={["#0b0f1f"]} />
      <fog attach="fog" args={["#0b0f1f", 32, 58]} />
      <ambientLight intensity={0.22} />
      <pointLight
        position={[0, 0, 0]}
        intensity={frame === "heliocentric" ? 2.4 : 1.1}
        color="#ffc857"
        distance={40}
      />
      <hemisphereLight args={["#6c3cff", "#0b0f1f", 0.35]} />
      <Stars
        radius={60}
        depth={28}
        count={900}
        factor={2.1}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.45}
      />
      <TwinklingStars reduced={reducedMotion} />
      {rings.map((r) => (
        <OrbitRing key={r.toFixed(3)} radius={r} />
      ))}
      {bodies.map((b) =>
        b.id === originId(frame) ? null : (
          <OrbitTrail key={`trail-${b.id}`} id={b.id} trails={trails} />
        )
      )}
      {bodies.map((b) => (
        <PlanetMesh
          key={b.id}
          body={b}
          selected={selectedId === b.id}
          onSelect={onSelect}
          groupMap={groupMap}
        />
      ))}
      <SimulationDriver
        dateIso={dateIso}
        frame={frame}
        includeOuter={includeOuter}
        trailEpoch={trailEpoch}
        groupMap={groupMap}
        trails={trails}
        bodiesRef={bodiesRef}
        onSimClock={onSimClock}
      />
      <CameraDirector
        selectedId={selectedId}
        viewReset={viewReset}
        reduced={reducedMotion}
        groupMap={groupMap}
        controlsRef={controlsRef}
      />
      <PerfAndHud bodiesRef={bodiesRef} onHud={onHud} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={1.05}
        maxDistance={42}
        enablePan
        autoRotate={!reducedMotion && autoRotate}
        autoRotateSpeed={0.22}
      />
    </>
  );
}

export default function ObservatoryCanvas({
  dateIso,
  frame,
  includeOuter,
  selectedId,
  onSelect,
  onHud,
  trailEpoch,
  viewReset,
  onSimClock,
}: {
  dateIso: string;
  frame: ObservatoryFrame;
  includeOuter: boolean;
  selectedId: ObservatoryBodyId | null;
  onSelect: (id: ObservatoryBodyId) => void;
  onHud?: (labels: ObservatoryHudLabel[], fps: number, simIso?: string) => void;
  trailEpoch: number;
  viewReset: number;
  onSimClock?: (iso: string) => void;
}) {
  const bodies = useMemo(() => {
    const date = new Date(dateIso);
    const instant = Number.isNaN(date.getTime()) ? new Date() : date;
    return queryObservatoryScene(instant, frame, includeOuter);
  }, [dateIso, frame, includeOuter]);

  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 7.5, 18], fov: 42, near: 0.1, far: 120 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ touchAction: "none", width: "100%", height: "100%" }}
    >
      <SceneContent
        bodies={bodies}
        frame={frame}
        selectedId={selectedId}
        onSelect={onSelect}
        onHud={onHud}
        dateIso={dateIso}
        includeOuter={includeOuter}
        trailEpoch={trailEpoch}
        viewReset={viewReset}
        onSimClock={onSimClock}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
