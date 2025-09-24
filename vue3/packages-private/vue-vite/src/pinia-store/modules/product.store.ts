// stores/modules/product.store.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// Option Mode Store
export const useProductStoreOptionMode = defineStore('productOptionMode', {
  state: () => ({
    products: [] as Array<{ id: number; name: string; price: number }>,
    filter: 'all', // Example state property
  }),
  getters: {
    // Example getter: Get products count
    productCount: state => state.products.length,
    // Example getter: Filtered products (example)
    filteredProducts: state => {
      if (state.filter === 'all') {
        return state.products
      }
      // Add more filtering logic if needed
      return state.products // Placeholder
    },
  },
  actions: {
    // Example action: Fetch products from an API
    async fetchProducts() {
      // Replace with your actual API call
      const fetchedProducts = await Promise.resolve([
        { id: 101, name: 'Laptop', price: 1200 },
        { id: 102, name: 'Mouse', price: 25 },
      ])
      this.products = fetchedProducts
    },
    // Example action: Add a product (locally for now)
    addProduct(product: { id: number; name: string; price: number }) {
      this.products.push(product)
    },
    // Example action: Set filter
    setFilter(filter: string) {
      this.filter = filter
    },
  },
})

// Composition Mode Store
export const useProductStoreCompositionMode = defineStore(
  'productCompositionMode',
  () => {
    const products = ref<Array<{ id: number; name: string; price: number }>>([])
    const filter = ref('all') // Example state property

    // Example getter: Get products count
    const productCount = computed(() => products.value.length)

    // Example getter: Filtered products (example)
    const filteredProducts = computed(() => {
      if (filter.value === 'all') {
        return products.value
      }
      // Add more filtering logic if needed
      return products.value // Placeholder
    })

    // Example action: Fetch products from an API
    async function fetchProducts() {
      // Replace with your actual API call
      const fetchedProducts = await Promise.resolve([
        { id: 201, name: 'Keyboard', price: 75 },
        { id: 202, name: 'Monitor', price: 300 },
      ])
      products.value = fetchedProducts
    }

    // Example action: Add a product (locally for now)
    function addProduct(product: { id: number; name: string; price: number }) {
      products.value.push(product)
    }

    // Example action: Set filter
    function setFilter(newFilter: string) {
      filter.value = newFilter
    }

    return {
      products,
      filter,
      productCount,
      filteredProducts,
      fetchProducts,
      addProduct,
      setFilter,
    }
  },
)
