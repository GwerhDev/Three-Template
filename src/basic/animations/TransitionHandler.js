import * as THREE from 'three';
import loopMachine from "../LoopMachine";

class TransitionHandler {
  constructor(mesh, peerId) {
    this.peerId = peerId;
    this.mixer = new THREE.AnimationMixer(mesh);
    this.clock = new THREE.Clock();
    this.mesh = mesh;
    this.clips = mesh.animations.map(animation => {
      return this.mixer.clipAction(animation);
    });
    this.lastClip = null;
    this.interpolationTime = 0.2;
    this.inProgress = false;
    this.callback = null;
  }

  run = () => {
    this.mixer.update(this.clock.getDelta());
  };

  start() {
    loopMachine.removeCallback(this.run);
  }

  stop() {
    loopMachine.addCallback(this.run);
  }

  onCycleFinished = () => {
    this.inProgress = false;
    if (this.callback != null) {
      this.callback(this.lastClip);
      this.callback = null;
    }
  };

  action(animationId, timeScale = 1, cycleFlag = false) {
    if (this.inProgress) return;
    if (cycleFlag) {
      this.mixer.addEventListener('loop', this.onCycleFinished);
      this.inProgress = true;
    }
    this.mixer.timeScale = timeScale;
    if (this.lastClip === animationId) return;
    if (this.lastClip === null) {
      this.clips[animationId].play();
    } else {
      this.clips[animationId].reset().play();
    }
    this.lastClip = animationId;
  }
}

export default TransitionHandler;
