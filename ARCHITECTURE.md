# Architecture Overview

Dokumen ini menjelaskan boundary frontend/backend dan alur data utama pada Black Sherpa Manufacturing OS.

## Layering

## 1) Frontend Layer

Tanggung jawab: rendering UI, interaksi user, navigasi role-based.

- `app/dashboard/**` page-level UI
- `components/dashboard/**` feature components
- `components/ui/**` shared primitive components
- `app/page.tsx` login UI

Frontend memanggil backend lewat:

- Server Actions (`app/actions/*.ts`)
- API Routes (`app/api/**/*.ts`)

## 2) Backend App Layer

Tanggung jawab: business logic, authz/authn, transaksi data.

- `app/actions/job-actions.ts`
  - create/release/cancel job order
  - update task status dengan routing sequence guard
  - stock consumption saat fase pengambilan bahan
  - rework flow saat QC fail
- `app/actions/user-actions.ts`
  - user CRUD (super admin)
- `app/api/reports/production/route.ts`
  - export CSV laporan produksi
- `auth.ts`, `auth.config.ts`, `middleware.ts`
  - NextAuth credentials, session claims, route authorization

## 3) Data Layer

- `prisma/schema.prisma`
  - model inti: `User`, `Product`, `Material`, `BOM`, `JobOrder`, `Task`, `WIPLog`, `AuditLog`
- `prisma/seed.ts`
  - seed role account, product, BOM, routing, WIP baseline
- `lib/prisma.ts`
  - Prisma client singleton

## Domain Flow (Internal)

1. Admin buat Job Order (`DRAFT`)
2. Admin release Job Order (`SCHEDULED`)
3. PIC update task berurutan:
   - `PENGAMBILAN_BAHAN` -> `POTONG` -> `PRODUKSI` -> `QC` -> `SEAL` -> `PACKING` -> `DIKIRIM`
4. Sistem update:
   - WIP % milestone (10/25/55/70/85/95/100)
   - `JobOrder.status` lifecycle
   - `AuditLog` traceability
5. Edge case:
   - QC fail -> task `PRODUKSI` jadi `REWORK`, downstream reset
   - consumption bahan mencatat planned/actual/variance

## Security/Access Model

- UI nav filtering berdasarkan role (`components/dashboard/Sidebar.tsx`)
- Middleware + auth callbacks untuk route-level authorization
- Server actions melakukan authorization ulang (defense-in-depth)

## Testing & Regression

- `scripts/smoke-check.mjs`: DB + seeded account sanity
- `scripts/rbac-smoke-check.mjs`: route RBAC smoke checks
- `scripts/full-flow-smoke.mjs`: end-to-end manufacturing flow smoke test

Jalankan:

```bash
npm run typecheck
npm run build
npm run smoke:full
```

## Out of Scope (Saat Ini)

- OTP WhatsApp
- Notifikasi WA/email eksternal
