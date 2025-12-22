# 資料需求清單文檔 v1.0

> **版本**：v1.0  
> **基於**：Wireframe 文檔、ORCA 分析文檔、BFF 路徑設計  
> **目的**：整理每個頁面的資料需求，標註 UI 區塊與 BFF 路徑的對應關係，定義資料結構，為 BFF 設計和 Mock 資料建立提供明確的輸入

---

## 文檔結構說明

每個頁面的資料需求包含以下部分：

1. **頁面資訊**：路由、對應的 BFF 路徑、頁面複雜度
2. **資料需求對應表**：UI 區塊 → BFF 路徑 → 資料結構
3. **資料結構定義**：TypeScript 介面定義
4. **資料載入策略**：哪些資料需要聚合，哪些可以獨立載入

---

## 頁面分類

### 認證系統
- [登入頁面](#登入頁面-login)
- [註冊頁面](#註冊頁面-register)

### 救援功能（B1）
- [建立救援請求頁](#建立救援請求頁-rescue-requestcreate)
- [救援請求詳情頁](#救援請求詳情頁-rescue-requestrequestid)

### Helper 功能（B4）
- [註冊成為 Helper 頁](#註冊成為-helper-頁-helperregister)
- [Helper 個人檔案頁](#helper-個人檔案頁-helperhelperid)
- [Helper 儀表板](#helper-儀表板-helperdashboard)

### 個人儀表板
- [個人儀表板](#個人儀表板-dashboard)

### 通知系統（B7）
- [通知中心](#通知中心-notifications)

### 應對錦囊（B2）
- [應對錦囊頁面](#應對錦囊頁面-response-kit)

### 同溫層牆（B5）
- [同溫層牆](#同溫層牆-venting)
- [發起聚會頁](#發起聚會頁-gatheringcreate)
- [聚會詳情頁](#聚會詳情頁-gatheringgatheringid)

---

## 登入頁面 (`/login`)

### 頁面資訊
- **路由**：`/login`
- **BFF 對應**：`POST /api/auth/login`
- **頁面複雜度**：Simple (1:1)

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `login-button` | `POST /api/auth/login` | `LoginRequest` | `LoginResponse` | 見下方 |

### 資料結構定義

```typescript
// 請求資料
interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

// 回應資料
interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    nickname: string
    avatar?: string
    role: UserRole
  }
}
```

### 資料載入策略
- 無需預載入資料（表單輸入頁面）
- 登入成功後返回 token 和用戶基本資訊

---

## 註冊頁面 (`/register`)

### 頁面資訊
- **路由**：`/register`
- **BFF 對應**：`POST /api/auth/register`
- **頁面複雜度**：Simple (1:1)

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `register-button` | `POST /api/auth/register` | `RegisterRequest` | `RegisterResponse` | 見下方 |

### 資料結構定義

```typescript
// 請求資料
interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

// 回應資料
interface RegisterResponse {
  token: string
  user: {
    id: string
    email: string
    nickname: string
    role: UserRole
  }
}
```

### 資料載入策略
- 無需預載入資料（表單輸入頁面）
- 註冊成功後返回 token 和用戶基本資訊

---

## 建立救援請求頁 (`/rescue-request/create`)

### 頁面資訊
- **路由**：`/rescue-request/create`
- **BFF 對應**：`POST /api/rescue-request/create`
- **頁面複雜度**：Simple (1:1)

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `submit-button` | `POST /api/rescue-request/create` | `CreateRescueRequestRequest` | `CreateRescueRequestResponse` | 見下方 |

### 資料結構定義

```typescript
// 請求資料
interface CreateRescueRequestRequest {
  requestType: '人力請求' | '空間導航' | '混合'
  stressLevel: number  // 1-5
  budget?: number
  description?: string
  location: {
    lat: number
    lng: number
    address?: string
  }
}

// 回應資料
interface CreateRescueRequestResponse {
  id: string
  status: 'pending' | 'matched' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: string
}
```

### 資料載入策略
- 無需預載入資料（表單輸入頁面）
- 建立成功後返回請求 ID 和狀態

---

## 救援請求詳情頁 (`/rescue-request/[requestId]`)

### 頁面資訊
- **路由**：`/rescue-request/[requestId]`
- **BFF 對應**：`GET /api/rescue-request/[id]/details`
- **頁面複雜度**：Standard (1:2-3) - 聚合 RescueRequest + Helper 資訊 + 地圖位置

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `left-panel` | `GET /api/rescue-request/[id]/details` | `{ requestId }` | `RescueRequestDetailsResponse` | 見下方 |
| `cancel-button` | `POST /api/rescue-request/[id]/cancel` | `{ requestId }` | `{ success: boolean }` | 簡單回應 |

### 資料結構定義

```typescript
// 回應資料（聚合多個資料來源）
interface RescueRequestDetailsResponse {
  rescueRequest: {
    id: string
    userId: string
    requestType: '人力請求' | '空間導航' | '混合'
    stressLevel: number
    budget?: number
    description?: string
    status: 'pending' | 'matched' | 'in-progress' | 'completed' | 'cancelled'
    matchedHelperId?: string
    matchedAt?: string
    createdAt: string
    updatedAt: string
  }
  matchedHelper?: {
    id: string
    userId: string
    skills: string[]
    bio: string
    hourlyRate?: number
    status: 'online' | 'offline' | 'busy'
    rating: number
    ratingCount: number
    user: {
      nickname: string
      avatar?: string
    }
  }
  location: {
    lat: number
    lng: number
    address?: string
  }
}
```

### 資料載入策略
- **聚合策略**：單一 BFF 路徑聚合三個資料來源
  - RescueRequest 資料（主要）
  - Helper 資料（如果已匹配）
  - 地圖位置資料
- **優點**：減少 HTTP 請求，確保資料一致性
- **缺點**：如果 Helper 未匹配，仍會返回 null

---

## 註冊成為 Helper 頁 (`/helper/register`)

### 頁面資訊
- **路由**：`/helper/register`
- **BFF 對應**：`POST /api/helper/register`
- **頁面複雜度**：Simple (1:1)

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `submit-button` | `POST /api/helper/register` | `RegisterHelperRequest` | `RegisterHelperResponse` | 見下方 |

### 資料結構定義

```typescript
// 請求資料
interface RegisterHelperRequest {
  bio: string
  skills: string[]
  hourlyRate?: number
  availableUntil?: string  // ISO 8601 日期字串
}

// 回應資料
interface RegisterHelperResponse {
  id: string
  status: 'online' | 'offline' | 'busy'
  createdAt: string
}
```

### 資料載入策略
- 無需預載入資料（表單輸入頁面）
- 註冊成功後返回 Helper ID 和狀態

---

## Helper 個人檔案頁 (`/helper/[helperId]`)

### 頁面資訊
- **路由**：`/helper/[helperId]`
- **BFF 對應**：`GET /api/helper/[id]/details`
- **頁面複雜度**：Standard (1:2-3) - 聚合 Helper + 歷史業績 + 評價列表

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `left-panel`, `right-panel`, `reviews-section` | `GET /api/helper/[id]/details` | `{ helperId }` | `HelperDetailsResponse` | 見下方 |

### 資料結構定義

```typescript
// 回應資料（聚合多個資料來源）
interface HelperDetailsResponse {
  helper: {
    id: string
    userId: string
    skills: string[]
    bio: string
    hourlyRate?: number
    status: 'online' | 'offline' | 'busy'
    user: {
      nickname: string
      avatar?: string
    }
  }
  stats: {
    totalCompleted: number
    totalEarnings: number
    rating: number
    ratingCount: number
  }
  reviews: Array<{
    id: string
    userId: string
    rating: number
    review: string
    createdAt: string
    user: {
      nickname: string
      avatar?: string
    }
  }>
}
```

### 資料載入策略
- **聚合策略**：單一 BFF 路徑聚合三個資料來源
  - Helper 基本資訊
  - 業績統計資料
  - 評價列表（可考慮分頁）
- **優點**：減少 HTTP 請求，確保資料一致性
- **注意**：評價列表可能需要分頁載入（如果評價數量很多）

---

## Helper 儀表板 (`/helper/dashboard`)

### 頁面資訊
- **路由**：`/helper/dashboard`
- **BFF 對應**：
  - `GET /api/helper/dashboard/init-data`
  - `GET /api/helper/dashboard/available-requests`
  - `GET /api/helper/dashboard/active-requests`
  - `GET /api/helper/dashboard/history`
- **頁面複雜度**：Complex (1:N) - 多個獨立區塊

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `status-toggle`, `stats-card` | `GET /api/helper/dashboard/init-data` | 無 | `HelperDashboardInitResponse` | 見下方 |
| `available-requests-section` | `GET /api/helper/dashboard/available-requests` | 無 | `AvailableRequestsResponse` | 見下方 |
| `active-requests-section` | `GET /api/helper/dashboard/active-requests` | 無 | `ActiveRequestsResponse` | 見下方 |
| `history-section` | `GET /api/helper/dashboard/history` | 無 | `HistoryResponse` | 見下方 |
| `status-toggle` | `POST /api/helper/toggle-status` | `{ status }` | `{ success: boolean }` | 簡單回應 |

### 資料結構定義

```typescript
// 初始資料
interface HelperDashboardInitResponse {
  status: 'online' | 'offline' | 'busy'
  stats: {
    totalCompleted: number
    totalEarnings: number
    rating: number
    ratingCount: number
  }
}

// 可接案件列表
interface AvailableRequestsResponse {
  requests: Array<{
    id: string
    requestType: '人力請求' | '空間導航' | '混合'
    stressLevel: number
    budget?: number
    description?: string
    location: {
      lat: number
      lng: number
      address?: string
    }
    createdAt: string
    user: {
      nickname: string
      avatar?: string
    }
  }>
  pagination?: {
    page: number
    total: number
    limit: number
  }
}

// 進行中的案件列表
interface ActiveRequestsResponse {
  requests: Array<{
    id: string
    requestType: '人力請求' | '空間導航' | '混合'
    stressLevel: number
    status: 'matched' | 'in-progress'
    matchedAt: string
    location: {
      lat: number
      lng: number
      address?: string
    }
    user: {
      nickname: string
      avatar?: string
    }
  }>
}

// 歷史案件列表
interface HistoryResponse {
  requests: Array<{
    id: string
    requestType: '人力請求' | '空間導航' | '混合'
    status: 'completed' | 'cancelled'
    completedAt?: string
    cancelledAt?: string
    rating?: number
    review?: string
  }>
  pagination?: {
    page: number
    total: number
    limit: number
  }
}
```

### 資料載入策略
- **獨立載入策略**：每個區塊對應獨立的 BFF 路徑
  - 初始資料（狀態、統計）：快速載入，顯示基本資訊
  - 可接案件列表：獨立載入，支援 Skeleton 載入狀態
  - 進行中的案件：獨立載入
  - 歷史案件：獨立載入，支援分頁
- **優點**：
  - 每個區塊可以獨立顯示 Skeleton 載入狀態
  - 不會因為一個區塊載入慢而阻塞整個頁面
  - 可以並行載入多個區塊
- **注意**：需要處理多個請求的錯誤狀態

---

## 個人儀表板 (`/dashboard`)

### 頁面資訊
- **路由**：`/dashboard`
- **BFF 對應**：
  - `GET /api/dashboard/init-data`
  - `GET /api/dashboard/rescue-requests`
  - `GET /api/dashboard/gatherings`
  - `GET /api/dashboard/notifications`
- **頁面複雜度**：Complex (1:N) - 多個獨立區塊

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `user-info-card` | `GET /api/dashboard/init-data` | 無 | `DashboardInitResponse` | 見下方 |
| `rescue-requests-section` | `GET /api/dashboard/rescue-requests` | 無 | `RescueRequestsResponse` | 見下方 |
| `gatherings-section` | `GET /api/dashboard/gatherings` | 無 | `GatheringsResponse` | 見下方 |
| `notifications-section` | `GET /api/dashboard/notifications` | 無 | `NotificationsResponse` | 見下方 |

### 資料結構定義

```typescript
// 初始資料
interface DashboardInitResponse {
  user: {
    id: string
    nickname: string
    avatar?: string
    role: UserRole
    roles: UserRole[]
  }
}

// 救援請求列表
interface RescueRequestsResponse {
  requests: Array<{
    id: string
    requestType: '人力請求' | '空間導航' | '混合'
    stressLevel: number
    status: 'pending' | 'matched' | 'in-progress' | 'completed' | 'cancelled'
    createdAt: string
    matchedHelper?: {
      id: string
      user: {
        nickname: string
        avatar?: string
      }
    }
  }>
  pagination?: {
    page: number
    total: number
    limit: number
  }
}

// 聚會列表
interface GatheringsResponse {
  gatherings: Array<{
    id: string
    title: string
    description: string
    scheduledAt: string
    status: 'open' | 'full' | 'completed' | 'cancelled'
    location: {
      address: string
    }
    participantsCount: number
    maxParticipants: number
  }>
  pagination?: {
    page: number
    total: number
    limit: number
  }
}

// 通知列表
interface NotificationsResponse {
  notifications: Array<{
    id: string
    type: 'rescue-matched' | 'survival-check' | 'gathering-invite' | 'helper-request'
    title: string
    content: string
    isRead: boolean
    createdAt: string
    relatedObjectId?: string
    relatedObjectType?: string
  }>
  pagination?: {
    page: number
    total: number
    limit: number
  }
}
```

### 資料載入策略
- **獨立載入策略**：每個區塊對應獨立的 BFF 路徑
  - 初始資料（用戶資訊）：快速載入
  - 救援請求列表：獨立載入，支援分頁
  - 聚會列表：獨立載入，支援分頁
  - 通知列表：獨立載入，支援分頁
- **優點**：
  - 每個區塊可以獨立顯示 Skeleton 載入狀態
  - 不會因為一個區塊載入慢而阻塞整個頁面
  - 可以並行載入多個區塊

---

## 通知中心 (`/notifications`)

### 頁面資訊
- **路由**：`/notifications`
- **BFF 對應**：`GET /api/notifications/list`
- **頁面複雜度**：Simple (1:1)

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `notifications-list` | `GET /api/notifications/list` | `{ filter?, page?, limit? }` | `NotificationsListResponse` | 見下方 |

### 資料結構定義

```typescript
// 請求參數
interface NotificationsListRequest {
  filter?: 'all' | 'unread' | 'read'
  page?: number
  limit?: number
}

// 回應資料
interface NotificationsListResponse {
  notifications: Array<{
    id: string
    type: 'rescue-matched' | 'survival-check' | 'gathering-invite' | 'helper-request'
    title: string
    content: string
    isRead: boolean
    createdAt: string
    relatedObjectId?: string
    relatedObjectType?: string
  }>
  pagination: {
    page: number
    total: number
    limit: number
  }
}
```

### 資料載入策略
- **單一載入策略**：單一 BFF 路徑處理所有通知資料
- **支援功能**：
  - 篩選（全部/未讀/已讀）
  - 分頁載入
- **優點**：簡單直接，易於實作

---

## 應對錦囊頁面 (`/response-kit`)

### 頁面資訊
- **路由**：`/response-kit`
- **BFF 對應**：`POST /api/response-kit/generate`
- **頁面複雜度**：Simple (1:1)

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `generate-button` | `POST /api/response-kit/generate` | `GenerateScriptRequest` | `GenerateScriptResponse` | 見下方 |
| `save-button` | `POST /api/response-script/save` | `{ scriptId }` | `{ success: boolean }` | 簡單回應 |

### 資料結構定義

```typescript
// 請求資料
interface GenerateScriptRequest {
  question: string
  tone: 'humorous' | 'cold' | 'laid-back'
}

// 回應資料
interface GenerateScriptResponse {
  script: string
  bodyLanguageTips: string[]
  scriptId?: string  // 如果腳本需要保存，返回 ID
}
```

### 資料載入策略
- 無需預載入資料（表單輸入頁面）
- 生成腳本後返回腳本內容和肢體語言建議
- **注意**：根據 MVP 決策，腳本由前端工程師或 API SERVER 提供，不依賴 AI 生成

---

## 同溫層牆 (`/venting`)

### 頁面資訊
- **路由**：`/venting`
- **BFF 對應**：
  - `GET /api/venting/feed`
  - `GET /api/venting/gatherings`
- **頁面複雜度**：Complex (1:2) - 主內容區 + 側邊欄

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `feed-list` | `GET /api/venting/feed` | `{ page?, limit? }` | `VentingFeedResponse` | 見下方 |
| `gatherings-section` | `GET /api/venting/gatherings` | 無 | `GatheringsResponse` | 見下方 |

### 資料結構定義

```typescript
// 貼文流回應
interface VentingFeedResponse {
  posts: Array<{
    id: string
    content: string
    images?: string[]
    isAnonymous: boolean
    likes: number
    commentCount: number
    createdAt: string
    location?: {
      lat: number
      lng: number
      address?: string
    }
    user?: {
      nickname: string
      avatar?: string
    }  // 如果匿名，不顯示用戶資訊
    relatedGatheringId?: string
  }>
  pagination: {
    page: number
    total: number
    limit: number
  }
}

// 相關聚會回應（與個人儀表板的 GatheringsResponse 相同）
interface GatheringsResponse {
  gatherings: Array<{
    id: string
    title: string
    description: string
    scheduledAt: string
    status: 'open' | 'full' | 'completed' | 'cancelled'
    location: {
      address: string
    }
    participantsCount: number
    maxParticipants: number
  }>
}
```

### 資料載入策略
- **獨立載入策略**：主內容區和側邊欄分別載入
  - 貼文流：獨立載入，支援分頁
  - 相關聚會：獨立載入
- **優點**：
  - 主內容區和側邊欄可以獨立顯示 Skeleton 載入狀態
  - 不會因為一個區塊載入慢而阻塞整個頁面

---

## 發起聚會頁 (`/gathering/create`)

### 頁面資訊
- **路由**：`/gathering/create`
- **BFF 對應**：`POST /api/gathering/create`
- **頁面複雜度**：Simple (1:1)

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `submit-button` | `POST /api/gathering/create` | `CreateGatheringRequest` | `CreateGatheringResponse` | 見下方 |

### 資料結構定義

```typescript
// 請求資料
interface CreateGatheringRequest {
  title: string
  description: string
  scheduledAt: string  // ISO 8601 日期時間字串
  location: {
    lat: number
    lng: number
    address: string
  }
  maxParticipants: number
}

// 回應資料
interface CreateGatheringResponse {
  id: string
  status: 'open' | 'full' | 'completed' | 'cancelled'
  createdAt: string
}
```

### 資料載入策略
- 無需預載入資料（表單輸入頁面）
- 發起成功後返回聚會 ID 和狀態

---

## 聚會詳情頁 (`/gathering/[gatheringId]`)

### 頁面資訊
- **路由**：`/gathering/[gatheringId]`
- **BFF 對應**：`GET /api/gathering/[id]/details`
- **頁面複雜度**：Standard (1:2-3) - 聚合 Gathering + 參與者列表 + 地圖位置

### 資料需求對應表

| UI 區塊 | BFF 路徑 | 請求資料 | 回應資料 | 資料結構 |
|---------|----------|----------|----------|----------|
| `left-panel`, `right-panel` | `GET /api/gathering/[id]/details` | `{ gatheringId }` | `GatheringDetailsResponse` | 見下方 |
| `join-button` | `POST /api/gathering/[id]/join` | `{ gatheringId }` | `{ success: boolean }` | 簡單回應 |
| `leave-button` | `POST /api/gathering/[id]/leave` | `{ gatheringId }` | `{ success: boolean }` | 簡單回應 |
| `cancel-button` | `POST /api/gathering/[id]/cancel` | `{ gatheringId }` | `{ success: boolean }` | 簡單回應 |

### 資料結構定義

```typescript
// 回應資料（聚合多個資料來源）
interface GatheringDetailsResponse {
  gathering: {
    id: string
    creatorId: string
    title: string
    description: string
    scheduledAt: string
    status: 'open' | 'full' | 'completed' | 'cancelled'
    maxParticipants: number
    createdAt: string
    creator: {
      nickname: string
      avatar?: string
    }
  }
  participants: Array<{
    id: string
    nickname: string
    avatar?: string
    joinedAt: string
  }>
  location: {
    lat: number
    lng: number
    address: string
  }
  currentUserParticipating: boolean  // 當前用戶是否已參與
  isCreator: boolean  // 當前用戶是否為發起者
}
```

### 資料載入策略
- **聚合策略**：單一 BFF 路徑聚合三個資料來源
  - Gathering 基本資訊（主要）
  - 參與者列表
  - 地圖位置資料
  - 當前用戶狀態（是否參與、是否為發起者）
- **優點**：減少 HTTP 請求，確保資料一致性

---

## 資料載入策略總結

### Simple Page (1:1)
- **特點**：一個頁面對應一個 BFF 路徑
- **範例**：登入頁、註冊頁、應對錦囊頁
- **策略**：單一請求，簡單直接

### Standard Page (1:2-3)
- **特點**：一個頁面對應 2-3 個 BFF 路徑，或單一 BFF 路徑聚合多個資料來源
- **範例**：救援請求詳情頁、Helper 個人檔案頁、聚會詳情頁
- **策略**：聚合策略，減少 HTTP 請求，確保資料一致性

### Complex Dashboard (1:N)
- **特點**：一個頁面對應多個獨立的 BFF 路徑（N > 3）
- **範例**：個人儀表板、Helper 儀表板、同溫層牆
- **策略**：獨立載入策略，每個區塊對應獨立的 BFF 路徑
- **優點**：
  - 每個區塊可以獨立顯示 Skeleton 載入狀態
  - 不會因為一個區塊載入慢而阻塞整個頁面
  - 可以並行載入多個區塊

---

## 下一步行動

1. **BFF 設計**：基於此資料需求清單設計 BFF 路徑和回應格式
2. **Mock 資料建立**：基於此資料結構定義建立 Mock 資料
3. **前端 Hooks 設計**：基於 BFF 路徑設計對應的前端 Hooks

---

**文檔版本**：v1.0  
**最後更新**：2024  
**維護者**：待指定


