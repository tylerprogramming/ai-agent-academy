import { useCallback, useEffect, useRef, useState } from 'react';
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
  const isMountedRef = useRef(true);
  const [scriptStatus, setScriptStatus] = useState<'pending' | 'ready' | 'error'>(() =>
    typeof window !== 'undefined' && window.customElements?.get('openai-chatkit')
      ? 'ready'
      : 'pending'
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number | undefined;

    const handleLoaded = () => {
      if (!isMountedRef.current) return;
      console.log('[ChatKit] Script loaded successfully');
      setScriptStatus('ready');
      setError(null);
    };

    const handleError = (event: Event) => {
      console.error('[ChatKit] Failed to load chatkit.js', event);
      if (!isMountedRef.current) return;
      setScriptStatus('error');
      const detail = (event as CustomEvent<unknown>)?.detail ?? 'Unknown error';
      setError(`Error: ${detail}`);
    };

    window.addEventListener('chatkit-script-loaded', handleLoaded);
    window.addEventListener('chatkit-script-error', handleError as EventListener);

    if (window.customElements?.get('openai-chatkit')) {
      handleLoaded();
    } else if (scriptStatus === 'pending') {
      timeoutId = window.setTimeout(() => {
        if (!window.customElements?.get('openai-chatkit')) {
          handleError(
            new CustomEvent('chatkit-script-error', {
              detail: 'ChatKit web component is unavailable. Verify that the script URL is reachable.',
            })
          );
        }
      }, 5000);
    }

    return () => {
      window.removeEventListener('chatkit-script-loaded', handleLoaded);
      window.removeEventListener('chatkit-script-error', handleError as EventListener);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [scriptStatus]);

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

  console.log('[ChatKit] Render state:', { scriptStatus, hasControl: Boolean(chatkit.control), error });

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Failed to load chat</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (scriptStatus === 'pending') {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-gray-600">Loading assistant...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ChatKit
        control={chatkit.control}
        className="block h-full w-full"
      />
    </div>
  );
}
