import { useState, useRef, useEffect } from 'react';
import ThreeScene from './ThreeScene';
import EnterScreen from './app/components/screens/EnterScreen';
import CharacterSelectionUI from './app/components/ui/CharacterSelectionUI';
import DialogueOptionsUI from './app/components/ui/DialogueOptionsUI'; // New import
import Layout from './app/layouts/Layout';

function App() {
  const [showUI, setShowUI] = useState(true);
  const [showCharacterSelectionUI, setShowCharacterSelectionUI] = useState(true);
  const [character, setCharacter] = useState('none');
  const [showDialogue, setShowDialogue] = useState(false); // New state
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

  // New dialogue handlers
  const handleOpenDialogue = () => {
    setShowDialogue(true);
  };

  const handleCloseDialogue = () => {
    setShowDialogue(false);
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

  // Determine if a character is selected for the ThreeScene prop
  const isCharacterSelected = character !== 'none' && !showCharacterSelectionUI;

  return (
    <div className="App">
      <Layout
        threeScene={<ThreeScene ref={threeSceneRef} onOpenDialogue={handleOpenDialogue} isCharacterSelected={isCharacterSelected} />}
        ui={uiContent}
      />
      {showDialogue && <DialogueOptionsUI onClose={handleCloseDialogue} />} {/* Conditional rendering of dialogue */}
    </div>
  );
}

export default App;