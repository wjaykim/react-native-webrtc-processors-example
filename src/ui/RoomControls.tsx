import { useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Image,
  ViewStyle,
  StyleProp,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { VideoEffectsList } from './VideoEffectsList';

export type Props = {
  micEnabled?: boolean;
  setMicEnabled: (enabled: boolean) => void;
  cameraEnabled?: boolean;
  setCameraEnabled: (enabled: boolean) => void;
  switchCamera: () => void;
  style?: StyleProp<ViewStyle>;
};
export const RoomControls = ({
  micEnabled = false,
  setMicEnabled,
  cameraEnabled = false,
  setCameraEnabled,
  switchCamera,
  style,
}: Props) => {
  const [videoEffectsModalVisible, setVideoEffectsModalVisible] =
    useState(false);
  const micImage = micEnabled
    ? require('../icons/baseline_mic_white_24dp.png')
    : require('../icons/baseline_mic_off_white_24dp.png');
  const cameraImage = cameraEnabled
    ? require('../icons/baseline_videocam_white_24dp.png')
    : require('../icons/baseline_videocam_off_white_24dp.png');

  return (
    <SafeAreaView edges={['bottom']} style={[style, styles.container]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={videoEffectsModalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setVideoEffectsModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <VideoEffectsList
              onClose={() => {
                setVideoEffectsModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Pressable
        onPress={() => {
          setMicEnabled(!micEnabled);
        }}>
        <Image style={styles.icon} source={micImage} />
      </Pressable>
      <Pressable
        onPress={() => {
          setCameraEnabled(!cameraEnabled);
        }}>
        <Image style={styles.icon} source={cameraImage} />
      </Pressable>
      <Pressable
        onPress={() => {
          switchCamera();
        }}>
        <Image
          style={styles.icon}
          source={require('../icons/camera_flip_outline.png')}
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setVideoEffectsModalVisible(true);
        }}>
        <Image
          style={styles.icon}
          source={require('../icons/outline_dots_white_24dp.png')}
        />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 8,
  },
  icon: {
    width: 32,
    height: 32,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  modalView: {
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
