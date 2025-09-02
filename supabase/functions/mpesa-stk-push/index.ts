import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('M-Pesa STK Push function called');
    
    const { phoneNumber } = await req.json();
    console.log('Phone number received:', phoneNumber);
    
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Get access token first
    const consumerKey = Deno.env.get('DARAJA_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('DARAJA_CONSUMER_SECRET');
    
    console.log('Consumer key exists:', !!consumerKey);
    console.log('Consumer secret exists:', !!consumerSecret);
    
    if (!consumerKey || !consumerSecret) {
      console.error('Missing Daraja credentials');
      throw new Error('Daraja credentials not configured - please check Supabase secrets');
    }

    const credentials = btoa(`${consumerKey}:${consumerSecret}`);
    
    console.log('Getting access token...');
    const tokenResponse = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`
      }
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('Failed to get access token');
    }

    // Format phone number (remove + and leading zeros, ensure it starts with 254)
    let formattedPhone = phoneNumber.replace(/[\s\-\+]/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone;
    }

    // STK Push request
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];
    const shortCode = '174379'; // Sandbox shortcode
    const passkey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Sandbox passkey
    const password = btoa(shortCode + passkey + timestamp);

    console.log('Initiating STK Push...');
    const stkResponse = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: 100,
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: 'https://your-callback-url.com/callback', // Replace with actual callback
        AccountReference: 'Premium Access',
        TransactionDesc: 'Premium subscription payment'
      })
    });

    const stkData = await stkResponse.json();
    console.log('STK Push response:', stkData);

    if (stkData.ResponseCode === '0') {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'STK Push sent successfully',
        checkoutRequestId: stkData.CheckoutRequestID
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      throw new Error(stkData.errorMessage || 'STK Push failed');
    }

  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Payment initiation failed' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});