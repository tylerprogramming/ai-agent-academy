import { useEffect, useRef } from 'react';
import getChatKitSessionToken from '../chatkit';

declare global {
  interface Window {
    openai?: {
      chatkit: {
        mount: (options: {
          targetElement: HTMLElement;
          api: {
            getChatKitSessionToken: () => Promise<string>;
          };
        }) => void;
      };
    };
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

export function ChatComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceId = getOrCreateDeviceId();

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('Mounting ChatKit...');

    if (window.openai?.chatkit) {
      window.openai.chatkit.mount({
        targetElement: containerRef.current,
        api: {
          getChatKitSessionToken: async () => {
            console.log('Getting ChatKit session token for device:', deviceId);
            const token = await getChatKitSessionToken(deviceId);
            console.log('ChatKit session token received:', token);
            return token;
          },
        },
      });
      console.log('ChatKit mounted successfully');
    } else {
      console.error('ChatKit library not found on window.openai');
    }
  }, [deviceId]);

  return <div ref={containerRef} className="h-full w-full" />;
}
