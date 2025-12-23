# 前端 Hooks 規劃文檔

> **版本**：v1.0  
> **基於**：BFF 路徑設計文檔  
> **命名規則**：遵循 `.cursor/rules/routing/architectural-rules.mdc` - `use[PageContext][Resource]()`

---

## Hooks 命名規範

- **模式**：`use[PageContext][Resource]()`
- **範例**：`useRescueRequestDetails()`, `useHelperList()`
- **原則**：語義清晰，對應到 BFF 路徑的語義

---

## Hooks 清單

### 用戶相關 Hooks

#### `useUserProfile()`
**對應 BFF**：`GET /api/user/profile`  
**用途**：獲取當前用戶的個人資料  
**使用頁面**：個人設定頁  
**回傳類型**：
```typescript
const { data: user, refresh, update } = useUserProfile()
```

#### `useUpdateUserProfile()`
**對應 BFF**：`PUT /api/user/profile`  
**用途**：更新用戶個人資料  
**使用頁面**：個人設定頁

#### `useSwitchRole()`
**對應 BFF**：`POST /api/user/switch-role`  
**用途**：切換用戶角色  
**使用頁面**：角色切換功能

---

### 救援請求相關 Hooks

#### `useRescueRequestDetails(requestId: string)`
**對應 BFF**：`GET /api/rescue-request/[id]/details`  
**用途**：獲取救援請求詳情（包含 Helper 資訊與地圖位置）  
**使用頁面**：救援請求詳情頁  
**回傳類型**：
```typescript
const { data, pending, error } = useRescueRequestDetails(requestId)
// data: { request, matchedHelper?, mapLocation? }
```

#### `useCreateRescueRequest()`
**對應 BFF**：`POST /api/rescue-request/create`  
**用途**：建立新的救援請求  
**使用頁面**：建立救援請求頁

#### `useRescueRequestList(filters?)`
**對應 BFF**：`GET /api/rescue-request/list`  
**用途**：獲取救援請求列表  
**使用頁面**：個人儀表板  
**回傳類型**：
```typescript
const { data, pending, refresh } = useRescueRequestList({ status: 'pending' })
// data: { requests, pagination }
```

#### `useAcceptMatch(requestId: string)`
**對應 BFF**：`POST /api/rescue-request/[id]/accept-match`  
**用途**：接受 Helper 匹配  
**使用頁面**：救援請求詳情頁

#### `useCompleteRequest(requestId: string)`
**對應 BFF**：`POST /api/rescue-request/[id]/complete`  
**用途**：標記救援請求完成  
**使用頁面**：救援請求詳情頁

#### `useRateHelper(requestId: string)`
**對應 BFF**：`POST /api/rescue-request/[id]/rate`  
**用途**：評價 Helper  
**使用頁面**：救援請求完成頁

---

### Helper 相關 Hooks

#### `useHelperDetails(helperId: string)`
**對應 BFF**：`GET /api/helper/[id]/details`  
**用途**：獲取 Helper 詳細資訊（包含歷史業績與評價）  
**使用頁面**：Helper 個人檔案頁  
**回傳類型**：
```typescript
const { data, pending } = useHelperDetails(helperId)
// data: { helper, completedRequests, reviews }
```

#### `useHelperList(filters?)`
**對應 BFF**：`GET /api/helper/list`  
**用途**：獲取可用 Helper 列表  
**使用頁面**：救援請求匹配頁  
**回傳類型**：
```typescript
const { data, pending, refresh } = useHelperList({ 
  skills: ['酒量大'], 
  location: { lat: 25.0, lng: 121.5 },
  maxDistance: 5000 
})
```

#### `useRegisterHelper()`
**對應 BFF**：`POST /api/helper/register`  
**用途**：註冊成為 Helper  
**使用頁面**：Helper 註冊頁

#### `useUpdateHelperProfile()`
**對應 BFF**：`PUT /api/helper/profile`  
**用途**：更新 Helper 個人檔案  
**使用頁面**：Helper 設定頁

#### `useToggleHelperStatus()`
**對應 BFF**：`POST /api/helper/toggle-status`  
**用途**：切換 Helper 接案狀態  
**使用頁面**：Helper 儀表板

#### `useAvailableRequests()`
**對應 BFF**：`GET /api/helper/available-requests`  
**用途**：獲取可接的救援請求列表  
**使用頁面**：Helper 儀表板

---

### 應對腳本相關 Hooks

#### `useGenerateScript()`
**對應 BFF**：`POST /api/response-kit/generate`  
**用途**：生成 AI 應對腳本  
**使用頁面**：應對錦囊頁  
**回傳類型**：
```typescript
const { generate, data: script, pending } = useGenerateScript()
await generate({ inputQuestion: '...', tone: 'humorous' })
```

#### `useSavedScripts()`
**對應 BFF**：`GET /api/response-kit/saved-scripts`  
**用途**：獲取收藏的腳本列表  
**使用頁面**：應對錦囊頁

#### `useSaveScript(scriptId: string)`
**對應 BFF**：`POST /api/response-kit/[id]/save`  
**用途**：收藏腳本  
**使用頁面**：應對錦囊頁

---

### 診斷報告相關 Hooks

#### `useStartTest()`
**對應 BFF**：`POST /api/diagnostic/start-test`  
**用途**：開始診斷測驗  
**使用頁面**：角色診斷頁

#### `useSubmitAnswers()`
**對應 BFF**：`POST /api/diagnostic/submit-answers`  
**用途**：提交測驗答案  
**使用頁面**：角色診斷頁

#### `useDiagnosticReportDetails(reportId: string)`
**對應 BFF**：`GET /api/diagnostic-report/[id]/details`  
**用途**：獲取診斷報告詳情（包含處方箋）  
**使用頁面**：診斷報告頁  
**回傳類型**：
```typescript
const { data, pending } = useDiagnosticReportDetails(reportId)
// data: { report, prescription }
```

#### `useShareReport(reportId: string)`
**對應 BFF**：`POST /api/diagnostic-report/[id]/share`  
**用途**：分享診斷報告  
**使用頁面**：診斷報告頁

---

### 宣洩貼文相關 Hooks

#### `useVentPostFeed(filters?)`
**對應 BFF**：`GET /api/venting/feed`  
**用途**：獲取同溫層貼文流（瀑布流）  
**使用頁面**：同溫層牆頁  
**回傳類型**：
```typescript
const { data, pending, loadMore, hasMore } = useVentPostFeed({ 
  page: 1, 
  limit: 20 
})
// data: { posts, pagination }
```

#### `useCreateVentPost()`
**對應 BFF**：`POST /api/venting/post/create`  
**用途**：發布宣洩貼文  
**使用頁面**：同溫層牆頁

#### `useLikePost(postId: string)`
**對應 BFF**：`POST /api/venting/post/[id]/like`  
**用途**：按讚貼文  
**使用頁面**：同溫層牆頁

#### `useCommentPost(postId: string)`
**對應 BFF**：`POST /api/venting/post/[id]/comment`  
**用途**：留言  
**使用頁面**：同溫層牆頁

---

### 聚會相關 Hooks

#### `useGatheringDetails(gatheringId: string)`
**對應 BFF**：`GET /api/gathering/[id]/details`  
**用途**：獲取聚會詳情（包含參與者列表與地圖位置）  
**使用頁面**：聚會詳情頁  
**回傳類型**：
```typescript
const { data, pending } = useGatheringDetails(gatheringId)
// data: { gathering, participants, mapLocation }
```

#### `useCreateGathering()`
**對應 BFF**：`POST /api/gathering/create`  
**用途**：發起聚會  
**使用頁面**：發起聚會頁

#### `useJoinGathering(gatheringId: string)`
**對應 BFF**：`POST /api/gathering/[id]/join`  
**用途**：加入聚會  
**使用頁面**：聚會詳情頁

#### `useLeaveGathering(gatheringId: string)`
**對應 BFF**：`POST /api/gathering/[id]/leave`  
**用途**：退出聚會  
**使用頁面**：聚會詳情頁

#### `useGatheringList(filters?)`
**對應 BFF**：`GET /api/gathering/list`  
**用途**：獲取聚會列表  
**使用頁面**：聚會列表頁

---

### 地圖相關 Hooks

#### `useMapInitData()`
**對應 BFF**：`GET /api/map/init-data`  
**用途**：獲取地圖初始設定  
**使用頁面**：戰況地圖頁  
**回傳類型**：
```typescript
const { data, pending } = useMapInitData()
// data: { center, zoom, availableLayers }
```

#### `useRescuePointsLayer(bounds?)`
**對應 BFF**：`GET /api/map/rescue-points`  
**用途**：獲取救援點圖層數據  
**使用頁面**：戰況地圖頁  
**回傳類型**：
```typescript
const { data, pending, refresh } = useRescuePointsLayer(bounds)
// data: { layers }
```

#### `useHelpersLayer(bounds?)`
**對應 BFF**：`GET /api/map/helpers`  
**用途**：獲取 Helper 位置圖層數據  
**使用頁面**：戰況地圖頁

#### `useSanctuariesLayer(bounds?)`
**對應 BFF**：`GET /api/map/sanctuaries`  
**用途**：獲取避難空間圖層數據  
**使用頁面**：戰況地圖頁

#### `useHeatZonesLayer(bounds?)`
**對應 BFF**：`GET /api/map/heat-zones`  
**用途**：獲取熱力分布圖層數據  
**使用頁面**：戰況地圖頁

---

### 通知相關 Hooks

#### `useNotificationsList(filters?)`
**對應 BFF**：`GET /api/notifications/list`  
**用途**：獲取通知列表  
**使用頁面**：個人儀表板、通知中心  
**回傳類型**：
```typescript
const { data, pending, refresh } = useNotificationsList({ isRead: false })
// data: { notifications, unreadCount }
```

#### `useMarkNotificationRead(notificationId: string)`
**對應 BFF**：`POST /api/notifications/[id]/mark-read`  
**用途**：標記通知為已讀  
**使用頁面**：通知中心

#### `useNotificationPreferences()`
**對應 BFF**：`PUT /api/notifications/preferences`  
**用途**：更新通知偏好設定  
**使用頁面**：通知設定頁

---

### 邊界說明書相關 Hooks

#### `useBoundaryManualDetails()`
**對應 BFF**：`GET /api/boundary-manual/details`  
**用途**：獲取當前用戶的邊界說明書  
**使用頁面**：邊界說明書頁  
**回傳類型**：
```typescript
const { data, pending } = useBoundaryManualDetails()
// data: { manual }
```

#### `useUpdateBoundaryManual()`
**對應 BFF**：`PUT /api/boundary-manual/update`  
**用途**：更新邊界說明書  
**使用頁面**：邊界說明書頁

#### `useBoundaryManualByToken(shareToken: string)`
**對應 BFF**：`GET /api/boundary-manual/[shareToken]`  
**用途**：透過分享 token 訪問邊界說明書  
**使用頁面**：邊界說明書分享頁

---

### 儀表板相關 Hooks

#### `useDashboardInitData()`
**對應 BFF**：`GET /api/dashboard/init-data`  
**用途**：獲取儀表板初始數據（用戶基本資訊與統計）  
**使用頁面**：個人儀表板  
**回傳類型**：
```typescript
const { data, pending } = useDashboardInitData()
// data: { user, stats }
```

#### `useDashboardRescueRequests()`
**對應 BFF**：`GET /api/dashboard/rescue-requests`  
**用途**：獲取用戶的救援請求列表（獨立載入）  
**使用頁面**：個人儀表板  
**回傳類型**：
```typescript
const { data, pending, refresh } = useDashboardRescueRequests()
// 獨立載入，不阻塞其他區塊
```

#### `useDashboardGatherings()`
**對應 BFF**：`GET /api/dashboard/gatherings`  
**用途**：獲取用戶參與的聚會列表（獨立載入）  
**使用頁面**：個人儀表板

#### `useDashboardNotifications()`
**對應 BFF**：`GET /api/dashboard/notifications`  
**用途**：獲取通知列表（獨立載入）  
**使用頁面**：個人儀表板

---

## Hooks 實作原則

### 1. 使用 Nuxt 3 的 `useFetch` 或 `useAsyncData`

```typescript
// 範例：useRescueRequestDetails
export function useRescueRequestDetails(requestId: string) {
  return useFetch(`/api/rescue-request/${requestId}/details`, {
    key: `rescue-request-${requestId}`,
    transform: (data: any) => ({
      request: data.request,
      matchedHelper: data.matchedHelper,
      mapLocation: data.mapLocation
    })
  })
}
```

### 2. 獨立載入狀態管理

對於 Complex Dashboard，每個 Hook 應該有獨立的 `pending` 狀態，支援 Skeleton 載入：

```typescript
// 範例：儀表板頁面
const { data: initData, pending: initPending } = useDashboardInitData()
const { data: requests, pending: requestsPending } = useDashboardRescueRequests()
const { data: gatherings, pending: gatheringsPending } = useDashboardGatherings()

// 每個區塊可以獨立顯示 Skeleton
```

### 3. 避免 Waterfall 載入

如果 A 需要 B 的資料，應該在 BFF 中聚合，而不是在前端串聯：

```typescript
// ❌ 錯誤：Waterfall 載入
const { data: request } = useRescueRequestDetails(id)
const helperId = computed(() => request.value?.matchedHelperId)
const { data: helper } = useHelperDetails(helperId.value) // 依賴 request

// ✅ 正確：BFF 已聚合
const { data } = useRescueRequestDetails(id)
// data.value 已包含 matchedHelper
```

### 4. 錯誤處理

所有 Hooks 應該統一處理錯誤：

```typescript
const { data, error, pending } = useRescueRequestDetails(id)

if (error.value) {
  // 統一錯誤處理
  console.error('Failed to load rescue request:', error.value)
}
```

### 5. 重新整理機制

提供 `refresh` 方法供手動重新載入：

```typescript
const { data, refresh } = useRescueRequestList()

// 手動重新載入
await refresh()
```

---

## Hooks 檔案結構建議

```
composables/
  ├── user/
  │   ├── useUserProfile.ts
  │   ├── useUpdateUserProfile.ts
  │   └── useSwitchRole.ts
  ├── rescue-request/
  │   ├── useRescueRequestDetails.ts
  │   ├── useCreateRescueRequest.ts
  │   └── useRescueRequestList.ts
  ├── helper/
  │   ├── useHelperDetails.ts
  │   └── useHelperList.ts
  └── ...
```

---

**文檔版本**：v1.0  
**最後更新**：2024  
**維護者**：待指定

