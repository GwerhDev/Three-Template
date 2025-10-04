import { useState, useRef, useEffect } from 'react';
import ThreeScene from './ThreeScene';
import EnterScreen from './app/components/screens/EnterScreen';
import CharacterSelectionUI from './app/components/ui/CharacterSelectionUI';
import DialogueOptionsUI from './app/components/ui/DialogueOptionsUI'; // New import
import CharacterInteractionOptionsUI from './app/components/ui/CharacterInteractionOptionsUI'; // New import
import Layout from './app/layouts/Layout';

function App() {
  const [showUI, setShowUI] = useState(true);
  const [showCharacterSelectionUI, setShowCharacterSelectionUI] = useState(true);
  const [character, setCharacter] = useState('none');
  const [showDialogue, setShowDialogue] = useState(false); // New state
  const [isCharacterMovementBlocked, setIsCharacterMovementBlocked] = useState(false); // New state for blocking movement
  const [showCharacterInteractionOptions, setShowCharacterInteractionOptions] = useState(false); // New state for interaction options UI
  const threeSceneRef = useRef(null);

  const handleEnter = () => {
    setShowUI(false);
    setShowCharacterSelectionUI(true);
  };

  const handleExit = () => {
    setShowUI(true);
    setShowCharacterSelectionUI(true);
    setCharacter('none'); // Reset character when exiting
    setIsCharacterMovementBlocked(false); // Ensure movement is unblocked on exit
    setShowCharacterInteractionOptions(false); // Hide interaction options on exit
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

  // Dialogue handlers
  const handleOpenDialogue = () => {
    setShowDialogue(true);
  };

  const handleCloseDialogue = () => {
    setShowDialogue(false);
  };

  // Character movement handler
  const toggleCharacterMovement = (block) => {
    setIsCharacterMovementBlocked(block);
  };

  // Interaction options UI handler
  const toggleCharacterInteractionOptions = (show) => {
    setShowCharacterInteractionOptions(show);
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
        threeScene={
          <ThreeScene
            ref={threeSceneRef}
            onOpenDialogue={handleOpenDialogue}
            onCloseDialogue={handleCloseDialogue}
            isCharacterSelected={isCharacterSelected}
            isCharacterMovementBlocked={isCharacterMovementBlocked}
            toggleCharacterMovement={toggleCharacterMovement}
            onShowInteractionOptions={() => toggleCharacterInteractionOptions(true)} // Pass handler to show options
          />
        }
        ui={uiContent}
      />
      {showDialogue && <DialogueOptionsUI onClose={handleCloseDialogue} />} {/* Conditional rendering of dialogue */}
      {showCharacterInteractionOptions && (
        <CharacterInteractionOptionsUI
          onOpenDialogue={handleOpenDialogue}
          onCloseDialogue={handleCloseDialogue}
          toggleCharacterMovement={toggleCharacterMovement}
          toggleCharacterInteractionOptions={toggleCharacterInteractionOptions}
        />
      )} {/* Conditional rendering of interaction options */}
    </div>
  );
}

export default App;