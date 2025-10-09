import { ChatKit, useChatKit } from '@openai/chatkit-react';
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

function ChatKitWrapper() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        if (existing) {
          return existing;
        }

        const deviceId = getOrCreateDeviceId();
        const clientSecret = await getChatKitSessionToken(deviceId);
        return clientSecret;
      },
    },
  });

  return <ChatKit control={control} className="h-full w-full" />;
}

export function ChatComponent() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkChatKit = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).ChatKit) {
        setIsReady(true);
        clearInterval(checkChatKit);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkChatKit);
      setIsReady(true);
    }, 10000);

    return () => {
      clearInterval(checkChatKit);
      clearTimeout(timeout);
    };
  }, []);

  if (!isReady) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-500">Loading chat...</div>
      </div>
    );
  }

  return <ChatKitWrapper />;
}
