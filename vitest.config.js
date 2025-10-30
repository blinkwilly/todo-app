import { defineConfig } from 'vitest/config'

// Vitest configuration: use jsdom environment and run setup file
export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: 'src/test-setup.js',
    },
})
