'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = t => t * t * (3 - 2 * t);
const backOut = t => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

// Three different molecules. Each returns atoms [{p:[x,y,z], r, c}] and bonds [[i,j]].
function build(kind) {
  const atoms = [], bonds = [];
  const add = (p, r, c) => { atoms.push({ p: new THREE.Vector3(...p), r, c }); return atoms.length - 1; };
  if (kind === 'ring') {
    // a six-membered ring with three substituent atoms
    const ids = [];
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; ids.push(add([Math.cos(a) * 1, Math.sin(a) * 1, 0], .2, k % 2 ? '#5f98f2' : '#9fdcff')); }
    for (let k = 0; k < 6; k++) bonds.push([ids[k], ids[(k + 1) % 6]]);
    [0, 2, 4].forEach(k => { const a = k * Math.PI / 3, s = add([Math.cos(a) * 1.85, Math.sin(a) * 1.85, (k - 2) * .12], .13, '#f2faff'); bonds.push([ids[k], s]); });
  } else if (kind === 'helix') {
    // a small double helix with rungs
    const n = 8, h = 3.3, A = [], B = [];
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1), ang = u * Math.PI * 2.4, y = (u - .5) * h;
      A.push(add([Math.cos(ang) * .72, y, Math.sin(ang) * .72], .17, '#7fb0ff'));
      B.push(add([Math.cos(ang + Math.PI) * .72, y, Math.sin(ang + Math.PI) * .72], .17, '#bfe9ff'));
    }
    for (let i = 0; i < n - 1; i++) { bonds.push([A[i], A[i + 1]]); bonds.push([B[i], B[i + 1]]); }
    for (let i = 0; i < n; i += 1) if (i % 2 === 0) bonds.push([A[i], B[i]]);
  } else {
    // a branching molecule: centre, four arms, two arms fork again
    const c = add([0, 0, 0], .3, '#ffffff');
    const dirs = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(d => new THREE.Vector3(...d).normalize());
    dirs.forEach((d, k) => {
      const p = d.clone().multiplyScalar(1.15), a = add([p.x, p.y, p.z], .2, '#5f98f2'); bonds.push([c, a]);
      if (k < 2) {
        const perp = new THREE.Vector3().crossVectors(d, new THREE.Vector3(0, 1, .3)).normalize();
        [-1, 1].forEach(s => { const q = p.clone().add(d.clone().multiplyScalar(.6)).add(perp.clone().multiplyScalar(.5 * s)); const e = add([q.x, q.y, q.z], .13, '#8fe0e6'); bonds.push([a, e]); });
      }
    });
  }
  return { atoms, bonds };
}

// A small three.js molecule that assembles from scattered atoms as its card scrolls into view.
export default function Molecule({ kind = 'ring', spin = 1, zoom = 1 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current, host = canvas.parentElement, card = canvas.closest('.gcard');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(34, 1, .1, 30); cam.position.set(0, 0, 7 / zoom);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
    const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(-3, 4, 5); scene.add(key);

    const { atoms, bonds } = build(kind);
    const group = new THREE.Group(); scene.add(group);
    const sphereG = new THREE.SphereGeometry(1, 28, 28);
    const meshes = atoms.map((a, i) => {
      const m = new THREE.Mesh(sphereG, new THREE.MeshPhysicalMaterial({ color: a.c, roughness: .16, clearcoat: 1, clearcoatRoughness: .06, emissive: new THREE.Color(a.c), emissiveIntensity: .12, envMapIntensity: 1.3 }));
      m.scale.setScalar(a.r); group.add(m);
      // scattered start position, unique per atom
      const s = new THREE.Vector3(Math.sin(i * 12.9) * 4, Math.cos(i * 7.3) * 3, Math.sin(i * 3.1) * 3);
      m.userData = { start: s, i };
      return m;
    });
    const bondMat = new THREE.MeshStandardMaterial({ color: 0xd7ecff, roughness: .35, transparent: true, opacity: .8 });
    const bondG = new THREE.CylinderGeometry(.045, .045, 1, 8);
    const bondMeshes = bonds.map(() => { const m = new THREE.Mesh(bondG, bondMat.clone()); group.add(m); return m; });
    const up = new THREE.Vector3(0, 1, 0), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), q = new THREE.Quaternion(), cur = atoms.map(() => new THREE.Vector3());

    const resize = () => { const w = host.clientWidth || 200, h = host.clientHeight || 160; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    const ro = new ResizeObserver(resize); ro.observe(host); resize();

    let visible = true;
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { rootMargin: '100px' }); io.observe(host);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = e => { const r = host.getBoundingClientRect(); mouse.tx = ((e.clientX - r.left) / r.width - .5); mouse.ty = ((e.clientY - r.top) / r.height - .5); };
    host.addEventListener('pointermove', onMove); host.addEventListener('pointerleave', () => { mouse.tx = 0; mouse.ty = 0; });

    const clock = new THREE.Clock(); let raf = 0, disposed = false;
    const frame = () => {
      if (disposed) return; raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = reduce ? 1 : clock.getElapsedTime();
      const p = reduce ? 1 : clamp(parseFloat(card?.dataset.p ?? '1'));          // scroll progress of this card
      mouse.x += (mouse.tx - mouse.x) * .08; mouse.y += (mouse.ty - mouse.y) * .08;
      atoms.forEach((a, i) => {
        const n = atoms.length, local = clamp(p * 1.5 - (i / n) * .5);      // staggered assembly
        const k = backOut(smooth(local));
        cur[i].copy(meshes[i].userData.start).lerp(a.p, k);
        meshes[i].position.copy(cur[i]);
        meshes[i].scale.setScalar(a.r * (.4 + .6 * smooth(local)));
      });
      bonds.forEach(([i, j], b) => {
        const A = cur[i], B = cur[j], len = A.distanceTo(B), m = bondMeshes[b];
        v1.copy(A).add(B).multiplyScalar(.5); v2.copy(B).sub(A).normalize(); q.setFromUnitVectors(up, v2);
        m.position.copy(v1); m.quaternion.copy(q); m.scale.set(1, Math.max(len, .001), 1);
        m.material.opacity = .8 * smooth(clamp(p * 1.6 - .35));
      });
      // scroll-linked spin + gentle idle motion + pointer tilt
      group.rotation.y = (reduce ? .4 : scrollY * .0035 * spin + t * .25 * spin) + mouse.x * .8;
      group.rotation.x = .25 + Math.sin(t * .5) * .06 + mouse.y * .5;
      group.position.y = Math.sin(t * .8) * .06;
      const s = .78 + .22 * smooth(p); group.scale.setScalar(s);
      renderer.render(scene, cam);
    };
    frame();

    return () => { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); host.removeEventListener('pointermove', onMove); renderer.dispose(); };
  }, [kind, spin, zoom]);
  return <canvas ref={canvasRef} aria-hidden="true" />;
}
