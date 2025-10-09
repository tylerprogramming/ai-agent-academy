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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const waitForElement = async () => {
      if (chatkitRef.current) {
        await customElements.whenDefined('openai-chatkit');

        // Wait a bit more for the component to be fully ready
        await new Promise(resolve => setTimeout(resolve, 100));

        setIsReady(true);
      }
    };

    waitForElement();
  }, []);

  useEffect(() => {
    if (isReady && chatkitRef.current && clientToken) {
      console.log('[ChatKit] Configuring with clientToken');
      try {
        chatkitRef.current.setOptions({
          api: {
            getClientSecret: async () => clientToken,
          },
          startScreen: {
            greeting: "Welcome! How can I help you today?",
            prompts: [
              { label: "Courses", prompt: "Tell me about your courses" },
              { label: "Getting Started", prompt: "How do I get started?" },
              { label: "Topics", prompt: "What topics do you cover?" }
            ],
          },
          composer: {
            placeholder: "Ask me anything...",
          },
        });
        console.log('[ChatKit] Configuration complete');
      } catch (error) {
        console.error('[ChatKit] Configuration error:', error);
      }
    }
  }, [isReady, clientToken]);

  return (
    <openai-chatkit
      ref={chatkitRef}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
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
