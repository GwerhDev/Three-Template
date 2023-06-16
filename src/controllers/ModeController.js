const mode = {
  "IDLE": 0,
  "STEALTH": 1,
  "IDLE": 2,
  "RUNNER": 3,
  "SHOOTER": 4
}

class ModeController {
  constructor(){}

  init(characterController){
    this.state = characterController.state
    this.state['mode'] = mode.IDLE
  }
  tick(){

  }

}
const modeController = new ModeController();

export default modeController;

export { ModeController, mode }