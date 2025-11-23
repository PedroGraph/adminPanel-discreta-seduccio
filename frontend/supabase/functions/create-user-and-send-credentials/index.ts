
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@3.4.0";
import { renderAsync } from "npm:@react-email/render@0.0.7";
import React from "npm:react@18.2.0";
import { CredentialsEmail } from "./templates/credentials-email.tsx";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { name, email, password, role, status } = await req.json();

    const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (authError) throw authError;
    if (!user) throw new Error("La creación del usuario falló.");

    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .insert({
        id: user.id,
        name,
        email,
        role,
        status,
        last_login: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      throw profileError;
    }

    const loginUrl = `${Deno.env.get("SUPABASE_URL")?.replace('.co', '.app')}/project/${Deno.env.get("SUPABASE_PROJECT_ID")}/auth/sign-in`

    const emailHtml = await renderAsync(
      React.createElement(CredentialsEmail, { name, email, password, loginUrl })
    );

    const { error: emailError } = await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>",
      to: [email],
      subject: "Tus credenciales de acceso",
      html: emailHtml,
    });
    
    if (emailError) {
      console.error("Fallo al enviar el correo de credenciales:", emailError);
    }
    
    return new Response(JSON.stringify(userProfile), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
