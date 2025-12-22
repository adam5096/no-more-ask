/**
 * 生成應對腳本
 * 
 * POST /api/response-kit/generate
 * 
 * 複雜業務流程：生成應對腳本（保留 action-oriented）
 * MVP 階段：腳本由前端工程師或 API SERVER 提供，不依賴 AI 生成
 */

import type { ResponseScript } from '../../../docs/types/orca-types'
import { generateId } from '../../mocks/utils'

// 預設腳本範本（根據問題和語氣返回對應腳本）
const scriptTemplates: Record<string, Record<string, string>> = {
  'humorous': {
    '結婚': '哈哈，我還在享受單身生活呢！等緣分到了自然就會結婚的。',
    '工作': '工作還不錯，正在努力中。您最近身體好嗎？',
    '薪水': '薪水還可以，夠用就好。重要的是工作開心。'
  },
  'cold': {
    '結婚': '這個問題我不想討論。',
    '工作': '工作還好。',
    '薪水': '這是個人隱私。'
  },
  'laid-back': {
    '結婚': '隨緣吧，不強求。',
    '工作': '還行，過得去就好。',
    '薪水': '夠用就好，不用太在意。'
  }
}

// 預設肢體語言建議
const bodyLanguageTips = [
  '眼神堅定',
  '微笑點頭',
  '保持輕鬆姿態',
  '適時轉移話題',
  '保持距離感'
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // 基本變數檢查
  if (!body.question || !body.tone) {
    throw createError({
      statusCode: 400,
      statusMessage: '問題和語氣不能為空'
    })
  }
  
  // Mock 階段：根據問題關鍵字和語氣返回對應腳本
  // 實際應由前端工程師或 API SERVER 提供更完整的腳本庫
  const question = body.question.toLowerCase()
  const tone = body.tone as 'humorous' | 'cold' | 'laid-back'
  
  let script = '這是一個很好的問題，讓我思考一下...'
  
  // 簡單的關鍵字匹配（Mock 階段）
  if (question.includes('結婚') || question.includes('對象')) {
    script = scriptTemplates[tone]['結婚'] || script
  } else if (question.includes('工作') || question.includes('職業')) {
    script = scriptTemplates[tone]['工作'] || script
  } else if (question.includes('薪水') || question.includes('收入')) {
    script = scriptTemplates[tone]['薪水'] || script
  }
  
  // 生成腳本物件（Mock 階段）
  const responseScript: ResponseScript = {
    id: generateId(),
    inputQuestion: body.question,
    tone,
    generatedScript: script,
    bodyLanguageTips: bodyLanguageTips.slice(0, 3), // 隨機選擇 3 個建議
    savedByUsers: [],
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  return {
    script: responseScript.script,
    bodyLanguageTips: responseScript.bodyLanguageTips,
    scriptId: responseScript.id
  }
})

