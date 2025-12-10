let pricingData = null;
let allModels = [];

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

        // Render pricing cards
        renderPricingCards(allModels);

        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Error loading pricing data:', error);
        document.getElementById('pricingGrid').innerHTML =
            '<div class="no-results">Failed to load pricing data. Please try again later.</div>';
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

// Render pricing cards
function renderPricingCards(models) {
    const grid = document.getElementById('pricingGrid');

    if (models.length === 0) {
        grid.innerHTML = '<div class="no-results">No models match your filters.</div>';
        return;
    }

    grid.innerHTML = models.map(model => `
        <div class="pricing-card ${model.providerId}" data-provider="${model.providerId}">
            <span class="provider-badge ${model.providerId}">${model.providerName}</span>
            <div class="model-name">${model.modelName}</div>
            <div class="price-row">
                <span class="price-label">Input</span>
                <span class="price-value">$${model.inputPrice.toFixed(2)}</span>
            </div>
            <div class="price-row">
                <span class="price-label">Output</span>
                <span class="price-value">$${model.outputPrice.toFixed(2)}</span>
            </div>
            <div class="price-row">
                <span class="price-label">Unit</span>
                <span class="price-value" style="font-size: 0.875rem; color: var(--text-secondary);">${model.unit}</span>
            </div>
            ${model.notes ? `<div class="model-notes">${model.notes}</div>` : ''}
        </div>
    `).join('');
}

// Set up event listeners
function setupEventListeners() {
    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', applyFilters);

    // Provider filters
    document.querySelectorAll('.provider-filter').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Search functionality
    document.getElementById('searchBox').addEventListener('input', applyFilters);
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

    // Sort
    const sortBy = document.getElementById('sortBy').value;
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.modelName.localeCompare(b.modelName);
            case 'inputPrice':
                return a.inputPrice - b.inputPrice;
            case 'outputPrice':
                return a.outputPrice - b.outputPrice;
            case 'provider':
                return a.providerName.localeCompare(b.providerName);
            default:
                return 0;
        }
    });

    renderPricingCards(filtered);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
