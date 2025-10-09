export default async function getChatKitSessionToken(
  deviceId: string
): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('Environment check:', {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseKey,
    supabaseUrl: supabaseUrl
  });

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  const apiUrl = `${supabaseUrl}/functions/v1/chatkit-session`;

  console.log('Calling chatkit-session API at:', apiUrl);
  console.log('Request payload:', { deviceId });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        deviceId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }

      throw new Error(`Failed to get client secret: ${errorData.error || response.statusText}`);
    }

    const responseText = await response.text();
    console.log('Response body:', responseText);

    const data = JSON.parse(responseText);

    if (!data.client_secret) {
      console.error('Invalid response data:', data);
      throw new Error('Invalid response from API: missing client_secret');
    }

    console.log('Successfully got client_secret');
    return data.client_secret;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out after 30 seconds');
    }
    throw error;
  }
}
