/**
 * 獲取救援請求詳情
 * 
 * GET /api/rescue-requests/[id]/details
 * 
 * 聚合 RescueRequest + Helper 資訊 + 地圖位置
 */

import { getRescueRequestById } from '../../mocks/rescue-requests'
import { getHelperById } from '../../mocks/helpers'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: '請求 ID 不能為空'
    })
  }
  
  const request = getRescueRequestById(id)
  
  if (!request) {
    throw createError({
      statusCode: 404,
      statusMessage: '救援請求不存在'
    })
  }
  
  // 如果已匹配，獲取 Helper 詳細資訊
  let matchedHelper = undefined
  if (request.matchedHelperId) {
    const helper = getHelperById(request.matchedHelperId)
    if (helper) {
      // 獲取 Helper 對應的用戶資訊（簡化版）
      matchedHelper = {
        id: helper.id,
        skills: helper.skills,
        bio: helper.bio,
        hourlyRate: helper.hourlyRate,
        status: helper.status,
        rating: helper.rating,
        ratingCount: helper.ratingCount
      }
    }
  }
  
  // 地圖位置資訊（從請求位置生成）
  const mapLocation = {
    id: `map_${request.id}`,
    type: 'rescue-point' as const,
    coordinates: {
      lat: request.location.lat,
      lng: request.location.lng
    },
    visible: true,
    zIndex: 1,
    relatedObjectId: request.id,
    relatedObjectType: 'RescueRequest',
    createdAt: request.createdAt,
    updatedAt: request.updatedAt
  }
  
  return {
    request,
    matchedHelper,
    mapLocation
  }
})

