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

  const { control, ref } = useChatKit({
    onError: (error) => {
      console.error('[ChatKit] onError event:', error);
    },
    onMessageCreated: (event) => {
      console.log('[ChatKit] onMessageCreated:', event);
    },
  });

  useEffect(() => {
    if (ref.current) {
      const element = ref.current as any;
      console.log('[ChatKit] Getting session token for device:', deviceId);

      getChatKitSessionToken(deviceId)
        .then((token) => {
          console.log('[ChatKit] Session token received:', token.substring(0, 20) + '...');
          element.sessionToken = token;
          console.log('[ChatKit] sessionToken set on element');

          if (control.setInstance) {
            control.setInstance(element);
          }
        })
        .catch((error) => {
          console.error('[ChatKit] Error getting session token:', error);
        });
    }
  }, [ref, control, deviceId]);

  return (
    <div className="h-full w-full bg-gray-50">
      <ChatKit control={control} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
