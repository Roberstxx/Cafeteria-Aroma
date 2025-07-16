// js/menu-tabs.js

document.addEventListener('DOMContentLoaded', () => {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategories = document.querySelectorAll('.menu-category');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover 'active' de todas las pestañas y ocultar paneles
            menuTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            menuCategories.forEach(cat => {
                cat.classList.remove('active');
                cat.setAttribute('hidden', 'true');
            });

            // Añadir 'active' a la pestaña clicada y mostrar su panel
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const targetTab = tab.dataset.tab;
            document.getElementById(`${targetTab}-panel`).classList.add('active');
            document.getElementById(`${targetTab}-panel`).removeAttribute('hidden');
        });
    });

    // Activar la primera pestaña por defecto al cargar la página si no hay una activa
    if (menuTabs.length > 0 && !document.querySelector('.menu-tab.active')) {
        menuTabs[0].click();
    }
});