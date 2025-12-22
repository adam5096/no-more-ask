/**
 * 救援請求 Mock 資料
 * 
 * 包含不同狀態的救援請求資料
 */

import type { RescueRequest } from '../../docs/types/orca-types'
import { generateId, randomDate, randomItem, randomNumber, randomFloat } from './utils'
import { mockUsers } from './users'
import { mockHelpers } from './helpers'

// 請求類型
const requestTypes: RescueRequest['requestType'][] = ['人力請求', '空間導航', '混合']

// 狀態列表
const statuses: RescueRequest['status'][] = ['pending', 'matched', 'in-progress', 'completed', 'cancelled']

// 預設描述範本
const descriptions = [
  '需要專業人士協助應對節慶聚會',
  '尋找避難地點，遠離家庭聚會',
  '需要情緒支持和實際協助',
  '節慶壓力過大，急需救援'
]

/**
 * 生成單一救援請求 Mock 資料
 */
export function createMockRescueRequest(
  userId: string,
  overrides?: Partial<RescueRequest>
): RescueRequest {
  const status = overrides?.status || randomItem(statuses)
  const createdAt = randomDate(30)
  const matchedHelperId = (status === 'matched' || status === 'in-progress' || status === 'completed')
    ? randomItem(mockHelpers)?.id
    : undefined
  
  return {
    id: generateId(),
    userId,
    requestType: randomItem(requestTypes),
    stressLevel: randomNumber(1, 5),
    budget: randomNumber(500, 5000),
    description: randomItem(descriptions),
    location: {
      lat: 25.0330 + (Math.random() - 0.5) * 0.1, // 台北附近
      lng: 121.5654 + (Math.random() - 0.5) * 0.1,
      address: '台北市信義區'
    },
    status,
    matchedHelperId,
    matchedAt: matchedHelperId ? randomDate(7) : undefined,
    rating: status === 'completed' ? randomNumber(1, 5) : undefined,
    review: status === 'completed' && Math.random() > 0.5
      ? '服務很好，非常感謝！'
      : undefined,
    createdAt,
    updatedAt: randomDate(7),
    completedAt: status === 'completed' ? randomDate(3) : undefined,
    cancelledAt: status === 'cancelled' ? randomDate(5) : undefined,
    ...overrides
  }
}

/**
 * 預設 Mock 救援請求列表
 */
export const mockRescueRequests: RescueRequest[] = [
  // 為 Escapee 和 SilentBuffer 用戶創建救援請求
  ...mockUsers
    .filter(user => user.role === 'Escapee' || user.role === 'SilentBuffer')
    .flatMap(user => [
      createMockRescueRequest(user.id, { status: 'pending' }),
      createMockRescueRequest(user.id, { status: 'matched' }),
      createMockRescueRequest(user.id, { status: 'completed' })
    ])
]

/**
 * 根據 ID 獲取救援請求
 */
export function getRescueRequestById(id: string): RescueRequest | undefined {
  return mockRescueRequests.find(request => request.id === id)
}

/**
 * 根據 User ID 獲取救援請求列表
 */
export function getRescueRequestsByUserId(userId: string): RescueRequest[] {
  return mockRescueRequests.filter(request => request.userId === userId)
}

/**
 * 根據狀態獲取救援請求列表
 */
export function getRescueRequestsByStatus(status: RescueRequest['status']): RescueRequest[] {
  return mockRescueRequests.filter(request => request.status === status)
}

/**
 * 生成更多救援請求（用於測試）
 */
export function generateRescueRequests(userIds: string[], count: number): RescueRequest[] {
  return Array.from({ length: count }, () => {
    const userId = randomItem(userIds)
    return createMockRescueRequest(userId)
  })
}

