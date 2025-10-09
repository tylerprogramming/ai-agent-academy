import { ChatKit } from '@openai/chatkit-react';
import getChatKitSessionToken from '../chatkit';
import { useState, useEffect } from 'react';

export function ChatComponent() {
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    console.log('Starting to fetch client secret...');

    const deviceId = getOrCreateDeviceId();
    console.log('Device ID:', deviceId);

    getChatKitSessionToken(deviceId)
      .then((secret) => {
        console.log('Got client secret successfully');
        setClientSecret(secret);
      })
      .catch((err) => {
        console.error('Failed to get client secret:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize chat');
      });
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 border border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-slate-700 mb-2">{error}</p>
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

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Initializing chat...</p>
        </div>
      </div>
    );
  }

  return <ChatKit clientSecret={clientSecret} className="h-full w-full" />;
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
