# BFF 路徑設計文檔

> **版本**：v1.0  
> **基於**：ORCA 分析文檔 v1.0  
> **命名規則**：遵循 `.cursor/rules/routing/bff-path-guideline.mdc` 和 `.cursor/rules/routing/architectural-rules.mdc`

---

## 頁面複雜度分析

基於 ORCA 分析中的對象與 Calls to Action，以下是各頁面的複雜度分類：

### Simple Page (1:1) - 一個頁面對應一個 BFF 路徑

| 頁面 | 描述 | BFF 路徑 |
|------|------|----------|
| 應對錦囊頁面 | 生成 AI 腳本 | `/api/response-kit/generate` |
| 邊界說明書頁面 | 查看/編輯個人邊界清單 | `/api/boundary-manual/details` |

### Standard CRUD (1:2 或 1:3) - 拆分為主要資源與次要資源

| 頁面 | 描述 | BFF 路徑 | 聚合邏輯 |
|------|------|----------|----------|
| 救援請求詳情頁 | 查看請求詳情 | `/api/rescue-request/[id]/details` | RescueRequest + Helper 資訊 + 地圖位置 |
| Helper 個人檔案頁 | 查看 Helper 詳情 | `/api/helper/[id]/details` | Helper + 歷史業績 + 評價列表 |
| 診斷報告頁面 | 查看診斷報告 | `/api/diagnostic-report/[id]/details` | DiagnosticReport + 處方箋內容 |
| 聚會詳情頁 | 查看聚會詳情 | `/api/gathering/[id]/details` | Gathering + 參與者列表 + 地圖位置 |

### Complex Dashboard (1:N, N > 3) - 每個獨立區塊對應一個 BFF 路徑

| 頁面 | 描述 | BFF 路徑 | 說明 |
|------|------|----------|------|
| 個人儀表板 | 用戶主頁 | `/api/dashboard/init-data` | 初始數據（用戶資訊） |
| | | `/api/dashboard/rescue-requests` | 救援請求列表（獨立載入） |
| | | `/api/dashboard/gatherings` | 參與的聚會列表（獨立載入） |
| | | `/api/dashboard/notifications` | 通知列表（獨立載入） |
| 戰況地圖頁 | 地圖視覺化中心 | `/api/map/init-data` | 地圖初始設定 |
| | | `/api/map/rescue-points` | 救援點圖層（獨立載入） |
| | | `/api/map/helpers` | Helper 位置圖層（獨立載入） |
| | | `/api/map/sanctuaries` | 避難空間圖層（獨立載入） |
| | | `/api/map/heat-zones` | 熱力分布圖層（獨立載入） |
| 同溫層牆頁 | 社群貼文流 | `/api/venting/feed` | 貼文列表（瀑布流） |
| | | `/api/venting/gatherings` | 相關聚會列表（側邊欄） |

---

## BFF 路徑詳細設計

### 用戶相關 (User)

#### `GET /api/user/profile`
**描述**：獲取當前用戶的個人資料  
**頁面對應**：個人設定頁  
**複雜度**：Simple (1:1)  
**聚合邏輯**：直接從後端獲取 User 資料  
**回應格式**：
```typescript
interface UserProfileResponse {
  user: User
}
```

#### `PUT /api/user/profile`
**描述**：更新用戶個人資料  
**頁面對應**：個人設定頁  
**複雜度**：Simple (1:1)  
**聚合邏輯**：更新 User 資料  
**請求格式**：
```typescript
interface UpdateUserProfileRequest {
  nickname?: string
  avatar?: string
  phone?: string
  location?: { lat: number; lng: number; address?: string }
}
```

#### `POST /api/user/switch-role`
**描述**：切換用戶角色  
**頁面對應**：角色切換功能  
**複雜度**：Simple (1:1)  
**聚合邏輯**：更新 User.role

---

### 救援請求相關 (RescueRequest)

#### `GET /api/rescue-request/[id]/details`
**描述**：獲取救援請求詳情（聚合 Helper 資訊與地圖位置）  
**頁面對應**：救援請求詳情頁  
**複雜度**：Standard (1:3)  
**聚合邏輯**：
- 獲取 RescueRequest 資料
- 如果已匹配，獲取 Helper 詳細資訊
- 獲取地圖位置資訊（MapLayer）
**回應格式**：
```typescript
interface RescueRequestDetailsResponse {
  request: RescueRequest
  matchedHelper?: Helper
  mapLocation?: MapLayer
}
```

#### `POST /api/rescue-request/create`
**描述**：建立新的救援請求  
**頁面對應**：建立救援請求頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface CreateRescueRequestRequest {
  requestType: '人力請求' | '空間導航' | '混合'
  stressLevel: number
  budget?: number
  description?: string
  location: { lat: number; lng: number; address?: string }
}
```

#### `GET /api/rescue-request/list`
**描述**：獲取救援請求列表（用於儀表板）  
**頁面對應**：個人儀表板  
**複雜度**：Simple (1:1)  
**查詢參數**：
- `status?: string` - 篩選狀態
- `page?: number` - 分頁
- `limit?: number` - 每頁數量
**回應格式**：
```typescript
interface RescueRequestListResponse {
  requests: RescueRequest[]
  pagination: { page: number; total: number; limit: number }
}
```

#### `POST /api/rescue-request/[id]/accept-match`
**描述**：接受 Helper 匹配  
**頁面對應**：救援請求詳情頁  
**複雜度**：Simple (1:1)  
**聚合邏輯**：更新 RescueRequest 狀態 + 發送通知

#### `POST /api/rescue-request/[id]/complete`
**描述**：標記救援請求完成  
**頁面對應**：救援請求詳情頁  
**複雜度**：Simple (1:1)

#### `POST /api/rescue-request/[id]/rate`
**描述**：評價 Helper  
**頁面對應**：救援請求完成頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface RateHelperRequest {
  rating: number // 1-5
  review?: string
}
```

---

### Helper 相關

#### `GET /api/helper/[id]/details`
**描述**：獲取 Helper 詳細資訊（聚合歷史業績與評價）  
**頁面對應**：Helper 個人檔案頁  
**複雜度**：Standard (1:3)  
**聚合邏輯**：
- 獲取 Helper 基本資料
- 獲取歷史完成案件列表
- 獲取評價列表
**回應格式**：
```typescript
interface HelperDetailsResponse {
  helper: Helper
  completedRequests: RescueRequest[]
  reviews: { rating: number; review: string; createdAt: Date }[]
}
```

#### `GET /api/helper/list`
**描述**：獲取可用 Helper 列表（用於匹配）  
**頁面對應**：救援請求匹配頁  
**複雜度**：Simple (1:1)  
**查詢參數**：
- `skills?: string[]` - 技能篩選
- `location?: { lat: number; lng: number }` - 地理位置篩選
- `maxDistance?: number` - 最大距離（公尺）
**回應格式**：
```typescript
interface HelperListResponse {
  helpers: Helper[]
}
```

#### `POST /api/helper/register`
**描述**：註冊成為 Helper  
**頁面對應**：Helper 註冊頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface RegisterHelperRequest {
  skills: string[]
  bio: string
  hourlyRate?: number
}
```

#### `PUT /api/helper/profile`
**描述**：更新 Helper 個人檔案  
**頁面對應**：Helper 設定頁  
**複雜度**：Simple (1:1)

#### `POST /api/helper/toggle-status`
**描述**：切換 Helper 接案狀態  
**頁面對應**：Helper 儀表板  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface ToggleHelperStatusRequest {
  status: 'online' | 'offline' | 'busy'
  availableUntil?: Date
}
```

#### `GET /api/helper/available-requests`
**描述**：獲取可接的救援請求列表  
**頁面對應**：Helper 儀表板  
**複雜度**：Simple (1:1)  
**聚合邏輯**：根據 Helper 位置與技能篩選可用請求

---

### 應對腳本相關 (ResponseScript)

#### `POST /api/response-kit/generate`
**描述**：生成 AI 應對腳本  
**頁面對應**：應對錦囊頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface GenerateScriptRequest {
  inputQuestion: string
  tone: 'humorous' | 'cold' | 'laid-back'
}
```
**回應格式**：
```typescript
interface GenerateScriptResponse {
  script: ResponseScript
}
```

#### `GET /api/response-kit/saved-scripts`
**描述**：獲取收藏的腳本列表  
**頁面對應**：應對錦囊頁  
**複雜度**：Simple (1:1)

#### `POST /api/response-kit/[id]/save`
**描述**：收藏腳本  
**頁面對應**：應對錦囊頁  
**複雜度**：Simple (1:1)

---

### 診斷報告相關 (DiagnosticReport)

#### `POST /api/diagnostic/start-test`
**描述**：開始診斷測驗  
**頁面對應**：角色診斷頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface StartTestRequest {
  testType: 'elder' | 'junior'
}
```

#### `POST /api/diagnostic/submit-answers`
**描述**：提交測驗答案  
**頁面對應**：角色診斷頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface SubmitAnswersRequest {
  testId: string
  answers: Record<string, any>
}
```

#### `GET /api/diagnostic-report/[id]/details`
**描述**：獲取診斷報告詳情（包含處方箋）  
**頁面對應**：診斷報告頁  
**複雜度**：Standard (1:2)  
**聚合邏輯**：
- 獲取 DiagnosticReport 資料
- 獲取處方箋內容
**回應格式**：
```typescript
interface DiagnosticReportDetailsResponse {
  report: DiagnosticReport
  prescription: string
}
```

#### `POST /api/diagnostic-report/[id]/share`
**描述**：分享診斷報告  
**頁面對應**：診斷報告頁  
**複雜度**：Simple (1:1)

---

### 宣洩貼文相關 (VentPost)

#### `GET /api/venting/feed`
**描述**：獲取同溫層貼文流（瀑布流）  
**頁面對應**：同溫層牆頁  
**複雜度**：Simple (1:1)  
**查詢參數**：
- `page?: number` - 分頁
- `limit?: number` - 每頁數量
- `location?: { lat: number; lng: number }` - 地理位置篩選
**回應格式**：
```typescript
interface VentPostFeedResponse {
  posts: VentPost[]
  pagination: { page: number; total: number; limit: number }
}
```

#### `POST /api/venting/post/create`
**描述**：發布宣洩貼文  
**頁面對應**：同溫層牆頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface CreateVentPostRequest {
  content: string
  images?: string[]
  isAnonymous: boolean
  location?: { lat: number; lng: number; address?: string }
  relatedGatheringId?: string
}
```

#### `POST /api/venting/post/[id]/like`
**描述**：按讚貼文  
**頁面對應**：同溫層牆頁  
**複雜度**：Simple (1:1)

#### `POST /api/venting/post/[id]/comment`
**描述**：留言  
**頁面對應**：同溫層牆頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface CommentRequest {
  content: string
  isAnonymous: boolean
}
```

---

### 聚會相關 (Gathering)

#### `GET /api/gathering/[id]/details`
**描述**：獲取聚會詳情（聚合參與者列表與地圖位置）  
**頁面對應**：聚會詳情頁  
**複雜度**：Standard (1:3)  
**聚合邏輯**：
- 獲取 Gathering 資料
- 獲取參與者列表（User 基本資訊）
- 獲取地圖位置資訊
**回應格式**：
```typescript
interface GatheringDetailsResponse {
  gathering: Gathering
  participants: User[]
  mapLocation: MapLayer
}
```

#### `POST /api/gathering/create`
**描述**：發起聚會  
**頁面對應**：發起聚會頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface CreateGatheringRequest {
  title: string
  description: string
  location: { lat: number; lng: number; address: string }
  scheduledAt: Date
  maxParticipants: number
}
```

#### `POST /api/gathering/[id]/join`
**描述**：加入聚會  
**頁面對應**：聚會詳情頁  
**複雜度**：Simple (1:1)

#### `POST /api/gathering/[id]/leave`
**描述**：退出聚會  
**頁面對應**：聚會詳情頁  
**複雜度**：Simple (1:1)

#### `GET /api/gathering/list`
**描述**：獲取聚會列表  
**頁面對應**：聚會列表頁  
**複雜度**：Simple (1:1)  
**查詢參數**：
- `status?: string` - 篩選狀態
- `location?: { lat: number; lng: number }` - 地理位置篩選
- `maxDistance?: number` - 最大距離

---

### 地圖相關 (MapLayer)

#### `GET /api/map/init-data`
**描述**：獲取地圖初始設定  
**頁面對應**：戰況地圖頁  
**複雜度**：Simple (1:1)  
**回應格式**：
```typescript
interface MapInitDataResponse {
  center: { lat: number; lng: number }
  zoom: number
  availableLayers: string[]
}
```

#### `GET /api/map/rescue-points`
**描述**：獲取救援點圖層數據  
**頁面對應**：戰況地圖頁  
**複雜度**：Simple (1:1)  
**查詢參數**：
- `bounds?: { north: number; south: number; east: number; west: number }` - 地圖邊界
**回應格式**：
```typescript
interface MapLayerResponse {
  layers: MapLayer[]
}
```

#### `GET /api/map/helpers`
**描述**：獲取 Helper 位置圖層數據  
**頁面對應**：戰況地圖頁  
**複雜度**：Simple (1:1)

#### `GET /api/map/sanctuaries`
**描述**：獲取避難空間圖層數據  
**頁面對應**：戰況地圖頁  
**複雜度**：Simple (1:1)

#### `GET /api/map/heat-zones`
**描述**：獲取熱力分布圖層數據  
**頁面對應**：戰況地圖頁  
**複雜度**：Simple (1:1)

---

### 通知相關 (Notification)

#### `GET /api/notifications/list`
**描述**：獲取通知列表  
**頁面對應**：個人儀表板、通知中心  
**複雜度**：Simple (1:1)  
**查詢參數**：
- `isRead?: boolean` - 篩選已讀/未讀
- `type?: string` - 篩選通知類型
**回應格式**：
```typescript
interface NotificationListResponse {
  notifications: Notification[]
  unreadCount: number
}
```

#### `POST /api/notifications/[id]/mark-read`
**描述**：標記通知為已讀  
**頁面對應**：通知中心  
**複雜度**：Simple (1:1)

#### `PUT /api/notifications/preferences`
**描述**：更新通知偏好設定  
**頁面對應**：通知設定頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface NotificationPreferencesRequest {
  lineEnabled: boolean
  lineTypes: string[] // 哪些類型要發送到 Line
  emailEnabled: boolean
  pushEnabled: boolean
}
```

---

### 邊界說明書相關 (BoundaryManual)

#### `GET /api/boundary-manual/details`
**描述**：獲取當前用戶的邊界說明書  
**頁面對應**：邊界說明書頁  
**複雜度**：Simple (1:1)  
**回應格式**：
```typescript
interface BoundaryManualDetailsResponse {
  manual: BoundaryManual
}
```

#### `PUT /api/boundary-manual/update`
**描述**：更新邊界說明書  
**頁面對應**：邊界說明書頁  
**複雜度**：Simple (1:1)  
**請求格式**：
```typescript
interface UpdateBoundaryManualRequest {
  acceptedTopics: string[]
  rejectedTopics: string[]
  isPublic: boolean
}
```

#### `GET /api/boundary-manual/[shareToken]`
**描述**：透過分享 token 訪問邊界說明書（公開訪問）  
**頁面對應**：邊界說明書分享頁  
**複雜度**：Simple (1:1)  
**聚合邏輯**：獲取 BoundaryManual + 更新 viewCount

---

### 儀表板相關 (Dashboard)

#### `GET /api/dashboard/init-data`
**描述**：獲取儀表板初始數據（用戶基本資訊）  
**頁面對應**：個人儀表板  
**複雜度**：Simple (1:1)  
**回應格式**：
```typescript
interface DashboardInitDataResponse {
  user: User
  stats: {
    totalRequests: number
    activeRequests: number
    totalGatherings: number
    unreadNotifications: number
  }
}
```

#### `GET /api/dashboard/rescue-requests`
**描述**：獲取用戶的救援請求列表（獨立載入）  
**頁面對應**：個人儀表板  
**複雜度**：Simple (1:1)  
**聚合邏輯**：獲取用戶的所有 RescueRequest，按狀態分組

#### `GET /api/dashboard/gatherings`
**描述**：獲取用戶參與的聚會列表（獨立載入）  
**頁面對應**：個人儀表板  
**複雜度**：Simple (1:1)

#### `GET /api/dashboard/notifications`
**描述**：獲取通知列表（獨立載入）  
**頁面對應**：個人儀表板  
**複雜度**：Simple (1:1)

---

## BFF 設計原則檢查清單

- [x] BFF 路徑隱藏後端微服務複雜度
- [x] 粒度符合頁面複雜度定義（Simple/Standard/Complex）
- [x] 獨立 UI 區塊分離，避免阻塞整個頁面
- [x] 命名遵循 `[domain]/[page-context]/[action-or-resource]` 模式
- [x] 所有資料轉換與映射在 BFF 層完成
- [x] 回應格式為 UI-ready JSON

---

## 與後端團隊對齊事項

1. **聚合邏輯確認**：每個 BFF 路徑需要聚合哪些後端 API？
2. **回應格式確認**：後端 API 的回應格式是否符合前端需求？
3. **錯誤處理**：統一的錯誤回應格式
4. **認證機制**：如何傳遞認證資訊（JWT Token）？
5. **分頁機制**：統一分頁參數與回應格式
6. **地理位置篩選**：如何實作地理位置範圍查詢？

---

**文檔版本**：v1.0  
**最後更新**：2024  
**維護者**：待指定

