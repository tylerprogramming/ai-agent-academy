import { ChatKit, useChatKit } from '@openai/chatkit-react';
import getChatKitSessionToken from '../chatkit';
import { useState } from 'react';

export function ChatComponent() {
  const [error, setError] = useState<string | null>(null);

  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          return existing;
        }

        try {
          const deviceId = getOrCreateDeviceId();
          console.log('Getting client secret for device:', deviceId);
          const clientSecret = await getChatKitSessionToken(deviceId);
          console.log('Successfully got client secret');
          return clientSecret;
        } catch (err) {
          console.error('Error getting client secret:', err);
          setError(err instanceof Error ? err.message : 'Failed to get client secret');
          throw err;
        }
      },
    },
  });

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 border border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-slate-700">{error}</p>
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
