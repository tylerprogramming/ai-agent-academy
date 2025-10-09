export default async function getChatKitSessionToken(
  deviceId: string
): Promise<string> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gtcdaabumddldklfpfsr.supabase.co';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Y2RhYWJ1bWRkbGRrbGZwZnNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDc1NjUsImV4cCI6MjA3NTUyMzU2NX0.6ce5h9Csls3L9bHNDFSZnH-IXAStfxxN3e792d-ypCA';

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


  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

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
