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
  const deviceId = getOrCreateDeviceId();

  const { control } = useChatKit({
    api: {
      async getChatKitSessionToken() {
        console.log('Getting ChatKit session token for device:', deviceId);
        const token = await getChatKitSessionToken(deviceId);
        console.log('ChatKit session token received:', token);
        return token;
      },
    },
  });

  console.log('ChatComponent rendering, control:', control);

  return (
    <div className="h-full w-full bg-gray-50">
      <ChatKit control={control} />
    </div>
  );
}
