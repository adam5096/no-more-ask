/**
 * 獲取 Helper 詳情
 * 
 * GET /api/helpers/[id]/details
 * 
 * 聚合 Helper + 歷史業績 + 評價列表
 */

import { getHelperById } from '../../mocks/helpers'
import { getRescueRequestsByStatus } from '../../mocks/rescue-requests'
import { mockUsers } from '../../mocks/users'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Helper ID 不能為空'
    })
  }
  
  const helper = getHelperById(id)
  
  if (!helper) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Helper 不存在'
    })
  }
  
  // 獲取歷史完成案件列表（已完成且匹配到此 Helper 的請求）
  const completedRequests = getRescueRequestsByStatus('completed')
    .filter(r => r.matchedHelperId === helper.id)
    .slice(0, 10) // 限制數量
  
  // 獲取評價列表（從完成的請求中提取）
  const reviews = completedRequests
    .filter(r => r.rating && r.review)
    .map(r => {
      const user = mockUsers.find(u => u.id === r.userId)
      return {
        id: r.id,
        rating: r.rating!,
        review: r.review!,
        createdAt: r.completedAt || r.updatedAt,
        user: user ? {
          nickname: user.nickname,
          avatar: user.avatar
        } : undefined
      }
    })
  
  return {
    helper: {
      id: helper.id,
      userId: helper.userId,
      skills: helper.skills,
      bio: helper.bio,
      hourlyRate: helper.hourlyRate,
      status: helper.status,
      rating: helper.rating,
      ratingCount: helper.ratingCount
    },
    completedRequests: completedRequests.slice(0, 5), // 限制數量
    reviews
  }
})

