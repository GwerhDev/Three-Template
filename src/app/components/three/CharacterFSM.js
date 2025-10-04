import FiniteStateMachine from './FiniteStateMachine';
import { IdleState, WalkState, RunState } from './States'; // Assuming States.js will contain all state classes

class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('run', RunState);
  }
};

export default CharacterFSM;