/**
 * 更新 Helper 狀態或資料
 * 
 * PATCH /api/helpers/[id]
 * 
 * 更新 Helper 個人檔案或接案狀態
 */

import { getHelperById, mockHelpers } from '../../mocks/helpers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Helper ID 不能為空'
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
  
  const helper = getHelperById(id)
  
  if (!helper) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Helper 不存在'
    })
  }
  
  // 檢查權限：只有 Helper 擁有者可以更新
  if (helper.userId !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: '無權限更新此 Helper'
    })
  }
  
  // 更新資料
  if (body.skills !== undefined) helper.skills = body.skills
  if (body.bio !== undefined) helper.bio = body.bio
  if (body.hourlyRate !== undefined) helper.hourlyRate = body.hourlyRate
  if (body.status !== undefined) helper.status = body.status
  if (body.availableUntil !== undefined) helper.availableUntil = body.availableUntil
  
  helper.updatedAt = new Date()
  
  return {
    success: true,
    helper: {
      id: helper.id,
      skills: helper.skills,
      bio: helper.bio,
      hourlyRate: helper.hourlyRate,
      status: helper.status,
      availableUntil: helper.availableUntil,
      updatedAt: helper.updatedAt
    }
  }
})

