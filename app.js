let pricingData = null;
let allModels = [];
let currentSort = { column: 'inputPrice', ascending: true };

// Initialize the app
async function init() {
    try {
        const response = await fetch('pricing.json');
        pricingData = await response.json();

        // Update last updated date
        const lastUpdated = new Date(pricingData.lastUpdated);
        document.getElementById('lastUpdated').textContent = lastUpdated.toLocaleString();

        // Transform data into flat array
        allModels = flattenPricingData(pricingData);

        // Render pricing table (sorted by cheapest input price by default)
        renderPricingTable(allModels);

        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error loading pricing data:', error);
        document.getElementById('pricingTableBody').innerHTML =
            '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Failed to load pricing data. Please try again later.</td></tr>';
    }
}

// Flatten pricing data into array of models
function flattenPricingData(data) {
    const models = [];

    for (const [providerId, provider] of Object.entries(data.providers)) {
        for (const model of provider.models) {
            models.push({
                providerId,
                providerName: provider.name,
                modelName: model.name,
                inputPrice: model.inputPrice,
                outputPrice: model.outputPrice,
                unit: model.unit,
                notes: model.notes || null
            });
        }
    }

    return models;
}

// Render pricing table
function renderPricingTable(models) {
    const tbody = document.getElementById('pricingTableBody');

    if (models.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No models match your filters.</td></tr>';
        return;
    }

    tbody.innerHTML = models.map(model => `
        <tr data-provider="${model.providerId}">
            <td><span class="provider-badge ${model.providerId}">${model.providerName}</span></td>
            <td class="model-name">${model.modelName}</td>
            <td><span class="price-value price-input">$${model.inputPrice.toFixed(2)}</span></td>
            <td><span class="price-value price-output">$${model.outputPrice.toFixed(2)}</span></td>
            <td class="model-notes">${model.notes || '—'}</td>
        </tr>
    `).join('');
}

// Set up event listeners
function setupEventListeners() {
    // Table header sorting
    document.querySelectorAll('.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-sort');

            // Toggle sort direction if same column, otherwise default to ascending
            if (currentSort.column === column) {
                currentSort.ascending = !currentSort.ascending;
            } else {
                currentSort.column = column;
                currentSort.ascending = true;
            }

            updateSortIndicators();
            applyFilters();
        });
    });

    // Provider filters
    document.querySelectorAll('.provider-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Search functionality
    document.getElementById('searchBox').addEventListener('input', applyFilters);
}

// Update sort indicators on table headers
function updateSortIndicators() {
    document.querySelectorAll('.sortable').forEach(header => {
        const column = header.getAttribute('data-sort');
        header.classList.remove('active');

        // Remove existing arrows
        header.textContent = header.textContent.replace(/[▲▼]/g, '').trim();

        if (column === currentSort.column) {
            header.classList.add('active');
            const arrow = currentSort.ascending ? ' ▲' : ' ▼';
            header.textContent += arrow;
        }
    });
}

// Apply all filters and sorting
function applyFilters() {
    let filtered = [...allModels];

    // Filter by provider
    const selectedProviders = Array.from(document.querySelectorAll('.provider-filter:checked'))
        .map(cb => cb.value);

    filtered = filtered.filter(model => selectedProviders.includes(model.providerId));

    // Filter by search term
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(model =>
            model.modelName.toLowerCase().includes(searchTerm) ||
            model.providerName.toLowerCase().includes(searchTerm)
        );
    }

    // Sort by current sort column and direction
    filtered.sort((a, b) => {
        let aVal, bVal;

        switch (currentSort.column) {
            case 'name':
                aVal = a.modelName.toLowerCase();
                bVal = b.modelName.toLowerCase();
                return currentSort.ascending
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);

            case 'inputPrice':
                aVal = a.inputPrice;
                bVal = b.inputPrice;
                break;

            case 'outputPrice':
                aVal = a.outputPrice;
                bVal = b.outputPrice;
                break;

            case 'provider':
                aVal = a.providerName.toLowerCase();
                bVal = b.providerName.toLowerCase();
                return currentSort.ascending
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);

            default:
                return 0;
        }

        // For numeric values
        return currentSort.ascending ? aVal - bVal : bVal - aVal;
    });

    renderPricingTable(filtered);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
