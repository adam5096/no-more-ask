// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@vueuse/nuxt'
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
  },

  // 運行時配置：Mock 資料切換機制
  runtimeConfig: {
    // 私有配置（僅在服務器端可用）
    useMockData: process.env.USE_MOCK_DATA !== 'false', // 預設使用 Mock 資料
    
    // 公開配置（可在客戶端和服務器端使用）
    public: {
      apiBaseUrl: process.env.API_BASE_URL || '/api', // API 基礎路徑
      useMockData: process.env.USE_MOCK_DATA !== 'false' // 預設使用 Mock 資料
    }
  }
})