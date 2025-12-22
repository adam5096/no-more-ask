/**
 * 更新用戶個人資料
 * 
 * PATCH /api/users/profile
 * 
 * 更新用戶的個人資料，包括暱稱、頭像、電話、位置、角色等
 */

import { mockUsers } from '../../mocks/users'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Mock 階段：從 header 或 cookie 獲取用戶 ID
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
  
  // 更新用戶資料（Mock 階段直接修改，實際應由後端處理）
  if (body.nickname !== undefined) user.nickname = body.nickname
  if (body.avatar !== undefined) user.avatar = body.avatar
  if (body.phone !== undefined) user.phone = body.phone
  if (body.location !== undefined) user.location = body.location
  if (body.role !== undefined) {
    user.role = body.role
    // 如果角色不在 roles 列表中，則添加
    if (!user.roles.includes(body.role)) {
      user.roles.push(body.role)
    }
  }
  user.updatedAt = new Date()
  
  // 返回更新後的用戶資料
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
      updatedAt: user.updatedAt
    }
  }
})

