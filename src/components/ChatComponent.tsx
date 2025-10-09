import { ChatKit, useChatKit } from '@openai/chatkit-react';
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
