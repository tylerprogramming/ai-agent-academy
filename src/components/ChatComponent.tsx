import { useCallback } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
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

  const getClientSecret = useCallback(async () => {
    console.log('[ChatKit] Fetching client secret');
    try {
      const token = await getChatKitSessionToken(deviceId);
      console.log('[ChatKit] Client secret obtained');
      return token;
    } catch (error) {
      console.error('[ChatKit] Failed to get client secret:', error);
      throw error;
    }
  }, [deviceId]);

  const chatkit = useChatKit({
    api: { getClientSecret },
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
    onError: ({ error }: { error: unknown }) => {
      console.error('[ChatKit] Error:', error);
    },
  });

  return (
    <div className="h-full w-full">
      <ChatKit control={chatkit.control} className="block h-full w-full" />
    </div>
  );
}
