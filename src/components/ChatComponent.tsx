import { useChatKit, ChatKit } from '@openai/chatkit-react';
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

function ChatKitWidget({ clientToken, deviceId }: { clientToken: string; deviceId: string }) {
  console.log('[ChatKitWidget] Rendering with token:', clientToken.substring(0, 20) + '...');

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
      console.error('[ChatKit] onError event:', error);
    },
    onMessageCreated: (event: any) => {
      console.log('[ChatKit] onMessageCreated:', event);
    },
  });

  useEffect(() => {
    if (control) {
      console.log('[ChatKit] Control ready:', control);
      console.log('[ChatKit] Control.options:', control.options);

      // Check the DOM element
      setTimeout(() => {
        const element = document.querySelector('openai-chatkit');
        console.log('[ChatKit] DOM element:', element);
        if (element) {
          console.log('[ChatKit] Element outerHTML:', element.outerHTML.substring(0, 200));
          console.log('[ChatKit] Shadow root:', element.shadowRoot);
          if (element.shadowRoot) {
            console.log('[ChatKit] Shadow root children:', element.shadowRoot.children);
            console.log('[ChatKit] Shadow root HTML:', element.shadowRoot.innerHTML.substring(0, 500));
          }
        }
      }, 1000);
    }
  }, [control]);

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="p-4 bg-blue-100 border border-blue-300 rounded mb-4">
        <p className="text-sm">Debug: ChatKit component area</p>
        <p className="text-xs">Device ID: {deviceId}</p>
        <p className="text-xs">Client token: {clientToken.substring(0, 20) + '...'}</p>
        <p className="text-xs">Control: {control ? 'Ready' : 'Not ready'}</p>
      </div>
      <div className="border-2 border-green-500 p-2 bg-white">
        <p className="text-sm mb-2">ChatKit component should render here:</p>
        <div className="border-2 border-red-500">
          <ChatKit control={control} className="w-full h-[600px]" />
        </div>
      </div>
    </div>
  );
}

export function ChatComponent() {
  const deviceId = getOrCreateDeviceId();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [clientToken, setClientToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('ChatComponent mounted with deviceId:', deviceId);

    const checkScript = setInterval(() => {
      if (typeof customElements.get('openai-chatkit') !== 'undefined') {
        console.log('[ChatKit] Web component registered');
        setScriptLoaded(true);
        clearInterval(checkScript);
      }
    }, 100);

    return () => clearInterval(checkScript);
  }, [deviceId]);

  useEffect(() => {
    if (scriptLoaded && !clientToken) {
      console.log('[ChatKit] Fetching client token...');
      getChatKitSessionToken(deviceId).then((token) => {
        console.log('[ChatKit] Got token:', token.substring(0, 20) + '...');
        setClientToken(token);
      }).catch((error) => {
        console.error('[ChatKit] Failed to get token:', error);
      });
    }
  }, [scriptLoaded, deviceId, clientToken]);

  if (!scriptLoaded) {
    return <div className="p-4">Loading ChatKit script...</div>;
  }

  if (!clientToken) {
    return <div className="p-4">Fetching session token...</div>;
  }

  return <ChatKitWidget clientToken={clientToken} deviceId={deviceId} />;
}
