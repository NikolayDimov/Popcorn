// Standart Vite Config file
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// To work .env file
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        define: {
            "process.env": env,
        },
        plugins: [react()],
    };
});

// Alternative
// import { defineConfig, loadEnv } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => {
//     const env = loadEnv(mode, process.cwd(), "");
//     return {
//         define: {
//             "process.env.SOME_KEY": JSON.stringify(env.SOME_KEY),
//         },
//         plugins: [react()],
//     };
// });
