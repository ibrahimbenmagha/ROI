// src/pages/Unauthorized.js
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100vh'
    }}>
      <h1>Accès non autorisé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <Button type="primary" onClick={() => navigate('/')}>
        Retour à l'accueil
      </Button>
    </div>
  );
};

export default Unauthorized;