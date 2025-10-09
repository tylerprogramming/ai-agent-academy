export default async function getChatKitSessionToken(
  deviceId: string
): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  const apiUrl = `${supabaseUrl}/functions/v1/chatkit-session`;

  console.log('Calling chatkit-session API at:', apiUrl);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      deviceId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    console.error('API Error:', errorData);
    throw new Error(`Failed to get client secret: ${errorData.error || response.statusText}`);
  }

  const data = await response.json();

  if (!data.client_secret) {
    throw new Error('Invalid response from API: missing client_secret');
  }

  return data.client_secret;
}
