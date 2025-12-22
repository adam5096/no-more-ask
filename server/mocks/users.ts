/**
 * 用戶 Mock 資料
 * 
 * 包含不同角色的用戶資料，用於測試和開發
 */

import type { User, UserRole } from '../../docs/types/orca-types'
import { generateId, randomDate, randomItem } from './utils'

// 預設角色列表
const userRoles: UserRole[] = ['Escapee', 'Helper', 'WokeElder', 'SilentBuffer', 'UrbanLoner']

// 預設暱稱列表
const nicknames = [
  '節慶逃兵', '社交恐懼者', '家庭和事佬', '邊緣人', '覺醒長輩',
  '專業閒人', '救援達人', '節慶救星', '溫暖陪伴', '智慧長者'
]

/**
 * 生成單一用戶 Mock 資料
 */
export function createMockUser(overrides?: Partial<User>): User {
  const roles = [randomItem(userRoles)]
  const createdAt = randomDate(365)
  
  return {
    id: generateId(),
    email: `user${Math.random().toString(36).substr(2, 9)}@example.com`,
    passwordHash: 'hashed_password', // Mock 階段不驗證
    nickname: randomItem(nicknames),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
    phone: `09${Math.floor(Math.random() * 100000000)}`,
    lineUserId: `line_${generateId()}`,
    role: roles[0],
    roles,
    isActive: true,
    location: {
      lat: 25.0330 + (Math.random() - 0.5) * 0.1, // 台北附近
      lng: 121.5654 + (Math.random() - 0.5) * 0.1,
      address: '台北市信義區'
    },
    createdAt,
    updatedAt: randomDate(30),
    lastLoginAt: randomDate(7),
    ...overrides
  }
}

/**
 * 預設 Mock 用戶列表
 */
export const mockUsers: User[] = [
  // Escapee - 焦慮的求助者
  createMockUser({
    email: 'escapee@example.com',
    nickname: '節慶逃兵',
    role: 'Escapee',
    roles: ['Escapee']
  }),
  
  // Helper - 專業的閒人
  createMockUser({
    email: 'helper@example.com',
    nickname: '專業閒人',
    role: 'Helper',
    roles: ['Helper']
  }),
  
  // WokeElder - 覺醒的長輩
  createMockUser({
    email: 'wokeelder@example.com',
    nickname: '覺醒長輩',
    role: 'WokeElder',
    roles: ['WokeElder']
  }),
  
  // SilentBuffer - 夾心餅乾配偶
  createMockUser({
    email: 'silentbuffer@example.com',
    nickname: '家庭和事佬',
    role: 'SilentBuffer',
    roles: ['SilentBuffer']
  }),
  
  // UrbanLoner - 節慶邊緣人
  createMockUser({
    email: 'urbanloner@example.com',
    nickname: '節慶邊緣人',
    role: 'UrbanLoner',
    roles: ['UrbanLoner']
  }),
  
  // 多角色用戶
  createMockUser({
    email: 'multirole@example.com',
    nickname: '多角色用戶',
    role: 'Escapee',
    roles: ['Escapee', 'Helper']
  })
]

/**
 * 根據 ID 獲取用戶
 */
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id)
}

/**
 * 根據 Email 獲取用戶（用於登入驗證）
 */
export function getUserByEmail(email: string): User | undefined {
  return mockUsers.find(user => user.email === email)
}

/**
 * 生成更多用戶（用於測試）
 */
export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => createMockUser())
}

