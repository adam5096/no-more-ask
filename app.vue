<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <NuxtRouteAnnouncer />
    
    <!-- Tailwind CSS 測試頁面 -->
    <div class="container mx-auto px-4 py-16">
      <!-- 標題區域 -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-gray-800 mb-4">
          Tailwind CSS 測試頁面
        </h1>
        <p class="text-xl text-gray-600">
          驗證 Tailwind Utility Classes 是否正常運作
        </p>
      </div>

      <!-- 卡片網格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- 卡片 1: 顏色測試 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-blue-500 rounded-full mb-4"></div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">顏色測試</h2>
          <p class="text-gray-600 mb-4">驗證背景色、文字色等顏色 utility</p>
          <div class="flex gap-2">
            <span class="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">Red</span>
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Green</span>
            <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Yellow</span>
          </div>
        </div>

        <!-- 卡片 2: 間距測試 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-purple-500 rounded-full mb-4"></div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">間距測試</h2>
          <p class="text-gray-600 mb-4">驗證 padding、margin 等間距 utility</p>
          <div class="space-y-2">
            <div class="h-2 bg-purple-200 rounded"></div>
            <div class="h-2 bg-purple-300 rounded"></div>
            <div class="h-2 bg-purple-400 rounded"></div>
          </div>
        </div>

        <!-- 卡片 3: 響應式測試 -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="w-12 h-12 bg-pink-500 rounded-full mb-4"></div>
          <h2 class="text-2xl font-semibold text-gray-800 mb-2">響應式測試</h2>
          <p class="text-gray-600 mb-4">驗證響應式設計 utility</p>
          <div class="text-sm text-gray-500">
            <p class="hidden md:block">中等螢幕可見</p>
            <p class="block md:hidden">小螢幕可見</p>
          </div>
        </div>
      </div>

      <!-- 按鈕測試區域 -->
      <div class="bg-white rounded-lg shadow-lg p-8 mb-12">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">按鈕樣式測試</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold">
            主要按鈕
          </button>
          <button class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
            成功按鈕
          </button>
          <button class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold">
            危險按鈕
          </button>
          <button class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
            外框按鈕
          </button>
        </div>
      </div>

      <!-- 狀態指示器 -->
      <div class="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
        <div class="flex items-center justify-center mb-2">
          <svg class="w-8 h-8 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <h3 class="text-2xl font-bold text-green-800">Tailwind CSS 運作正常！</h3>
        </div>
        <p class="text-green-700">所有 utility classes 都已正確載入並應用</p>
      </div>
    </div>
  </div>
</template>
