/**
 * 獲取可接的救援請求列表
 * 
 * GET /api/helpers/dashboard/available-requests
 * 
 * 根據 Helper 位置與技能篩選可用請求
 */

import { getHelperByUserId } from '../../mocks/helpers'
import { getRescueRequestsByStatus } from '../../mocks/rescue-requests'
import { mockUsers } from '../../mocks/users'

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
  
  // 只顯示在線且可接案的 Helper
  if (helper.status !== 'online') {
    return {
      requests: [],
      pagination: {
        page: 1,
        total: 0,
        limit: 10
      }
    }
  }
  
  // 獲取待匹配的救援請求
  const availableRequests = getRescueRequestsByStatus('pending')
    .slice(0, 10) // 限制數量
  
  // 為每個請求添加用戶資訊
  const requestsWithUser = availableRequests.map(request => {
    const user = mockUsers.find(u => u.id === request.userId)
    return {
      id: request.id,
      requestType: request.requestType,
      stressLevel: request.stressLevel,
      budget: request.budget,
      description: request.description,
      location: request.location,
      createdAt: request.createdAt,
      user: user ? {
        nickname: user.nickname,
        avatar: user.avatar
      } : undefined
    }
  })
  
  return {
    requests: requestsWithUser,
    pagination: {
      page: 1,
      total: availableRequests.length,
      limit: 10
    }
  }
})

