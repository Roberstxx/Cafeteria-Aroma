// js/menu-generator.js

document.addEventListener('DOMContentLoaded', () => {
    // Define un mapa de categorías a sus archivos JSON correspondientes
    const menuDataSources = {
        coffee: 'data/menu-coffee.json',
        food: 'data/menu-food.json',
        desserts: 'data/menu-desserts.json',
        drinks: 'data/menu-drinks.json'
    };

    // Referencias a los elementos del DOM
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCategoryContainer = document.querySelector('.menu-category-container');

    /**
     * Fetches menu data from a given JSON file.
     * @param {string} url - The URL of the JSON file.
     * @returns {Promise<Array>} A promise that resolves with the menu items array.
     */
    async function fetchMenuData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching menu data:", error);
            return []; // Return an empty array on error
        }
    }

    /**
     * Creates a single menu card HTML element.
     * @param {Object} item - The menu item object.
     * @returns {HTMLElement} The created article element.
     */
    function createMenuCard(item) {
        const article = document.createElement('article');
        article.classList.add('menu-card');

        // Create badge HTML if item.badge exists
        const badgeHtml = item.badge ? `<span class="menu-item-badge badge-${item.badge.toLowerCase().replace(/\s/g, '-')}">${item.badge}</span>` : '';

        // Create meta HTML if item.meta exists and is not empty
        const metaHtml = item.meta && item.meta.length > 0 ? `
            <div class="menu-item-meta">
                ${item.meta.map(metaItem => `<span class="menu-item-info">${metaItem}</span>`).join('')}
            </div>
        ` : '';

        article.innerHTML = `
            <div class="menu-card-img-container">
                <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy" width="400" height="300" onerror="this.onerror=null;this.src='https://placehold.co/400x300/D4C9BF/333333?text=Imagen+No+Disp.'">
                <span class="menu-item-price">${item.price}</span>
            </div>
            <div class="menu-card-content">
                <div class="menu-item-header">
                    <h4 class="menu-item-name">${item.name}</h4>
                    ${badgeHtml}
                </div>
                <p class="menu-item-desc">${item.description}</p>
                ${metaHtml}
            </div>
        `;
        return article;
    }

    /**
     * Renders menu items for a specific category.
     * @param {string} categoryId - The ID of the category (e.g., 'coffee', 'food').
     * @param {Array} items - An array of menu item objects.
     */
    function renderMenuCategory(categoryId, items) {
        const categoryPanel = document.getElementById(`${categoryId}-panel`);
        const menuGrid = categoryPanel.querySelector('.menu-grid');
        menuGrid.innerHTML = ''; // Clear existing items

        if (items.length === 0) {
            menuGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">No hay elementos disponibles en esta categoría por el momento.</p>';
            return;
        }

        items.forEach(item => {
            const card = createMenuCard(item);
            menuGrid.appendChild(card);
        });
    }

    /**
     * Handles tab clicks, fetches data, and renders the corresponding menu category.
     * @param {Event} event - The click event.
     */
    async function handleTabClick(event) {
        const clickedTab = event.target;
        const targetTabId = clickedTab.dataset.tab;

        // Deactivate all tabs and hide all category panels
        menuTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.menu-category').forEach(panel => {
            panel.classList.remove('active');
            panel.setAttribute('hidden', 'true');
        });

        // Activate the clicked tab
        clickedTab.classList.add('active');
        clickedTab.setAttribute('aria-selected', 'true');

        // Show a loading state or clear the current grid while fetching
        const currentPanel = document.getElementById(`${targetTabId}-panel`);
        currentPanel.classList.add('active');
        currentPanel.removeAttribute('hidden');
        currentPanel.querySelector('.menu-grid').innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">Cargando menú...</p>';


        // Fetch and render data for the selected category
        const jsonUrl = menuDataSources[targetTabId];
        if (jsonUrl) {
            const menuItems = await fetchMenuData(jsonUrl);
            renderMenuCategory(targetTabId, menuItems);
        } else {
            console.error(`No data source defined for tab: ${targetTabId}`);
            currentPanel.querySelector('.menu-grid').innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem; color: red;">Error al cargar el menú. Inténtalo de nuevo más tarde.</p>';
        }
    }

    // Add event listeners to all menu tabs
    menuTabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });

    // Automatically trigger a click on the first tab to load its content on page load
    if (menuTabs.length > 0) {
        menuTabs[0].click();
    }
});