import React from 'react';
import styles from '../styles/ThreeScene.module.css';
import uiStyles from './CharacterSelectionUI.module.css';

const CharacterSelectionUI = ({ onCharacterChange, onExit, character }) => {
  return (
    <>
      <div className={styles.selectContainer}>
                <select onChange={onCharacterChange} value={character} className={uiStyles.select}>
          <option value="none">Select your character</option>
          <option value="X_Archer.fbx">Character 1</option>
          <option value="X_Bot.fbx">Character 2</option>
          <option value="Y_Militia.fbx">Character 3</option>
        </select>
      </div>
      <div className={styles.exitButtonContainer}>
                <button className={`exit-button border-gold ${uiStyles.button}`} onClick={onExit}>
          Exit
        </button>
      </div>
    </>
  );
};

export default CharacterSelectionUI;
