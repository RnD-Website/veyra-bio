'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const NB = 24, M = 6, N = NB * M, MAX_LINKS = 220;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Four close-up (micro) molecular scenes built from the same 144 atoms. Switching tab flows the atoms into the next one.
//  0 Gather: six ring molecules, each with a flexible tail, drawing together
//  1 Unfold: a double helix with rungs, turning slowly
//  2 Read:   one strand fills the view while a light scans along it
//  3 Align:  a lattice of linked rows receding in perspective
function layout(step) {
  const pos = [], sc = [], extra = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3(), p5 = new THREE.Vector3(), tmp = new THREE.Vector3();
  for (let k = 0; k < M; k++) {
    if (step === 0) {
      const ang = k * 2.399, rad = 1.0 + (k % 3) * .5;
      c.set(Math.cos(ang) * rad * 1.15, Math.sin(k * 1.7) * 1.1, Math.sin(ang) * rad - .3);
      a.set(Math.cos(k * 1.1), 0, Math.sin(k * 1.1)).normalize();
      b.set(-Math.sin(k * .9) * .4, 1, Math.cos(k * .9) * .4); b.addScaledVector(a, -a.dot(b)).normalize();
      n.crossVectors(a, b).normalize();
      d.copy(a).multiplyScalar(.6).addScaledVector(b, .5).addScaledVector(n, .6).normalize();
      p5.copy(c).addScaledVector(a, Math.cos(5 * Math.PI / 3) * .5).addScaledVector(b, Math.sin(5 * Math.PI / 3) * .5);
      extra.push([k * NB, k * NB + 5]); // ring closure
    }
    for (let i = 0; i < NB; i++) {
      const u = i / (NB - 1), big = i % 4 === 0;
      let p, s;
      if (step === 0) {
        if (i < 6) { const th = i * Math.PI / 3; tmp.copy(c).addScaledVector(a, Math.cos(th) * .5).addScaledVector(b, Math.sin(th) * .5); p = [tmp.x, tmp.y, tmp.z]; s = .13; }
        else { const t = (i - 6) / 17; tmp.copy(p5).addScaledVector(d, t * 2.2 + .15).addScaledVector(b, Math.sin(t * 7 + k) * .22 * (.3 + t)).addScaledVector(n, Math.cos(t * 7 + k) * .22 * (.3 + t)); p = [tmp.x, tmp.y, tmp.z]; s = .085 + (big ? .03 : 0); }
      } else if (step === 1) {
        if (k < 2) { const ang = u * Math.PI * 6 + k * Math.PI; p = [Math.cos(ang) * .85, (u - .5) * 4.6, Math.sin(ang) * .85]; s = .15 + (big ? .03 : 0); if (k === 0 && i % 2 === 0) extra.push([i, NB + i]); }
        else { p = [(k < 4 ? -4.5 - (k - 2) * .9 : 4.5 + (k - 4) * .9), (u - .5) * 5, -4 - (k % 2) * 1.5]; s = .08; }
      } else if (step === 2) {
        // one strand in a gentle S-curve so the whole thing stays in view while still filling the frame
        if (k === 0) { p = [(u - .5) * 5.4, Math.sin(u * Math.PI * 2) * .55, Math.cos(u * Math.PI * 2) * .5]; s = .105 + (big ? .025 : 0); }
        else { p = [(i - (NB - 1) / 2) * .4, (k - 3) * .95, -2.6 - k * .8]; s = .09; }
      } else {
        p = [(i - (NB - 1) / 2) * .2, (k - (M - 1) / 2) * .46, -k * .12]; s = .062 + (big ? .015 : 0);
        if (k < M - 1 && i % 3 === 0) extra.push([k * NB + i, (k + 1) * NB + i]);
      }
      pos.push(new THREE.Vector3(...p)); sc.push(s);
    }
  }
  // bounding extents of the beads that matter in this scene, used to frame the camera so nothing is cut off
  let hw = 0, hh = 0, zmax = 0;
  pos.forEach((p, b) => {
    const k = Math.floor(b / NB); if ((step === 2 && k > 0) || (step === 1 && k > 1)) return;
    const r = (step <= 1 ? Math.hypot(p.x, p.z) : Math.abs(p.x)) + sc[b];
    hw = Math.max(hw, r); hh = Math.max(hh, Math.abs(p.y) + sc[b]); zmax = Math.max(zmax, Math.abs(p.z));
  });
  return { pos, sc, extra, fit: { hw, hh, zmax } };
}

const CAM_Z = [6.6, 6.4, 5.6, 6.8];
const WORLD_X = [.4, 0, .8, .7];
const CHAIN_COL = ['#7fb0ff', '#aee4ff', '#5f98f2', '#bfe9ff', '#8fe0e6', '#a9b8ff'].map(c => new THREE.Color(c));

export default function MethodStage({ step = 0, frac = 0 }) {
  const canvasRef = useRef(null);
  const live = useRef({ step, frac });
  live.current.step = step; live.current.frac = frac;

  useEffect(() => {
    const canvas = canvasRef.current, host = canvas.parentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;

    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .1, 60); cam.position.set(0, 0, CAM_Z[0]);
    scene.fog = new THREE.Fog(new THREE.Color('#0a2a73'), 5, 12);
    scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
    const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(-3, 5, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x7fb0ff, 1.5); rim.position.set(5, 2, -4); scene.add(rim);

    const world = new THREE.Group(); scene.add(world);
    const beadMat = new THREE.MeshPhysicalMaterial({ roughness: .14, clearcoat: 1, clearcoatRoughness: .05, envMapIntensity: 1.3, emissive: new THREE.Color('#2b5cc4'), emissiveIntensity: .2 });
    const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 28, 28), beadMat, N);
    const bondMat = new THREE.MeshStandardMaterial({ color: 0xd7ecff, roughness: .4, transparent: true, opacity: .6 });
    const bondG = new THREE.CylinderGeometry(.02, .02, 1, 8);
    const bonds = new THREE.InstancedMesh(bondG, bondMat, M * (NB - 1));
    const links2 = new THREE.InstancedMesh(bondG, bondMat, MAX_LINKS); // step-specific extra bonds (ring closure, rungs, lattice)
    world.add(beads, bonds, links2);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xbfe9ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.34, .014, 10, 48), ringMat); ring.rotation.y = Math.PI / 2; world.add(ring);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x8fd3ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(.5, 24, 24), haloMat); world.add(halo);

    const dc = document.createElement('canvas'); dc.width = dc.height = 32;
    const dx = dc.getContext('2d'), dg = dx.createRadialGradient(16, 16, 0, 16, 16, 16); dg.addColorStop(0, 'rgba(255,255,255,.95)'); dg.addColorStop(1, 'rgba(255,255,255,0)'); dx.fillStyle = dg; dx.fillRect(0, 0, 32, 32);
    const DN = 90, dpos = new Float32Array(DN * 3), dseed = [];
    for (let i = 0; i < DN; i++) { dpos.set([(Math.random() - .5) * 14, (Math.random() - .5) * 8, (Math.random() - .5) * 8], i * 3); dseed.push(Math.random() * 6.28); }
    const dgeo = new THREE.BufferGeometry(); dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
    scene.add(new THREE.Points(dgeo, new THREE.PointsMaterial({ size: .08, map: new THREE.CanvasTexture(dc), transparent: true, depthWrite: false, opacity: .5 })));

    let tgt = layout(live.current.step);
    const pos = tgt.pos.map(v => v.clone()), scl = tgt.sc.slice();
    let lastStep = live.current.step, changeAt = 0;
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc3 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), tmpC = new THREE.Color(), white = new THREE.Color('#ffffff');
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);

    const resize = () => { const w = host.clientWidth || 800, h = host.clientHeight || 600; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
    const ro = new ResizeObserver(resize); ro.observe(host); resize();
    let visible = true; const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { rootMargin: '80px' }); io.observe(canvas);

    const setLink = (mesh, idx, A, B, f = 1) => {
      const len = A.distanceTo(B); v1.copy(A).add(B).multiplyScalar(.5); v2.copy(B).sub(A).normalize(); q.setFromUnitVectors(up, v2);
      m4.compose(v1, q, sc3.set(f, Math.max(len, .001), f)); mesh.setMatrixAt(idx, m4);
    };

    const clock = new THREE.Clock(); let raf = 0, disposed = false, rotY = 0, prevT = 0;
    const frame = () => {
      if (disposed) return; raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = reduce ? 4 : clock.getElapsedTime(), dt = Math.min(.05, t - prevT); prevT = t;
      const step = live.current.step;
      if (step !== lastStep) { lastStep = step; tgt = layout(step); changeAt = t; }

      // atoms flow to their new places, with a wave of delay along each chain
      for (let k = 0; k < M; k++) for (let i = 0; i < NB; i++) {
        const b = k * NB + i, delay = (i / NB) * .55 + k * .05;
        const rate = reduce ? 1 : (t - changeAt > delay ? 1 - Math.exp(-dt * 4.2) : 0), u = i / (NB - 1);
        let wx = 0, wy = 0, wz = 0;
        if (step === 0) { wx = Math.sin(t * .9 + k + u * 4) * .03; wy = Math.sin(t * .7 + i) * .03; }
        else if (step === 1) { wy = Math.sin(t * 1.2 + i * .5 + k) * .02; }
        else if (step === 2) { wy = (k === 0 ? Math.sin(t * 1.6 + i * .6) * .06 : Math.sin(t + i * .4 + k) * .08); }
        else { wz = Math.sin(t * 1.2 + i * .5 + k) * .05; }
        pos[b].x += (tgt.pos[b].x + wx - pos[b].x) * rate; pos[b].y += (tgt.pos[b].y + wy - pos[b].y) * rate; pos[b].z += (tgt.pos[b].z + wz - pos[b].z) * rate;
        scl[b] += (tgt.sc[b] - scl[b]) * rate;
      }

      // scanning light (Read) and settling wave (Align)
      const scanS = (t * 5) % (NB + 6) - 3;
      for (let k = 0; k < M; k++) for (let i = 0; i < NB; i++) {
        const b = k * NB + i; let w = 0;
        if (step === 2 && k === 0) w = Math.exp(-.5 * ((i - scanS) / 1.3) ** 2);
        else if (step === 3) w = Math.exp(-.5 * ((i - ((t * 7 + k * 3) % (NB + 8) - 4)) / 1.8) ** 2) * .8;
        else if (step === 1 && k < 2) w = Math.exp(-.5 * ((i - ((t * 4 + k * 5) % (NB + 6) - 3)) / 1.6) ** 2) * .5;
        tmpC.copy(CHAIN_COL[k]).lerp(white, (i % 4 === 0 ? .35 : 0) + w * .75);
        beads.setColorAt(b, tmpC);
        const s = scl[b] * (1 + w * .5);
        m4.compose(pos[b], q.identity(), sc3.set(s, s, s)); beads.setMatrixAt(b, m4);
      }
      beads.instanceColor.needsUpdate = true; beads.instanceMatrix.needsUpdate = true;
      for (let k = 0; k < M; k++) for (let i = 0; i < NB - 1; i++) setLink(bonds, k * (NB - 1) + i, pos[k * NB + i], pos[k * NB + i + 1]);
      bonds.instanceMatrix.needsUpdate = true;
      for (let e = 0; e < MAX_LINKS; e++) {
        const pr = tgt.extra[e];
        if (pr) setLink(links2, e, pos[pr[0]], pos[pr[1]], .8); else links2.setMatrixAt(e, zero);
      }
      links2.instanceMatrix.needsUpdate = true;

      // the scan ring rides along the curved strand, facing along it
      const on = step === 2 ? 1 : 0, si = clamp(scanS, 0, NB - 1.001), i0 = Math.floor(si), ff = si - i0;
      v1.copy(pos[i0]).lerp(pos[i0 + 1], ff); v2.copy(pos[i0 + 1]).sub(pos[i0]).normalize();
      ring.position.copy(v1); halo.position.copy(v1); ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v2);
      ringMat.opacity += (on * .85 - ringMat.opacity) * .12; haloMat.opacity += (on * .12 - haloMat.opacity) * .12;
      ring.scale.setScalar(1 + Math.sin(t * 6) * .06);

      const rTarget = step === 0 ? t * .25 : step === 1 ? t * .4 : step === 3 ? -.5 + Math.sin(t * .3) * .05 : 0;
      rotY += (rTarget - rotY) * .06; world.rotation.y = rotY;
      world.rotation.x += (([.12, 0, .06, .1][step]) - world.rotation.x) * .05;
      world.position.x += (0 - world.position.x) * .05;
      // frame the whole scene: pull the camera back just enough for it to fit the stage, whatever its shape
      const f = tgt.fit, tanH = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const zNeed = clamp(Math.max(f.hh / tanH, f.hw / (tanH * cam.aspect)) * 1.2 + f.zmax, 4.2, 18);
      cam.position.z += (zNeed - cam.position.z) * .05;
      scene.fog.near = cam.position.z - 1; scene.fog.far = cam.position.z + 7;
      const dp = dgeo.attributes.position.array;
      for (let i = 0; i < DN; i++) { dp[i * 3 + 1] += .003 + Math.sin(t * .4 + dseed[i]) * .001; if (dp[i * 3 + 1] > 4.5) dp[i * 3 + 1] = -4.5; }
      dgeo.attributes.position.needsUpdate = true;
      renderer.render(scene, cam);
    };
    frame();
    return () => { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); renderer.dispose(); };
  }, []);
  return <canvas ref={canvasRef} className="mstage" aria-hidden="true" />;
}
