import { useState, useRef, useEffect } from 'react';
import ThreeScene from './ThreeScene';
import EnterScreen from './app/components/screens/EnterScreen';
import CharacterSelectionUI from './app/components/ui/CharacterSelectionUI';
import Layout from './app/layouts/Layout';

function App() {
  const [showUI, setShowUI] = useState(true);
  const [showCharacterSelectionUI, setShowCharacterSelectionUI] = useState(true);
  const [character, setCharacter] = useState('none');
  const threeSceneRef = useRef(null);

  const handleEnter = () => {
    setShowUI(false);
    setShowCharacterSelectionUI(true);
  };

  const handleExit = () => {
    setShowUI(true);
    setShowCharacterSelectionUI(true);
    setCharacter('none'); // Reset character when exiting
  };

  const handleCharacterChange = (selectedCharacter) => {
    setCharacter(selectedCharacter);
    if (threeSceneRef.current) {
      threeSceneRef.current.loadCharacter(selectedCharacter);
    }
  };

  const handleSelectCharacter = (selectedCharacter) => {
    setCharacter(selectedCharacter);
    if (threeSceneRef.current) {
      threeSceneRef.current.loadCharacter(selectedCharacter, (position, quaternion) => {
        threeSceneRef.current.moveCameraBehindCharacter(position, quaternion);
      });
    }
    setShowCharacterSelectionUI(false);
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
    showCharacterSelectionUI && (
      <CharacterSelectionUI
        onCharacterChange={handleCharacterChange}
        onExit={handleExit}
        character={character}
        onSelectCharacter={handleSelectCharacter}
      />
    )
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