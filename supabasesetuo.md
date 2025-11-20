# Supabase Setup Quick Guide

## Prerequisites
- Install Supabase CLI
- Sign in: `supabase login`
- Have your project ref ready: `acorlkxpqxanqcstlghz`

## One-Time Project Init (local)
- Initialize: `supabase init`
- Start local stack (requires Docker Desktop): `supabase start`

## Link Cloud Project
- Link: `supabase link --project-ref acorlkxpqxanqcstlghz`

## Create Migration
- New migration: `supabase migration new add_locations_table`
- Put your SQL into the generated file under `supabase/migrations/`.

## Push Migrations
- Push to cloud DB: `supabase db push`

## Daily Flow (Login → Link → Migrate → Push)
- Login: `supabase login`
- Link: `supabase link --project-ref acorlkxpqxanqcstlghz`
- Create migration: `supabase migration new <name>`
- Edit migration SQL
- Push: `supabase db push`

## Useful Commands
- Open Studio: `supabase studio`
- Generate TS types: `supabase gen types typescript --project-id acorlkxpqxanqcstlghz > supabase.types.ts`
- Run SQL file: `supabase db query < file.sql`
- Logs: `supabase logs`
- Reset local (destructive): `supabase db reset`

## REST Insert (History Mode)
```bash
curl -X POST \
  "https://acorlkxpqxanqcstlghz.supabase.co/rest/v1/locations" \
  -H "apikey: <anon>" \
  -H "Authorization: Bearer <anon>" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{"user_id":"device1","lat":3.1,"lng":101.5,"accuracy":12}'
```

## Upsert (Single-Row Mode)
```bash
curl -X POST \
  "https://acorlkxpqxanqcstlghz.supabase.co/rest/v1/locations?on_conflict=user_id" \
  -H "apikey: <anon>" \
  -H "Authorization: Bearer <anon>" \
  -H "Content-Type: application/json" \
  -H "Prefer: resolution=merge-duplicates,return=representation" \
  -d '{"user_id":"device1","lat":3.1,"lng":101.5,"accuracy":12,"updated_at":"2025-01-01T00:00:00Z"}'
```

## Realtime Subscribe (Web)
```js
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://acorlkxpqxanqcstlghz.supabase.co', '<anon>')

supabase.channel('public:locations')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, (payload) => {
    const row = payload.new ?? payload.old
    // use row.lat, row.lng
  })
  .subscribe()
```

## Notes
- Supabase free tier has limits on Realtime connections and message throughput — keep channels minimal and updates at 3–10s cadence when possible.