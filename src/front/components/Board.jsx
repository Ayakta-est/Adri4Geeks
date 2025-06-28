import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { path } from "../data/path.js";   // ← mueve tu array ahí

const Board = forwardRef((_, ref) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    /* ---------- escena, cámara, renderer ---------- */
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -aspect * 5,
      aspect * 5,
       5,
      -5,
      0.1,
      100,
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableRotate  = false;
    controls.screenSpacePanning = true;

    /* -------------------- luces ------------------- */
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(10, 10, 10);
    scene.add(dir);

    scene.add(new THREE.AmbientLight(0x808080, 0.8));
    /* --------------- casillas --------------------- */
    const COLORS = {
      E: 0xffffff, P: 0x0a7025, A: 0xff4c4c,
      R: 0x6b3e00, M: 0x6b33a0, T: 0x1c4fa0,
    };

    const createTile = (x, z, color) => {
      const geo = new THREE.BoxGeometry(1, 0.5, 1);
      geo.translate(0, 0.5, 0);            // base en y = 0
      const mat  = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, 0, z);          // plano X-Z
      return mesh;
    };

    path.forEach(({ pos: [x, z], type }) =>
      scene.add(createTile(x, z, COLORS[type] ?? 0x888888)),
    );

    /* ---------------- animación ------------------- */
    const loop = () => {
      requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();

    /* -------------- resize handler ---------------- */
    const onResize = () => {
      const a = window.innerWidth / window.innerHeight;
      camera.left = -a * 5;
      camera.right =  a * 5;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  /* ---------- API pública para fichas ------------ */
  useImperativeHandle(ref, () => ({
    add:  (obj)        => sceneRef.current?.add(obj),
    move: (obj, x, z)  => obj.position.set(x, 1, z),
  }));

  return <div ref={mountRef} className="w-full h-screen" />;
});

export default Board;
