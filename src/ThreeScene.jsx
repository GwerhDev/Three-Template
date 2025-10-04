import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import BasicCharacterControllerProxy from './app/components/three/BasicCharacterControllerProxy';
import BasicCharacterController from './app/components/three/BasicCharacterController';

const ThreeScene = forwardRef((props, ref) => {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);

  useImperativeHandle(ref, () => ({    loadCharacter(characterFile) {
      if (controlsRef.current) {
        controlsRef.current._LoadModels(characterFile);
      }
    }
  }));

  useEffect(() => {
    const mount = mountRef.current;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight; // Use window.innerWidth / window.innerHeight for correct aspect ratio
    const near = 1.0;
    const far = 1000.0;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 15, -20);

    const scene = new THREE.Scene();

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(-100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 50;
    light.shadow.camera.right = -50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    scene.add(light);

    light = new THREE.AmbientLight(0xFFFFFF, 0.25);
    scene.add(light);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.target.set(0, 10, 0);
    orbitControls.update();

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x808080,
          }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    const params = {
      camera: camera,
      scene: scene,
    }
    const controls = new BasicCharacterController(params);
    controlsRef.current = controls;

    let previousRAF = null;

    const raf = (t) => {
      if (previousRAF === null) {
        previousRAF = t;
      }

      renderer.render(scene, camera);
      step(t - previousRAF);
      previousRAF = t;
      requestAnimationFrame(raf);
    }
    
    const step = (timeElapsed) => {
      const timeElapsedS = timeElapsed * 0.001;
      controls.Update(timeElapsedS);
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    raf(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
    </div>
  );
});

export default ThreeScene;