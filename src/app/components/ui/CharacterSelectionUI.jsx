import React, { useState, useEffect } from 'react';
import s from './CharacterSelectionUI.module.css';

const characters = [
  { name: 'X_Archer', file: 'X_Archer.fbx' },
  { name: 'X_Bot', file: 'X_Bot.fbx' },
  { name: 'Y_Militia', file: 'Y_Militia.fbx' },
];

const CharacterSelectionUI = ({ onCharacterChange, onExit, character, onSelectCharacter }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Initialize the character based on the prop
    const initialIndex = characters.findIndex(char => char.file === character);
    if (initialIndex !== -1) {
      setCurrentIndex(initialIndex);
    } else if (characters.length > 0) {
      // If no character is selected or an invalid one, default to the first
      onCharacterChange({ target: { value: characters[0].file } });
    }
  }, [character, onCharacterChange]);

  const handleNextCharacter = () => {
    const nextIndex = (currentIndex + 1) % characters.length;
    setCurrentIndex(nextIndex);
    onCharacterChange({ target: { value: characters[nextIndex].file } });
  };

  const handlePreviousCharacter = () => {
    const prevIndex = (currentIndex - 1 + characters.length) % characters.length;
    setCurrentIndex(prevIndex);
    onCharacterChange({ target: { value: characters[prevIndex].file } });
  };

  return (
    <div className={s.controlsContainer}>
      <div className={s.exitButtonContainer}>
        <button className={`exit-button border-gold ${s.button}`} onClick={onExit}>
          Exit
        </button>
      </div>
      <div className={s.sliderContainer}>
        <button className={`${s.button} ${s.navButton}`} onClick={handlePreviousCharacter}>
          &lt;
        </button>
        <span className={s.characterName}>
          {characters[currentIndex] ? characters[currentIndex].name : 'Select your character'}
        </span>
        <button className={`${s.button} ${s.navButton}`} onClick={handleNextCharacter}>
          &gt;
        </button>
      </div>
      <div className={s.selectButtonContainer}>
        <button className={`select-button border-gold ${s.button}`} onClick={() => onSelectCharacter(characters[currentIndex].file)}>
          Choose
        </button>
      </div>
    </div>
  );
};

export default CharacterSelectionUI;
