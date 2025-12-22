/**
 * 宣洩貼文 Mock 資料
 * 
 * 包含匿名和公開的貼文資料
 */

import type { VentPost, Comment } from '../../docs/types/orca-types'
import { generateId, randomDate, randomItem, randomNumber, randomItems } from './utils'
import { mockUsers } from './users'
import { mockGatherings } from './gatherings'

// 貼文內容範本
const postContents = [
  '今天又被問到什麼時候結婚了...',
  '節慶又要到了，壓力好大',
  '不想參加家庭聚會，但又不知道怎麼拒絕',
  '有沒有人也覺得節慶很累？',
  '需要同溫層的溫暖支持',
  '節慶逃兵報到！',
  '家庭聚會真的讓人很焦慮',
  '尋找節慶避難所'
]

// 留言內容範本
const commentContents = [
  '我懂你的感受！',
  '加油，你不是一個人',
  '節慶確實很累，一起撐過去',
  '我也在逃避家庭聚會',
  '同溫層給你溫暖'
]

/**
 * 生成單一留言 Mock 資料
 */
export function createMockComment(userId: string): Comment {
  return {
    id: generateId(),
    userId,
    content: randomItem(commentContents),
    isAnonymous: Math.random() > 0.5,
    createdAt: randomDate(7)
  }
}

/**
 * 生成單一貼文 Mock 資料
 */
export function createMockVentPost(
  userId: string,
  overrides?: Partial<VentPost>
): VentPost {
  const isAnonymous = overrides?.isAnonymous ?? Math.random() > 0.5
  const relatedGatheringId = Math.random() > 0.7
    ? randomItem(mockGatherings)?.id
    : undefined
  
  const commentCount = randomNumber(0, 10)
  const comments = Array.from({ length: commentCount }, () => {
    const commentUserId = randomItem(mockUsers).id
    return createMockComment(commentUserId)
  })
  
  return {
    id: generateId(),
    userId,
    content: randomItem(postContents),
    images: Math.random() > 0.7 ? [`https://picsum.photos/400/300?random=${generateId()}`] : undefined,
    isAnonymous,
    location: Math.random() > 0.5 ? {
      lat: 25.0330 + (Math.random() - 0.5) * 0.1,
      lng: 121.5654 + (Math.random() - 0.5) * 0.1,
      address: '台北市信義區'
    } : undefined,
    likes: randomNumber(0, 50),
    comments,
    commentCount,
    relatedGatheringId,
    createdAt: randomDate(7),
    updatedAt: randomDate(3),
    ...overrides
  }
}

/**
 * 預設 Mock 貼文列表
 */
export const mockVentPosts: VentPost[] = [
  // 為所有用戶創建一些貼文
  ...mockUsers.flatMap(user => [
    createMockVentPost(user.id, { isAnonymous: false }),
    createMockVentPost(user.id, { isAnonymous: true })
  ])
]

/**
 * 根據 ID 獲取貼文
 */
export function getVentPostById(id: string): VentPost | undefined {
  return mockVentPosts.find(post => post.id === id)
}

/**
 * 根據 User ID 獲取貼文列表
 */
export function getVentPostsByUserId(userId: string): VentPost[] {
  return mockVentPosts.filter(post => post.userId === userId)
}

/**
 * 根據聚會 ID 獲取相關貼文
 */
export function getVentPostsByGatheringId(gatheringId: string): VentPost[] {
  return mockVentPosts.filter(post => post.relatedGatheringId === gatheringId)
}

/**
 * 生成更多貼文（用於測試）
 */
export function generateVentPosts(userIds: string[], count: number): VentPost[] {
  return Array.from({ length: count }, () => {
    const userId = randomItem(userIds)
    return createMockVentPost(userId)
  })
}

