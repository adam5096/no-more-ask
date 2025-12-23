# 組件庫規劃文檔

> **版本**：v1.0  
> **基於**：ORCA 分析文檔、BFF 路徑設計與頁面路由  
> **目的**：識別可重用的 UI 組件，對應到 ORCA 對象的屬性顯示，定義組件如何透過 Hooks 獲取 BFF 資料

---

## 組件分類

### 1. 基礎組件（Base Components）
基於現有的 shadcn-vue 組件庫擴充

### 2. 業務組件（Business Components）
對應到 ORCA 對象的專屬組件

### 3. 布局組件（Layout Components）
頁面結構與導航組件

### 4. 表單組件（Form Components）
資料輸入與驗證組件

---

## 基礎組件清單

### 已存在（shadcn-vue）
- `Button` - 按鈕組件（已存在於 `components/ui/button/`）

### 需要新增
- `Card` - 卡片容器
- `Input` - 輸入框
- `Textarea` - 多行輸入
- `Select` - 下拉選單
- `Checkbox` - 複選框
- `Radio` - 單選框
- `Badge` - 標籤
- `Avatar` - 頭像
- `Skeleton` - 載入骨架
- `Dialog` - 對話框
- `Toast` - 提示訊息
- `Tabs` - 標籤頁
- `Accordion` - 手風琴
- `Tooltip` - 工具提示

---

## 業務組件清單

### User 相關組件

#### `UserAvatar`
**對應對象**：User  
**用途**：顯示用戶頭像與名稱  
**資料來源**：`useUserProfile()`  
**屬性顯示**：
- `avatar` - 頭像 URL
- `nickname` - 顯示名稱
- `role` - 角色標籤（可選）

```vue
<UserAvatar 
  :user="user" 
  :show-role="true"
  size="md"
/>
```

#### `UserRoleBadge`
**對應對象**：User  
**用途**：顯示用戶角色標籤  
**資料來源**：User.role  
**屬性顯示**：
- `role` - 角色類型（Escapee, Helper, 等）

```vue
<UserRoleBadge :role="user.role" />
```

---

### RescueRequest 相關組件

#### `RescueRequestCard`
**對應對象**：RescueRequest  
**用途**：顯示救援請求卡片（列表用）  
**資料來源**：`useRescueRequestList()`  
**屬性顯示**：
- `requestType` - 請求類型
- `stressLevel` - 壓力等級（視覺化）
- `status` - 狀態標籤
- `location` - 地理位置（簡化顯示）
- `createdAt` - 建立時間

```vue
<RescueRequestCard 
  :request="request"
  @click="navigateToDetails(request.id)"
/>
```

#### `RescueRequestDetails`
**對應對象**：RescueRequest  
**用途**：顯示救援請求詳情  
**資料來源**：`useRescueRequestDetails(requestId)`  
**屬性顯示**：
- 所有 RescueRequest 屬性
- 匹配的 Helper 資訊（如果已匹配）
- 地圖位置

```vue
<RescueRequestDetails 
  :request-id="requestId"
  :show-helper="true"
  :show-map="true"
/>
```

#### `StressLevelIndicator`
**對應對象**：RescueRequest  
**用途**：視覺化壓力等級（1-5）  
**資料來源**：RescueRequest.stressLevel

```vue
<StressLevelIndicator 
  :level="request.stressLevel"
  :show-label="true"
/>
```

#### `RescueRequestForm`
**對應對象**：RescueRequest  
**用途**：建立/編輯救援請求表單  
**資料來源**：表單輸入  
**提交**：`useCreateRescueRequest()`

```vue
<RescueRequestForm 
  @submit="handleSubmit"
  :initial-data="initialData"
/>
```

---

### Helper 相關組件

#### `HelperCard`
**對應對象**：Helper  
**用途**：顯示 Helper 卡片（列表用）  
**資料來源**：`useHelperList()`  
**屬性顯示**：
- `skills` - 技能標籤列表
- `rating` - 評價分數
- `totalCompleted` - 完成案件數
- `status` - 狀態（online/offline/busy）
- `hourlyRate` - 時薪

```vue
<HelperCard 
  :helper="helper"
  @click="navigateToDetails(helper.id)"
/>
```

#### `HelperDetails`
**對應對象**：Helper  
**用途**：顯示 Helper 詳細資訊  
**資料來源**：`useHelperDetails(helperId)`  
**屬性顯示**：
- 所有 Helper 屬性
- 歷史完成案件列表
- 評價列表

```vue
<HelperDetails 
  :helper-id="helperId"
  :show-history="true"
  :show-reviews="true"
/>
```

#### `SkillTags`
**對應對象**：Helper  
**用途**：顯示技能標籤列表  
**資料來源**：Helper.skills

```vue
<SkillTags 
  :skills="helper.skills"
  :max-display="5"
/>
```

#### `RatingDisplay`
**對應對象**：Helper  
**用途**：顯示評價分數  
**資料來源**：Helper.rating, Helper.ratingCount

```vue
<RatingDisplay 
  :rating="helper.rating"
  :count="helper.ratingCount"
  :show-count="true"
/>
```

---

### ResponseScript 相關組件

#### `ResponseScriptGenerator`
**對應對象**：ResponseScript  
**用途**：生成 AI 應對腳本  
**資料來源**：表單輸入  
**提交**：`useGenerateScript()`

```vue
<ResponseScriptGenerator 
  @generate="handleGenerate"
  :saved-scripts="savedScripts"
/>
```

#### `ResponseScriptDisplay`
**對應對象**：ResponseScript  
**用途**：顯示生成的腳本  
**資料來源**：ResponseScript 物件  
**屬性顯示**：
- `generatedScript` - 生成的腳本
- `tone` - 語氣標籤
- `bodyLanguageTips` - 肢體語言建議

```vue
<ResponseScriptDisplay 
  :script="script"
  :show-tips="true"
  :show-copy-button="true"
/>
```

---

### DiagnosticReport 相關組件

#### `DiagnosticTestForm`
**對應對象**：DiagnosticReport  
**用途**：診斷測驗表單  
**資料來源**：表單輸入  
**提交**：`useSubmitAnswers()`

```vue
<DiagnosticTestForm 
  :test-type="testType"
  :questions="questions"
  @submit="handleSubmit"
/>
```

#### `DiagnosticReportDisplay`
**對應對象**：DiagnosticReport  
**用途**：顯示診斷報告  
**資料來源**：`useDiagnosticReportDetails(reportId)`  
**屬性顯示**：
- `shadowArea` - 心理陰影面積（視覺化）
- `socialLabel` - 社交標籤
- `prescription` - 處方箋內容

```vue
<DiagnosticReportDisplay 
  :report-id="reportId"
  :show-prescription="true"
/>
```

#### `ShadowAreaChart`
**對應對象**：DiagnosticReport  
**用途**：視覺化心理陰影面積  
**資料來源**：DiagnosticReport.shadowArea

```vue
<ShadowAreaChart 
  :area="report.shadowArea"
  :max="100"
/>
```

---

### VentPost 相關組件

#### `VentPostCard`
**對應對象**：VentPost  
**用途**：顯示宣洩貼文卡片  
**資料來源**：`useVentPostFeed()`  
**屬性顯示**：
- `content` - 貼文內容
- `images` - 圖片列表
- `isAnonymous` - 匿名標記
- `likes` - 按讚數
- `commentCount` - 留言數
- `createdAt` - 發布時間

```vue
<VentPostCard 
  :post="post"
  @like="handleLike"
  @comment="handleComment"
/>
```

#### `VentPostForm`
**對應對象**：VentPost  
**用途**：發布宣洩貼文表單  
**資料來源**：表單輸入  
**提交**：`useCreateVentPost()`

```vue
<VentPostForm 
  @submit="handleSubmit"
  :allow-anonymous="true"
  :allow-images="true"
/>
```

#### `VentPostFeed`
**對應對象**：VentPost  
**用途**：貼文流（瀑布流）  
**資料來源**：`useVentPostFeed()`  
**功能**：
- 無限滾動載入
- 按讚與留言互動

```vue
<VentPostFeed 
  :filters="filters"
  @load-more="handleLoadMore"
/>
```

---

### Gathering 相關組件

#### `GatheringCard`
**對應對象**：Gathering  
**用途**：顯示聚會卡片（列表用）  
**資料來源**：`useGatheringList()`  
**屬性顯示**：
- `title` - 聚會標題
- `description` - 描述
- `scheduledAt` - 預定時間
- `location` - 地點
- `participants` - 參與者數量
- `maxParticipants` - 人數上限
- `status` - 狀態標籤

```vue
<GatheringCard 
  :gathering="gathering"
  @click="navigateToDetails(gathering.id)"
/>
```

#### `GatheringDetails`
**對應對象**：Gathering  
**用途**：顯示聚會詳情  
**資料來源**：`useGatheringDetails(gatheringId)`  
**屬性顯示**：
- 所有 Gathering 屬性
- 參與者列表
- 地圖位置

```vue
<GatheringDetails 
  :gathering-id="gatheringId"
  :show-participants="true"
  :show-map="true"
/>
```

#### `GatheringForm`
**對應對象**：Gathering  
**用途**：發起聚會表單  
**資料來源**：表單輸入  
**提交**：`useCreateGathering()`

```vue
<GatheringForm 
  @submit="handleSubmit"
  :initial-location="userLocation"
/>
```

---

### MapLayer 相關組件

#### `OperationMap`
**對應對象**：MapLayer  
**用途**：戰況地圖主組件  
**資料來源**：
- `useMapInitData()`
- `useRescuePointsLayer()`
- `useHelpersLayer()`
- `useSanctuariesLayer()`
- `useHeatZonesLayer()`

```vue
<OperationMap 
  :layers="activeLayers"
  @layer-toggle="handleLayerToggle"
  @marker-click="handleMarkerClick"
/>
```

#### `MapLayerToggle`
**對應對象**：MapLayer  
**用途**：圖層開關控制  
**資料來源**：MapLayer 配置

```vue
<MapLayerToggle 
  :layers="availableLayers"
  v-model="activeLayers"
/>
```

#### `MapMarker`
**對應對象**：MapLayer  
**用途**：地圖標記  
**資料來源**：MapLayer.coordinates

```vue
<MapMarker 
  :coordinates="layer.coordinates"
  :type="layer.type"
  :data="layer.relatedObject"
/>
```

---

### Notification 相關組件

#### `NotificationList`
**對應對象**：Notification  
**用途**：通知列表  
**資料來源**：`useNotificationsList()`  
**屬性顯示**：
- `type` - 通知類型（圖示）
- `title` - 通知標題
- `content` - 通知內容
- `isRead` - 已讀狀態
- `createdAt` - 時間

```vue
<NotificationList 
  :filters="filters"
  @mark-read="handleMarkRead"
/>
```

#### `NotificationBadge`
**對應對象**：Notification  
**用途**：未讀通知數量徽章  
**資料來源**：`useNotificationsList({ isRead: false })`

```vue
<NotificationBadge 
  :count="unreadCount"
  @click="navigateToNotifications"
/>
```

---

### BoundaryManual 相關組件

#### `BoundaryManualEditor`
**對應對象**：BoundaryManual  
**用途**：編輯邊界說明書  
**資料來源**：`useBoundaryManualDetails()`  
**屬性顯示**：
- `acceptedTopics` - 接受的話題列表
- `rejectedTopics` - 不接受的話題列表

```vue
<BoundaryManualEditor 
  :manual="manual"
  @update="handleUpdate"
/>
```

#### `BoundaryManualViewer`
**對應對象**：BoundaryManual  
**用途**：查看邊界說明書（公開分享頁）  
**資料來源**：`useBoundaryManualByToken(shareToken)`

```vue
<BoundaryManualViewer 
  :share-token="shareToken"
  :show-stats="false"
/>
```

---

## 布局組件清單

### `AppLayout`
**用途**：應用程式主布局  
**包含**：
- 頂部導航欄
- 側邊欄（可選）
- 主要內容區
- 底部導航欄（手機版）

```vue
<AppLayout>
  <template #header>
    <AppHeader />
  </template>
  <template #sidebar>
    <AppSidebar />
  </template>
  <slot />
</AppLayout>
```

### `DashboardLayout`
**用途**：儀表板專用布局  
**包含**：
- 側邊欄導航
- 主要內容區（多欄位）

```vue
<DashboardLayout>
  <template #sidebar>
    <DashboardSidebar />
  </template>
  <slot />
</DashboardLayout>
```

### `PageHeader`
**用途**：頁面標題與操作區  
**包含**：
- 頁面標題
- 麵包屑導航
- 操作按鈕

```vue
<PageHeader 
  :title="pageTitle"
  :breadcrumbs="breadcrumbs"
>
  <template #actions>
    <Button>操作按鈕</Button>
  </template>
</PageHeader>
```

---

## 表單組件清單

### `LocationPicker`
**用途**：地理位置選擇器  
**對應對象**：User.location, RescueRequest.location, Gathering.location  
**功能**：
- 地圖選擇
- 地址搜尋
- 座標輸入

```vue
<LocationPicker 
  v-model="location"
  :allow-search="true"
/>
```

### `RoleSelector`
**用途**：角色選擇器  
**對應對象**：User.role  
**功能**：
- 多角色選擇
- 角色說明

```vue
<RoleSelector 
  v-model="selectedRoles"
  :available-roles="availableRoles"
/>
```

### `SkillSelector`
**用途**：技能標籤選擇器  
**對應對象**：Helper.skills  
**功能**：
- 多選標籤
- 自定義技能

```vue
<SkillSelector 
  v-model="selectedSkills"
  :suggestions="skillSuggestions"
/>
```

### `ToneSelector`
**用途**：語氣選擇器  
**對應對象**：ResponseScript.tone  
**功能**：
- 單選語氣
- 語氣說明

```vue
<ToneSelector 
  v-model="selectedTone"
  :options="toneOptions"
/>
```

---

## 組件資料綁定模式

### 模式 1：直接傳遞資料
```vue
<HelperCard :helper="helper" />
```

### 模式 2：透過 Hook 獲取
```vue
<HelperDetails :helper-id="helperId" />
<!-- 組件內部使用 useHelperDetails(helperId) -->
```

### 模式 3：透過 Slot 傳遞
```vue
<RescueRequestCard :request="request">
  <template #actions>
    <Button @click="handleAction">操作</Button>
  </template>
</RescueRequestCard>
```

---

## 組件檔案結構建議

```
components/
  ├── ui/                    # 基礎組件（shadcn-vue）
  │   ├── button/
  │   ├── card/
  │   ├── input/
  │   └── ...
  ├── business/              # 業務組件
  │   ├── user/
  │   │   ├── UserAvatar.vue
  │   │   └── UserRoleBadge.vue
  │   ├── rescue-request/
  │   │   ├── RescueRequestCard.vue
  │   │   ├── RescueRequestDetails.vue
  │   │   └── RescueRequestForm.vue
  │   ├── helper/
  │   │   ├── HelperCard.vue
  │   │   └── HelperDetails.vue
  │   └── ...
  ├── layout/                # 布局組件
  │   ├── AppLayout.vue
  │   ├── DashboardLayout.vue
  │   └── PageHeader.vue
  └── forms/                 # 表單組件
      ├── LocationPicker.vue
      ├── RoleSelector.vue
      └── SkillSelector.vue
```

---

## 組件開發優先級

### Phase 1 (MVP)
1. 基礎組件（Card, Input, Button, Badge）
2. UserAvatar, UserRoleBadge
3. RescueRequestCard, RescueRequestForm
4. HelperCard, HelperDetails
5. VentPostCard, VentPostFeed
6. AppLayout, PageHeader

### Phase 2
7. ResponseScriptGenerator, ResponseScriptDisplay
8. DiagnosticTestForm, DiagnosticReportDisplay
9. GatheringCard, GatheringForm
10. NotificationList, NotificationBadge
11. OperationMap, MapLayerToggle

### Phase 3
12. BoundaryManualEditor, BoundaryManualViewer
13. DashboardLayout
14. 所有表單組件

---

**文檔版本**：v1.0  
**最後更新**：2024  
**維護者**：待指定

