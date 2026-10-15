/* =========================================================================
   INTERACTIVE 3D PLANT (Three.js)
   Replaces the flat SVG plant in the Arduino soil-moisture simulator.
   - Drag to rotate, auto-rotates when idle
   - Smoothly morphs between 'healthy', 'moderate' and 'dry' states
   - Falls back to the original SVG automatically if WebGL is unavailable
   Public API: Plant3D.mount(el), Plant3D.setState(state), Plant3D.ready
   ========================================================================= */
const Plant3D = (() => {
  const api = { ready: false, mount, setState };
  if (typeof THREE === 'undefined') return api;

  // dryness 0 = healthy, 0.5 = moderate, 1 = dry
  const STATES = {
    healthy:  { d: 0,   glow: 0x10b981 },
    moderate: { d: 0.5, glow: 0xf59e0b },
    dry:      { d: 1,   glow: 0xef4444 }
  };
  const C = {
    leafA: [new THREE.Color('#10b981'), new THREE.Color('#84cc16'), new THREE.Color('#ca8a04')],
    leafB: [new THREE.Color('#34d399'), new THREE.Color('#65a30d'), new THREE.Color('#a16207')],
    stem:  [new THREE.Color('#22c55e'), new THREE.Color('#65a30d'), new THREE.Color('#a16207')],
    pot:   [new THREE.Color('#1e3a5f'), new THREE.Color('#92400e'), new THREE.Color('#78350f')],
    soil:  [new THREE.Color('#1b120c'), new THREE.Color('#4a3320'), new THREE.Color('#8b6b3a')]
  };
  // colour ramp helper: d 0..1 -> blend between 3 stops
  function ramp(stops, d, out) {
    if (d <= 0.5) return out.copy(stops[0]).lerp(stops[1], d / 0.5);
    return out.copy(stops[1]).lerp(stops[2], (d - 0.5) / 0.5);
  }

  let renderer, scene, camera, root, plant, stemMesh, stemMat, potMat, soilMat, rimMat;
  let leaves = [], bud, budMat, drops = [], dropMat, alertMat, glowLight, ring, ringMat;
  let container, raf = 0, last = 0;
  let cur = 0, target = 0, glowCol = new THREE.Color(STATES.healthy.glow), glowTarget = new THREE.Color(STATES.healthy.glow);
  let rotY = 0.5, rotVel = 0, dragging = false, lastX = 0, idleTimer = 0, builtD = -1;
  const tmp = new THREE.Color();
  const LEAF_U = [0.28, 0.42, 0.56, 0.7, 0.82];

  function curveFor(d) {
    const H = 2.4 * (1 - 0.25 * d);
    const b = 1.15 * d;
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(b * 0.1, H * 0.4, 0),
      new THREE.Vector3(b * 0.45, H * 0.75, 0),
      new THREE.Vector3(b * 1.0, H * 0.95 - d * 0.5, 0),
      new THREE.Vector3(b * 1.5, H * 0.9 - d * 1.15, 0)
    ]);
  }

  function leafGeometry() {
    const g = new THREE.SphereGeometry(1, 20, 12);
    g.translate(1, 0, 0); // base at origin, extends along +x
    return g;
  }

  function build() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 2.1, 6.2);
    camera.lookAt(0, 1.25, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6ea8ff, 0.5);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    glowLight = new THREE.PointLight(STATES.healthy.glow, 1.1, 9);
    glowLight.position.set(0, 2.4, 2);
    scene.add(glowLight);

    root = new THREE.Group();
    scene.add(root);

    // ---- Pot ----
    potMat = new THREE.MeshStandardMaterial({ color: C.pot[0], roughness: 0.55, metalness: 0.15 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.78, 0.95, 40), potMat);
    pot.position.y = -0.475;
    root.add(pot);
    rimMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.3 });
    const rimMesh = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.07, 14, 48), rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    root.add(rimMesh);
    soilMat = new THREE.MeshStandardMaterial({ color: C.soil[0], roughness: 1 });
    const soil = new THREE.Mesh(new THREE.CircleGeometry(1.0, 40), soilMat);
    soil.rotation.x = -Math.PI / 2;
    soil.position.y = -0.04;
    root.add(soil);

    // ---- Glow ring on the floor ----
    ringMat = new THREE.MeshBasicMaterial({ color: STATES.healthy.glow, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    ring = new THREE.Mesh(new THREE.RingGeometry(1.35, 1.55, 64), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.97;
    root.add(ring);

    // ---- Plant (stem + leaves + bud) ----
    plant = new THREE.Group();
    root.add(plant);
    stemMat = new THREE.MeshStandardMaterial({ color: C.stem[0], roughness: 0.6 });
    const lg = leafGeometry();
    const leafMatA = new THREE.MeshStandardMaterial({ color: C.leafA[0], roughness: 0.45, side: THREE.DoubleSide, emissive: 0x06382a, emissiveIntensity: 0.6 });
    const leafMatB = new THREE.MeshStandardMaterial({ color: C.leafB[0], roughness: 0.45, side: THREE.DoubleSide, emissive: 0x06382a, emissiveIntensity: 0.6 });
    LEAF_U.forEach((u, i) => {
      const holder = new THREE.Group();
      const mesh = new THREE.Mesh(lg, i % 2 ? leafMatB : leafMatA);
      mesh.scale.set(0.62 - i * 0.04, 0.06, 0.34 - i * 0.02);
      holder.add(mesh);
      holder.userData = { u, yaw: i * 2.4, mesh, base: 0.62 - i * 0.04 };
      plant.add(holder);
      leaves.push(holder);
    });
    budMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.4, emissive: 0x0a4a2a, emissiveIntensity: 0.7 });
    bud = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), budMat);
    bud.scale.set(0.8, 1.5, 0.8);
    plant.add(bud);
    leaves.mats = [leafMatA, leafMatB];

    // ---- Water droplets (healthy) / alert orbs (dry) ----
    dropMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0b6fa8, emissiveIntensity: 0.9, roughness: 0.1, transparent: true, opacity: 0.95 });
    alertMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.9 });
    const dg = new THREE.SphereGeometry(0.1, 14, 10);
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(dg, dropMat);
      m.userData = { phase: i * 1.6, r: 1.15 + (i % 2) * 0.3, h: 2.3 + i * 0.28 };
      scene.add(m);
      drops.push(m);
    }
    rebuildStem(0);
  }

  function rebuildStem(d) {
    builtD = d;
    const curve = curveFor(d);
    plant.userData.curve = curve;
    if (stemMesh) { stemMesh.geometry.dispose(); plant.remove(stemMesh); }
    const taper = 0.1;
    stemMesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, taper - d * 0.02, 10, false), stemMat);
    plant.add(stemMesh);
    leaves.forEach(h => {
      const p = curve.getPoint(h.userData.u);
      h.position.copy(p);
    });
    const end = curve.getPoint(1);
    bud.position.copy(end);
    const tan = curve.getTangent(1);
    bud.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
  }

  function applyColours(d) {
    ramp(C.stem, d, stemMat.color);
    ramp(C.pot, d, potMat.color);
    ramp(C.soil, d, soilMat.color);
    ramp(C.leafA, d, leaves.mats[0].color);
    ramp(C.leafB, d, leaves.mats[1].color);
    budMat.color.copy(leaves.mats[1].color);
    const em = 0.6 * (1 - d);
    leaves.mats[0].emissiveIntensity = em;
    leaves.mats[1].emissiveIntensity = em;
    budMat.emissiveIntensity = 0.7 * (1 - d);
    rimMat.color.setHex(d > 0.75 ? 0xb45309 : 0x0284c7);
    leaves.forEach(h => {
      const { mesh, yaw, base } = h.userData;
      h.rotation.y = yaw;
      mesh.rotation.z = THREE.MathUtils.lerp(0.75, -1.15, d);
      const s = THREE.MathUtils.lerp(1, 0.78, d);
      mesh.scale.set(base * s, 0.06, mesh.scale.z);
    });
    bud.scale.set(0.8 * (1 - d * 0.4), 1.5 * (1 - d * 0.5), 0.8 * (1 - d * 0.4));
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;

    // Ease toward target state
    if (Math.abs(cur - target) > 0.001) {
      cur += (target - cur) * Math.min(1, dt * 4);
      if (Math.abs(cur - builtD) > 0.01) rebuildStem(cur);
      applyColours(cur);
    }
    glowCol.lerp(glowTarget, Math.min(1, dt * 4));
    glowLight.color.copy(glowCol);
    ringMat.color.copy(glowCol);

    // Rotation: drag inertia + idle auto-spin
    if (!dragging) {
      idleTimer += dt;
      rotVel *= 0.93;
      rotY += rotVel + (idleTimer > 1.5 ? dt * 0.35 : 0);
    }
    root.rotation.y = rotY;

    // Gentle sway (less when wilted)
    const sway = Math.sin(t / 900) * 0.035 * (1 - cur * 0.8);
    plant.rotation.z = sway;

    // Droplets (healthy) / alert pulse (dry)
    const showDrops = cur < 0.35;
    const showAlert = cur > 0.8;
    drops.forEach((m, i) => {
      const u = m.userData;
      const a = t / 1100 + u.phase;
      if (showDrops) {
        m.visible = true;
        m.material = dropMat;
        m.position.set(Math.cos(a) * u.r, u.h - ((t / 700 + u.phase) % 1.4) * 0.7 + 0.5, Math.sin(a) * u.r);
        m.scale.setScalar(1);
      } else if (showAlert && i < 2) {
        m.visible = true;
        m.material = alertMat;
        const p = 0.8 + 0.4 * Math.sin(t / 220 + i);
        m.position.set(0.9, 3.0 + i * 0.4, 0);
        m.scale.setScalar(p * (i ? 0.7 : 1));
      } else {
        m.visible = false;
      }
    });
    ringMat.opacity = 0.25 + 0.15 * Math.sin(t / 500);

    renderer.render(scene, camera);
  }

  function resize() {
    if (!renderer || !container) return;
    const w = container.clientWidth || 240;
    const h = container.clientHeight || 220;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function bindPointer(el) {
    el.style.touchAction = 'pan-y';
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', e => {
      dragging = true; lastX = e.clientX; rotVel = 0; idleTimer = 0;
      el.setPointerCapture(e.pointerId); el.style.cursor = 'grabbing';
    });
    el.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - lastX; lastX = e.clientX;
      rotY += dx * 0.012; rotVel = dx * 0.012;
    });
    const end = e => { dragging = false; idleTimer = 0; el.style.cursor = 'grab'; };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  function mount(el) {
    if (!el || api.ready) return api.ready;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.warn('[Plant3D] WebGL unavailable, using SVG fallback.', e);
      return false;
    }
    container = el;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    build();
    el.innerHTML = '';
    el.appendChild(renderer.domElement);
    el.classList.add('plant-3d-active');
    bindPointer(renderer.domElement);
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(el); else window.addEventListener('resize', resize);
    api.ready = true;
    applyColours(cur);
    raf = requestAnimationFrame(frame);
    return true;
  }

  function setState(state) {
    const s = STATES[state] || STATES.healthy;
    target = s.d;
    glowTarget.setHex(s.glow);
  }

  return api;
})();
