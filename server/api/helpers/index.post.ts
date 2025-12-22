/**
 * 註冊成為 Helper
 * 
 * POST /api/helpers
 * 
 * 創建新的 Helper 資料
 */

import { createMockHelper, mockHelpers } from '../../mocks/helpers'
import { getHelperByUserId } from '../../mocks/helpers'

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
  
  // 基本變數檢查
  if (!body.skills || !body.bio) {
    throw createError({
      statusCode: 400,
      statusMessage: '技能和個人簡介不能為空'
    })
  }
  
  // 檢查是否已經註冊為 Helper（MVP 限制：一個 User 只能有一個 Helper）
  const existingHelper = getHelperByUserId(userId)
  
  if (existingHelper) {
    throw createError({
      statusCode: 409,
      statusMessage: '您已經註冊為 Helper'
    })
  }
  
  // 創建 Helper（Mock 階段，實際應由後端處理）
  const newHelper = createMockHelper(userId, {
    skills: body.skills,
    bio: body.bio,
    hourlyRate: body.hourlyRate,
    status: 'online'
  })
  
  // 將新 Helper 加入 Mock 資料（實際應由後端處理）
  mockHelpers.push(newHelper)
  
  return {
    id: newHelper.id,
    status: newHelper.status,
    createdAt: newHelper.createdAt
  }
})

