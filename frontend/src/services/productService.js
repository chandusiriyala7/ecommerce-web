import SummaryApi from '../common';

// Cache object to store fetched products
const productCache = {
    categories: null,
    products: {},
    lastFetched: {},
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes cache duration
};

// Helper to check if cache is valid
const isCacheValid = (key) => {
    const lastFetched = productCache.lastFetched[key];
    if (!lastFetched) return false;
    return Date.now() - lastFetched < productCache.CACHE_DURATION;
};

// Fetch all categories
export const fetchCategories = async () => {
    if (isCacheValid('categories')) {
        return productCache.categories;
    }

    try {
        const response = await fetch(SummaryApi.categoryProduct.url);
        const dataResponse = await response.json();
        const filteredData = dataResponse.data.filter(product => product.category !== "OutOfStock");
        
        productCache.categories = filteredData;
        productCache.lastFetched['categories'] = Date.now();
        
        return filteredData;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};

// Fetch products by category
export const fetchProductsByCategory = async (category) => {
    if (isCacheValid(category)) {
        return productCache.products[category];
    }

    try {
        const response = await fetch(SummaryApi.categoryWiseProduct.url, {
            method: SummaryApi.categoryWiseProduct.method,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ category })
        });

        const dataResponse = await response.json();
        
        productCache.products[category] = dataResponse.data;
        productCache.lastFetched[category] = Date.now();
        
        return dataResponse.data;
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
        throw error;
    }
};

// Prefetch all categories and their products
export const prefetchAllProducts = async () => {
    try {
        const categories = await fetchCategories();
        const categoryNames = [...new Set(categories.map(cat => cat.category))];
        
        // Fetch products for each category in parallel
        await Promise.all(
            categoryNames.map(category => fetchProductsByCategory(category))
        );
    } catch (error) {
        console.error("Error prefetching products:", error);
    }
};

// Clear cache
export const clearProductCache = () => {
    productCache.categories = null;
    productCache.products = {};
    productCache.lastFetched = {};
}; 