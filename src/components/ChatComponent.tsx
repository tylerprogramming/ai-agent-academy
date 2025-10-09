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
      console.log('[ChatKit] Setting up web component for device:', deviceId);

      element.api = {
        getChatKitSessionToken: async () => {
          console.log('[ChatKit] getChatKitSessionToken called for device:', deviceId);
          try {
            const token = await getChatKitSessionToken(deviceId);
            console.log('[ChatKit] Session token received:', token.substring(0, 20) + '...');
            return token;
          } catch (error) {
            console.error('[ChatKit] Error getting session token:', error);
            throw error;
          }
        },
      };

      console.log('[ChatKit] API set on element:', element.api);

      if (control.setInstance) {
        console.log('[ChatKit] Calling setInstance');
        control.setInstance(element);
      }

      setTimeout(() => {
        console.log('[ChatKit] After setInstance - loaded:', element.getAttribute('data-loaded'));
        console.log('[ChatKit] After setInstance - sessionToken:', element.sessionToken);
        console.log('[ChatKit] After setInstance - api:', element.api);

        if (element.load && typeof element.load === 'function') {
          console.log('[ChatKit] Calling load() method');
          element.load();
        }

        if (element.init && typeof element.init === 'function') {
          console.log('[ChatKit] Calling init() method');
          element.init();
        }
      }, 100);
    }
  }, [ref, control, deviceId]);

  return (
    <div className="h-full w-full bg-gray-50">
      <ChatKit control={control} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
