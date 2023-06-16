import animationBehaviour from "../basic/animations/AnimationBehaviour"
import TransitionHandler from "../basic/animations/TransitionHandler"
import { mode } from "./ModeController"

class AnimationController {
  constructor() {
    this.state = null
    this.transitionHandler = null
  }
  init(characterController) {
    this.state = characterController.state
    if(!this.transitionHandler) {
      this.transitionHandler = new TransitionHandler(characterController.character)
    }
    this.transitionHandler.start()
  }
  stop() {
    this.transitionHandler.stop()
  }
  tick() {
    const speed = 1.2
    if(this.state.mode == mode.IDLE) {
      if(false) { 
      } else if(this.state.translation.x == 1) {
        this.transitionHandler.action(animationBehaviour.left, speed)
      } else if(this.state.translation.x == -1) {
        this.transitionHandler.action(animationBehaviour.right, speed)
      } else if(this.state.translation.y == 1) {
        this.transitionHandler.action(animationBehaviour.run, speed)
      } else if(this.state.translation.y == -1) {
        this.transitionHandler.action(animationBehaviour.runBack, speed)
      } else {
        this.transitionHandler.action(animationBehaviour.idle, speed)
      }
    }
  }
}

const animationController = new AnimationController();

export default animationController;

export { AnimationController }