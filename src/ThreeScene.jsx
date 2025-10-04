import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import BasicCharacterControllerProxy from './app/components/three/BasicCharacterControllerProxy';
import BasicCharacterController from './app/components/three/BasicCharacterController';

const ThreeScene = forwardRef((props, ref) => {
  const { onOpenDialogue, onCloseDialogue, isCharacterSelected, isCharacterMovementBlocked, toggleCharacterMovement, onShowInteractionOptions } = props;
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const targetCameraPosition = useRef(null);
  const targetOrbitControlsTarget = useRef(null);
  const isTrackingCharacter = useRef(false);
  const transitioning = useRef(false);
  const transitionStartTime = useRef(0);
  const transitionDuration = useRef(2000); // 2 seconds for orbital transition
  const initialCameraPosition = useRef(new THREE.Vector3());
  const initialOrbitControlsTarget = useRef(new THREE.Vector3());
  const characterPositionAtTransitionStart = useRef(new THREE.Vector3());
  const dummyCubeRef = useRef(null);

  useEffect(() => {
    if (isCharacterSelected && dummyCubeRef.current) {
      // Position the cube further away after character is loaded
      dummyCubeRef.current.position.set(0, 2.5, -30);
    } else if (!isCharacterSelected && dummyCubeRef.current) {
      // Hide the cube if no character is selected
      dummyCubeRef.current.position.set(1000, 1000, 1000);
    }
  }, [isCharacterSelected]);

  // Effect to control character movement based on prop
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.SetEnabled(!isCharacterMovementBlocked);
    }
  }, [isCharacterMovementBlocked]);

  useImperativeHandle(ref, () => ({    loadCharacter(characterFile, onLoadCallback) {
      if (controlsRef.current) {
        controlsRef.current._LoadModels(characterFile, onLoadCallback);
      }
    },
    moveCameraBehindCharacter(characterPosition, characterQuaternion) {
      const finalOffset = new THREE.Vector3(20, 20, -20); // Final following offset

      // Store initial camera state
      initialCameraPosition.current.copy(cameraRef.current.position);
      initialOrbitControlsTarget.current.copy(orbitControlsRef.current.target);
      characterPositionAtTransitionStart.current.copy(characterPosition);

      // Calculate final camera position and target
      finalOffset.applyQuaternion(characterQuaternion);
      const finalCameraPosition = characterPosition.clone().add(finalOffset);
      const finalOrbitControlsTarget = characterPosition.clone().add(new THREE.Vector3(0, 10, 0));

      // Set transition parameters
      targetCameraPosition.current = finalCameraPosition; // This will be the target for the orbital transition
      targetOrbitControlsTarget.current = finalOrbitControlsTarget; // This will be the target for the orbital transition
      transitionStartTime.current = performance.now();
      isTrackingCharacter.current = true;
      transitioning.current = true; // Set transitioning flag
    }
  }));

  useEffect(() => {
    if (isCharacterSelected && dummyCubeRef.current) {
      // Position the cube further away after character is loaded
      dummyCubeRef.current.position.set(0, 2.5, -30);
    } else if (!isCharacterSelected && dummyCubeRef.current) {
      // Hide the cube if no character is selected
      dummyCubeRef.current.position.set(1000, 1000, 1000);
    }
  }, [isCharacterSelected]);

  useImperativeHandle(ref, () => ({    loadCharacter(characterFile, onLoadCallback) {
      if (controlsRef.current) {
        controlsRef.current._LoadModels(characterFile, onLoadCallback);
      }
    },
    moveCameraBehindCharacter(characterPosition, characterQuaternion) {
      const finalOffset = new THREE.Vector3(20, 20, -20); // Final following offset

      // Store initial camera state
      initialCameraPosition.current.copy(cameraRef.current.position);
      initialOrbitControlsTarget.current.copy(orbitControlsRef.current.target);
      characterPositionAtTransitionStart.current.copy(characterPosition);

      // Calculate final camera position and target
      finalOffset.applyQuaternion(characterQuaternion);
      const finalCameraPosition = characterPosition.clone().add(finalOffset);
      const finalOrbitControlsTarget = characterPosition.clone().add(new THREE.Vector3(0, 10, 0));

      // Set transition parameters
      targetCameraPosition.current = finalCameraPosition; // This will be the target for the orbital transition
      targetOrbitControlsTarget.current = finalOrbitControlsTarget; // This will be the target for the orbital transition
      transitionStartTime.current = performance.now();
      isTrackingCharacter.current = true;
      transitioning.current = true; // Set transitioning flag
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
    camera.position.set(0, 15, 20);
    cameraRef.current = camera;

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
    orbitControlsRef.current = orbitControls;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x808080,
          }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Dummy Cube
    const cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const dummyCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    dummyCube.position.set(1000, 1000, 1000); // Initially far away
    dummyCube.name = 'dummyCube'; // Give it a name for raycasting
    scene.add(dummyCube);
    dummyCubeRef.current = dummyCube;

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the raycaster
      const intersects = raycaster.intersectObjects(scene.children);

      for (let i = 0; i < intersects.length; i++) {
        const intersectedObject = intersects[i].object;

        if (intersectedObject.name === 'dummyCube') {
          intersectedObject.rotation.y += Math.PI / 4; // Rotate on click
          toggleCharacterMovement(true); // Block character movement
          // Call a new prop to show UI interaction options
          if (props.onShowInteractionOptions) {
            props.onShowInteractionOptions();
          }
        }
      }
    };

    window.addEventListener('click', onMouseClick, false);

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

      if (isTrackingCharacter.current) {
        if (transitioning.current) {
          const elapsedTime = performance.now() - transitionStartTime.current;
          const t = Math.min(1, elapsedTime / transitionDuration.current);

          const currentCharacterPosition = characterPositionAtTransitionStart.current;

          // Calculate interpolated camera position
          const interpolatedCameraPosition = new THREE.Vector3().lerpVectors(initialCameraPosition.current, targetCameraPosition.current, t);

          // Calculate orbital component
          const angle = t * Math.PI; // Rotate 180 degrees
          const radius = initialCameraPosition.current.distanceTo(currentCharacterPosition) * (1 - t) + targetCameraPosition.current.distanceTo(currentCharacterPosition) * t;
          
          const orbitalX = currentCharacterPosition.x + radius * Math.sin(angle);
          const orbitalZ = currentCharacterPosition.z + radius * Math.cos(angle);
          const orbitalY = interpolatedCameraPosition.y; // Use interpolated Y

          const orbitalPosition = new THREE.Vector3(orbitalX, orbitalY, orbitalZ);

          cameraRef.current.position.copy(orbitalPosition);
          orbitControlsRef.current.target.lerpVectors(initialOrbitControlsTarget.current, targetOrbitControlsTarget.current, t);

          if (t >= 1) {
            transitioning.current = false;
          }
        } else {
          // Continuous following logic
          if (controls.Target && cameraRef.current && orbitControlsRef.current) {
            const characterPosition = controls.Target.position;
            const characterQuaternion = controls.Target.quaternion;

            const finalOffset = new THREE.Vector3(0, 30, -30); // Final following offset
            finalOffset.applyQuaternion(characterQuaternion);

            targetCameraPosition.current = characterPosition.clone().add(finalOffset);
            targetOrbitControlsTarget.current = characterPosition.clone().add(new THREE.Vector3(0, 10, 0));
          }
        }

        // Smooth camera transition (always active when tracking)
        if (targetCameraPosition.current && cameraRef.current && orbitControlsRef.current) {
          cameraRef.current.position.lerp(targetCameraPosition.current, 0.1);
          orbitControlsRef.current.target.lerp(targetOrbitControlsTarget.current, 0.1);
          orbitControlsRef.current.update();
        }
      }
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
      window.removeEventListener('click', onMouseClick, false);
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