import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useState } from 'react';
import getChatKitSessionToken from '../chatkit';

function getOrCreateDeviceId(): string {
  const DEVICE_ID_KEY = 'chatkit_device_id';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

export function ChatComponent() {
  const [error, setError] = useState<string | null>(null);

  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          console.log('Using existing client secret');
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
      <div className="h-full w-full flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <p className="font-semibold text-gray-900 mb-2">Chat unavailable</p>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ChatComponent control={control} />
    </div>
  );
}
