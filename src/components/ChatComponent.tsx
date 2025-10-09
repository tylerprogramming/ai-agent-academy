import { ChatKit } from '@openai/chatkit-react';
import getChatKitSessionToken from '../chatkit';
import { useState, useEffect } from 'react';

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
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        console.log('Starting to fetch client secret...');
        const deviceId = getOrCreateDeviceId();
        console.log('Device ID:', deviceId);
        const secret = await getChatKitSessionToken(deviceId);
        console.log('Got client secret successfully');
        setClientSecret(secret);
      } catch (err) {
        console.error('Failed to get client secret:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize chat');
      }
    };

    fetchClientSecret();
  }, []);

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

  if (!clientSecret) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-600">Loading chat...</div>
      </div>
    );
  }

  return (
    <ChatKit
      clientSecret={clientSecret}
      className="h-full w-full"
    />
  );
}
