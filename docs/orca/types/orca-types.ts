/**
 * ORCA 分析 - TypeScript 類型定義
 * 
 * 此文件包含所有 ORCA 對象的完整 TypeScript 介面定義
 * 用於前端開發、BFF 設計和後端 API 對齊
 * 
 * @see ../orca-analysis-v1.md - ORCA 分析主文檔
 */

// ============================================================================
// 基礎類型
// ============================================================================

/**
 * 用戶角色類型
 */
export type UserRole =
  | 'Escapee'        // 焦慮的求助者
  | 'Helper'         // 專業的閒人
  | 'WokeElder'      // 覺醒的長輩
  | 'SilentBuffer'   // 夾心餅乾配偶
  | 'UrbanLoner'     // 節慶邊緣人

/**
 * 地理位置介面
 */
export interface Location {
  lat: number
  lng: number
  address?: string
}

// ============================================================================
// 核心對象類型定義
// ============================================================================

/**
 * User（用戶）
 * 
 * 系統中所有角色的基礎對象，可切換不同角色身份
 * 
 * @see ../orca-analysis-v1.md#1-user用戶
 */
export interface User {
  // 識別資訊
  id: string                    // UUID
  email: string                 // 唯一，用於登入
  passwordHash: string          // 加密密碼（前端不直接處理）
  
  // 個人資訊
  nickname: string              // 顯示名稱
  avatar?: string               // 頭像 URL
  phone?: string                // 手機號碼（用於 Line 通知）
  lineUserId?: string           // Line User ID（用於 B7）
  
  // 角色與狀態
  role: UserRole                // 主要角色
  roles: UserRole[]             // 可切換的角色列表（一個用戶可有多個角色）
  isActive: boolean             // 帳號是否啟用
  
  // 地理位置
  location?: Location
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

/**
 * RescueRequest（救援請求）
 * 
 * 用戶發起的即時救援需求，包含人力請求與空間導航
 * 
 * @see ../orca-analysis-v1.md#2-rescuerequest救援請求
 */
export interface RescueRequest {
  // 識別資訊
  id: string                    // UUID
  userId: string                // 外鍵：User.id
  
  // 請求內容
  requestType: '人力請求' | '空間導航' | '混合'
  stressLevel: number           // 1-5，壓力等級
  budget?: number               // 預算（新台幣）
  description?: string          // 詳細描述
  
  // 地理位置
  location: Location
  
  // 匹配資訊
  status: 'pending' | 'matched' | 'in-progress' | 'completed' | 'cancelled'
  matchedHelperId?: string      // 外鍵：Helper.id
  matchedAt?: Date
  
  // 評價
  rating?: number               // 1-5，對 Helper 的評價
  review?: string               // 評價內容
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  cancelledAt?: Date
}

/**
 * Helper（救援者）
 * 
 * 提供救援服務的專業閒人，具備特殊技能
 * 
 * @see ../orca-analysis-v1.md#3-helper救援者
 */
export interface Helper {
  // 識別資訊
  id: string                    // UUID
  userId: string                // 外鍵：User.id（一對一）
  
  // 服務資訊
  skills: string[]              // 技能標籤，如：['酒量大', '會修電腦', '奧斯卡演技']
  bio: string                   // 個人簡介
  hourlyRate?: number           // 時薪（新台幣）
  
  // 狀態管理
  status: 'online' | 'offline' | 'busy'
  availableUntil?: Date         // 可接案截止時間
  
  // 業績統計
  totalCompleted: number        // 完成案件數
  totalEarnings: number         // 總收入
  rating: number                // 平均評價（1-5）
  ratingCount: number           // 評價數量
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
}

/**
 * ResponseScript（應對腳本）
 * 
 * 對話腳本，用於應對長輩問話
 * 
 * @see ../orca-analysis-v1.md#4-responsescript應對腳本
 */
export interface ResponseScript {
  // 識別資訊
  id: string                    // UUID
  
  // 輸入內容
  inputQuestion: string         // 長輩的問話內容
  
  // 生成內容
  tone: 'humorous' | 'cold' | 'laid-back'
  generatedScript: string       // AI 生成的對話腳本
  bodyLanguageTips: string[]   // 肢體語言建議，如：['眼神堅定', '微笑點頭']
  
  // 使用統計
  savedByUsers: string[]       // 收藏此腳本的用戶 ID 列表
  usageCount: number           // 使用次數
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
}

/**
 * DiagnosticReport（診斷報告）
 * 
 * 雙向心理測驗的結果報告
 * 
 * @see ../orca-analysis-v1.md#5-diagnosticreport診斷報告
 */
export interface DiagnosticReport {
  // 識別資訊
  id: string                    // UUID
  userId: string                // 外鍵：User.id
  
  // 測驗資訊
  testType: 'elder' | 'junior'
  answers: Record<string, any>  // 測驗答案（JSON）
  
  // 診斷結果
  shadowArea: number            // 心理陰影面積（0-100）
  socialLabel: string           // 社交標籤，如：'高壓型長輩', '敏感型後輩'
  prescription: string          // 處方箋內容（建議與改善方案）
  
  // 分享設定
  isShared: boolean             // 是否已分享
  shareToken?: string           // 分享 token（用於生成分享 URL）
  // MVP 決策：診斷報告分享採用私密連結（token 機制）
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
}

/**
 * VentPost（宣洩貼文）
 * 
 * 用戶發布的匿名或公開宣洩內容
 * 
 * @see ../orca-analysis-v1.md#6-ventpost宣洩貼文
 */
export interface VentPost {
  // 識別資訊
  id: string                    // UUID
  userId: string                // 外鍵：User.id（可匿名）
  
  // 內容
  content: string               // 貼文內容
  images?: string[]             // 圖片 URL 列表
  isAnonymous: boolean         // 是否匿名發布
  
  // 地理位置（可選）
  location?: Location
  
  // 互動統計
  likes: number                 // 按讚數
  comments: Comment[]          // 留言列表
  commentCount: number         // 留言數
  
  // 關聯聚會（可選）
  relatedGatheringId?: string  // 外鍵：Gathering.id
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
}

/**
 * Comment（留言）
 * 
 * 貼文的留言
 */
export interface Comment {
  id: string
  userId: string
  content: string
  isAnonymous: boolean
  createdAt: Date
}

/**
 * Gathering（聚會）
 * 
 * 邊緣人發起的節慶小聚活動
 * 
 * @see ../orca-analysis-v1.md#7-gathering聚會
 */
export interface Gathering {
  // 識別資訊
  id: string                    // UUID
  creatorId: string            // 外鍵：User.id
  
  // 聚會資訊
  title: string                // 聚會標題
  description: string          // 聚會描述
  
  // 時間地點
  location: Location
  scheduledAt: Date            // 預定時間
  
  // 參與者
  maxParticipants: number      // 人數上限
  participants: string[]       // 參與者 User ID 列表
  
  // 狀態
  status: 'open' | 'full' | 'completed' | 'cancelled'
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  cancelledAt?: Date
}

/**
 * MapLayer（地圖圖層）
 * 
 * 地圖上的各種可視化圖層
 * 
 * @see ../orca-analysis-v1.md#8-maplayer地圖圖層
 */
export interface MapLayer {
  // 識別資訊
  id: string                    // UUID
  
  // 圖層類型
  type: 'rescue-point' | 'helper' | 'sanctuary' | 'loner' | 'heat-zone'
  
  // 地理位置
  coordinates: {
    lat: number
    lng: number
  }
  
  // 顯示設定
  visible: boolean              // 是否顯示
  zIndex: number                // 圖層層級
  
  // 關聯數據
  relatedObjectId: string      // 關聯的對象 ID（如 RescueRequest.id, Helper.id）
  relatedObjectType: string    // 關聯的對象類型
  
  // 熱力圖數據（僅 heat-zone 類型）
  heatData?: {
    intensity: number          // 強度（0-100）
    radius: number             // 影響半徑（公尺）
  }
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
}

/**
 * Notification（通知）
 * 
 * 系統發送的各類通知訊息
 * 
 * @see ../orca-analysis-v1.md#9-notification通知
 */
export interface Notification {
  // 識別資訊
  id: string                    // UUID
  userId: string                // 外鍵：User.id
  
  // 通知內容
  type: 'rescue-matched' | 'survival-check' | 'gathering-invite' | 'helper-request'
  title: string                 // 通知標題
  content: string               // 通知內容
  
  // Line 整合
  lineMessageId?: string        // Line 訊息 ID
  lineSentAt?: Date             // Line 發送時間
  
  // 狀態
  isRead: boolean               // 是否已讀
  readAt?: Date
  
  // 關聯對象
  relatedObjectId?: string      // 關聯的對象 ID
  relatedObjectType?: string   // 關聯的對象類型
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
}

/**
 * BoundaryManual（邊界說明書）
 * 
 * 用戶設定的個人社交邊界清單
 * 
 * @see ../orca-analysis-v1.md#10-boundarymanual邊界說明書
 */
export interface BoundaryManual {
  // 識別資訊
  id: string                    // UUID
  userId: string                // 外鍵：User.id（一對一，唯一）
  
  // 分享設定
  shareUrl: string              // 分享 URL（如：/boundary/{shareToken}）
  shareToken: string            // 分享 token（用於生成 URL）
  isPublic: boolean             // 是否公開（任何人都可訪問）
  
  // 邊界清單
  acceptedTopics: string[]     // 接受的話題列表
  rejectedTopics: string[]     // 不接受的話題列表
  
  // 訪問統計
  viewCount: number            // 訪問次數
  lastViewedAt?: Date          // 最後訪問時間
  
  // 時間戳記
  createdAt: Date
  updatedAt: Date
}

