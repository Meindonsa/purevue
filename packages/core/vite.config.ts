import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            include: ['src/**/*'],
        }),
    ],
    test: {
        environment: 'happy-dom',
        globals: true,
        include: ['src/**/*.{test,spec}.ts'],
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'PureVue',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
})