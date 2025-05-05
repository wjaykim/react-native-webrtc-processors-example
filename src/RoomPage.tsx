import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, type ListRenderItem } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AudioSession,
  useLocalParticipant,
  LiveKitRoom,
  useRoomContext,
  useVisualStableUpdate,
  useTracks,
  type TrackReferenceOrPlaceholder,
  AndroidAudioTypePresets,
  useIOSAudioManagement,
} from '@livekit/react-native';
import { mediaDevices } from '@livekit/react-native-webrtc';
import { LocalVideoTrack, Track } from 'livekit-client';

import type { RootStackParamList } from './App';
import { ParticipantView } from './ui/ParticipantView';
import { RoomControls } from './ui/RoomControls';
import { VideoEffect } from './ui/VideoEffectsList.tsx';
import { VideoEffectContext } from './contexts/VideoEffectContext.ts';

export const RoomPage = ({
  route,
}: NativeStackScreenProps<RootStackParamList, 'RoomPage'>) => {
  const { url, token } = route.params;
  useEffect(() => {
    let start = async () => {
      // Configure audio session
      AudioSession.configureAudio({
        android: {
          audioTypeOptions: AndroidAudioTypePresets.communication,
        },
      });
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <LiveKitRoom
      serverUrl={url}
      token={token}
      connect={true}
      options={{
        adaptiveStream: { pixelDensity: 'screen' },
      }}
      audio={true}
      video={true}>
      <RoomView />
    </LiveKitRoom>
  );
};

const RoomView = () => {
  const [isCameraFrontFacing, setCameraFrontFacing] = useState(true);
  const [videoEffects, setVideoEffects] = useState<Set<VideoEffect>>(
    () => new Set(),
  );
  const room = useRoomContext();

  useIOSAudioManagement(room, true);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  const stableTracks = useVisualStableUpdate(tracks, 5);
  // Setup views.
  const stageView = tracks.length > 0 && (
    <ParticipantView trackRef={stableTracks[0]} style={styles.stage} />
  );

  const renderParticipant: ListRenderItem<TrackReferenceOrPlaceholder> = ({
    item,
  }) => {
    return (
      <ParticipantView trackRef={item} style={styles.otherParticipantView} />
    );
  };

  const otherParticipantsView = stableTracks.length > 0 && (
    <FlatList
      data={stableTracks}
      renderItem={renderParticipant}
      horizontal={true}
      style={styles.otherParticipantsList}
    />
  );

  const {
    isCameraEnabled,
    isMicrophoneEnabled,
    localParticipant,
    cameraTrack,
  } = useLocalParticipant();

  useEffect(() => {
    if (!cameraTrack) {
      return;
    }

    const localCameraTrack = cameraTrack.videoTrack;
    if (localCameraTrack instanceof LocalVideoTrack) {
      localCameraTrack.mediaStreamTrack._setVideoEffects(
        Array.from(videoEffects),
      );
    }
  }, [cameraTrack, videoEffects]);

  return (
    <VideoEffectContext.Provider
      value={{
        videoEffects,
        setVideoEffects,
      }}>
      <View style={styles.container}>
        {stageView}
        {otherParticipantsView}
        <RoomControls
          micEnabled={isMicrophoneEnabled}
          setMicEnabled={(enabled: boolean) => {
            localParticipant.setMicrophoneEnabled(enabled);
          }}
          cameraEnabled={isCameraEnabled}
          setCameraEnabled={(enabled: boolean) => {
            localParticipant.setCameraEnabled(enabled);
          }}
          switchCamera={async () => {
            if (!cameraTrack) {
              return;
            }

            const facingModeStr = !isCameraFrontFacing ? 'user' : 'environment';
            setCameraFrontFacing(!isCameraFrontFacing);

            let devices = await mediaDevices.enumerateDevices();
            let newDevice;
            //@ts-ignore
            for (const device of devices) {
              if (
                device.kind === 'videoinput' &&
                device.facing === facingModeStr
              ) {
                newDevice = device;
                break;
              }
            }

            if (!newDevice) {
              return;
            }

            const localCameraTrack = cameraTrack.videoTrack;
            if (localCameraTrack instanceof LocalVideoTrack) {
              localCameraTrack.restartTrack({
                deviceId: newDevice.deviceId,
                facingMode: facingModeStr,
              });
            }
          }}
        />
      </View>
    </VideoEffectContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stage: {
    flex: 1,
    width: '100%',
  },
  otherParticipantsList: {
    width: '100%',
    height: 150,
    flexGrow: 0,
  },
  otherParticipantView: {
    width: 150,
    height: 150,
  },
});
