<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
    <NuxtRouteAnnouncer />
    
    <!-- Tailwind CSS 測試頁面 -->
    <div class="container mx-auto px-4 py-16">
      <!-- 標題區域 -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-neutral-800 mb-4">
          Design Tokens + Tailwind CSS
        </h1>
        <p class="text-xl text-neutral-600">
          使用 Style Dictionary 管理 Design Tokens，並整合到 Tailwind CSS
        </p>
      </div>

      <!-- 卡片網格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- 卡片 1: 顏色測試 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-primary-500 rounded-full mb-4"></div>
          <h2 class="text-2xl font-semibold text-neutral-800 mb-2">顏色測試</h2>
          <p class="text-neutral-600 mb-4">使用 Design Tokens 語義化顏色</p>
          <div class="flex gap-2">
            <span class="px-3 py-1 bg-danger-100 text-danger-800 rounded-full text-sm">Danger</span>
            <span class="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm">Success</span>
            <span class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">Primary</span>
          </div>
        </div>

        <!-- 卡片 2: 間距測試 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-primary-400 rounded-full mb-4"></div>
          <h2 class="text-2xl font-semibold text-neutral-800 mb-2">間距測試</h2>
          <p class="text-neutral-600 mb-4">使用 Design Tokens 間距值</p>
          <div class="space-y-2">
            <div class="h-2 bg-primary-200 rounded" style="width: var(--spacing-12);"></div>
            <div class="h-2 bg-primary-300 rounded" style="width: var(--spacing-16);"></div>
            <div class="h-2 bg-primary-400 rounded" style="width: var(--spacing-20);"></div>
          </div>
        </div>

        <!-- 卡片 3: 響應式測試 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-primary-300 rounded-full mb-4"></div>
          <h2 class="text-2xl font-semibold text-neutral-800 mb-2">響應式測試</h2>
          <p class="text-neutral-600 mb-4">驗證響應式設計 utility</p>
          <div class="text-sm text-neutral-500">
            <p class="hidden md:block">中等螢幕可見</p>
            <p class="block md:hidden">小螢幕可見</p>
          </div>
        </div>
      </div>

      <!-- 按鈕測試區域 -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 class="text-3xl font-bold text-neutral-800 mb-6 text-center">按鈕樣式測試</h2>
        <p class="text-center text-neutral-600 mb-6">
          使用 Design Tokens：語義化命名（primary, success, danger）而非直接顏色名稱
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <button class="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold">
            主要按鈕 (primary)
          </button>
          <button class="px-6 py-3 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors font-semibold">
            成功按鈕 (success)
          </button>
          <button class="px-6 py-3 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition-colors font-semibold">
            危險按鈕 (danger)
          </button>
          <button class="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-semibold">
            外框按鈕 (neutral)
          </button>
        </div>
      </div>

      <!-- Design Tokens 展示區域 -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 class="text-3xl font-bold text-neutral-800 mb-6 text-center">Design Tokens 展示</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 語義化顏色 -->
          <div>
            <h3 class="text-xl font-semibold text-neutral-700 mb-4">語義化顏色 Tokens</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-primary-500 rounded-lg"></div>
                <span class="text-neutral-700">primary-500</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-success-500 rounded-lg"></div>
                <span class="text-neutral-700">success-500</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-danger-500 rounded-lg"></div>
                <span class="text-neutral-700">danger-500</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-neutral-500 rounded-lg"></div>
                <span class="text-neutral-700">neutral-500</span>
              </div>
            </div>
          </div>
          <!-- 間距 Tokens -->
          <div>
            <h3 class="text-xl font-semibold text-neutral-700 mb-4">間距 Tokens</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <div class="bg-primary-200 rounded" style="width: var(--spacing-4); height: var(--spacing-4);"></div>
                <span class="text-neutral-700">spacing-4 (1rem)</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="bg-primary-300 rounded" style="width: var(--spacing-6); height: var(--spacing-6);"></div>
                <span class="text-neutral-700">spacing-6 (1.5rem)</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="bg-primary-400 rounded" style="width: var(--spacing-8); height: var(--spacing-8);"></div>
                <span class="text-neutral-700">spacing-8 (2rem)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 狀態指示器 -->
      <div class="bg-success-50 border-2 border-success-200 rounded-lg p-6 text-center">
        <div class="flex items-center justify-center mb-2">
          <svg class="w-8 h-8 text-success-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 class="text-2xl font-bold text-success-800">Design Tokens 整合成功！</h3>
        </div>
        <p class="text-success-700">Style Dictionary + Tailwind CSS 已正確配置並運作</p>
      </div>
    </div>
  </div>
</template>
