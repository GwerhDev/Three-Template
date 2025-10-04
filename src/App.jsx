import React, { useState, useRef, useEffect } from 'react';
import ThreeScene from './ThreeScene';
import EnterScreen from './components/EnterScreen';
import CharacterSelectionUI from './components/CharacterSelectionUI';
import Layout from './components/Layout';
import './styles/globals.css';

function App() {
  const [showUI, setShowUI] = useState(true);
  const [character, setCharacter] = useState('none');
  const threeSceneRef = useRef(null);

  const handleEnter = () => {
    setShowUI(false);
  };

  const handleExit = () => {
    setShowUI(true);
    setCharacter('none'); // Reset character when exiting
  };

  const handleCharacterChange = (e) => {
    const selectedCharacter = e.target.value;
    setCharacter(selectedCharacter);
    if (threeSceneRef.current) {
      threeSceneRef.current.loadCharacter(selectedCharacter);
    }
  };

  useEffect(() => {
    if (!showUI && character === 'none') {
      // Optionally load a default character when entering the scene if none is selected
      // threeSceneRef.current.loadCharacter('X_Archer.fbx');
    }
  }, [showUI, character]);

  const uiContent = showUI ? (
    <EnterScreen onEnter={handleEnter} />
  ) : (
    <CharacterSelectionUI
      onCharacterChange={handleCharacterChange}
      onExit={handleExit}
      character={character}
    />
  );

  return (
    <div className="App">
      <Layout
        threeScene={<ThreeScene ref={threeSceneRef} />}
        ui={uiContent}
      />
    </div>
  );
}

export default App;