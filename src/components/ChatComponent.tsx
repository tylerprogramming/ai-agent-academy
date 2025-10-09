import { useEffect, useRef, useState } from 'react';
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
  const [isLoaded, setIsLoaded] = useState(false);
  const deviceId = getOrCreateDeviceId();

  useEffect(() => {
    const checkChatKitLoaded = () => {
      if (window.openai?.chatkit) {
        console.log('ChatKit library detected');
        setIsLoaded(true);
      } else {
        console.log('Waiting for ChatKit library...');
        setTimeout(checkChatKitLoaded, 100);
      }
    };

    checkChatKitLoaded();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isLoaded) return;

    console.log('Mounting ChatKit to container...');

    try {
      window.openai!.chatkit.mount({
        targetElement: containerRef.current,
        api: {
          getChatKitSessionToken: async () => {
            console.log('Getting ChatKit session token for device:', deviceId);
            const token = await getChatKitSessionToken(deviceId);
            console.log('ChatKit session token received');
            return token;
          },
        },
      });
      console.log('ChatKit mounted successfully');
    } catch (error) {
      console.error('Error mounting ChatKit:', error);
    }
  }, [isLoaded, deviceId]);

  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-600">Loading chat...</div>
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full" />;
}
