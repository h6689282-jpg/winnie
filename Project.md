## 交友網站作品專案說明

## 專案名稱
**MeetNow**｜簡易交友配對網站

## 專案目標
建立一個交友網站 MVP，使用者可以註冊登入、建立個人資料、瀏覽其他使用者、按 Like / Pass，若雙方互相 Like 則成立 Match。

此專案重點在於展示：
- 前後端分離架構
- REST API 設計
- 使用者驗證
- 關聯式資料庫設計

---

## 技術選型

### Frontend
- React

### Backend
- Django
- Django REST Framework
- Simple JWT

### Database
- SQLite

---

## 系統功能

### 1. 會員系統
- 註冊
- 登入
- 登出
- JWT 驗證
- 取得目前登入者資料

### 2. 個人資料
- 暱稱
- 年齡
- 性別
- 地區
- 自我介紹
- 興趣標籤
- 頭像 URL

### 3. 探索頁（Discover）
- 顯示其他使用者卡片
- Like / Pass 操作
- 不顯示自己
- 不重複顯示已操作過的人

### 4. 配對功能（Match）
- A Like B
- 若 B 也 Like A，則建立 Match
- 顯示配對成功訊息

### 5. 配對清單
- 查看所有成功配對的對象
- 顯示對方基本資料

---

## 頁面規劃

### Home
- 網站介紹
- Login / Register 按鈕

### Register
- Email
- Password
- Confirm Password
- Nickname

### Login
- Email
- Password

### Profile
- 編輯個人資料
- 興趣標籤設定

### Discover
- 使用者卡片
- Like / Pass 按鈕

### Matches
- 成功配對列表

---

## 資料表設計

### User
可使用 Django 自訂 User 或 `AbstractUser`

欄位建議：
- id
- email
- password
- username
- created_at

### Profile
- id
- user (OneToOne)
- nickname
- age
- gender
- location
- bio
- avatar_url
- created_at
- updated_at

### Interest
- id
- name

### Like
- id
- from_user (FK User)
- to_user (FK User)
- created_at

限制：
- 不可 Like 自己
- 同一人不可重複 Like 同一人

### Match
- id
- user1 (FK User)
- user2 (FK User)
- matched_at

限制：
- user1 / user2 組合唯一
- 建議固定小 id 在前，避免重複配對資料

---

## API 設計

### Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/token/refresh/`
- `GET /api/auth/me/`

### Profile
- `GET /api/profile/me/`
- `PUT /api/profile/me/`
- `GET /api/profile/<user_id>/`

### Discover
- `GET /api/discover/`

### Like
- `POST /api/likes/`

請求範例：

```json
{
  "to_user_id": 5,
  "action": "like"
}
```

成功回應範例（有成立配對時）：

```json
{
  "match": true
}
```

---

## 系統架構概觀

- **架構型態**: 前後端分離的 SPA + RESTful API
- **前端**: React SPA，透過 `fetch`/`axios` 呼叫後端 API
- **後端**: Django + DRF，負責驗證、商業邏輯與資料存取
- **資料庫**: SQLite（開發階段），可日後抽換為 PostgreSQL

簡化架構示意：

```text
[React Frontend]  -- JWT / JSON -->  [Django REST API]  -- ORM -->  [SQLite DB]
                         ↑
                    Token 驗證
```

---

## 前端架構設計（規劃）

- **頁面路由**
  - `/` : Home
  - `/login` : Login
  - `/register` : Register
  - `/profile` : Profile 編輯
  - `/discover` : 探索頁
  - `/matches` : 配對清單

- **狀態管理**
  - 使用 `Context` 或輕量狀態管理，集中管理登入狀態與目前使用者資料
  - 將 API 呼叫封裝在 `api` 模組中，頁面僅負責 UI 與互動

- **建議目錄結構**

```text
frontend/
  src/
    api/          # 封裝與後端溝通的函式
    components/   # 共用 UI 元件（按鈕、卡片等）
    pages/        # 各頁面（Home, Login, Register...）
    hooks/        # 自訂 hooks（如 useAuth, useProfile）
    styles/       # 全域樣式或樣式方案
    main.jsx/tsx
```

---

## 後端架構設計（規劃）

- **Django App 拆分建議**
  - `accounts` : 使用者帳號與 JWT 驗證相關
  - `profiles` : 個人資料與興趣標籤
  - `matches` : Like / Match 邏輯與查詢
  - `core` : 共用工具、設定與基底 model

- **URL / View 分層**
  - 使用 DRF 的 `ViewSet` 或 `APIView` 來實作 `Auth / Profile / Discover / Like / Match` 等 API
  - 善用 Serializer 做輸入驗證與輸出格式控制

---

## 非功能性需求（NFR）

- **安全性**
  - 密碼必須雜湊儲存，使用 Django 內建機制
  - 所有需要登入的 API 一律檢查 JWT
  - Like / Match 操作需檢查權限（只能對自己以外的使用者操作）

- **效能與體驗**
  - 探索頁一次回傳有限數量的使用者（例如分頁或 batch）
  - 避免 N+1 查詢，對常用查詢加上適當 prefetch / select_related

- **可維護性**
  - 前後端 API 介面透過文件（此檔案）明確定義
  - Model 與 Serializer 命名清楚，避免過度耦合

---

## 開發與執行方式（規劃）

- **環境需求**
  - Python 3.11+
  - Node.js（版本依實際前端框架而定）

- **預期專案結構**

```text
project/
  backend/
    manage.py
    meetnow/                # Django 專案設定
      __init__.py
      settings.py
      urls.py
      asgi.py
      wsgi.py

    apps/                   # 業務模組
      accounts/             # 帳號、登入、註冊
      profiles/             # 使用者個人資料
      matches/              # Like / Match 邏輯
      common/               # 共用工具、基底類別、權限

    static/                 # Django 全域共用 static
    media/                  # 使用者上傳檔案
    templates/              # 如 admin / email template
    requirements.txt

  frontend/
    package.json
    vite.config.(ts|js)     # 建議使用 Vite 建立 React 專案
    tsconfig.json           # 若使用 TypeScript
    src/
      main.(tsx|jsx)
      App.(tsx|jsx)
      pages/                # Home, Login, Register, Profile, Discover, Matches
      components/           # 共用 UI 元件
      api/                  # 封裝呼叫後端 API 的函式
      hooks/                # useAuth, useProfile, useDiscover 等
      styles/               # 全域樣式 / Tailwind 設定等

  project.md                # 專案說明文件
```

- **基本流程**
  - 後端：建立虛擬環境 → 安裝依賴 → `python manage.py migrate` → `python manage.py runserver`
  - 前端：`npm install` / `pnpm install` → `npm run dev` → 瀏覽器打開對應網址