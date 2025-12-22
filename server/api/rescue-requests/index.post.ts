/**
 * 建立救援請求
 * 
 * POST /api/rescue-requests
 * 
 * 創建新的救援請求
 */

import { createMockRescueRequest, mockRescueRequests } from '../../mocks/rescue-requests'

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
  if (!body.requestType || !body.stressLevel || !body.location) {
    throw createError({
      statusCode: 400,
      statusMessage: '請求類型、壓力等級和地理位置不能為空'
    })
  }
  
  // 創建救援請求（Mock 階段，實際應由後端處理）
  const newRequest = createMockRescueRequest(userId, {
    requestType: body.requestType,
    stressLevel: body.stressLevel,
    budget: body.budget,
    description: body.description,
    location: body.location,
    status: 'pending'
  })
  
  // 將新請求加入 Mock 資料（實際應由後端處理）
  mockRescueRequests.push(newRequest)
  
  return {
    id: newRequest.id,
    status: newRequest.status,
    createdAt: newRequest.createdAt
  }
})

