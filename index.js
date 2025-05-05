import { AppRegistry } from 'react-native';
import { registerGlobals, setLogLevel } from '@livekit/react-native';
import { LogLevel } from 'livekit-client';

import App from './src/App';
import { name as appName } from './app.json';

// Logging
setLogLevel(LogLevel.debug);

// Required React-Native setup for app
registerGlobals();
AppRegistry.registerComponent(appName, () => App);
