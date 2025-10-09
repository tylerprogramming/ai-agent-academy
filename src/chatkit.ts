export default async function getChatKitSessionToken(
  deviceId: string
): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mqxndxoaorwcepuawsrv.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeG5keG9hb3J3Y2VwdWF3c3J2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4NTE4MDUsImV4cCI6MjA3NTQyNzgwNX0.zXDL8v7n1en0H-Zh2B8uIQRqu-T6JQhusLe5iyNZ-5M';

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
