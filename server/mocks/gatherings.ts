/**
 * 聚會 Mock 資料
 * 
 * 包含不同狀態的聚會資料
 */

import type { Gathering } from '../../docs/types/orca-types'
import { generateId, randomDate, randomItem, randomNumber, randomItems } from './utils'
import { mockUsers } from './users'

// 狀態列表
const statuses: Gathering['status'][] = ['open', 'full', 'completed', 'cancelled']

// 聚會標題範本
const titles = [
  '節慶邊緣人小聚', '單身節慶派對', '逃離家庭聚會', '節慶避難所',
  '溫暖小聚', '節慶同溫層', '邊緣人聚會', '節慶救星聚會'
]

// 聚會描述範本
const descriptions = [
  '歡迎所有節慶邊緣人一起度過溫暖時光',
  '遠離家庭聚會壓力，享受輕鬆氛圍',
  '節慶避難所，提供溫暖陪伴',
  '單身或不想參加家庭聚會的朋友們，一起來吧！'
]

/**
 * 生成單一聚會 Mock 資料
 */
export function createMockGathering(
  creatorId: string,
  overrides?: Partial<Gathering>
): Gathering {
  const status = overrides?.status || randomItem(statuses)
  const maxParticipants = randomNumber(5, 20)
  const participants = status === 'open' || status === 'full'
    ? randomItems(
        mockUsers.filter(u => u.id !== creatorId).map(u => u.id),
        status === 'full' ? maxParticipants : randomNumber(0, maxParticipants - 1)
      )
    : []
  
  const createdAt = randomDate(60)
  const scheduledAt = new Date(Date.now() + randomNumber(1, 30) * 24 * 60 * 60 * 1000) // 未來 1-30 天
  
  return {
    id: generateId(),
    creatorId,
    title: randomItem(titles),
    description: randomItem(descriptions),
    location: {
      lat: 25.0330 + (Math.random() - 0.5) * 0.1,
      lng: 121.5654 + (Math.random() - 0.5) * 0.1,
      address: '台北市信義區'
    },
    scheduledAt,
    maxParticipants,
    participants,
    status,
    createdAt,
    updatedAt: randomDate(30),
    completedAt: status === 'completed' ? randomDate(3) : undefined,
    cancelledAt: status === 'cancelled' ? randomDate(5) : undefined,
    ...overrides
  }
}

/**
 * 預設 Mock 聚會列表
 */
export const mockGatherings: Gathering[] = [
  // 為 UrbanLoner 用戶創建聚會
  ...mockUsers
    .filter(user => user.role === 'UrbanLoner')
    .flatMap(user => [
      createMockGathering(user.id, { status: 'open' }),
      createMockGathering(user.id, { status: 'full' }),
      createMockGathering(user.id, { status: 'completed' })
    ])
]

/**
 * 根據 ID 獲取聚會
 */
export function getGatheringById(id: string): Gathering | undefined {
  return mockGatherings.find(gathering => gathering.id === id)
}

/**
 * 根據 Creator ID 獲取聚會列表
 */
export function getGatheringsByCreatorId(creatorId: string): Gathering[] {
  return mockGatherings.filter(gathering => gathering.creatorId === creatorId)
}

/**
 * 根據參與者 ID 獲取聚會列表
 */
export function getGatheringsByParticipantId(userId: string): Gathering[] {
  return mockGatherings.filter(gathering => 
    gathering.participants.includes(userId) || gathering.creatorId === userId
  )
}

/**
 * 根據狀態獲取聚會列表
 */
export function getGatheringsByStatus(status: Gathering['status']): Gathering[] {
  return mockGatherings.filter(gathering => gathering.status === status)
}

/**
 * 生成更多聚會（用於測試）
 */
export function generateGatherings(creatorIds: string[], count: number): Gathering[] {
  return Array.from({ length: count }, () => {
    const creatorId = randomItem(creatorIds)
    return createMockGathering(creatorId)
  })
}

