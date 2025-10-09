import { useEffect, useState, useRef } from 'react';
import getChatKitSessionToken from '../chatkit';

declare global {
  interface Window {
    ChatKit: any;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    const initChatKit = async () => {
      if (!containerRef.current || instanceRef.current) return;

      // Wait for ChatKit to be available
      while (!window.ChatKit) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('[ChatKit] Initializing with ChatKit.create()');

      try {
        instanceRef.current = window.ChatKit.create(containerRef.current, {
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
        console.log('[ChatKit] Instance created successfully');
      } catch (error) {
        console.error('[ChatKit] Initialization error:', error);
      }
    };

    initChatKit();

    return () => {
      if (instanceRef.current?.destroy) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [clientToken]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%' }}
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
