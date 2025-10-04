import s from './EnterScreen.module.css';

const EnterScreen = ({ onEnter }) => {
  return (
    <div className={s.buttonContainer}>
      <h1>Testing ThreeJs App</h1>
      <h2>Choose your character and play!</h2>
      <small>Move with [w,a,s,d], sprint with shift and use your mouse to move the camera</small> <br/>
      <button className={`border-gold ${s.button}`} onClick={onEnter}>Enter</button>
    </div>
  );
};

export default EnterScreen;
