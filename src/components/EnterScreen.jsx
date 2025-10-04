import React from 'react';
import styles from '../styles/ThreeScene.module.css';
import buttonStyles from './EnterScreen.module.css';

const EnterScreen = ({ onEnter }) => {
  return (
    <div className={`${styles.buttonContainer}`}>
      <h1>Testing ThreeJs App</h1>
      <h2>Choose your character and play!</h2>
      <small>Move with [w,a,s,d], sprint with shift and use your mouse to move the camera</small> <br/>
            <button className={`border-gold ${buttonStyles.button}`} onClick={onEnter}>Enter</button>
    </div>
  );
};

export default EnterScreen;
