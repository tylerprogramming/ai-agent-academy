import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);
  const deviceId = getOrCreateDeviceId();

  const { control } = useChatKit({
    api: {
      async getChatKitSessionToken() {
        try {
          console.log('Getting ChatKit session token for device:', deviceId);
          const token = await getChatKitSessionToken(deviceId);
          console.log('ChatKit session token received');
          setLoading(false);
          return token;
        } catch (err) {
          console.error('Error getting ChatKit session token:', err);
          setError(err instanceof Error ? err.message : 'Failed to initialize chat');
          setLoading(false);
          throw err;
        }
      },
    },
  });

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load chat</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-600">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ChatKit control={control} />
    </div>
  );
}
