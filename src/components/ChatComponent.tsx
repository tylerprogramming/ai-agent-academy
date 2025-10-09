import { useChatKit, ChatKit } from '@openai/chatkit-react';
import { useEffect, useState } from 'react';
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
  const deviceId = getOrCreateDeviceId();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    console.log('ChatComponent mounted with deviceId:', deviceId);

    const checkScript = setInterval(() => {
      if (typeof customElements.get('openai-chatkit') !== 'undefined') {
        console.log('[ChatKit] Web component registered');
        setScriptLoaded(true);
        clearInterval(checkScript);
      }
    }, 100);

    return () => clearInterval(checkScript);
  }, [deviceId]);

  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        console.log('[ChatKit] getClientSecret called for device:', deviceId);
        const token = await getChatKitSessionToken(deviceId);
        console.log('[ChatKit] Returning token:', token.substring(0, 20) + '...');
        return token;
      },
    },
    onError: (error) => {
      console.error('[ChatKit] onError event:', error);
    },
    onMessageCreated: (event) => {
      console.log('[ChatKit] onMessageCreated:', event);
    },
  });

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="p-4 bg-blue-100 border border-blue-300 rounded mb-4">
        <p className="text-sm">Debug: ChatKit component area</p>
        <p className="text-xs">Device ID: {deviceId}</p>
        <p className="text-xs">Script loaded: {scriptLoaded ? 'Yes' : 'No'}</p>
      </div>
      {scriptLoaded ? (
        <ChatKit control={control} style={{ width: '100%', height: '100%' }} />
      ) : (
        <div className="p-4">Loading ChatKit...</div>
      )}
    </div>
  );
}
