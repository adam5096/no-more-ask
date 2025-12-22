/**
 * 獲取通知列表
 * 
 * GET /api/notifications
 * 
 * 支援篩選（已讀/未讀、類型）和分頁
 */

import { getNotificationsByUserId, getUnreadNotificationCount } from '../../mocks/notifications'

export default defineEventHandler(async (event) => {
  // Mock 階段：從 header 或 cookie 獲取用戶 ID
  const userId = getCookie(event, 'user_id') || getHeader(event, 'x-user-id')
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權'
    })
  }
  
  const query = getQuery(event)
  const isRead = query.isRead !== undefined ? query.isRead === 'true' : undefined
  const type = query.type as string | undefined
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  
  // 獲取用戶的通知
  let notifications = getNotificationsByUserId(userId)
  
  // 篩選
  if (isRead !== undefined) {
    notifications = notifications.filter(n => n.isRead === isRead)
  }
  if (type) {
    notifications = notifications.filter(n => n.type === type)
  }
  
  // 按時間排序（最新的在前）
  notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  // 分頁
  const total = notifications.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedNotifications = notifications.slice(start, end)
  
  const unreadCount = getUnreadNotificationCount(userId)
  
  return {
    notifications: paginatedNotifications,
    unreadCount,
    pagination: {
      page,
      total,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
})

