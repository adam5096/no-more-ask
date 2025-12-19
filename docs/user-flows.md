# 用戶流程圖文檔

> **版本**：v1.0  
> **基於**：ORCA 分析文檔與資訊架構規劃  
> **目的**：為 6 個用戶角色繪製主要使用流程，標註對應的頁面路由與 BFF 路徑

---

## 流程圖說明

- **矩形**：頁面/操作
- **菱形**：決策點
- **圓角矩形**：系統處理
- **標註**：頁面路由與 BFF 路徑

---

## Escapee（焦慮的求助者）流程

### 流程 1：建立救援請求

```mermaid
flowchart TD
    Start([進入系統]) --> Login{已登入?}
    Login -->|否| LoginPage[/login]
    LoginPage --> Dashboard[/dashboard]
    Login -->|是| Dashboard
    Dashboard --> CreateRequest[/rescue-request/create]
    CreateRequest --> InputInfo[輸入壓力等級與預算]
    InputInfo --> SetLocation[設定地理位置]
    SetLocation --> Submit[提交請求]
    Submit --> BFF1[POST /api/rescue-request/create]
    BFF1 --> RequestCreated[請求已建立]
    RequestCreated --> ViewRequest[/rescue-request/[requestId]]
    ViewRequest --> BFF2[GET /api/rescue-request/[id]/details]
    BFF2 --> WaitMatch[等待匹配]
    WaitMatch --> MatchNotification[收到匹配通知]
    MatchNotification --> BFF3[GET /api/notifications/list]
    BFF3 --> ViewMatches[/rescue-request/[requestId]/match]
    ViewMatches --> BFF4[GET /api/helper/list]
    BFF4 --> SelectHelper[選擇 Helper]
    SelectHelper --> AcceptMatch[接受匹配]
    AcceptMatch --> BFF5[POST /api/rescue-request/[id]/accept-match]
    BFF5 --> Matched[匹配成功]
    Matched --> Complete[完成救援]
    Complete --> Rate[評價 Helper]
    Rate --> BFF6[POST /api/rescue-request/[id]/rate]
    BFF6 --> End([流程結束])
```

### 流程 2：使用應對錦囊

```mermaid
flowchart TD
    Start([進入應對錦囊]) --> ResponseKit[/response-kit]
    ResponseKit --> InputQuestion[輸入長輩問話]
    InputQuestion --> SelectTone[選擇語氣]
    SelectTone --> Generate[生成腳本]
    Generate --> BFF1[POST /api/response-kit/generate]
    BFF1 --> ViewScript[查看生成的腳本]
    ViewScript --> Copy[複製腳本]
    Copy --> Save{是否收藏?}
    Save -->|是| BFF2[POST /api/response-kit/[id]/save]
    Save -->|否| End([流程結束])
    BFF2 --> End
```

---

## Helper（專業的閒人）流程

### 流程 1：註冊成為 Helper 並接案

```mermaid
flowchart TD
    Start([進入系統]) --> RegisterHelper[/helper/register]
    RegisterHelper --> InputSkills[輸入技能標籤]
    InputSkills --> InputBio[輸入個人簡介]
    InputBio --> SetRate[設定時薪]
    SetRate --> Submit[提交註冊]
    Submit --> BFF1[POST /api/helper/register]
    BFF1 --> HelperRegistered[Helper 註冊成功]
    HelperRegistered --> HelperDashboard[/helper/dashboard]
    HelperDashboard --> ToggleStatus[切換為在線狀態]
    ToggleStatus --> BFF2[POST /api/helper/toggle-status]
    BFF2 --> ViewRequests[查看可接案件]
    ViewRequests --> BFF3[GET /api/helper/available-requests]
    BFF3 --> SelectRequest[選擇救援請求]
    SelectRequest --> ViewDetails[/rescue-request/[requestId]]
    ViewDetails --> BFF4[GET /api/rescue-request/[id]/details]
    BFF4 --> Accept{是否接受?}
    Accept -->|是| AcceptRequest[接受請求]
    AcceptRequest --> BFF5[POST /api/helper/accept-request]
    BFF5 --> InProgress[進行中]
    InProgress --> Complete[完成救援]
    Complete --> End([流程結束])
    Accept -->|否| ViewRequests
```

---

## WokeElder（覺醒的長輩）流程

### 流程 1：進行角色診斷

```mermaid
flowchart TD
    Start([進入系統]) --> Diagnostic[/diagnostic]
    Diagnostic --> SelectTest[選擇長輩端測驗]
    SelectTest --> BFF1[POST /api/diagnostic/start-test]
    BFF1 --> AnswerQuestions[回答測驗問題]
    AnswerQuestions --> SubmitAnswers[提交答案]
    SubmitAnswers --> BFF2[POST /api/diagnostic/submit-answers]
    BFF2 --> ViewReport[/diagnostic/report/[reportId]]
    ViewReport --> BFF3[GET /api/diagnostic-report/[id]/details]
    BFF3 --> ViewPrescription[查看處方箋]
    ViewPrescription --> End([流程結束])
```

---

## SilentBuffer（夾心餅乾配偶）流程

### 流程 1：建立救援請求並使用應對腳本

```mermaid
flowchart TD
    Start([進入系統]) --> Dashboard[/dashboard]
    Dashboard --> CreateRequest[/rescue-request/create]
    CreateRequest --> InputInfo[輸入需求]
    InputInfo --> SubmitRequest[提交請求]
    SubmitRequest --> BFF1[POST /api/rescue-request/create]
    BFF1 --> ResponseKit[/response-kit]
    ResponseKit --> GenerateScript[生成應對腳本]
    GenerateScript --> BFF2[POST /api/response-kit/generate]
    BFF2 --> UseScript[使用腳本應對]
    UseScript --> Venting[/venting]
    Venting --> CreatePost[發布宣洩貼文]
    CreatePost --> BFF3[POST /api/venting/post/create]
    BFF3 --> End([流程結束])
```

---

## UrbanLoner（節慶邊緣人）流程

### 流程 1：發起聚會並參與社群

```mermaid
flowchart TD
    Start([進入系統]) --> Map[/map]
    Map --> BFF1[GET /api/map/init-data]
    BFF1 --> ViewLoners[查看邊緣人座標]
    ViewLoners --> BFF2[GET /api/map/loners]
    BFF2 --> CreateGathering[/gathering/create]
    CreateGathering --> SetLocation[設定地點]
    SetLocation --> SetTime[設定時間]
    SetTime --> SetMax[設定人數上限]
    SetMax --> Submit[提交]
    Submit --> BFF3[POST /api/gathering/create]
    BFF3 --> ViewGathering[/gathering/[gatheringId]]
    ViewGathering --> BFF4[GET /api/gathering/[id]/details]
    BFF4 --> Venting[/venting]
    Venting --> CreatePost[發布貼文宣傳聚會]
    CreatePost --> BFF5[POST /api/venting/post/create]
    BFF5 --> WaitJoin[等待參與者加入]
    WaitJoin --> End([流程結束])
```

### 流程 2：參與他人發起的聚會

```mermaid
flowchart TD
    Start([進入系統]) --> GatheringList[/gathering/list]
    GatheringList --> BFF1[GET /api/gathering/list]
    BFF1 --> Filter[篩選聚會]
    Filter --> ViewDetails[/gathering/[gatheringId]]
    ViewDetails --> BFF2[GET /api/gathering/[id]/details]
    BFF2 --> CheckStatus{聚會狀態?}
    CheckStatus -->|開放| Join[加入聚會]
    CheckStatus -->|已滿| WaitList[加入候補]
    CheckStatus -->|已取消| Back[返回列表]
    Join --> BFF3[POST /api/gathering/[id]/join]
    BFF3 --> Joined[已加入]
    Joined --> End([流程結束])
    WaitList --> End
    Back --> GatheringList
```

---

## 跨角色通用流程

### 流程 1：查看通知

```mermaid
flowchart TD
    Start([收到通知]) --> NotificationCenter[/notifications]
    NotificationCenter --> BFF1[GET /api/notifications/list]
    BFF1 --> ViewList[查看通知列表]
    ViewList --> ClickNotification[點擊通知]
    ClickNotification --> MarkRead[標記為已讀]
    MarkRead --> BFF2[POST /api/notifications/[id]/mark-read]
    BFF2 --> Navigate[導航到相關頁面]
    Navigate --> End([流程結束])
```

### 流程 2：建立邊界說明書

```mermaid
flowchart TD
    Start([進入邊界說明書]) --> BoundaryManual[/boundary-manual]
    BoundaryManual --> BFF1[GET /api/boundary-manual/details]
    BFF1 --> SelectTopics[勾選接受/不接受的話題]
    SelectTopics --> Update[更新清單]
    Update --> BFF2[PUT /api/boundary-manual/update]
    BFF2 --> GenerateUrl[生成分享 URL]
    GenerateUrl --> Share[分享給親友]
    Share --> End([流程結束])
```

---

## 流程圖對應表

| 用戶角色 | 主要流程 | 頁面路由 | BFF 路徑 |
|---------|---------|---------|----------|
| Escapee | 建立救援請求 | `/rescue-request/create` | `POST /api/rescue-request/create` |
| Escapee | 使用應對錦囊 | `/response-kit` | `POST /api/response-kit/generate` |
| Helper | 註冊並接案 | `/helper/register` | `POST /api/helper/register` |
| Helper | 查看可接案件 | `/helper/dashboard` | `GET /api/helper/available-requests` |
| WokeElder | 角色診斷 | `/diagnostic` | `POST /api/diagnostic/start-test` |
| SilentBuffer | 建立請求+腳本 | `/rescue-request/create` + `/response-kit` | 多個 BFF 路徑 |
| UrbanLoner | 發起聚會 | `/gathering/create` | `POST /api/gathering/create` |
| UrbanLoner | 參與聚會 | `/gathering/list` | `GET /api/gathering/list` |
| 所有角色 | 查看通知 | `/notifications` | `GET /api/notifications/list` |
| 所有角色 | 建立邊界說明書 | `/boundary-manual` | `PUT /api/boundary-manual/update` |

---

## 決策點說明

### 1. 登入狀態檢查
- **位置**：所有需要認證的流程
- **決策**：已登入 → 繼續流程；未登入 → 導向登入頁

### 2. 匹配選擇
- **位置**：救援請求匹配流程
- **決策**：接受匹配 → 繼續；拒絕 → 重新匹配

### 3. 聚會狀態檢查
- **位置**：參與聚會流程
- **決策**：開放 → 加入；已滿 → 候補；已取消 → 返回

### 4. 收藏選擇
- **位置**：應對腳本流程
- **決策**：收藏 → 保存；不收藏 → 僅使用

---

## 錯誤處理流程

### 流程：處理 API 錯誤

```mermaid
flowchart TD
    Start([API 請求]) --> Request[發送請求]
    Request --> Success{請求成功?}
    Success -->|是| Process[處理回應]
    Success -->|否| CheckError{錯誤類型?}
    CheckError -->|401 未授權| RedirectLogin[/login]
    CheckError -->|403 無權限| ShowError[顯示權限錯誤]
    CheckError -->|404 不存在| ShowNotFound[顯示不存在]
    CheckError -->|500 伺服器錯誤| ShowServerError[顯示伺服器錯誤]
    CheckError -->|網路錯誤| ShowNetworkError[顯示網路錯誤]
    RedirectLogin --> End([流程結束])
    ShowError --> End
    ShowNotFound --> End
    ShowServerError --> Retry{是否重試?}
    Retry -->|是| Request
    Retry -->|否| End
    ShowNetworkError --> Retry
    Process --> End
```

---

## 流程優化建議

### 1. 減少步驟
- 合併相關操作（如建立請求後直接進入匹配頁）
- 提供快速操作入口（FAB 按鈕）

### 2. 提供預設值
- 地理位置自動偵測
- 預設技能標籤建議
- 預設語氣選擇

### 3. 即時反饋
- 載入狀態顯示（Skeleton）
- 操作成功提示
- 錯誤訊息明確

### 4. 離線支援
- 快取常用資料
- 離線時顯示快取內容
- 上線後同步更新

---

**文檔版本**：v1.0  
**最後更新**：2024  
**維護者**：待指定

