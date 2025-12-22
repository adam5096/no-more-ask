/**
 * 獲取儀表板通知列表
 * 
 * GET /api/dashboard/notifications
 * 
 * 用於儀表板顯示，返回最近的未讀通知
 */

import { getNotificationsByUserId } from '../../mocks/notifications'

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
  const limit = Number(query.limit) || 5 // 儀表板只顯示最近 5 條
  
  // 獲取用戶的通知
  let notifications = getNotificationsByUserId(userId)
  
  // 按時間排序（最新的在前）
  notifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  
  // 限制數量
  const limitedNotifications = notifications.slice(0, limit)
  
  return {
    notifications: limitedNotifications
  }
})

