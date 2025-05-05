This is a working example of video frame processor of [react-native-webrtc](https://github.com/react-native-webrtc/react-native-webrtc).

This example uses LiveKit(https://livekit.io/) as a webrtc backend.

## Registering Processors

As video frame processors are written in native code, they need to be registered in the native side of the app.

Usually, you can register them in entry point of your app, such as `MainApplication.java` for Android and `AppDelegate.swift` for iOS.

### Android

1. Add `ProcessorProvider` import:
    ```kotlin
    import com.oney.WebRTCModule.videoEffects.ProcessorProvider
    ```
2. Add processor by calling `ProcessorProvider.addProcessor`.

Example: [MainApplication.kt](android/app/src/main/java/com/webrtcprocessor/MainApplication.kt)

### iOS

1. Add `ProcessorProvider.h` import (if using swift, add it to bridging header):
    ```objc
    #import "ProcessorProvider.h"
    ```
2. Add processor by calling `ProcessorProvider.addProcessor`.

Example: [AppDelegate.swift](ios/WebrtcProcessor/AppDelegate.swift)

## Example Processor Implementations

| Processor          | Description                                                                   | Android                                                                                  | iOS                                           |
|--------------------|-------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|-----------------------------------------------|
| FlipFrameProcessor | Horizontally flips an frame, which can be useful for 'self view' of a webcam. | [source](android/app/src/main/java/com/webrtcprocessor/processors/FlipFrameProcessor.kt) | [source](ios/Processors/FlipFrameProcessor.m) |
