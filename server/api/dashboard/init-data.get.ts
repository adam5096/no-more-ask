/**
 * 獲取儀表板初始資料
 * 
 * GET /api/dashboard/init-data
 * 
 * 返回用戶基本資訊和統計資料
 */

import { mockUsers } from '../../mocks/users'
import { getRescueRequestsByUserId } from '../../mocks/rescue-requests'
import { getGatheringsByParticipantId } from '../../mocks/gatherings'
import { getUnreadNotificationCount } from '../../mocks/notifications'

export default defineEventHandler(async (event) => {
  // Mock 階段：從 header 或 cookie 獲取用戶 ID
  const userId = getCookie(event, 'user_id') || getHeader(event, 'x-user-id')
  
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授權'
    })
  }
  
  const user = mockUsers.find(u => u.id === userId)
  
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: '用戶不存在'
    })
  }
  
  // 計算統計資料
  const requests = getRescueRequestsByUserId(userId)
  const gatherings = getGatheringsByParticipantId(userId)
  const unreadNotifications = getUnreadNotificationCount(userId)
  
  return {
    user: {
      id: user.id,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role,
      roles: user.roles
    },
    stats: {
      totalRequests: requests.length,
      activeRequests: requests.filter(r => 
        r.status === 'pending' || r.status === 'matched' || r.status === 'in-progress'
      ).length,
      totalGatherings: gatherings.length,
      unreadNotifications
    }
  }
})

