import { useChatKit, ChatKit } from '@openai/chatkit-react';
import { useEffect } from 'react';
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

  useEffect(() => {
    console.log('ChatComponent mounted with deviceId:', deviceId);
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
      <ChatKit control={control} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
