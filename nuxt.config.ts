// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/eslint',
    'vuetify-nuxt-module',
    '@nuxtjs/tailwindcss'
  ],

  // Vuetify 配置（可選，模組已提供預設配置）
  vuetify: {
    moduleOptions: {
      /* 模組特定選項 */
      // 如需自訂配置，請參考：https://nuxt.vuetifyjs.com/guide/
    },
    vuetifyOptions: {
      /* Vuetify 選項 */
      // 如需自訂 Vuetify 配置，請參考：https://nuxt.vuetifyjs.com/guide/
    }
  }
})