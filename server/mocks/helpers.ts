/**
 * Helper Mock 資料
 * 
 * 包含 Helper 的服務資訊、業績統計等資料
 */

import type { Helper } from '../../docs/types/orca-types'
import { generateId, randomDate, randomItem, randomItems, randomNumber } from './utils'
import { mockUsers } from './users'

// 預設技能標籤
const skillTags = [
  '酒量大', '會修電腦', '奧斯卡演技', '社交達人', '時間管理',
  '情緒支持', '導航專家', '應對長輩', '節慶規劃', '危機處理'
]

// 預設簡介範本
const bioTemplates = [
  '專業的節慶救援者，擅長應對各種社交場合',
  '擁有豐富的節慶經驗，能提供即時支援',
  '溫暖陪伴，專業服務，讓您安心度過節慶',
  '節慶救星，隨時待命，為您排憂解難'
]

/**
 * 生成單一 Helper Mock 資料
 */
export function createMockHelper(userId: string, overrides?: Partial<Helper>): Helper {
  const skills = randomItems(skillTags, randomNumber(2, 5))
  const createdAt = randomDate(180)
  
  return {
    id: generateId(),
    userId,
    skills,
    bio: randomItem(bioTemplates),
    hourlyRate: randomNumber(300, 1000),
    status: randomItem(['online', 'offline', 'busy']),
    availableUntil: randomDate(30),
    totalCompleted: randomNumber(0, 50),
    totalEarnings: randomNumber(0, 50000),
    rating: randomNumber(35, 50) / 10, // 3.5 - 5.0
    ratingCount: randomNumber(0, 30),
    createdAt,
    updatedAt: randomDate(30),
    ...overrides
  }
}

/**
 * 預設 Mock Helper 列表
 */
export const mockHelpers: Helper[] = [
  // 找到 Helper 角色的用戶
  ...mockUsers
    .filter(user => user.role === 'Helper' || user.roles.includes('Helper'))
    .map(user => createMockHelper(user.id, {
      status: 'online',
      totalCompleted: randomNumber(10, 30),
      rating: randomNumber(40, 50) / 10
    }))
]

/**
 * 根據 ID 獲取 Helper
 */
export function getHelperById(id: string): Helper | undefined {
  return mockHelpers.find(helper => helper.id === id)
}

/**
 * 根據 User ID 獲取 Helper
 */
export function getHelperByUserId(userId: string): Helper | undefined {
  return mockHelpers.find(helper => helper.userId === userId)
}

/**
 * 生成更多 Helper（用於測試）
 */
export function generateHelpers(userIds: string[], count: number): Helper[] {
  return Array.from({ length: count }, () => {
    const userId = randomItem(userIds)
    return createMockHelper(userId)
  })
}

