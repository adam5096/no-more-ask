/**
 * 開始診斷測驗
 * 
 * POST /api/diagnostic/start-test
 * 
 * 複雜業務流程：開始診斷測驗（保留 action-oriented）
 * 創建新的測驗實例並初始化狀態
 */

import type { DiagnosticReport } from '../../../docs/types/orca-types'
import { generateId } from '../../mocks/utils'

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
  if (!body.testType) {
    throw createError({
      statusCode: 400,
      statusMessage: '測驗類型不能為空'
    })
  }
  
  // 創建測驗實例（Mock 階段，實際應由後端處理）
  const testId = generateId()
  
  // 返回測驗 ID 和初始狀態
  return {
    testId,
    testType: body.testType,
    status: 'in-progress',
    createdAt: new Date(),
    message: '測驗已開始，請開始回答問題'
  }
})

