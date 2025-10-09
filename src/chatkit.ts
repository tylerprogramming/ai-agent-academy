export default async function getChatKitSessionToken(
  deviceId: string
): Promise<string> {
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatkit-session`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      deviceId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get ChatKit session: ${response.statusText}`);
  }

  const { client_secret } = await response.json();

  return client_secret;
}
