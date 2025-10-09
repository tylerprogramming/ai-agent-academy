import { useEffect, useState, useRef } from 'react';
import getChatKitSessionToken from '../chatkit';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'openai-chatkit': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<any>;
      };
    }
  }
}

function getOrCreateDeviceId(): string {
  const DEVICE_ID_KEY = 'chatkit_device_id';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

function ChatKitWidget({ clientToken }: { clientToken: string }) {
  const chatkitRef = useRef<any>(null);

  useEffect(() => {
    if (chatkitRef.current) {
      console.log('[ChatKit] Calling setOptions with clientToken');
      chatkitRef.current.setOptions({
        api: {
          getClientSecret: async () => clientToken,
        },
        startScreen: {
          greeting: "Welcome! How can I help you today?",
          prompts: [
            { text: "Tell me about your courses" },
            { text: "How do I get started?" },
            { text: "What topics do you cover?" }
          ],
        },
        composer: {
          placeholder: "Ask me anything...",
        },
      });
      console.log('[ChatKit] setOptions called');
    }
  }, [clientToken]);

  return (
    <div className="h-full w-full">
      <openai-chatkit
        ref={chatkitRef}
        className="block h-[600px] w-full"
      />
    </div>
  );
}

export function ChatComponent() {
  const deviceId = getOrCreateDeviceId();
  const [clientToken, setClientToken] = useState<string | null>(null);

  useEffect(() => {
    getChatKitSessionToken(deviceId).then((token) => {
      setClientToken(token);
    }).catch((error) => {
      console.error('[ChatKit] Failed to get token:', error);
    });
  }, [deviceId]);

  if (!clientToken) {
    return <div className="p-4">Loading...</div>;
  }

  return <ChatKitWidget clientToken={clientToken} />;
}
