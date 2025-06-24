import config from './config.js';
import { addToCart } from './cart.js';

// Fetch all menu items from backend
async function fetchAllMenuItems() {
    try {
        const response = await fetch(config.endpoints.menu);
        if (!response.ok) {
            throw new Error('Failed to fetch menu items');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
}

// Group items by category
function groupByCategory(menuItems) {
    return menuItems.reduce((acc, item) => {
        const category = item.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});
}

// Display menu items on the page
function displayMenu(groupedMenu) {
    const menuContainer = document.getElementById('menuAccordion');
    if (!menuContainer) return;

    menuContainer.innerHTML = ''; // Clear existing content

    for (const category in groupedMenu) {
        const items = groupedMenu[category];
        const categoryId = `collapse${category.replace(/\s+/g, '')}`;

        const categoryHtml = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${category}">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${categoryId}" aria-expanded="true">
                        ${category}
                    </button>
                </h2>
                <div id="${categoryId}" class="accordion-collapse collapse show">
                    <div class="accordion-body row row-cols-1 row-cols-md-3 g-4">
                        ${items.map(item => `
                            <div class="col">
                                <div class="card h-100">
                                    <img src="${item.image}" class="card-img-top" alt="${item.name}">
                                    <div class="card-body">
                                        <h5 class="card-title">${item.name}</h5>
                                        <p class="card-text">₨ ${item.price}</p>
                                        <button class="btn btn-attractive" data-item-id="${item._id}">Add to Cart</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        menuContainer.innerHTML += categoryHtml;
    }

    // Add event listeners to the new buttons
    document.querySelectorAll('.btn-attractive').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = event.target.dataset.itemId;
            const selectedItem = groupedMenu[Object.keys(groupedMenu).find(cat => groupedMenu[cat].some(i => i._id === itemId))]
                .find(i => i._id === itemId);
            
            const itemToAdd = {
                id: selectedItem._id,
                name: selectedItem.name,
                price: selectedItem.price,
                image: selectedItem.image,
                quantity: 1
            };
            addToCart(itemToAdd);
        });
    });
}

// Initialize menu functionality
document.addEventListener('DOMContentLoaded', async function() {
    const menuItems = await fetchAllMenuItems();
    const groupedMenu = groupByCategory(menuItems);
    displayMenu(groupedMenu);
}); 