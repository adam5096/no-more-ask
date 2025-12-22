/**
 * 獲取用戶的救援請求列表
 * 
 * GET /api/dashboard/rescue-requests
 * 
 * 用於儀表板顯示，支援分頁和狀態篩選
 */

import { getRescueRequestsByUserId } from '../../mocks/rescue-requests'

export default defineEventHandler(async (event) => {
  // Mock 階段：從 header 或 cookie 獲取用戶 ID
  const userId = getCookie(event, 'user_id') || getHeader(event, 'x-user-id')
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權'
    })
  }
  
  const query = getQuery(event)
  const status = query.status as string | undefined
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  
  // 獲取用戶的救援請求
  let requests = getRescueRequestsByUserId(userId)
  
  // 狀態篩選
  if (status) {
    requests = requests.filter(r => r.status === status)
  }
  
  // 分頁
  const total = requests.length
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedRequests = requests.slice(start, end)
  
  return {
    requests: paginatedRequests,
    pagination: {
      page,
      total,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
})

