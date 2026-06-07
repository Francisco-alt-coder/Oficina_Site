import { defineConfig } from "vite";
import path from "path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Configuração Principal Do Vite
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Alias Para Importações Limpas (Resolve o problema do plugin de forma nativa)
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
      "@components": path.resolve(process.cwd(), "src/components"),
      "@pages": path.resolve(process.cwd(), "src/pages"),
      "@styles": path.resolve(process.cwd(), "src/styles"),
      "@hooks": path.resolve(process.cwd(), "src/hooks"),
      "@services": path.resolve(process.cwd(), "src/services"),
      "@types": path.resolve(process.cwd(), "src/types"),
      "@utils": path.resolve(process.cwd(), "src/utils"),
      "@assets": path.resolve(process.cwd(), "src/assets"),
      
      // Se você quiser manter a sintaxe "asset/nome.png" exatamente como no plugin:
      "asset": path.resolve(process.cwd(), "src/assets"),
    },
  },

  // Configuração Do Servidor De Desenvolvimento (Acesso Externo)
  
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: false,
    open: true,
    cors: true,
  },

  // Configuração Do Preview De Produção
  preview: {
    port: 8001,
    strictPort: false,
  },

  // Configuração De Build Otimizada
  build: {
    outDir: "dist",
    target: "es2020",
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: "esbuild",
    
    //  Organiza os arquivos gerados em pastas limpas dentro da 'dist'
    rollupOptions: {
      output: {
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
  },

  // Apenas arquivos não suportados nativamente pelo Vite
  assetsInclude: [
    "**/*.csv",
  ],

  // Melhor Debug No Terminal
  clearScreen: false,

  // Variáveis Globais de Compilação
  define: {
    __APP_VERSION__: JSON.stringify("1.0.0"),
  },
});