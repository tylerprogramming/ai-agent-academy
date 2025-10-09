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

    if (ref.current) {
      console.log('[ChatKit] Web component attributes:', {
        loaded: ref.current.getAttribute('data-loaded'),
        colorScheme: ref.current.getAttribute('data-color-scheme'),
      });

      const element = ref.current as any;
      console.log('[ChatKit] Web component properties before:', {
        api: element.api,
        sessionToken: element.sessionToken,
      });

      // Try setting the api directly on the element
      if (!element.api) {
        console.log('[ChatKit] Setting api property directly');
        element.api = {
          getChatKitSessionToken: sessionTokenGetter,
        };
        console.log('[ChatKit] Web component properties after:', {
          api: element.api,
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
