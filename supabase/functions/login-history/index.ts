// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseSrKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseSrKey) {
      return new Response(JSON.stringify({ error: 'server_misconfigured' }), { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseSrKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const ipHeader = req.headers.get('x-forwarded-for') ?? ''
    const ip = ipHeader ? ipHeader.split(',')[0].trim() : (req.headers.get('x-real-ip') ?? 'unknown')
    const userAgent = req.headers.get('user-agent') ?? ''

    let body: any = {}
    try {
      body = await req.json()
    } catch (_) {
      body = {}
    }
    const providerBody: string | undefined = body?.provider
    const passedUserId: string | undefined = body?.user_id

    let meta: Record<string, unknown> = { ua: userAgent }
    try {
      if (ip && ip !== 'unknown') {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`)
        if (geoRes.ok) {
          const geo = await geoRes.json()
          meta = { ...meta, country: geo?.country_name, city: geo?.city }
        }
      }
    } catch (e) {
      console.log('[login-history] geo lookup failed')
    }

    const insertPayload = {
      user_id: passedUserId,
      provider: providerBody ?? 'local',
      ip,
      user_agent: userAgent,
      meta
    }

    if (!passedUserId) {
      return new Response(JSON.stringify({ error: 'invalid_body' }), { status: 400 })
    }

    const { error } = await supabase.from('login_history').insert(insertPayload)
    if (error) {
      console.log('[login-history] insert error', error.message)
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'unexpected_error' }), { status: 500 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/login-history' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
