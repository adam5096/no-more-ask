# 頁面路由設計文檔

> **版本**：v1.0  
> **基於**：ORCA 分析文檔與 BFF 路徑設計  
> **命名規則**：遵循 `.cursor/rules/routing/page-routung-guideline.mdc` 和 `.cursor/rules/routing/routing-consistency.mdc`

---

## 路由設計原則

1. **命名規則**：嚴格使用 `kebab-case`（小寫字母與連字號）
2. **層級限制**：不超過 3 層嵌套
3. **動態參數**：
   - SEO 敏感內容使用 `[slug]`
   - 私有內容使用 `[id]`
4. **語義對齊**：頁面路由與 BFF 路徑保持語義一致性
5. **參數對齊**：使用相同的參數名稱（如 `requestId`, `helperId`）

---

## 路由清單

### 公開路由（無需認證）

#### `/`
**描述**：首頁/登陸頁  
**BFF 對應**：無  
**組件**：`pages/index.vue`

#### `/login`
**描述**：登入頁面  
**BFF 對應**：無  
**組件**：`pages/login.vue`

#### `/register`
**描述**：註冊頁面  
**BFF 對應**：無  
**組件**：`pages/register.vue`

#### `/boundary/[shareToken]`
**描述**：邊界說明書分享頁（公開訪問）  
**BFF 對應**：`GET /api/boundary-manual/[shareToken]`  
**組件**：`pages/boundary/[shareToken].vue`  
**參數對齊**：`shareToken` 與 BFF 一致

---

### 認證路由（需要登入）

#### `/dashboard`
**描述**：個人儀表板  
**BFF 對應**：
- `GET /api/dashboard/init-data`
- `GET /api/dashboard/rescue-requests`
- `GET /api/dashboard/gatherings`
- `GET /api/dashboard/notifications`
**組件**：`pages/dashboard.vue`  
**路由守衛**：需要認證

#### `/profile`
**描述**：個人資料設定頁  
**BFF 對應**：
- `GET /api/user/profile`
- `PUT /api/user/profile`
**組件**：`pages/profile.vue`  
**路由守衛**：需要認證

---

### 救援請求相關路由

#### `/rescue-request/create`
**描述**：建立救援請求頁  
**BFF 對應**：`POST /api/rescue-request/create`  
**組件**：`pages/rescue-request/create.vue`  
**路由守衛**：需要認證，角色為 Escapee 或 SilentBuffer  
**語義對齊**：`rescue-request` 與 BFF `/api/rescue-request` 一致

#### `/rescue-request/[requestId]`
**描述**：救援請求詳情頁  
**BFF 對應**：`GET /api/rescue-request/[id]/details`  
**組件**：`pages/rescue-request/[requestId].vue`  
**參數對齊**：`requestId` 對應 BFF 的 `[id]`  
**路由守衛**：需要認證，且為請求擁有者或匹配的 Helper

#### `/rescue-request/[requestId]/match`
**描述**：救援請求匹配頁（選擇 Helper）  
**BFF 對應**：
- `GET /api/helper/list`
- `POST /api/rescue-request/[id]/accept-match`
**組件**：`pages/rescue-request/[requestId]/match.vue`  
**路由守衛**：需要認證，且為請求擁有者

---

### Helper 相關路由

#### `/helper/register`
**描述**：註冊成為 Helper 頁  
**BFF 對應**：`POST /api/helper/register`  
**組件**：`pages/helper/register.vue`  
**路由守衛**：需要認證

#### `/helper/[helperId]`
**描述**：Helper 個人檔案頁  
**BFF 對應**：`GET /api/helper/[id]/details`  
**組件**：`pages/helper/[helperId].vue`  
**參數對齊**：`helperId` 對應 BFF 的 `[id]`  
**路由守衛**：需要認證（公開查看，但某些資訊僅本人可見）

#### `/helper/settings`
**描述**：Helper 設定頁  
**BFF 對應**：
- `GET /api/helper/[id]/details`
- `PUT /api/helper/profile`
- `POST /api/helper/toggle-status`
**組件**：`pages/helper/settings.vue`  
**路由守衛**：需要認證，且為 Helper 身份

#### `/helper/dashboard`
**描述**：Helper 儀表板（查看可接案件）  
**BFF 對應**：
- `GET /api/helper/available-requests`
**組件**：`pages/helper/dashboard.vue`  
**路由守衛**：需要認證，且為 Helper 身份

---

### 應對錦囊相關路由

#### `/response-kit`
**描述**：應對錦囊頁（生成 AI 腳本）  
**BFF 對應**：
- `POST /api/response-kit/generate`
- `GET /api/response-kit/saved-scripts`
- `POST /api/response-kit/[id]/save`
**組件**：`pages/response-kit/index.vue`  
**路由守衛**：需要認證  
**語義對齊**：`response-kit` 與 BFF `/api/response-kit` 一致

---

### 角色診斷相關路由

#### `/diagnostic`
**描述**：角色診斷頁（開始測驗）  
**BFF 對應**：
- `POST /api/diagnostic/start-test`
- `POST /api/diagnostic/submit-answers`
**組件**：`pages/diagnostic/index.vue`  
**路由守衛**：需要認證

#### `/diagnostic/report/[reportId]`
**描述**：診斷報告詳情頁  
**BFF 對應**：`GET /api/diagnostic-report/[id]/details`  
**組件**：`pages/diagnostic/report/[reportId].vue`  
**參數對齊**：`reportId` 對應 BFF 的 `[id]`  
**路由守衛**：需要認證，且為報告擁有者

---

### 同溫層牆相關路由

#### `/venting`
**描述**：同溫層牆頁（貼文流）  
**BFF 對應**：
- `GET /api/venting/feed`
- `POST /api/venting/post/create`
- `POST /api/venting/post/[id]/like`
- `POST /api/venting/post/[id]/comment`
**組件**：`pages/venting/index.vue`  
**路由守衛**：需要認證  
**語義對齊**：`venting` 與 BFF `/api/venting` 一致

---

### 聚會相關路由

#### `/gathering/create`
**描述**：發起聚會頁  
**BFF 對應**：`POST /api/gathering/create`  
**組件**：`pages/gathering/create.vue`  
**路由守衛**：需要認證，角色為 UrbanLoner

#### `/gathering/[gatheringId]`
**描述**：聚會詳情頁  
**BFF 對應**：
- `GET /api/gathering/[id]/details`
- `POST /api/gathering/[id]/join`
- `POST /api/gathering/[id]/leave`
**組件**：`pages/gathering/[gatheringId].vue`  
**參數對齊**：`gatheringId` 對應 BFF 的 `[id]`  
**路由守衛**：需要認證

#### `/gathering/list`
**描述**：聚會列表頁  
**BFF 對應**：`GET /api/gathering/list`  
**組件**：`pages/gathering/list.vue`  
**路由守衛**：需要認證

---

### 戰況地圖相關路由

#### `/map`
**描述**：戰況地圖頁（全景視覺中心）  
**BFF 對應**：
- `GET /api/map/init-data`
- `GET /api/map/rescue-points`
- `GET /api/map/helpers`
- `GET /api/map/sanctuaries`
- `GET /api/map/heat-zones`
**組件**：`pages/map/index.vue`  
**路由守衛**：需要認證  
**語義對齊**：`map` 與 BFF `/api/map` 一致

---

### 通知相關路由

#### `/notifications`
**描述**：通知中心頁  
**BFF 對應**：
- `GET /api/notifications/list`
- `POST /api/notifications/[id]/mark-read`
**組件**：`pages/notifications/index.vue`  
**路由守衛**：需要認證

#### `/notifications/settings`
**描述**：通知設定頁  
**BFF 對應**：
- `PUT /api/notifications/preferences`
**組件**：`pages/notifications/settings.vue`  
**路由守衛**：需要認證

---

### 邊界說明書相關路由

#### `/boundary-manual`
**描述**：邊界說明書頁（查看/編輯）  
**BFF 對應**：
- `GET /api/boundary-manual/details`
- `PUT /api/boundary-manual/update`
**組件**：`pages/boundary-manual/index.vue`  
**路由守衛**：需要認證  
**語義對齊**：`boundary-manual` 與 BFF `/api/boundary-manual` 一致

---

## 路由與 BFF 對應關係表

| 頁面路由 | BFF 路徑 | 語義對齊 | 參數對齊 |
|---------|----------|----------|----------|
| `/rescue-request/[requestId]` | `/api/rescue-request/[id]/details` | ✅ `rescue-request` | ✅ `requestId` → `id` |
| `/helper/[helperId]` | `/api/helper/[id]/details` | ✅ `helper` | ✅ `helperId` → `id` |
| `/gathering/[gatheringId]` | `/api/gathering/[id]/details` | ✅ `gathering` | ✅ `gatheringId` → `id` |
| `/response-kit` | `/api/response-kit/*` | ✅ `response-kit` | N/A |
| `/venting` | `/api/venting/*` | ✅ `venting` | N/A |
| `/map` | `/api/map/*` | ✅ `map` | N/A |
| `/boundary-manual` | `/api/boundary-manual/*` | ✅ `boundary-manual` | N/A |
| `/diagnostic/report/[reportId]` | `/api/diagnostic-report/[id]/details` | ✅ `diagnostic-report` | ✅ `reportId` → `id` |

---

## 路由守衛規劃

### 認證守衛

所有需要認證的路由都應該使用 Nuxt 3 的 middleware：

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
```

### 角色守衛

特定角色才能訪問的路由：

```typescript
// middleware/role.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  
  // 救援請求建立頁：僅 Escapee 或 SilentBuffer
  if (to.path === '/rescue-request/create') {
    if (!['Escapee', 'SilentBuffer'].includes(user.value.role)) {
      return navigateTo('/dashboard')
    }
  }
  
  // Helper 相關頁面：僅 Helper 角色
  if (to.path.startsWith('/helper/')) {
    if (user.value.role !== 'Helper') {
      return navigateTo('/dashboard')
    }
  }
  
  // 聚會建立頁：僅 UrbanLoner
  if (to.path === '/gathering/create') {
    if (user.value.role !== 'UrbanLoner') {
      return navigateTo('/dashboard')
    }
  }
})
```

### 資源擁有者守衛

確保用戶只能訪問自己擁有的資源：

```typescript
// middleware/owner.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useAuth()
  const route = useRoute()
  
  // 救援請求詳情頁：請求擁有者或匹配的 Helper
  if (to.path.startsWith('/rescue-request/') && route.params.requestId) {
    const { data: request } = await useRescueRequestDetails(route.params.requestId as string)
    
    if (request.value?.userId !== user.value.id && 
        request.value?.matchedHelperId !== user.value.helperId) {
      return navigateTo('/dashboard')
    }
  }
})
```

---

## 路由檔案結構

```
pages/
  ├── index.vue                    # 首頁
  ├── login.vue                    # 登入
  ├── register.vue                 # 註冊
  ├── dashboard.vue                # 儀表板
  ├── profile.vue                  # 個人資料
  ├── rescue-request/
  │   ├── create.vue               # 建立救援請求
  │   └── [requestId].vue          # 救援請求詳情
  ├── helper/
  │   ├── register.vue            # 註冊 Helper
  │   ├── [helperId].vue           # Helper 檔案
  │   ├── settings.vue             # Helper 設定
  │   └── dashboard.vue            # Helper 儀表板
  ├── response-kit/
  │   └── index.vue                # 應對錦囊
  ├── diagnostic/
  │   ├── index.vue                # 開始測驗
  │   └── report/
  │       └── [reportId].vue       # 診斷報告
  ├── venting/
  │   └── index.vue                # 同溫層牆
  ├── gathering/
  │   ├── create.vue               # 發起聚會
  │   ├── list.vue                 # 聚會列表
  │   └── [gatheringId].vue        # 聚會詳情
  ├── map/
  │   └── index.vue                # 戰況地圖
  ├── notifications/
  │   ├── index.vue                # 通知中心
  │   └── settings.vue            # 通知設定
  ├── boundary-manual/
  │   └── index.vue                # 邊界說明書
  └── boundary/
      └── [shareToken].vue         # 邊界說明書分享頁
```

---

## 路由命名規範檢查清單

- [x] 所有路由使用 `kebab-case`
- [x] 不超過 3 層嵌套
- [x] 動態參數使用 `[id]` 或 `[slug]`
- [x] 頁面路由與 BFF 路徑語義對齊
- [x] 參數名稱與 BFF 一致
- [x] 路由守衛已規劃（認證、角色、資源擁有者）

---

**文檔版本**：v1.0  
**最後更新**：2024  
**維護者**：待指定

