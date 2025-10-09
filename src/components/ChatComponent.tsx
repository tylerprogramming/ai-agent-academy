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

export function ChatComponent() {
  const deviceId = getOrCreateDeviceId();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

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
    if (scriptLoaded && !clientSecret) {
      console.log('[ChatKit] Fetching client secret...');
      getChatKitSessionToken(deviceId).then((token) => {
        console.log('[ChatKit] Got token:', token.substring(0, 20) + '...');
        setClientSecret(token);
      }).catch((error) => {
        console.error('[ChatKit] Failed to get token:', error);
      });
    }
  }, [scriptLoaded, deviceId, clientSecret]);

  const { control } = useChatKit({
    clientSecret: clientSecret || undefined,
    onError: (error) => {
      console.error('[ChatKit] onError event:', error);
    },
    onMessageCreated: (event) => {
      console.log('[ChatKit] onMessageCreated:', event);
    },
  });

  useEffect(() => {
    if (scriptLoaded && control) {
      console.log('[ChatKit] Control object methods:', Object.keys(control));
      console.log('[ChatKit] Control object:', control);
    }
  }, [scriptLoaded, control]);

  console.log('[ChatKit] Rendering, scriptLoaded:', scriptLoaded, 'control:', !!control, 'clientSecret:', !!clientSecret);

  if (!scriptLoaded) {
    return <div className="p-4">Loading ChatKit script...</div>;
  }

  if (!clientSecret) {
    return <div className="p-4">Fetching session token...</div>;
  }

  return (
    <div className="h-full w-full bg-gray-50">
      <div className="p-4 bg-blue-100 border border-blue-300 rounded mb-4">
        <p className="text-sm">Debug: ChatKit component area</p>
        <p className="text-xs">Device ID: {deviceId}</p>
        <p className="text-xs">Script loaded: {scriptLoaded ? 'Yes' : 'No'}</p>
        <p className="text-xs">Client secret: {clientSecret ? clientSecret.substring(0, 20) + '...' : 'None'}</p>
        <p className="text-xs">Control: {control ? 'Ready' : 'Not ready'}</p>
      </div>
      <div className="border-2 border-green-500 p-2 bg-white">
        <p className="text-sm mb-2">ChatKit component should render here:</p>
        <div className="border-2 border-red-500" style={{ minHeight: '600px' }}>
          <ChatKit control={control} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
