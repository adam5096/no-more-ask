/**
 * 更新通知狀態
 * 
 * PATCH /api/notifications/[id]
 * 
 * 標記通知為已讀
 */

import { getNotificationById, mockNotifications } from '../../mocks/notifications'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '通知 ID 不能為空'
    })
  }
  
  // Mock 階段：從 header 或 cookie 獲取用戶 ID
  const userId = getCookie(event, 'user_id') || getHeader(event, 'x-user-id')
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權'
    })
  }
  
  const notification = getNotificationById(id)
  
  if (!notification) {
    throw createError({
      statusCode: 404,
      statusMessage: '通知不存在'
    })
  }
  
  // 檢查權限：只有通知擁有者可以更新
  if (notification.userId !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: '無權限更新此通知'
    })
  }
  
  // 更新狀態
  if (body.isRead !== undefined) {
    notification.isRead = body.isRead
    if (body.isRead && !notification.readAt) {
      notification.readAt = new Date()
    }
  }
  
  notification.updatedAt = new Date()
  
  return {
    success: true,
    notification: {
      id: notification.id,
      isRead: notification.isRead,
      readAt: notification.readAt,
      updatedAt: notification.updatedAt
    }
  }
})

