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

    let body: any = {}
    try {
      body = await req.json()
    } catch (_) {
      body = {}
    }
    const requestedUserId: string | undefined = body?.user_id
    const headerUserId = req.headers.get('x-somiti-uid') ?? ''

    if (!requestedUserId || requestedUserId !== headerUserId) {
      return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 })
    }

    const { data, error } = await supabase
      .from('login_history')
      .select('created_at, ip, user_agent, meta')
      .eq('user_id', requestedUserId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (_) {
    return new Response(JSON.stringify({ error: 'unexpected_error' }), { status: 500 })
  }
})