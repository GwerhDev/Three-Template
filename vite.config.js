// vite.config.js
module.exports = {
  build: {
    base: './',
    rollupOptions: {
      // Agrega la configuración de externalización para index.html y main.js
      external: ['index.html', 'src/main.js']
    }
  }
};