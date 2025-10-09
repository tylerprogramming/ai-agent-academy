import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useEffect, useState } from 'react';
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

function ChatKitWidget({ clientToken }: { clientToken: string }) {
  const { control } = useChatKit({
    api: {
      clientToken,
    },
    startScreen: {
      greeting: "Welcome! How can I help you today?",
      prompts: [
        "Tell me about your courses",
        "How do I get started?",
        "What topics do you cover?"
      ],
    },
    composer: {
      placeholder: "Ask me anything...",
    },
    onError: (error: any) => {
      console.error('[ChatKit] Error:', error);
    },
    onMessageCreated: (event: any) => {
      console.log('[ChatKit] Message created:', event);
    },
  });

  return (
    <div className="h-full w-full">
      <ChatKit control={control} className="h-[600px] w-full" />
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
