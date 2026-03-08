# MeetNow

簡易交友／配對專案：前後端分離，後端提供 REST API（JWT 登入），前端為 React SPA。

---

## 簡易架構

```
project/
├── backend/          # Django 後端 (Python)
│   ├── apps/
│   │   ├── accounts/   # 註冊、登入、JWT、當前使用者
│   │   ├── profiles/   # 個人資料（我的／他人）
│   │   └── matches/    # 探索、喜歡、配對列表
│   ├── project/        # Django 設定與主 URL
│   ├── manage.py
│   └── requirements.txt
├── frontend/         # React 前端 (Vite + TypeScript)
│   ├── src/
│   │   ├── api/        # API 呼叫（auth、profile、discover、likes、matches）
│   │   ├── components/ # 共用元件（含 ProtectedRoute）
│   │   ├── contexts/   # AuthContext（登入狀態）
│   │   └── pages/      # 各頁面
│   └── package.json
└── start_all.sh      # 一鍵啟動後端 + 前端
```

### 技術棧

| 層級 | 技術 |
|------|------|
| 後端 | Django 4.2、Django REST Framework、Simple JWT、django-cors-headers、SQLite |
| 前端 | React、Vite、TypeScript、React Router、Axios、Tailwind CSS、Lucide React |
| 認證 | 以 **email** 登入，JWT（Access + Refresh Token） |

### API 端點概覽

| 路徑 | 說明 |
|------|------|
| `POST /api/auth/register/` | 註冊 |
| `POST /api/auth/login/` | 登入（取得 JWT） |
| `POST /api/auth/token/refresh/` | 刷新 Access Token |
| `GET /api/auth/me/` | 當前使用者（需登入） |
| `GET/PUT /api/profile/me/` | 我的個人資料（需登入） |
| `GET /api/profile/<user_id>/` | 他人個人資料（需登入） |
| `GET /api/discover/` | 探索使用者列表（需登入） |
| `POST /api/likes/` | 送出喜歡（需登入） |
| `GET /api/matches/` | 配對列表（需登入） |

---

## 操作流程

### 環境需求

- **後端**：Python 3、pip
- **前端**：Node.js、npm（或 nvm / fnm）

### 一、一鍵啟動（推薦）

在專案根目錄執行：

```bash
./start_all.sh
```

會同時啟動：

- 後端：`http://localhost:8000`（自動建立虛擬環境、安裝依賴、執行 migrate、跑 runserver）
- 前端：`http://localhost:5173`（自動 npm install、跑 Vite dev）

用 `Ctrl+C` 會一併關閉後端與前端。

### 二、分別啟動

**後端：**

```bash
cd backend
./start_backend.sh
```

- 若無 `.venv` 會自動建立並安裝 `requirements.txt`、執行 migrate。
- 若 8000 埠被佔用，腳本會提示並結束。

**前端：**

```bash
cd frontend
./start_frontend.sh
```

- 會自動 `npm install` 並執行 `npm run dev`（支援 nvm/fnm 環境）。

### 三、前端頁面與流程

1. **首頁** `/` — 導向登入或註冊。
2. **註冊** `/register` — 填寫 email、密碼等 → 註冊成功可登入。
3. **登入** `/login` — email + 密碼 → 取得 JWT，登入後可進入需登入頁面。
4. **我的資料** `/profile` — 查看／編輯個人資料（需登入）。
5. **他人資料** `/profile/:userId` — 查看指定使用者資料（需登入）。
6. **探索** `/discover` — 瀏覽推薦使用者、送出喜歡（需登入）。
7. **配對** `/matches` — 查看互相喜歡的配對列表（需登入）。

未登入時造訪需登入頁面會被導向登入頁。

### 四、可選：後端 API Base URL

前端預設連到 `http://localhost:8000/api`。若要改為其他網址，可在前端目錄設定環境變數：

```bash
# 例如
export VITE_API_BASE_URL=http://localhost:8000/api
```

然後重新啟動前端 dev server。

---

## 資料庫

- 開發環境使用 **SQLite**，資料庫檔為 `backend/db.sqlite3`。
- 後台：`http://localhost:8000/admin/`（需先建立 superuser：`cd backend && source .venv/bin/activate && python manage.py createsuperuser`）。

---

## 簡短流程總結

1. 執行 `./start_all.sh` 啟動前後端。
2. 瀏覽器開啟 `http://localhost:5173`。
3. 註冊或登入後，可編輯個人資料、探索使用者、送出喜歡、查看配對列表。
