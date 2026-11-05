'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

const BG_FRAG = `precision highp float;varying vec2 vUv;uniform float uTime,uTheme;uniform vec2 uRes;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
void main(){vec2 p=(vUv-.5)*vec2(uRes.x/uRes.y,1.);float t=uTime*.05;vec2 q=p*1.3;
  vec2 w=vec2(fbm(q+vec2(0.,t)),fbm(q+vec2(5.2,1.3)-t));float f=fbm(q+2.2*w+t);
  vec3 A=mix(vec3(0.,.12,.40),vec3(.72,.86,.94),uTheme),B=mix(vec3(.2,.34,.68),vec3(.88,.95,.985),uTheme),C=mix(vec3(.5,.6,.86),vec3(.6,.79,.92),uTheme);
  vec3 col=mix(A,B,smoothstep(.25,.75,f));col=mix(col,C,smoothstep(.55,.95,f)*.8);
  col=mix(col,A*.7,(1.-uTheme)*.5*(1.-smoothstep(.2,1.3,length(p+vec2(.45,.45)))));
  col+=(h(vUv*uRes+uTime)-.5)*.025;gl_FragColor=vec4(col,1.);}`;

// Full-screen three.js scene: fluid background + beaded chains over a perforated plate.
export default function Scene() {
  const canvasRef = useRef(null);
  const tagsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current, tagsHost = tagsRef.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = () => innerWidth < 820;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (e) { console.warn('WebGL unavailable', e); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.autoClear = false;

    const secs = [...document.querySelectorAll('section[data-pose]')];
    const processEl = document.getElementById('process');
    let pP = 0;
    const onScroll = () => { pP = clamp((scrollY - processEl.offsetTop) / (processEl.offsetHeight - innerHeight)); };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // background
    const bgS = new THREE.Scene(), bgC = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const bu = { uTime: { value: 0 }, uTheme: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } };
    bgS.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      uniforms: bu, depthTest: false,
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
      fragmentShader: BG_FRAG,
    })));

    // scene + environment
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, .1, 60);
    cam.position.set(0, .6, 11); cam.lookAt(0, 0, 0);
    const pm = new THREE.PMREMGenerator(renderer);
    const es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), new THREE.MeshBasicMaterial({ color: 0x8fb4ee, side: THREE.BackSide })));
    [[-8, 8, 8, 6], [10, 3, 6, 4], [0, -9, 4, 2.5]].forEach(([x, y, z, b]) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(8, 5), new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(b), side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m);
    });
    scene.environment = pm.fromScene(es, .03).texture;
    scene.add(new THREE.DirectionalLight(0xffffff, 1.2));

    // chains
    const K = mobile() ? 8 : 14, NB = 20, G = new THREE.Group(); scene.add(G);
    const beadMat = new THREE.MeshPhysicalMaterial({ roughness: .18, clearcoat: 1, iridescence: .6, iridescenceIOR: 1.5, envMapIntensity: 1.5, metalness: .05 });
    const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 24, 24), beadMat, K * NB);
    const linkMat = new THREE.MeshStandardMaterial({ color: 0xd7ecff, roughness: .4, transparent: true, opacity: .55, envMapIntensity: 1 });
    const links = new THREE.InstancedMesh(new THREE.CylinderGeometry(.018, .018, 1, 8), linkMat, K * (NB - 1));
    G.add(beads, links);
    const pal = ['#aee4ff', '#ffffff', '#7fb0ff', '#d5e8f0', '#4f78d0', '#bfe9ff'].map(c => new THREE.Color(c));
    const chains = [];
    for (let c = 0; c < K; c++) {
      const a = Math.random() * 6.28, r = 1.2 + Math.random() * 2.4;
      chains.push({ rx: Math.cos(a) * r, rz: Math.sin(a) * r * .6, gx: (c % 5 - 2) * .95, gz: (Math.floor(c / 5) - 1) * .95, ph: Math.random() * 6.28, turns: 2.5 + Math.random() * 1.5 });
      for (let i = 0; i < NB; i++) beads.setColorAt(c * NB + i, pal[(i * 3 + c) % pal.length]);
    }
    const ringM = new THREE.MeshStandardMaterial({ color: 0xd9ecff, roughness: .35, transparent: true, opacity: .7 });
    const rings = new THREE.InstancedMesh(new THREE.TorusGeometry(.22, .035, 8, 28), ringM, 121);
    const mm = new THREE.Matrix4();
    for (let i = 0; i < 121; i++) {
      mm.compose(new THREE.Vector3((i % 11 - 5) * .72, -1.65, (Math.floor(i / 11) - 5) * .72), new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), new THREE.Vector3(1, 1, 1));
      rings.setMatrixAt(i, mm);
    }
    G.add(rings);

    // floating tags
    const names = ['unit 04', 'strand B', 'unit 11', 'read 07', 'strand D', 'unit 02'];
    const tagIdx = [[0, 8], [3, 14], [5, 5], [7, 17], [9, 10], [11, 3]];
    const tagEls = names.slice(0, Math.min(names.length, K)).map(n => {
      const d = document.createElement('div'); d.className = 'tag'; d.innerHTML = `<i></i>${n}`; tagsHost.appendChild(d); return d;
    });

    // poses: x y scale shape  (desktop / mobile)
    // rows are indexed by each section's data-pose id; 5 and 6 park the graphic off-screen behind text-heavy sections
    const T = [[.6, -1.2, 1.35, .95], [3.3, 0, .85, 1], [3.5, 0, .6, 0], [0, -3.7, .6, 0], [0, -3.4, .55, 0], [0, -7, 1, .95], [0, -7, 1, .95]];
    T[1] = [0, -7, 1, .95]; // the Method section has its own stage, so park the hero graphic off-screen
    T[2] = [0, -7, 1, .95]; // About uses its own molecule diagram, so keep the strands out of the way
    T[4] = [0, -7, 1, .95]; // Contact + footer have their own layouts, so the strands stay out of their text
    const TM = [[0, -.4, .75, .95], [0, 1.4, .8, 1], [0, 2.4, .5, 0], [0, 2.6, .5, 0], [0, 2.4, .6, 0], [0, -7, .8, .95], [0, -7, .8, .95]];
    TM[1] = [0, -7, .8, .95]; TM[2] = [0, -7, .8, .95]; TM[4] = [0, -7, .8, .95];
    const THEME = [0, 0, 1, 0, 0, 0, 1];
    const P = [0, 0, 1, .95, 0], C = [.6, -1.2, 1.35, .95, 0];
    const stepTbl = [[0, 0, 0], [1, 0, 0], [1, 0, 1], [1, 1, 0]];
    const S = { e: 0, al: 0, pl: 0 };
    const getPose = () => {
      const Tb = mobile() ? TM : T, H = innerHeight, y = scrollY + H * .5;
      let i = 0; secs.forEach((s, k) => { if (s.offsetTop <= y) i = k; });
      const id = k => +secs[k].dataset.pose, cid = id(i), nid = secs[i + 1] ? id(i + 1) : cid;
      const nx = secs[i + 1], a = Tb[cid], b = Tb[nid];
      const e = nx ? ease(clamp((y - (nx.offsetTop - H * .4)) / (H * .4))) : 0;
      for (let k = 0; k < 4; k++) P[k] = lerp(a[k], b[k], e);
      P[4] = lerp(THEME[cid], THEME[nid], e);
      const sp = clamp(pP * 4), si = Math.min(3, Math.floor(sp)), sj = Math.min(3, si + 1), f = ease(clamp((sp - si - .4) / .6));
      const tgt = [0, 1, 2].map(k => lerp(stepTbl[si][k], stepTbl[sj][k], si === 3 ? 0 : f));
      const base = +secs[i].dataset.pose === 0 ? [0, 0, 0] : +secs[i].dataset.pose === 1 ? tgt : [1, 1, 0];
      S.e += (base[0] - S.e) * .05; S.al += (base[1] - S.al) * .05; S.pl += (base[2] - S.pl) * .06;
    };

    const resize = () => { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); bu.uRes.value.set(innerWidth, innerHeight); };
    addEventListener('resize', resize); resize();

    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3();
    const pos = Array.from({ length: K * NB }, () => new THREE.Vector3());
    const colA = new THREE.Color(), colB = new THREE.Color();
    const clock = new THREE.Clock();
    let raf = 0, disposed = false;

    const frame = () => {
      if (disposed) return;
      const t = reduce ? 3 : clock.getElapsedTime();
      getPose(); for (let i = 0; i < 5; i++) C[i] += (P[i] - C[i]) * (reduce ? 1 : .09);
      G.position.set(C[0], C[1], 0); G.scale.setScalar(C[2]); G.rotation.y = t * .1 + scrollY * .0008;
      const e = S.e, al = S.al, H = 3.2 * (.5 + .5 * e);
      for (let c = 0; c < K; c++) {
        const ch = chains[c], bx = lerp(ch.rx, ch.gx, al), bz = lerp(ch.rz, ch.gz, al);
        for (let i = 0; i < NB; i++) {
          const u = i / (NB - 1), a = u * ch.turns * 6.283 * (1 - .7 * e - .3 * al) + ch.ph + t * .3 * (1 - al);
          const r = (.55 * (1 - .8 * e) + .1) * (1 - .7 * al) * (.6 + Math.sin(u * 3 + ch.ph) * .4);
          const p = pos[c * NB + i];
          p.set(bx + Math.cos(a) * r, -1.6 + u * H + Math.sin(t * .8 + ch.ph + u * 4) * .05 * (1 - al), bz + Math.sin(a) * r);
          const pulse = 1 + S.pl * 1.1 * Math.pow(Math.max(0, Math.sin(i * .55 - t * 3 + c * .7)), 4);
          const s = (.075 + (i % 3) * .018) * pulse;
          m4.compose(p, q.identity(), sc.set(s, s, s)); beads.setMatrixAt(c * NB + i, m4);
        }
        for (let i = 0; i < NB - 1; i++) {
          const A = pos[c * NB + i], B = pos[c * NB + i + 1], len = A.distanceTo(B);
          v1.copy(A).add(B).multiplyScalar(.5); v2.copy(B).sub(A).normalize(); q.setFromUnitVectors(up, v2);
          m4.compose(v1, q, sc.set(1, len, 1)); links.setMatrixAt(c * (NB - 1) + i, m4);
        }
      }
      beads.instanceMatrix.needsUpdate = true; links.instanceMatrix.needsUpdate = true;
      const hideTags = C[4] > .5 || scrollY > processEl.offsetTop + processEl.offsetHeight - innerHeight;
      tagEls.forEach((el, k) => {
        const [c, i] = tagIdx[k]; if (c >= K) return;
        tmp.copy(pos[c * NB + i]); G.localToWorld(tmp); tmp.project(cam);
        el.style.transform = `translate(${(tmp.x * .5 + .5) * innerWidth + 12}px,${(-tmp.y * .5 + .5) * innerHeight - 10}px)`;
        el.style.opacity = hideTags ? 0 : 1;
      });
      bu.uTheme.value = C[4]; bu.uTime.value = t; document.body.classList.toggle('light', C[4] > .5);
      beadMat.color.set(0xffffff).lerp(colA.set('#2a4f9c'), C[4] * .8);
      linkMat.color.set(0xd7ecff).lerp(colB.set('#204287'), C[4]);
      ringM.color.set(0xd9ecff).lerp(colB.set('#204287'), C[4]);
      renderer.clear(); renderer.render(bgS, bgC); renderer.clearDepth(); renderer.render(scene, cam);
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      disposed = true; cancelAnimationFrame(raf);
      removeEventListener('scroll', onScroll); removeEventListener('resize', resize);
      tagEls.forEach(el => el.remove());
      document.body.classList.remove('light');
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <canvas id="stage" ref={canvasRef} aria-hidden="true" />
      <div id="tags" ref={tagsRef} aria-hidden="true" />
    </>
  );
}
