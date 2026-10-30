import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/** Original unbranded compact, modeled for this landing. Dimensions are illustrative. */
export function createCompactCar() {
  const car = new THREE.Group();
  car.name = "unigo-compact";
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0x748cab,
    metalness: 0.58,
    roughness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x111e2e,
    metalness: 0.4,
    roughness: 0.13,
    clearcoat: 1,
  });
  const black = new THREE.MeshStandardMaterial({
    color: 0x101521,
    roughness: 0.75,
  });
  const tire = new THREE.MeshStandardMaterial({
    color: 0x11151c,
    roughness: 0.93,
  });
  const alloy = new THREE.MeshStandardMaterial({
    color: 0xb8c2cb,
    metalness: 0.9,
    roughness: 0.25,
  });
  const light = new THREE.MeshStandardMaterial({
    color: 0xf0ebd8,
    emissive: 0xf0ebd8,
    emissiveIntensity: 0.8,
    roughness: 0.15,
  });
  const rearLight = new THREE.MeshStandardMaterial({
    color: 0x8d3e42,
    emissive: 0x6a1822,
    emissiveIntensity: 0.5,
  });
  function mesh(
    g: THREE.BufferGeometry,
    m: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    car.add(o);
    return o;
  }
  function box(
    w: number,
    h: number,
    d: number,
    r: number,
    m: THREE.Material,
    x: number,
    y: number,
    z: number,
  ) {
    return mesh(new RoundedBoxGeometry(w, h, d, 4, r), m, x, y, z);
  }
  function panel(points: number[][], m: THREE.Material) {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points.flat(), 3),
    );
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    const o = mesh(g, m);
    o.material = m;
    return o;
  }
  const body = new THREE.Shape();
  body.moveTo(-1.88, 0.4);
  body.lineTo(-1.57, 0.4);
  body.bezierCurveTo(-1.57, 1.04, -0.67, 1.04, -0.67, 0.4);
  body.lineTo(0.67, 0.4);
  body.bezierCurveTo(0.67, 1.04, 1.57, 1.04, 1.57, 0.4);
  body.lineTo(1.89, 0.4);
  body.quadraticCurveTo(2.02, 0.6, 1.91, 0.87);
  body.quadraticCurveTo(1.72, 1.02, 1.05, 1.04);
  body.lineTo(-1.55, 1.04);
  body.quadraticCurveTo(-1.98, 1.0, -1.94, 0.78);
  body.lineTo(-1.88, 0.4);
  const bodyGeo = new THREE.ExtrudeGeometry(body, {
    depth: 1.5,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.055,
    bevelSegments: 5,
    steps: 1,
    curveSegments: 24,
  });
  bodyGeo.translate(0, 0, -0.75);
  mesh(bodyGeo, paint);
  const cabin = new THREE.Shape();
  cabin.moveTo(-1.43, 1.05);
  cabin.quadraticCurveTo(-1.24, 1.59, -0.88, 1.65);
  cabin.quadraticCurveTo(-0.15, 1.72, 0.38, 1.62);
  cabin.lineTo(1.02, 1.05);
  cabin.closePath();
  const cabinGeo = new THREE.ExtrudeGeometry(cabin, {
    depth: 1.25,
    bevelEnabled: true,
    bevelThickness: 0.075,
    bevelSize: 0.055,
    bevelSegments: 5,
    curveSegments: 20,
  });
  cabinGeo.translate(0, 0, -0.625);
  mesh(cabinGeo, paint);
  const sideGlass = glass.clone();
  sideGlass.side = THREE.DoubleSide;
  for (const s of [-1, 1]) {
    panel(
      [
        [-1.28, 1.12, s * 0.704],
        [-1.01, 1.55, s * 0.704],
        [-0.36, 1.59, s * 0.704],
        [-0.36, 1.12, s * 0.704],
      ],
      sideGlass,
    );
    panel(
      [
        [-0.28, 1.12, s * 0.704],
        [-0.28, 1.59, s * 0.704],
        [0.34, 1.54, s * 0.704],
        [0.84, 1.12, s * 0.704],
      ],
      sideGlass,
    );
    box(0.23, 0.045, 0.025, 0.015, alloy, -0.53, 0.98, s * 0.82);
    box(0.23, 0.045, 0.025, 0.015, alloy, 0.45, 0.98, s * 0.82);
    box(2.2, 0.045, 0.045, 0.018, black, 0, 0.41, s * 0.79);
    const seam = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.3, 0.46, s * 0.814),
      new THREE.Vector3(-0.3, 1.06, s * 0.814),
    ]);
    car.add(
      new THREE.Line(seam, new THREE.LineBasicMaterial({ color: 0x3e5c76 })),
    );
    box(0.25, 0.13, 0.22, 0.055, paint, 0.71, 1.15, s * 0.83);
  }
  panel(
    [
      [0.49, 1.71, -0.56],
      [0.49, 1.71, 0.56],
      [1.13, 1.12, 0.65],
      [1.13, 1.12, -0.65],
    ],
    sideGlass,
  );
  panel(
    [
      [-1.47, 1.08, 0.57],
      [-1.47, 1.08, -0.57],
      [-1.03, 1.61, -0.54],
      [-1.03, 1.61, 0.54],
    ],
    sideGlass,
  );
  // Detailed wheels: rubber sidewall, alloy barrel and five double spokes.
  for (const x of [-1.12, 1.12])
    for (const s of [-1, 1]) {
      const z = s * 0.79;
      const rubber = mesh(
        new THREE.CylinderGeometry(0.39, 0.39, 0.22, 48),
        tire,
        x,
        0.4,
        z,
      );
      rubber.rotation.x = Math.PI / 2;
      const rim = mesh(
        new THREE.CylinderGeometry(0.265, 0.265, 0.235, 48),
        black,
        x,
        0.4,
        z,
      );
      rim.rotation.x = Math.PI / 2;
      const edge = mesh(
        new THREE.TorusGeometry(0.267, 0.018, 8, 48),
        alloy,
        x,
        0.4,
        z + s * 0.123,
      );
      edge.rotation.z = 0.1;
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const spoke = box(
          0.035,
          0.23,
          0.018,
          0.008,
          alloy,
          x + Math.sin(angle) * 0.125,
          0.4 + Math.cos(angle) * 0.125,
          z + s * 0.135,
        );
        spoke.rotation.z = -angle;
      }
      mesh(
        new THREE.SphereGeometry(0.068, 16, 12),
        alloy,
        x,
        0.4,
        z + s * 0.143,
      );
    }
  for (const s of [-1, 1]) {
    const head = box(0.075, 0.095, 0.4, 0.035, light, 1.96, 0.81, s * 0.5);
    head.rotation.y = s * 0.07;
    box(0.065, 0.105, 0.34, 0.03, rearLight, -1.96, 0.86, s * 0.5);
  }
  box(0.06, 0.18, 0.89, 0.05, black, 1.98, 0.52, 0);
  box(0.065, 0.085, 0.38, 0.02, alloy, 2.015, 0.59, 0);
  box(0.05, 0.1, 0.45, 0.02, black, -1.97, 0.59, 0);
  box(0.045, 0.08, 1.15, 0.025, black, -1.96, 0.42, 0);
  // Fine bonnet crease and roof antenna, without manufacturer badges.
  const antenna = mesh(
    new THREE.ConeGeometry(0.032, 0.16, 12),
    black,
    -0.79,
    1.78,
    0,
  );
  antenna.rotation.z = -0.2;
  car.position.y = -0.02;
  return car;
}
