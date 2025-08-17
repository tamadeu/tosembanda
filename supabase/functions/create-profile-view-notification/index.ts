import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { profileOwnerId } = await req.json()
    if (!profileOwnerId) {
      throw new Error("ID do dono do perfil é obrigatório.")
    }

    // Obter o usuário visitante a partir do token de autorização
    const userRes = await supabaseAdmin.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''))
    const visitor = userRes.data.user

    if (!visitor) {
      return new Response(JSON.stringify({ error: 'Visitante não autenticado.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Não criar notificação se o usuário estiver visitando o próprio perfil
    if (visitor.id === profileOwnerId) {
      return new Response(JSON.stringify({ message: 'Não é possível notificar a si mesmo.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Buscar o nome do visitante
    const { data: visitorProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', visitor.id)
      .single()

    if (profileError) throw profileError

    const visitorName = [visitorProfile.first_name, visitorProfile.last_name].filter(Boolean).join(' ') || 'Alguém'

    // Inserir a notificação
    const { error: notificationError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: profileOwnerId,
        type: 'profile_view',
        message: `${visitorName} visitou seu perfil.`,
        metadata: { visitor_id: visitor.id },
      })

    if (notificationError) throw notificationError

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})