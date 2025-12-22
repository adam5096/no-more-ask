/**
 * Mock 資料工具函數
 * 
 * 提供 Mock 資料生成、關聯資料生成等功能
 * 預留未來串接真實後端 API 的切換機制
 */

/**
 * 生成 UUID（簡化版，僅用於 Mock）
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 生成隨機日期（過去 N 天內）
 */
export function randomDate(daysAgo: number = 30): Date {
  const now = new Date()
  const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime())
  return new Date(randomTime)
}

/**
 * 從陣列中隨機選擇一個元素
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 從陣列中隨機選擇 N 個元素
 */
export function randomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, array.length))
}

/**
 * 生成隨機數字（範圍內）
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成隨機浮點數（範圍內）
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * 檢查是否使用 Mock 資料
 * 預留未來切換到真實 API 的機制
 */
export function useMockData(): boolean {
  // 開發環境預設使用 Mock 資料
  // 可透過環境變數控制：process.env.USE_MOCK_DATA !== 'false'
  return process.env.USE_MOCK_DATA !== 'false'
}

