/**
 * 獲取用戶個人資料
 * 
 * GET /api/users/profile
 * 
 * 從 Mock 資料獲取當前用戶的個人資料
 */

import { mockUsers } from '../../mocks/users'

export default defineEventHandler(async (event) => {
  // Mock 階段：從 header 或 cookie 獲取用戶 ID
  // 實際應從 JWT token 解析用戶 ID
  const userId = getCookie(event, 'user_id') || getHeader(event, 'x-user-id')
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權'
    })
  }
  
  const user = mockUsers.find(u => u.id === userId)
  
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: '用戶不存在'
    })
  }
  
  // 返回用戶資料（不包含敏感資料）
  return {
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
      roles: user.roles,
      location: user.location,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt
    }
  }
})

