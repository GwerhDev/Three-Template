import React from 'react';

const DialogueOptionsUI = ({ onClose }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 1000,
      textAlign: 'center',
    }}>
      <h2>Opciones de Diálogo</h2>
      <p>Aquí irían las opciones de diálogo para interactuar con el cubo.</p>
      <button onClick={onClose} style={{
        marginTop: '10px',
        padding: '8px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}>Cerrar</button>
    </div>
  );
};

export default DialogueOptionsUI;