
// @ts-nocheck

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID")
const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET")
const GOOGLE_REDIRECT_URI = Deno.env.get("GOOGLE_REDIRECT_URI") || "http://localhost:3000/googleCallback";


const getSupabaseClient = (authHeader: string) => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )
}

const getGoogleTokens = async (refreshToken: string) => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error_description || "Failed to refresh token.");
  return data.access_token;
}

interface EventDateTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  // Add a check for environment variables at the start of every request.
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Google OAuth environment variables are not set in Supabase secrets.");
    return new Response(JSON.stringify({ error: "Google API credentials are not configured on the server." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const { endpoint, ...reqBody } = await req.json()
    const supabase = getSupabaseClient(req.headers.get('Authorization')!)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("User not found.")
    
    let userProfile;
    if (endpoint !== 'google-oauth-url' && endpoint !== 'exchange-code') {
        const { data, error } = await supabase.from('profiles').select('id, google_refresh_token').eq('user_id', user.id).single();
        if (error || !data) throw new Error("User profile not found or error fetching it.");
        userProfile = data;
    }


    switch (endpoint) {
      case 'google-oauth-url': {
        const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
        url.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("scope", "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/gmail.send");
        url.searchParams.set("access_type", "offline");
        url.searchParams.set("prompt", "consent");
        return new Response(JSON.stringify({ url: url.toString() }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'exchange-code': {
        const { code } = reqBody;
        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code',
          }),
        });
        const tokens = await response.json();
        if (!response.ok) throw new Error(tokens.error_description || "Failed to exchange code.");
        
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ google_refresh_token: tokens.refresh_token })
            .eq('user_id', user.id);
        
        if (updateError) throw updateError;
        
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'send-email': {
        const { recipient, subject, body, htmlBody, images } = reqBody; // Images is an array of base64 strings
        if (!userProfile?.google_refresh_token) throw new Error("User not linked with Google.");
        
        const accessToken = await getGoogleTokens(userProfile.google_refresh_token);

        const profileResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!profileResponse.ok) throw new Error("Failed to get sender's email address.");
        const senderProfile = await profileResponse.json();
        const senderEmail = senderProfile.emailAddress;

        const boundary = `----=${Math.random().toString(16).substring(2)}`;
        let emailBody = [];

        if (htmlBody) {
          // Multipart/related for HTML with embedded images
          emailBody.push(`Content-Type: multipart/related; boundary="${boundary}"\r\n`);
          emailBody.push(`MIME-Version: 1.0\r\n`);
          emailBody.push(`to: ${recipient}\r\n`);
          emailBody.push(`from: ${senderEmail}\r\n`);
          emailBody.push(`subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=\r\n\r\n`);

          // HTML part
          emailBody.push(`--${boundary}\r\n`);
          emailBody.push(`Content-Type: text/html; charset="UTF-8"\r\n`);
          emailBody.push(`MIME-Version: 1.0\r\n`);
          emailBody.push(`Content-Transfer-Encoding: 7bit\r\n\r\n`);
          emailBody.push(`${htmlBody}\r\n\r\n`);

          // Image parts
          if (images && images.length > 0) {
              images.forEach((imgData, i) => {
                  emailBody.push(`--${boundary}\r\n`);
                  emailBody.push(`Content-Type: image/jpeg\r\n`); // Assuming jpeg, could be dynamic
                  emailBody.push(`Content-Transfer-Encoding: base64\r\n`);
                  emailBody.push(`Content-ID: <image${i}>\r\n`);
                  emailBody.push(`Content-Disposition: inline\r\n\r\n`);
                  emailBody.push(`${imgData}\r\n\r\n`);
              });
          }
          emailBody.push(`--${boundary}--`);

        } else {
          // Plain text email
           emailBody = [
              `Content-Type: text/plain; charset="UTF-8"`,
              `MIME-Version: 1.0`,
              `Content-Transfer-Encoding: 7bit`,
              `to: ${recipient}`,
              `from: ${senderEmail}`,
              `subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
              '',
              body,
          ];
        }
        
        const email = emailBody.join(htmlBody ? '' : '\n');
        const base64EncodedEmail = btoa(unescape(encodeURIComponent(email))).replace(/\+/g, '-').replace(/\//g, '_');

        const sendResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: base64EncodedEmail,
          }),
        });
        
        const sendData = await sendResponse.json();
        if (!sendResponse.ok) throw new Error(sendData.error.message || "Failed to send email.");

        return new Response(JSON.stringify({ success: true, messageId: sendData.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }

      case 'create-event':
      case 'update-event':
      case 'delete-event': {
        if (!userProfile?.google_refresh_token) return new Response(JSON.stringify({ skipped: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        
        const accessToken = await getGoogleTokens(userProfile.google_refresh_token);
        const { event } = reqBody;
        
        let url = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
        let method = "POST";
        let body: {
            summary: string;
            description?: string;
            start: EventDateTime;
            end: EventDateTime;
        } = {
            summary: event.title,
            description: event.description,
            start: { date: event.date },
            end: { date: event.endDate || event.date },
        };

        if(event.time) {
            const startDateTime = new Date(`${event.date}T${event.time}:00`);
            const endDateTime = event.endDate ? new Date(`${event.endDate}T${event.time}:00`) : new Date(startDateTime.getTime() + 60 * 60 * 1000);
            body.start = { dateTime: startDateTime.toISOString() };
            body.end = { dateTime: endDateTime.toISOString() };
        }

        if (endpoint === 'update-event' || endpoint === 'delete-event') {
            if (!event.google_event_id) throw new Error("Missing Google Event ID for update/delete.");
            url += `/${event.google_event_id}`;
            method = endpoint === 'update-event' ? "PUT" : "DELETE";
        }
        
        const calendarResponse = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: method === 'DELETE' ? undefined : JSON.stringify(body)
        });
        
        if (!calendarResponse.ok && calendarResponse.status !== 204) {
            const errorData = await calendarResponse.json();
            throw new Error(errorData.error.message || `Failed to ${endpoint}`);
        }
        
        const responseData = method === 'DELETE' ? { success: true } : await calendarResponse.json();
        return new Response(JSON.stringify(responseData), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      default:
        throw new Error("Invalid endpoint.")
    }

  } catch (error) {
    console.error("Error in google-api-handler:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
