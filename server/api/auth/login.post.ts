/**
 * 登入 API
 * 
 * POST /api/auth/login
 * 
 * 基本變數檢查：email、password 不能為空
 * 返回 Mock 資料：token 和用戶資訊
 */

import { getUserByEmail } from '../../mocks/users'
import { generateId } from '../../mocks/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 基本變數檢查
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email 和密碼不能為空'
    })
  }
  
  // Mock 驗證：查找用戶（Mock 階段不驗證密碼）
  const user = getUserByEmail(body.email)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email 或密碼錯誤'
    })
  }
  
  // 生成簡單的 token（Mock 階段）
  const token = `mock_token_${generateId()}`
  
  // 返回用戶資訊（不包含敏感資料）
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role
    }
  }
})

