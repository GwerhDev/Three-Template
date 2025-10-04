import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import BasicCharacterControllerInput from './BasicCharacterControllerInput';
import CharacterFSM from './CharacterFSM';
import BasicCharacterControllerProxy from './BasicCharacterControllerProxy';

import X_ArcherFbx from '@assets/models/characters/X_Archer.fbx';
import X_BotFbx from '@assets/models/characters/X_Bot.fbx';
import Y_MilitiaFbx from '@assets/models/characters/Y_Militia.fbx';

import WalkingFbx from '@assets/models/animations/Walking.fbx';
import RunningBackwardFbx from '@assets/models/animations/Running_Backward.fbx';
import RunningFbx from '@assets/models/animations/Running.fbx';
import IdleFbx from '@assets/models/animations/Idle.fbx';

class BasicCharacterController {
  constructor(params) {
    this._Init(params);
    this._currentModel = null;
  }

  _Init(params) {
    this._params = params;
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(1, 0.25, 50.0);
    this._velocity = new THREE.Vector3(0, 0, 0);
    
    this._animations = {};
    this._input = new BasicCharacterControllerInput();
    this._stateMachine = new CharacterFSM(
      new BasicCharacterControllerProxy(this._animations)
    );
    this._isLoading = false; // Add a loading flag
    this._enabled = true; // New: Enable movement by default
  }
  
  get Target() {
    return this._target;
  }
  

  _LoadModels(file, onLoadCallback) {
    if (this._isLoading) {
      console.warn('Model is already loading. Please wait.');
      return;
    }
    this._isLoading = true;

    if (this._target) {
      this._params.scene.remove(this._target);
      this._target = null; // Clear the reference after removing
    }

    const loader = new FBXLoader();
    const characterMap = {
      'X_Archer.fbx': X_ArcherFbx,
      'X_Bot.fbx': X_BotFbx,
      'Y_Militia.fbx': Y_MilitiaFbx,
    };
    const characterUrl = characterMap[file];
    if (!characterUrl) {
      console.error('Unknown character file:', file);
      this._isLoading = false; // Reset loading flag on error
      return;
    }
    loader.load(characterUrl, (fbx) => {
      fbx.scale.setScalar(0.1);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      this._target = fbx;
      this._params.scene.add(this._target);

      // Make the character face the camera
      const cameraPosition = this._params.camera.position.clone();
      cameraPosition.y = this._target.position.y; // Keep character at the same height
      this._target.lookAt(cameraPosition);

      this._mixer = new THREE.AnimationMixer(this._target);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {
        this._stateMachine.SetState('idle');
        this._isLoading = false; // Set loading to false after all animations are loaded
        if (onLoadCallback) {
          onLoadCallback(this._target.position, this._target.quaternion);
        }
      };

      const _OnLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this._mixer.clipAction(clip);
  
        this._animations[animName] = {
          clip: clip,
          action: action,
        };
      };

      const loader = new FBXLoader(this._manager);
      loader.load(WalkingFbx, (a) => { _OnLoad('walk', a); });
      loader.load(RunningBackwardFbx, (a) => { _OnLoad('walk_backward', a); });
      loader.load(RunningFbx, (a) => { _OnLoad('run', a); });
      loader.load(RunningBackwardFbx, (a) => { _OnLoad('run_backward', a); });
      loader.load(IdleFbx, (a) => { _OnLoad('idle', a); });
    });
  }

  get Target() {
    return this._target;
  }

  Update(timeInSeconds) {
    if (!this._target) {
      return;
    }

    if (!this._enabled) {
      if (this._mixer) {
        this._mixer.update(timeInSeconds);
      }
      return;
    }

    this._stateMachine.Update(timeInSeconds, this._input);

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
      Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = this._acceleration.clone();
    if (this._input._keys.shift) {
      acc.multiplyScalar(2.0);
    }
    if (this._input._keys.forward) {
      velocity.z += acc.z * timeInSeconds;
    }
    if (this._input._keys.backward) {
      velocity.z -= acc.z * timeInSeconds;
    }
    if (this._input._keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._input._keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    oldPosition.copy(controlObject.position);

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }
  }

  SetEnabled(enabled) {
    this._enabled = enabled;
    if (!enabled) {
      // Optionally reset input state when disabling movement
      this._input._keys.forward = false;
      this._input._keys.backward = false;
      this._input._keys.left = false;
      this._input._keys.right = false;
      this._input._keys.shift = false;
      // Also reset velocity to stop any residual movement
      this._velocity.set(0, 0, 0);
      // Set to idle animation if movement is disabled
      this._stateMachine.SetState('idle');
    }
  }
};

export default BasicCharacterController;