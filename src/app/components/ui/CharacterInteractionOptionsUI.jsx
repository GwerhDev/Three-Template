import React from 'react';

const CharacterInteractionOptionsUI = ({ onOpenDialogue, onCloseDialogue, toggleCharacterMovement, toggleCharacterInteractionOptions }) => {

  const handleOpenDialogueClick = () => {
    onOpenDialogue();
    toggleCharacterInteractionOptions(false); // Hide interaction options after opening dialogue
  };

  const handleAbandonInteractionClick = () => {
    toggleCharacterMovement(false); // Unblock character movement
    onCloseDialogue(); // Close dialogue modal if open
    toggleCharacterInteractionOptions(false); // Hide interaction options
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '20px',
      zIndex: 1000,
    }}>
      <button onClick={handleOpenDialogueClick} style={{
        padding: '15px 30px',
        fontSize: '1.2em',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease',
      }}>
        Abrir Diálogo
      </button>
      <button onClick={handleAbandonInteractionClick} style={{
        padding: '15px 30px',
        fontSize: '1.2em',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease',
      }}>
        Abandonar Interacción
      </button>
    </div>
  );
};

export default CharacterInteractionOptionsUI;