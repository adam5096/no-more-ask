/**
 * 註冊 API
 * 
 * POST /api/auth/register
 * 
 * 基本變數檢查：email、password、nickname 不能為空
 * 返回 Mock 資料：token 和用戶資訊
 */

import { createMockUser, mockUsers } from '../../mocks/users'
import { generateId } from '../../mocks/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 基本變數檢查
  if (!body.email || !body.password || !body.nickname) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email、密碼和暱稱不能為空'
    })
  }
  
  // Mock 驗證：檢查 email 是否已存在
  const existingUser = mockUsers.find(user => user.email === body.email)
  
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Email 已被註冊'
    })
  }
  
  // 創建新用戶（Mock 階段，實際應由後端處理）
  const newUser = createMockUser({
    email: body.email,
    nickname: body.nickname,
    passwordHash: 'hashed_password', // Mock 階段不實際加密
    role: 'Escapee', // 預設角色
    roles: ['Escapee']
  })
  
  // 將新用戶加入 Mock 資料（實際應由後端處理）
  mockUsers.push(newUser)
  
  // 生成簡單的 token（Mock 階段）
  const token = `mock_token_${generateId()}`
  
  // 返回用戶資訊（不包含敏感資料）
  return {
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      avatar: newUser.avatar,
      role: newUser.role
    }
  }
})

