# Wireframe 文檔 v2.0（精簡版）

> **版本**：v2.0  
> **基於**：ORCA 分析文檔、頁面路由設計、BFF 路徑設計  
> **目的**：精簡版 Wireframe 文檔，移除冗餘資訊，使用對照表和模板化描述  
> **最後更新**：2025

---

## 文檔結構說明

本精簡版採用分層抽象化：
- **Level 1**：頁面總覽表（路由、BFF、複雜度）
- **Level 2**：頁面模板（通用結構描述）
- **Level 3**：功能模組詳細規格（僅關鍵差異）
- **Level 4**：UI 區塊對照表（按模組分組）

---

## 頁面總覽表

| 頁面路由 | 功能模組 | 頁面複雜度 | 主要 BFF 路徑 | 布局類型 | 路由守衛 |
|---------|---------|-----------|--------------|---------|---------|
| `/login` | 認證系統 | Simple (1:1) | `POST /api/auth/login` | 單欄居中表單 | 無（公開） |
| `/register` | 認證系統 | Simple (1:1) | `POST /api/auth/register` | 單欄居中表單 | 無（公開） |
| `/rescue-request/create` | 救援功能（B1） | Simple (1:1) | `POST /api/rescue-request/create` | 單欄表單 | 認證 + Escapee/SilentBuffer |
| `/rescue-request/[requestId]` | 救援功能（B1） | Standard (1:2-3) | `GET /api/rescue-request/[id]/details` | 左右分欄詳情 | 認證 + 擁有者/Helper |
| `/helper/register` | Helper 功能（B4） | Simple (1:1) | `POST /api/helper/register` | 單欄表單 | 認證 |
| `/helper/[helperId]` | Helper 功能（B4） | Standard (1:2-3) | `GET /api/helper/[id]/details` | 左右分欄詳情 | 認證（公開） |
| `/helper/dashboard` | Helper 功能（B4） | Complex (1:N) | `GET /api/helper/dashboard/*` | 多區塊儀表板 | 認證 + Helper |
| `/dashboard` | 個人儀表板 | Complex (1:N) | `GET /api/dashboard/*` | 多區塊儀表板 | 認證 |
| `/notifications` | 通知系統（B7） | Simple (1:1) | `GET /api/notifications/list` | 列表頁 | 認證 |
| `/response-kit` | 應對錦囊（B2） | Simple (1:1) | `POST /api/response-kit/generate` | 單欄表單+輸出 | 認證 |
| `/venting` | 同溫層牆（B5） | Complex (1:2) | `GET /api/venting/*` | 主內容+側邊欄 | 認證 |
| `/gathering/create` | 同溫層牆（B5） | Simple (1:1) | `POST /api/gathering/create` | 單欄表單 | 認證 + UrbanLoner |
| `/gathering/[gatheringId]` | 同溫層牆（B5） | Standard (1:2-3) | `GET /api/gathering/[id]/details` | 左右分欄詳情 | 認證 |

---

## 頁面模板

### 表單頁面模板

**適用頁面**：登入、註冊、建立請求、註冊 Helper、發起聚會

**布局結構**：
- Header（導航列/Logo）
- 表單容器（居中，固定寬度）
  - 表單欄位（依功能而定）
  - 提交按鈕
  - 取消/返回連結

**資料流程**：
- 表單輸入 → 前端驗證 → 提交到 BFF → 成功導航/失敗顯示錯誤

**互動模式**：
- 表單驗證（前端）
- 提交後載入狀態
- 成功/失敗處理

---

### 詳情頁模板

**適用頁面**：救援請求詳情、Helper 詳情、聚會詳情

**布局結構**：
- Header（導航列）
- 左右分欄（50% / 50%）
  - 左側：主要資訊區塊 + 地圖位置
  - 右側：相關資訊區塊（Helper/參與者/統計）
- 操作按鈕（依權限顯示）

**資料流程**：
- 單一 BFF 路徑聚合多個資料來源
- 頁面載入時一次性獲取所有資料

**互動模式**：
- 條件顯示（依狀態/權限）
- 操作按鈕（取消/加入/退出等）

---

### 儀表板模板

**適用頁面**：個人儀表板、Helper 儀表板

**布局結構**：
- Header（導航列）
- 頂部資訊卡片（用戶資訊/狀態切換/統計）
- 多個獨立區塊（並行載入）
  - 每個區塊獨立顯示 Skeleton 載入狀態
  - 支援獨立刷新

**資料流程**：
- 多個 BFF 路徑並行載入
- 每個區塊對應獨立的 BFF 路徑
- 支援獨立錯誤處理

**互動模式**：
- 並行載入
- 獨立 Skeleton 狀態
- 區塊級操作

---

### 列表頁模板

**適用頁面**：通知中心、同溫層牆

**布局結構**：
- Header（導航列）
- 篩選/標籤（可選）
- 列表區塊（瀑布流/分頁）
- 側邊欄（可選，如聚會列表）

**資料流程**：
- 單一或多個 BFF 路徑
- 支援分頁/無限滾動
- 篩選參數

**互動模式**：
- 分頁載入
- 篩選切換
- 列表項操作（點擊/標記已讀等）

---

## 功能模組詳細規格

### 認證系統

#### 登入頁 (`/login`)
- **布局**：單欄居中表單
- **表單欄位**：Email、密碼、記住我（可選）
- **BFF**：`POST /api/auth/login` → `{ token, user }`
- **成功後**：儲存 token → 導航到 `/dashboard`
- **特殊處理**：忘記密碼連結、註冊連結

#### 註冊頁 (`/register`)
- **布局**：單欄居中表單
- **表單欄位**：Email、密碼、確認密碼、暱稱
- **BFF**：`POST /api/auth/register` → `{ token, user }`
- **前端驗證**：密碼確認、Email 格式
- **成功後**：儲存 token → 導航到 `/dashboard`

---

### 救援功能（B1）

#### 建立救援請求頁 (`/rescue-request/create`)
- **布局**：單欄表單
- **表單欄位**：
  - 請求類型（單選：人力請求/空間導航/混合）
  - 壓力等級（1-5）
  - 預算（可選）
  - 詳細描述（可選）
  - 地理位置（地圖選擇器 + 地址）
- **BFF**：`POST /api/rescue-request/create` → `{ id, status, createdAt }`
- **成功後**：導航到 `/rescue-request/[requestId]`

#### 救援請求詳情頁 (`/rescue-request/[requestId]`)
- **布局**：左右分欄詳情
- **左側區塊**：請求資訊、狀態、地圖位置、取消按鈕
- **右側區塊**：Helper 資訊（如果已匹配）、匹配資訊
- **BFF**：`GET /api/rescue-request/[id]/details` → `{ rescueRequest, helper?, location }`
- **條件顯示**：Helper 卡片（僅已匹配時）、取消按鈕（僅 pending 狀態）

---

### Helper 功能（B4）

#### 註冊成為 Helper 頁 (`/helper/register`)
- **布局**：單欄表單
- **表單欄位**：個人簡介、技能標籤（多選）、時薪（可選）、可接案時間（可選）
- **BFF**：`POST /api/helper/register` → `{ id, status, createdAt }`
- **成功後**：導航到 `/helper/dashboard`

#### Helper 個人檔案頁 (`/helper/[helperId]`)
- **布局**：左右分欄詳情
- **左側區塊**：Helper 基本資訊、技能標籤、狀態、聯絡按鈕
- **右側區塊**：業績統計（完成案件、總收入、評價）
- **下方區塊**：評價列表（分頁）
- **BFF**：`GET /api/helper/[id]/details` → `{ helper, stats, reviews }`

#### Helper 儀表板 (`/helper/dashboard`)
- **布局**：多區塊儀表板
- **頂部區塊**：狀態切換、業績統計
- **主要區塊**：
  - 可接案件列表（獨立載入）
  - 進行中的案件（獨立載入）
  - 歷史案件（獨立載入）
- **BFF 路徑**：
  - `GET /api/helper/dashboard/init-data`（狀態、統計）
  - `GET /api/helper/dashboard/available-requests`
  - `GET /api/helper/dashboard/active-requests`
  - `GET /api/helper/dashboard/history`
- **互動**：狀態切換 → `POST /api/helper/toggle-status`

---

### 個人儀表板

#### 個人儀表板 (`/dashboard`)
- **布局**：多區塊儀表板
- **頂部區塊**：用戶資訊卡片、快速操作按鈕
- **主要區塊**：
  - 我的救援請求列表（獨立載入）
  - 我參與的聚會列表（獨立載入）
  - 通知中心（獨立載入）
- **BFF 路徑**：
  - `GET /api/dashboard/init-data`（用戶資訊）
  - `GET /api/dashboard/rescue-requests`
  - `GET /api/dashboard/gatherings`
  - `GET /api/dashboard/notifications`

---

### 通知系統（B7）

#### 通知中心 (`/notifications`)
- **布局**：列表頁
- **頂部**：篩選標籤（全部/未讀/已讀）
- **列表**：通知項目（圖標、標題、內容、時間、未讀標記）
- **BFF**：`GET /api/notifications/list` → `{ notifications[], pagination }`
- **互動**：點擊通知 → 標記已讀 → 導航到相關頁面

---

### 應對錦囊（B2）

#### 應對錦囊頁面 (`/response-kit`)
- **布局**：單欄表單+輸出
- **輸入區塊**：問話輸入框、語氣選擇器（幽默/冷漠/擺爛）、生成按鈕
- **輸出區塊**：腳本內容、肢體語言建議、複製/收藏按鈕
- **BFF**：
  - `POST /api/response-kit/generate` → `{ script, bodyLanguageTips }`
  - `POST /api/response-script/save`（收藏）

---

### 同溫層牆（B5）

#### 同溫層牆 (`/venting`)
- **布局**：主內容+側邊欄（70% / 30%）
- **主內容區**：發布貼文按鈕、貼文流列表（分頁）
- **側邊欄**：相關聚會列表
- **BFF 路徑**：
  - `GET /api/venting/feed`（貼文流）
  - `GET /api/venting/gatherings`（相關聚會）
- **互動**：按讚、留言、載入更多

#### 發起聚會頁 (`/gathering/create`)
- **布局**：單欄表單
- **表單欄位**：標題、描述、日期時間、地點（地圖選擇器+地址）、人數上限
- **BFF**：`POST /api/gathering/create` → `{ id, status, createdAt }`
- **成功後**：導航到 `/gathering/[gatheringId]`

#### 聚會詳情頁 (`/gathering/[gatheringId]`)
- **布局**：左右分欄詳情
- **左側區塊**：聚會資訊、狀態、地圖位置、取消按鈕（僅發起者）
- **右側區塊**：參與者列表、加入/退出按鈕
- **BFF**：`GET /api/gathering/[id]/details` → `{ gathering, participants, location, currentUserParticipating, isCreator }`
- **條件顯示**：依用戶狀態顯示不同按鈕

---

## UI 區塊對照表

### 認證系統

| UI 區塊 ID | 功能描述 | 資料來源 | 備註 |
|-----------|---------|---------|------|
| `login-form` | 登入表單 | 用戶輸入 | 包含 Email、密碼、記住我 |
| `register-form` | 註冊表單 | 用戶輸入 | 包含 Email、密碼、確認密碼、暱稱 |

---

### 救援功能（B1）

| UI 區塊 ID | 功能描述 | 資料來源 | 備註 |
|-----------|---------|---------|------|
| `request-type-selector` | 請求類型選擇 | 用戶輸入 | 單選：人力請求/空間導航/混合 |
| `stress-level-selector` | 壓力等級選擇 | 用戶輸入 | 1-5 等級 |
| `location-picker` | 地理位置選擇器 | 用戶輸入 + 地圖 API | 地圖選擇器 + 地址輸入 |
| `request-info` | 請求基本資訊 | RescueRequest 資料 | 類型、壓力、預算、描述、狀態 |
| `helper-card` | Helper 卡片 | Helper 資料 | 僅已匹配時顯示 |
| `map-section` | 地圖顯示 | RescueRequest.location | 顯示請求位置 |

---

### Helper 功能（B4）

| UI 區塊 ID | 功能描述 | 資料來源 | 備註 |
|-----------|---------|---------|------|
| `skills-selector` | 技能標籤選擇器 | 用戶輸入 | 多選 |
| `helper-profile` | Helper 基本資訊 | Helper 資料 | 頭像、名稱、簡介、技能、時薪、狀態 |
| `stats-card` | 業績統計卡片 | Helper 統計資料 | 完成案件、總收入、評價 |
| `reviews-section` | 評價列表區塊 | 評價資料 | 分頁載入 |
| `status-toggle` | 狀態切換 | Helper.status | 在線/離線切換 |
| `available-requests-section` | 可接案件列表 | 救援請求列表 | 獨立載入 |
| `active-requests-section` | 進行中案件列表 | 救援請求列表 | 獨立載入 |
| `history-section` | 歷史案件列表 | 救援請求列表 | 獨立載入 |

---

### 個人儀表板

| UI 區塊 ID | 功能描述 | 資料來源 | 備註 |
|-----------|---------|---------|------|
| `user-info-card` | 用戶資訊卡片 | User 資料 | 頭像、名稱、角色 |
| `quick-actions` | 快速操作按鈕組 | 靜態內容 | 建立請求、發起聚會、應對錦囊 |
| `rescue-requests-section` | 救援請求列表 | 救援請求列表 | 獨立載入 |
| `gatherings-section` | 聚會列表 | 聚會列表 | 獨立載入 |
| `notifications-section` | 通知列表 | 通知列表 | 獨立載入 |

---

### 通知系統（B7）

| UI 區塊 ID | 功能描述 | 資料來源 | 備註 |
|-----------|---------|---------|------|
| `filter-tabs` | 篩選標籤 | 前端狀態 | 全部/未讀/已讀 |
| `notifications-list` | 通知列表 | 通知資料 | 支援分頁 |
| `notification-item` | 單一通知項目 | 通知資料 | 圖標、標題、內容、時間、未讀標記 |

---

### 應對錦囊（B2）

| UI 區塊 ID | 功能描述 | 資料來源 | 備註 |
|-----------|---------|---------|------|
| `question-textarea` | 問話輸入框 | 用戶輸入 | 長輩問話 |
| `tone-selector` | 語氣選擇器 | 用戶輸入 | 單選：幽默/冷漠/擺爛 |
| `script-display` | 腳本內容顯示 | ResponseScript 資料 | 生成的腳本 |
| `body-language-tips` | 肢體語言建議 | ResponseScript.bodyLanguageTips | 建議列表 |

---

### 同溫層牆（B5）

| UI 區塊 ID | 功能描述 | 資料來源 | 備註 |
|-----------|---------|---------|------|
| `create-post-button` | 發布貼文按鈕 | 靜態內容 | 路由到貼文創建或彈出表單 |
| `feed-list` | 貼文流列表 | VentPost 資料 | 支援分頁 |
| `post-item` | 單一貼文項目 | VentPost 資料 | 內容、圖片、按讚數、留言數 |
| `gatherings-section` | 相關聚會區塊 | Gathering 資料 | 側邊欄，獨立載入 |
| `participants-list` | 參與者列表 | Gathering.participants | 頭像、名稱 |

---

## 互動流程摘要

### 關鍵決策點

1. **認證流程**
   - 登入/註冊成功 → 儲存 token → 導航到儀表板
   - 失敗 → 顯示錯誤訊息

2. **救援請求流程**
   - 建立請求 → 成功 → 導航到詳情頁
   - 詳情頁 → 條件顯示 Helper 卡片（僅已匹配）
   - 取消請求 → 僅 pending 狀態可取消

3. **Helper 流程**
   - 註冊 Helper → 成功 → 導航到 Helper 儀表板
   - 儀表板 → 狀態切換 → 更新可接案件列表
   - 詳情頁 → 條件顯示聯絡按鈕（需有救援請求）

4. **儀表板流程**
   - 多區塊並行載入 → 獨立 Skeleton 狀態
   - 區塊級錯誤處理

5. **聚會流程**
   - 發起聚會 → 成功 → 導航到詳情頁
   - 詳情頁 → 條件顯示按鈕（依用戶狀態：未參與/已參與/發起者）

### 異常處理

- **API 錯誤**：顯示錯誤訊息，保持當前頁面
- **權限不足**：導航到儀表板或顯示權限錯誤
- **資料載入失敗**：顯示錯誤狀態，提供重試選項
- **表單驗證失敗**：顯示驗證錯誤，阻止提交

---

**文檔版本**：v2.0（精簡版）  
**最後更新**：2025  
**維護者**：待指定

