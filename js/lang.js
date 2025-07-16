function cambiarIdioma(idioma) {
  fetch(`lang/${idioma}.json`)
    .then(res => res.json())
    .then(traducciones => {
      document.documentElement.lang = idioma;

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const clave = el.getAttribute('data-i18n');
        if (traducciones[clave]) {
          el.textContent = traducciones[clave];
        }
      });

      // También puedes cambiar atributos si lo deseas (ej. placeholder, aria-label)
    });
}

window.addEventListener('DOMContentLoaded', () => {
  cambiarIdioma('es'); // Español por defecto
});
