// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt'
  ],

  // 載入自訂 CSS 文件，確保設計 tokens 和 Tailwind 樣式被正確處理
  // 注意：tokens.css 必須在 tailwind.css 之前載入，順序很重要
  css: ['~/assets/css/tokens.css', '~/assets/css/tailwind.css'],

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  }
})