/**
 * 獲取 Helper 儀表板初始資料
 * 
 * GET /api/helpers/dashboard/init-data
 * 
 * 返回 Helper 狀態和業績統計
 */

import { getHelperByUserId } from '../../mocks/helpers'

export default defineEventHandler(async (event) => {
  // Mock 階段：從 header 或 cookie 獲取用戶 ID
  const userId = getCookie(event, 'user_id') || getHeader(event, 'x-user-id')
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權'
    })
  }
  
  const helper = getHelperByUserId(userId)
  
  if (!helper) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Helper 不存在'
    })
  }
  
  return {
    status: helper.status,
    stats: {
      totalCompleted: helper.totalCompleted,
      totalEarnings: helper.totalEarnings,
      rating: helper.rating,
      ratingCount: helper.ratingCount
    }
  }
})

