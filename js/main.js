// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const header = document.getElementById('header');

    // Toggle de menú móvil
    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
            primaryNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Previene scroll en móvil
        });

        // Cerrar menú al hacer click en un enlace (solo en móvil)
        primaryNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (primaryNav.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    primaryNav.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // sticky header
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) { // Ajusta este valor según cuándo quieres que el header se haga "sticky"
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Smooth scroll para enlaces de anclaje
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});