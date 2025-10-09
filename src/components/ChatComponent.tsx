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
    console.log('ChatComponent mounted');
  }, []);

  const { control, ref } = useChatKit({
    api: {
      getChatKitSessionToken: async () => {
        console.log('Getting ChatKit session token for device:', deviceId);
        try {
          const token = await getChatKitSessionToken(deviceId);
          console.log('ChatKit session token received:', token.substring(0, 20) + '...');
          return token;
        } catch (error) {
          console.error('Error getting ChatKit session token:', error);
          throw error;
        }
      },
    },
  });

  useEffect(() => {
    console.log('useChatKit ref:', ref.current);
    console.log('useChatKit control:', control);
  }, [ref, control]);

  return (
    <div className="h-full w-full bg-gray-50">
      <ChatKit control={control} className="w-full h-full" />
    </div>
  );
}
