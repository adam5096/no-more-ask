/**
 * 提交測驗答案
 * 
 * POST /api/diagnostic/submit-answers
 * 
 * 複雜業務流程：提交測驗答案（保留 action-oriented）
 * 觸發計算和報告生成
 */

import type { DiagnosticReport } from '../../../docs/types/orca-types'
import { generateId } from '../../mocks/utils'

// 預設處方箋範本
const prescriptions: Record<string, Record<string, string>> = {
  'elder': {
    'high-pressure': '建議放鬆心態，減少對晚輩的期待，多關注自己的興趣愛好。',
    'sensitive': '建議增加溝通，理解晚輩的處境，建立更和諧的關係。',
    'normal': '您的心態很健康，保持現狀即可。'
  },
  'junior': {
    'high-pressure': '建議學習應對技巧，設定邊界，保護自己的心理健康。',
    'sensitive': '建議增加自信，學會表達自己的需求，尋求支持。',
    'normal': '您的心理狀態良好，繼續保持。'
  }
}

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
  if (!body.testId || !body.answers) {
    throw createError({
      statusCode: 400,
      statusMessage: '測驗 ID 和答案不能為空'
    })
  }
  
  // Mock 階段：簡單計算心理陰影面積和社交標籤
  // 實際應由後端進行複雜的心理測驗計算
  const testType = body.testType || 'junior'
  const answers = body.answers as Record<string, any>
  
  // 簡單的計算邏輯（Mock）
  const answerCount = Object.keys(answers).length
  const shadowArea = Math.min(100, answerCount * 10 + Math.random() * 20) // 0-100
  
  // 根據陰影面積判斷社交標籤
  let socialLabel = 'normal'
  if (shadowArea > 70) {
    socialLabel = 'high-pressure'
  } else if (shadowArea > 40) {
    socialLabel = 'sensitive'
  }
  
  // 獲取對應的處方箋
  const prescription = prescriptions[testType]?.[socialLabel] || prescriptions[testType]?.['normal'] || '建議保持良好心態。'
  
  // 生成診斷報告（Mock 階段，實際應由後端處理）
  const reportId = generateId()
  const shareToken = generateId()
  
  const diagnosticReport: DiagnosticReport = {
    id: reportId,
    userId,
    testType: testType as 'elder' | 'junior',
    answers,
    shadowArea: Math.round(shadowArea),
    socialLabel: socialLabel === 'high-pressure' 
      ? (testType === 'elder' ? '高壓型長輩' : '高壓型後輩')
      : (socialLabel === 'sensitive'
        ? (testType === 'elder' ? '敏感型長輩' : '敏感型後輩')
        : (testType === 'elder' ? '正常型長輩' : '正常型後輩')),
    prescription,
    isShared: false,
    shareToken,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  return {
    report: {
      id: diagnosticReport.id,
      testType: diagnosticReport.testType,
      shadowArea: diagnosticReport.shadowArea,
      socialLabel: diagnosticReport.socialLabel,
      prescription: diagnosticReport.prescription,
      shareToken: diagnosticReport.shareToken,
      createdAt: diagnosticReport.createdAt
    }
  }
})

