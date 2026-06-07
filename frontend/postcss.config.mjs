/**
 * postcss.config.mjs
 * 
 * Configuração profissional do PostCSS
 * Sistema Oficina Mecânica
 * 
 *
 * Tailwind CSS v4 + Vite já configuram automaticamente:
 *
 * - Tailwind CSS
 * - Autoprefixer
 * - Otimizações básicas
 *
 * Este arquivo foi mantido para:
 *
 * - Escalabilidade futura
 * - Organização profissional
 * - Plugins adicionais
 * - Compatibilidade avançada
 * - Minificação otimizada
 *
 * 
 * Plugins opcionais já preparados:
 *
 * postcss-nested
 * cssnano
 *
 * Para instalar:
 *
 * npm install -D postcss-nested cssnano
 *
 * 
 */

export default {
  plugins: {
    /**
     * Permite CSS aninhado:
     *
     * Exemplo:
     *
     * .card {
     *   .title {
     *     color: red;
     *   }
     * }
     */

    // "postcss-nested": {},

    /**
     * Minificação avançada para produção
     * Remove espaços desnecessários
     * Otimiza CSS automaticamente
     */

    // cssnano: {
    //   preset: "default",
    // },
  },
};
