import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createCompactCar } from "./CompactCar";
import { CarProfile } from "@phosphor-icons/react";

export default function CarModel({ driver }: { driver: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const wake = useRef<() => void>(() => {});
  const baseAngle = useRef(driver ? 0.35 : 0.9);
  const target = useRef(driver ? 0.35 : 0.9);
  const [state, setState] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  useEffect(() => {
    baseAngle.current = driver ? 0.35 : 0.9;
    target.current = baseAngle.current;
    wake.current();
  }, [driver]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      const fallbackTimer = window.setTimeout(() => setState("fallback"), 0);
      return () => window.clearTimeout(fallbackTimer);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x0d1321, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "Compacto tridimensional com carroceria arredondada e vidros escuros",
    );
    renderer.domElement.setAttribute("role", "img");
    const scene = new THREE.Scene();
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    camera.position.set(5, 2.6, 6);
    camera.lookAt(0, 0.7, 0);
    scene.add(new THREE.HemisphereLight(0xf0ebd8, 0x3e5c76, 1.3));
    const sun = new THREE.DirectionalLight(0xf0ebd8, 2.5);
    sun.position.set(3, 7, 5);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x748cab, 2);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    const group = new THREE.Group();
    scene.add(group);
    let disposed = false,
      visible = false,
      frame = 0,
      previous = 0;
    const disposeScene = (root: THREE.Object3D) =>
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material];
          mats.forEach((m: THREE.MeshStandardMaterial) => {
            m.map?.dispose();
            m.dispose();
          });
        }
      });
    const compact = createCompactCar();
    group.add(compact);
    group.rotation.y = target.current;
    const readyTimer = window.setTimeout(() => setState("ready"), 0);
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    const renderFrame = (now = 0) => {
      if (disposed) return;
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      group.rotation.y +=
        (target.current - group.rotation.y) * (1 - Math.exp(-dt * 5));
      renderer.render(scene, camera);
      if (
        visible &&
        !document.hidden &&
        Math.abs(target.current - group.rotation.y) > 0.0001
      )
        frame = requestAnimationFrame(renderFrame);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden) {
        previous = performance.now();
        frame = requestAnimationFrame(renderFrame);
      }
    };
    wake.current = start;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        start();
      },
      { rootMargin: "100px" },
    );
    visibility.observe(container);
    document.addEventListener("visibilitychange", start);
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = container.getBoundingClientRect();
      target.current =
        baseAngle.current + ((e.clientX - r.left) / r.width - 0.5) * 0.6;
      start();
    };
    // Current role is reflected through target; pointer interaction only adds a slight inspection angle.
    container.addEventListener("pointermove", move);
    const leave = () => {
      target.current = baseAngle.current;
      start();
    };
    container.addEventListener("pointerleave", leave);
    const lost = (e: Event) => {
      e.preventDefault();
      setState("fallback");
      visible = false;
      cancelAnimationFrame(frame);
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      disposed = true;
      wake.current = () => {};
      container.removeEventListener("pointerleave", leave);
      window.clearTimeout(readyTimer);
      environment.dispose();
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", start);
      container.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeScene(scene);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);
  return (
    <div className={`car-model car-model--${state}`}>
      <div ref={host} className="car-canvas" />
      {state !== "ready" && (
        <div className="car-fallback" role="status">
          <CarProfile weight="duotone" size={150} />
          <span>
            {state === "loading"
              ? "Preparando o seu próximo encontro…"
              : "Um lugar no carro. Uma nova conexão."}
          </span>
        </div>
      )}
      <div className="car-ground" aria-hidden="true" />
    </div>
  );
}
