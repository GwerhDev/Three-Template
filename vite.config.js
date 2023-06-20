const { resolve } = require('path');

module.exports = {
  base: '/',

  resolve: {
    alias: {
      // Agrega una entrada para los archivos de modelos 3D
      '/@models/': resolve(__dirname, 'src/models/'),
    },
  },

  // Otras configuraciones de Vite...
};
