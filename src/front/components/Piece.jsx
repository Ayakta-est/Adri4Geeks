
import * as THREE from "three";
import { path } from "../data/path.js";

export const createPiece = (index, color = 0xffff00) => {
  const geo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 32);
  geo.translate(0, 0.2, 0);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color }));

  const [x, z] = path[index].pos;  // tablero X-Z
  mesh.position.set(x, 0.8, z);
  return mesh;
};
