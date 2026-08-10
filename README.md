# 货车 ETC 需求咨询 H5

鑫出行（ETC）企业货车需求登记 H5，包含客户公开填写页、后台线索管理、
跟进状态维护和 CSV 导出。

## 功能

- 客户端 H5：企业行业、车辆数量、联系人、手机号
- 提交后直接写入 Supabase PostgreSQL 线索台账
- 管理后台：`/admin`，使用 ChatGPT 登录保护
- 关键词、行业、跟进状态筛选
- 查看详情、更新跟进状态、导出 CSV（Excel 可直接打开）

## 目录说明

```text
app/page.tsx                 客户 H5 页面
app/admin/                   线索管理后台
app/api/leads/               提交、查询、更新接口
app/api/leads/export/        CSV 导出接口
db/                          Supabase 服务端访问层
supabase/migrations/         Supabase PostgreSQL 建表与安全策略
```

## 本地运行

要求 Node.js `>=22.13.0`。

```bash
npm ci
npm run dev
```

## 发布

当前源码按 Next.js + Supabase 配置，可部署到 Vercel。执行正式构建：

```bash
npm run build
```

## Supabase 配置

在 Supabase SQL Editor 执行 `supabase/migrations/20260807000000_create_truck_etc_leads.sql`，
然后在 Vercel 项目配置以下环境变量：

```text
SUPABASE_URL=https://你的项目.supabase.co
SUPABASE_SERVICE_ROLE_KEY=你的服务端密钥
```

`SUPABASE_SERVICE_ROLE_KEY` 只能配置在 Vercel 服务端环境，不能以 `NEXT_PUBLIC_` 开头，
也不能提交到 GitHub。数据库已启用 RLS，匿名/登录用户没有直接读写权限，所有操作均经由
服务端 API 完成；`/admin` 仍需要 ChatGPT 登录。

## Prerequisites

- Node.js `>=22.13.0`
- Supabase 项目
- Vercel 项目

## Included Shape

- edit site code under `app/`
- `app/chatgpt-auth.ts` provides optional dispatch-owned ChatGPT sign-in helpers
- `db/index.ts` creates a server-only Supabase client
- `supabase/migrations/` contains the PostgreSQL schema and RLS setup

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Diagnostic Commands

- `npm run dev`: start the Next.js development server
- `npm run build`: build the deployable Next.js application
- `npm run start`: start the production Next.js application
- `npm run lint`: run ESLint
- `npm run db:generate`: display the Supabase migration location

## Learn More

- [Supabase JavaScript Reference](https://supabase.com/docs/reference/javascript/initializing)
- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
