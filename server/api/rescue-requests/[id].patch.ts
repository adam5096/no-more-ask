/**
 * 更新救援請求狀態
 * 
 * PATCH /api/rescue-requests/[id]
 * 
 * 更新救援請求狀態（接受匹配、標記完成、評價 Helper）
 */

import { getRescueRequestById, mockRescueRequests } from '../../mocks/rescue-requests'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '請求 ID 不能為空'
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
  
  const request = getRescueRequestById(id)
  
  if (!request) {
    throw createError({
      statusCode: 404,
      statusMessage: '救援請求不存在'
    })
  }
  
  // 檢查權限：只有請求擁有者可以更新
  if (request.userId !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: '無權限更新此請求'
    })
  }
  
  // 更新狀態
  if (body.status !== undefined) {
    request.status = body.status
    
    // 根據狀態設定相關時間戳記
    if (body.status === 'completed') {
      request.completedAt = new Date()
    } else if (body.status === 'cancelled') {
      request.cancelledAt = new Date()
    } else if (body.status === 'matched' && !request.matchedAt) {
      request.matchedAt = new Date()
    }
  }
  
  // 更新評價
  if (body.rating !== undefined) {
    request.rating = body.rating
  }
  if (body.review !== undefined) {
    request.review = body.review
  }
  
  request.updatedAt = new Date()
  
  return {
    success: true,
    request: {
      id: request.id,
      status: request.status,
      rating: request.rating,
      review: request.review,
      updatedAt: request.updatedAt
    }
  }
})

