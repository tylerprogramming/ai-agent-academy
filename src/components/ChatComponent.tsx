import { ChatKit, useChatKit } from '@openai/chatkit-react';
import getChatKitSessionToken from '../chatkit';
import { useState } from 'react';

export function ChatComponent() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          console.log('Using existing client secret');
          setIsLoading(false);
          return existing;
        }

        try {
          const deviceId = getOrCreateDeviceId();
          console.log('Getting client secret for device:', deviceId);
          const clientSecret = await getChatKitSessionToken(deviceId);
          console.log('Successfully got client secret:', clientSecret.substring(0, 20) + '...');
          setIsLoading(false);
          return clientSecret;
        } catch (err) {
          console.error('Error getting client secret:', err);
          setIsLoading(false);
          setError(err instanceof Error ? err.message : 'Failed to get client secret');
          throw err;
        }
      },
    },
    onReady: () => {
      console.log('ChatKit is ready');
    },
    onError: (err) => {
      console.error('ChatKit error:', err);
      setError(err instanceof Error ? err.message : 'ChatKit encountered an error');
    },
  });

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 border border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-slate-700 mb-2">{error}</p>
          <details className="mt-4 text-xs text-slate-500">
            <summary className="cursor-pointer hover:text-slate-700">Debug Info</summary>
            <pre className="mt-2 p-2 bg-slate-100 rounded overflow-auto">
              {JSON.stringify({
                deviceId: getOrCreateDeviceId(),
                supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
                hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
              }, null, 2)}
            </pre>
          </details>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  return <ChatKit control={control} className="h-full w-full" />;
}

function getOrCreateDeviceId(): string {
  const DEVICE_ID_KEY = 'chatkit_device_id';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}
