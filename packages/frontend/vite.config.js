import vue from '@vitejs/plugin-vue'
import svg from 'vite-svg-loader'
import { visualizer } from 'rollup-plugin-visualizer'



// -------------------
// Data
// -------------------

const {
    VERSION,
    BACKEND_URL,
    FRONTEND_URL,
    MAPS_KEY,
    MAP_ID,
    CRISP_WEBSITE_ID,
    FRONTEND_HMR_PORT
} = process.env;



// -------------------
// Exports
// -------------------

export default {

    plugins: [
        vue(),
        svg({ svgo: false }),
        // visualizer({ template: 'treemap', open: true })
    ],

    define: {
        APP_VERSION: JSON.stringify(VERSION),
        FRONTEND_URL: JSON.stringify(FRONTEND_URL),
        BACKEND_URL: JSON.stringify(BACKEND_URL),
        MAPS_KEY: JSON.stringify(MAPS_KEY),
        MAP_ID: JSON.stringify(MAP_ID),
        CRISP_WEBSITE_ID: JSON.stringify(CRISP_WEBSITE_ID)
    },

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "sass:math";
                    @import "#root/styles/abstract.scss";
                `,
            }
        }
    },

    server: {
        hmr: {
            port: FRONTEND_HMR_PORT
        }
    }

}