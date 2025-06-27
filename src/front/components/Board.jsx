import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Board = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    // CÁMARA ORTOGRÁFICA PARA 2.5D
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(
      -aspect * 5,
      aspect * 5,
      5,
      -5,
      0.1,
      100
    );
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // ajustes típicos
    controls.enableDamping = true;   // suaviza el movimiento
    controls.dampingFactor = 0.1;
    controls.zoomSpeed = 0.6;
    controls.enableRotate = false;   // isométrico fijo, solo pan+zoom
    controls.target.set(0, 0, 0);    // mira al centro del tablero
    controls.update();

    // LUZ
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // FUNCIONES PARA CREAR TABLERO
   const createTile = (x, z, color = 0xcccccc) => {
      // cubo de 1×1×1
      const geometry = new THREE.BoxGeometry(1, 0.3, 1);
      // lo “bajamos” medio cubo para que la base quede en y = 0
      geometry.translate(0, 0.5, 0);

      const material = new THREE.MeshLambertMaterial({ color });
      const tile = new THREE.Mesh(geometry, material);
      tile.position.set(x, 0, z);        //  ⬅  plano X-Z, altura en Y
      return tile;
    };

    const COLORS = {
      E: 0xffffff,   // entrada
      P: 0x0a7025,   // pregunta
      A: 0xff4c4c,   // comodín bueno
      R: 0x6b3e00,   // reto
      M: 0x6b33a0,   // mala
      T: 0x1c4fa0    // pase atajo
    };

    // 2. Lista de casillas según tu esquema
    //    posición en x,y y tipo (E,P,A,R,M,T)
    //    aquí un ejemplo de las primeras 5
    const casillas = [
      { pos: [0, 0], type: "E" },  // entrada
      { pos: [1, 0], type: "M" },
      { pos: [2, 0], type: "P" },
      { pos: [3, 0], type: "P" },
      { pos: [3, 1], type: "A" },
      { pos: [4, 1], type: "R" },
      { pos: [5, 1], type: "P" },
      { pos: [6, 1], type: "T" },
      { pos: [7, 1], type: "P" },
      { pos: [7, 2], type: "A" },
      { pos: [8, 2], type: "P" },
      { pos: [9, 2], type: "R" },
      { pos: [10, 2], type: "A" },
      { pos: [11, 2], type: "R" },
      { pos: [12, 2], type: "P" },
      { pos: [13, 2], type: "M" },
      { pos: [7, 0], type: "P" },
      { pos: [7, 0], type: "R" },
      { pos: [8, 0], type: "M" },
      { pos: [9, 0], type: "P" },
      { pos: [10, 0], type: "R" },
      { pos: [11, 0], type: "P" },
      { pos: [12, 0], type: "M" },
    ];

    // 3. Renderiza cada casilla
    casillas.forEach(({ pos: [x, y], type }) => {
      const color = COLORS[type] || 0x888888;
      const tile = createTile(x, y, color);
      scene.add(tile);
    });

    // ANIMACIÓN
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();   // ← imprescindible si enableDamping=true
      renderer.render(scene, camera);
    };
    animate();

    // RESIZE
    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = -aspect * 5;
      camera.right = aspect * 5;
      camera.top = 5;
      camera.bottom = -5;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-screen" />;
};

export default Board;
