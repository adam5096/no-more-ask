/**
 * 通知 Mock 資料
 * 
 * 包含不同類型的通知資料
 */

import type { Notification } from '../../docs/types/orca-types'
import { generateId, randomDate, randomItem, randomNumber } from './utils'
import { mockUsers } from './users'
import { mockRescueRequests } from './rescue-requests'
import { mockGatherings } from './gatherings'

// 通知類型
const notificationTypes: Notification['type'][] = [
  'rescue-matched',
  'survival-check',
  'gathering-invite',
  'helper-request'
]

// 通知標題範本
const titles: Record<Notification['type'], string[]> = {
  'rescue-matched': [
    '救援請求已匹配',
    '找到適合的 Helper',
    '救援匹配成功'
  ],
  'survival-check': [
    '節慶生存回報',
    '節慶狀態檢查',
    '節慶提醒'
  ],
  'gathering-invite': [
    '收到聚會邀請',
    '新的聚會活動',
    '聚會邀請通知'
  ],
  'helper-request': [
    '收到救援請求',
    '新的救援需求',
    '待接案件通知'
  ]
}

// 通知內容範本
const contents: Record<Notification['type'], string[]> = {
  'rescue-matched': [
    '您的救援請求已成功匹配到 Helper，請查看詳情',
    '找到適合的 Helper 協助您，請確認匹配',
    '救援匹配完成，Helper 已準備就緒'
  ],
  'survival-check': [
    '節慶期間請記得回報您的狀態',
    '節慶生存檢查，您還好嗎？',
    '節慶提醒：記得照顧自己'
  ],
  'gathering-invite': [
    '您收到一個新的聚會邀請，快來看看吧',
    '有新的節慶聚會活動，歡迎參加',
    '聚會邀請：一起度過溫暖時光'
  ],
  'helper-request': [
    '您收到一個新的救援請求，請查看詳情',
    '有新的救援需求等待您的協助',
    '待接案件：請查看救援請求'
  ]
}

/**
 * 生成單一通知 Mock 資料
 */
export function createMockNotification(
  userId: string,
  overrides?: Partial<Notification>
): Notification {
  const type = overrides?.type || randomItem(notificationTypes)
  const isRead = overrides?.isRead ?? Math.random() > 0.3
  const createdAt = randomDate(7)
  
  // 根據通知類型設定關聯對象
  let relatedObjectId: string | undefined
  let relatedObjectType: string | undefined
  
  if (type === 'rescue-matched') {
    const request = randomItem(mockRescueRequests.filter(r => r.userId === userId))
    relatedObjectId = request?.id
    relatedObjectType = 'RescueRequest'
  } else if (type === 'gathering-invite') {
    const gathering = randomItem(mockGatherings)
    relatedObjectId = gathering?.id
    relatedObjectType = 'Gathering'
  } else if (type === 'helper-request') {
    const request = randomItem(mockRescueRequests.filter(r => r.status === 'pending'))
    relatedObjectId = request?.id
    relatedObjectType = 'RescueRequest'
  }
  
  return {
    id: generateId(),
    userId,
    type,
    title: randomItem(titles[type]),
    content: randomItem(contents[type]),
    lineMessageId: Math.random() > 0.5 ? `line_${generateId()}` : undefined,
    lineSentAt: Math.random() > 0.5 ? randomDate(3) : undefined,
    isRead,
    readAt: isRead ? randomDate(1) : undefined,
    relatedObjectId,
    relatedObjectType,
    createdAt,
    updatedAt: randomDate(1),
    ...overrides
  }
}

/**
 * 預設 Mock 通知列表
 */
export const mockNotifications: Notification[] = [
  // 為所有用戶創建一些通知
  ...mockUsers.flatMap(user => [
    createMockNotification(user.id, { type: 'rescue-matched', isRead: false }),
    createMockNotification(user.id, { type: 'gathering-invite', isRead: false }),
    createMockNotification(user.id, { type: 'survival-check', isRead: true }),
    createMockNotification(user.id, { type: 'helper-request', isRead: false })
  ])
]

/**
 * 根據 ID 獲取通知
 */
export function getNotificationById(id: string): Notification | undefined {
  return mockNotifications.find(notification => notification.id === id)
}

/**
 * 根據 User ID 獲取通知列表
 */
export function getNotificationsByUserId(userId: string): Notification[] {
  return mockNotifications.filter(notification => notification.userId === userId)
}

/**
 * 根據類型獲取通知列表
 */
export function getNotificationsByType(type: Notification['type']): Notification[] {
  return mockNotifications.filter(notification => notification.type === type)
}

/**
 * 獲取未讀通知數量
 */
export function getUnreadNotificationCount(userId: string): number {
  return mockNotifications.filter(
    notification => notification.userId === userId && !notification.isRead
  ).length
}

/**
 * 生成更多通知（用於測試）
 */
export function generateNotifications(userIds: string[], count: number): Notification[] {
  return Array.from({ length: count }, () => {
    const userId = randomItem(userIds)
    return createMockNotification(userId)
  })
}

