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

  const sessionTokenGetter = async () => {
    console.log('[ChatKit] getChatKitSessionToken called for device:', deviceId);
    try {
      const token = await getChatKitSessionToken(deviceId);
      console.log('[ChatKit] Session token received:', token.substring(0, 20) + '...');
      return token;
    } catch (error) {
      console.error('[ChatKit] Error getting session token:', error);
      throw error;
    }
  };

  const { control, ref } = useChatKit({
    api: {
      getChatKitSessionToken: sessionTokenGetter,
    },
    onError: (error) => {
      console.error('[ChatKit] onError event:', error);
    },
    onMessageCreated: (event) => {
      console.log('[ChatKit] onMessageCreated:', event);
    },
  });

  useEffect(() => {
    console.log('[ChatKit] ref.current:', ref.current);
    console.log('[ChatKit] control:', control);
    console.log('[ChatKit] control.handlers:', control?.handlers);

    if (ref.current) {
      const element = ref.current as any;
      console.log('[ChatKit] Web component api:', element.api);
      console.log('[ChatKit] Loaded state:', element.getAttribute('data-loaded'));

      // Try to manually trigger initialization
      if (element.api && !element.getAttribute('data-loaded')) {
        console.log('[ChatKit] Attempting to call getChatKitSessionToken manually...');
        element.api.getChatKitSessionToken()
          .then((token: string) => {
            console.log('[ChatKit] Manual call successful, token:', token.substring(0, 20));
          })
          .catch((error: any) => {
            console.error('[ChatKit] Manual call failed:', error);
          });
      }
    }
  }, [ref, control]);

  return (
    <div className="h-full w-full bg-gray-50">
      <ChatKit control={control} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
