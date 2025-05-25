// actualizarEstadoFalta.js

import React, { useState } from 'react';

const actualizarEstadoFalta = (id, nuevoEstado, faltas, setFaltas) => {
  try {
    if (!id || !nuevoEstado) {
      console.error('ID y nuevo estado son requeridos.');
      return;
    }

    const nuevasFaltas = faltas.map((falta) =>
      falta.id === id ? { ...falta, estado: nuevoEstado } : falta
    );

    setFaltas(nuevasFaltas);
  } catch (error) {
    console.error('Error al actualizar el estado de la falta:', error);
  }
};

export default actualizarEstadoFalta;
