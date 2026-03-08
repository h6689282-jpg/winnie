# MeetNow — 架構與技術概覽

本文件說明 MeetNow 約會/配對 MVP 的整體框架、架構與實作方式。

---

## 1. 概覽

MeetNow 為**前後端分離的 SPA + REST API** 應用：

- **前端**：以 Vite 建置的 React（TypeScript/JSX）單頁應用，使用 React Router 與 Tailwind CSS。
- **後端**：Django + Django REST Framework（DRF），並以 Simple JWT 做身份驗證。
- **資料庫**：開發環境使用 SQLite；正式環境可改為 PostgreSQL。

前端僅透過 HTTP JSON API 與後端通訊。所有需驗證的請求皆使用 JWT Bearer Token；前端將 access 與 refresh token 存於 `localStorage`，並在每次 API 請求中附上 access token。

---

## 2. 高層架構

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           瀏覽器（使用者）                                │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  React SPA（Vite）                                                       │
│  • React Router（/, /login, /register, /profile, /discover, /matches）   │
│  • AuthContext（使用者狀態、登入、註冊、登出）                             │
│  • 受保護路由（未登入時導向 /login）                                       │
│  • API 層（axios 客戶端 + auth/profile/discover/likes/matches）           │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                          HTTP + JSON，Authorization: Bearer <access>
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  Django（後端）                                                          │
│  • 為前端來源啟用 CORS                                                    │
│  • DRF + 受保護端點的 JWT 驗證                                            │
│  • 應用：accounts、profiles、matches                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  SQLite（db.sqlite3）                                                    │
│  • User、Profile、Interest、Like、Match                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 技術棧

| 層級     | 技術 |
|----------|------|
| 前端     | React 18、TypeScript/JSX、Vite、React Router、Axios、Tailwind CSS、Lucide React |
| 後端     | Python、Django、Django REST Framework、django-cors-headers、djangorestframework-simplejwt |
| 資料庫   | SQLite（Django ORM） |
| 身份驗證 | JWT（access + refresh）；access token 放在 `Authorization: Bearer` 標頭 |

---

## 4. 後端架構

### 4.1 專案結構

```
backend/
├── manage.py
├── project/                 # Django 專案設定
│   ├── __init__.py
│   ├── urls.py              # 根 URL 設定
│   ├── wsgi.py
│   └── asgi.py
├── settings/
│   ├── __init__.py
│   └── base.py              # 主要設定（DB、DRF、JWT、CORS）
├── apps/
│   ├── accounts/            # 使用者模型、註冊、登入、me
│   ├── profiles/            # Profile、Interest、個人資料 CRUD
│   └── matches/             # 探索、喜歡、配對列表
├── db.sqlite3
├── media/
├── static/
└── requirements.txt
```

### 4.2 Django 應用

- **accounts**：自訂使用者模型（以 email 為 `USERNAME_FIELD`）、註冊、JWT 登入/刷新，以及「當前使用者」介面（`/api/auth/me/`）。
- **profiles**：`Profile`（與 User 一對一）與 `Interest`（與 Profile 多對多）。透過 `post_save` 訊號為每位新使用者自動建立 `Profile`。提供 `/api/profile/me/`（GET/PUT）與 `/api/profile/<user_id>/`（GET）。
- **matches**：`Like`（from_user → to_user）與 `Match`（唯一配對 user1、user2，且 user1.id < user2.id）。提供探索列表、喜歡動作與配對列表。

### 4.3 資料模型

| 模型       | 用途 |
|------------|------|
| **User**   | 自訂使用者（email 唯一）；用於登入並作為各處外鍵。 |
| **Profile**| 與 User 一對一：暱稱、年齡、性別、地區、簡介、頭像 URL，並與 Interest 多對多。 |
| **Interest** | 標籤名稱（唯一）；多個 Profile 可共用同一興趣。 |
| **Like**   | from_user、to_user、created_at；(from_user, to_user) 唯一。 |
| **Match**  | user1、user2（user1.id < user2.id）、matched_at；(user1, user2) 唯一。 |

### 4.4 API 端點

| 方法 | 路徑 | 需驗證 | 說明 |
|------|------|--------|------|
| POST | `/api/auth/register/`     | 否 | 註冊（email、username、password）。 |
| POST | `/api/auth/login/`        | 否 | 回傳 `{ access, refresh }`。 |
| POST | `/api/auth/token/refresh/`| 否 | Body：`{ refresh }` → 取得新 access。 |
| GET  | `/api/auth/me/`           | 是 | 當前使用者（id、email、username）。 |
| GET  | `/api/profile/me/`        | 是 | 當前使用者的個人資料（含興趣）。 |
| PUT  | `/api/profile/me/`        | 是 | 更新自己的個人資料（含 interest_names）。 |
| GET  | `/api/profile/<id>/`      | 是 | 其他使用者的個人資料（唯讀）。 |
| GET  | `/api/discover/`          | 是 | 要顯示的使用者（排除自己與已喜歡者）。 |
| POST | `/api/likes/`             | 是 | Body：`{ to_user_id, action: "like" }` → `{ match: bool }`。 |
| GET  | `/api/matches/`           | 是 | 互相喜歡的使用者列表（配對）。 |

根 URL 設定（`project/urls.py`）掛載：

- `api/auth/` → `apps.accounts.urls`
- `api/profile/` → `apps.profiles.urls`
- `api/` → `apps.matches.urls`（discover、likes、matches）

### 4.5 身份驗證與安全

- **DRF**：預設驗證為 `JWTAuthentication`；預設權限為 `IsAuthenticated`。註冊/登入/刷新在需要處使用 `AllowAny`。
- **JWT**：Access token 有效 60 分鐘；Refresh 7 天。存於前端；僅 access token 以 `Authorization: Bearer <token>` 送出。
- **CORS**：開發環境使用 `CORS_ALLOW_ALL_ORIGINS = True`。
- 密碼經 Django auth 雜湊；喜歡/配對邏輯確保使用者不能喜歡自己，且喜歡目標存在。

---

## 5. 前端架構

### 5.1 專案結構

```
frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── postcss.config.js
└── src/
    ├── main.tsx              # 入口：BrowserRouter、AuthProvider、App
    ├── App.tsx               # 路由與 ProtectedRoute 包裝
    ├── index.css             # Tailwind 指令
    ├── api/
    │   ├── client.ts         # Axios 實例、附加 JWT、401 時刷新
    │   ├── auth.ts           # login、register、getMe
    │   ├── profile.ts        # getMyProfile、updateMyProfile、getProfile(id)
    │   ├── discover.ts       # getDiscover()
    │   ├── likes.ts          # sendLike(toUserId)
    │   └── matches.ts        # getMatches()
    ├── contexts/
    │   └── AuthContext.tsx   # user、loading、login、register、logout、refreshUser
    ├── components/
    │   └── ProtectedRoute.tsx  # 未驗證時導向 /login
    └── pages/
        ├── Home.jsx          # 首頁（導覽、主視覺、特色、CTA）
        ├── LoginPage.tsx
        ├── RegisterPage.tsx
        ├── ProfilePage.tsx   # 編輯自己的個人資料
        ├── ProfileViewPage.tsx  # 檢視他人個人資料（唯讀）
        ├── DiscoverPage.tsx  # 卡片 + 喜歡 / 略過
        └── MatchesPage.tsx   # 配對列表
```

### 5.2 路由

| 路徑 | 元件 | 受保護 | 說明 |
|------|------|--------|------|
| `/` | Home | 否 | 首頁，導覽列有登入 / 註冊。 |
| `/login` | LoginPage | 否 | 輸入 email + 密碼 → 取得 JWT，再導向（如 `/discover`）。 |
| `/register` | RegisterPage | 否 | Email、暱稱、密碼、確認 → 註冊並自動登入。 |
| `/profile` | ProfilePage | 是 | 取得/更新自己的個人資料。 |
| `/profile/:userId` | ProfileViewPage | 是 | 取得他人個人資料（如從配對進入）。 |
| `/discover` | DiscoverPage | 是 | 來自 `/api/discover/` 的列表，透過 `/api/likes/` 進行喜歡/略過。 |
| `/matches` | MatchesPage | 是 | 來自 `/api/matches/` 的列表。 |

受保護路由以 `<ProtectedRoute>` 包裝；未登入使用者會被導向 `/login`。

### 5.3 狀態與驗證流程

- **AuthProvider**（在 `main.tsx`）：載入時若有 access token，會呼叫 `GET /api/auth/me/` 設定 `user`；否則 `user` 為 null。對外提供 `login`、`register`、`logout`、`refreshUser`。
- **登入/註冊**：成功後前端將 `access` 與 `refresh` 存於 `localStorage`（經由 `api/client.ts`），再呼叫 `getMe()` 填入 `user` 並導向。
- **API 客戶端**：每次請求加上 `Authorization: Bearer <access>`。收到 401 時會嘗試用 `refresh` 刷新；刷新失敗則清除 token 並派發 `meetnow:logout`，讓應用清除使用者狀態並導向登入頁。

### 5.4 API 層

- **client.ts**：Axios 實例，`baseURL` 來自 `VITE_API_BASE_URL` 或 `http://localhost:8000/api`；請求攔截器附加 JWT；回應攔截器處理 401 與 token 刷新。
- **auth.ts、profile.ts、discover.ts、likes.ts、matches.ts**：呼叫上述客戶端的薄包裝，回傳型別化結果。無業務邏輯；頁面使用這些模組並處理載入/錯誤 UI。

---

## 6. 請求流程範例

**登入**

1. 使用者在 LoginPage 送出 email + 密碼。
2. 前端呼叫 `POST /api/auth/login/` → 取得 `{ access, refresh }`。
3. 前端儲存 token 並呼叫 `GET /api/auth/me/` 設定 AuthContext 的 `user`。
4. 導向至 `/discover`（或先前請求的路徑）。

**探索與喜歡**

1. DiscoverPage 掛載 → `GET /api/discover/`（帶 Bearer token）。
2. 後端回傳非自己且尚未被當前使用者喜歡的用戶。
3. 使用者點喜歡 → `POST /api/likes/`，Body 為 `{ to_user_id, action: "like" }`。
4. 後端建立 Like；若對方也曾喜歡，則建立 Match 並回傳 `{ match: true }`。
5. 當 `match === true` 時前端顯示「配對成功！」並切換到下一張卡片。

**配對列表**

1. MatchesPage 掛載 → `GET /api/matches/`（帶 Bearer token）。
2. 後端回傳與當前使用者有 Match 的用戶。
3. 點擊用戶會導向 `/profile/:userId`，並載入 `GET /api/profile/<id>/`。

---

## 7. 執行專案

**後端（在專案根目錄或 backend/ 下）**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows 請用 .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API 根址預設：`http://localhost:8000/api`。

**前端**

```bash
cd frontend
npm install
npm run dev
```

若 API 不在上述網址，請在 `.env` 中設定 `VITE_API_BASE_URL=http://localhost:8000/api`。

**選用**：可使用單一腳本（如 `start_all.sh`）同時啟動後端與前端，方便本地開發。

---

## 8. 相關文件

- **Project.md** — 產品與功能規格、API 契約、資料模型設計與非功能需求（安全、效能、可維護性）。該文件為系統「做什麼」的單一來源；ARCHITECTURE.md 則說明「如何」實作。
