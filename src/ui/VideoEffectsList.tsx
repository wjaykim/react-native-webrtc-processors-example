import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useContext, useState } from 'react';
import { VideoEffectContext } from '../contexts/VideoEffectContext.ts';

export enum VideoEffect {
  Flip = 'FlipFrameProcessor',
}

type VideoEffectItem = {
  name: string;
  effect: VideoEffect;
};
const items: VideoEffectItem[] = [
  {
    name: 'Flip',
    effect: VideoEffect.Flip,
  },
];

type Props = {
  onClose: () => void;
};
export const VideoEffectsList = ({ onClose }: Props) => {
  const { videoEffects, setVideoEffects } = useContext(VideoEffectContext);

  const renderAudioOutput: ListRenderItem<VideoEffectItem> = ({ item }) => {
    return (
      <View>
        <View style={styles.spacer} />
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Switch
            onValueChange={value => {
              const newEnabledEffects = new Set(videoEffects);
              if (value) {
                newEnabledEffects.add(item.effect);
              } else {
                newEnabledEffects.delete(item.effect);
              }
              setVideoEffects(newEnabledEffects);
            }}
            value={videoEffects.has(item.effect)}
          />
        </View>
        <View style={styles.spacer} />
      </View>
    );
  };
  return (
    <View>
      <Text style={styles.titleText}>{'Video Effects'}</Text>
      <View style={styles.spacer} />
      <FlatList
        data={items}
        renderItem={renderAudioOutput}
        keyExtractor={item => item.effect}
        style={styles.list}
      />
      <Pressable
        onPress={() => {
          onClose();
        }}
        style={styles.applyButton}>
        <View style={styles.spacer} />
        <Text style={styles.buttonText}>{'Apply'}</Text>
        <View style={styles.spacer} />
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  spacer: {
    paddingTop: 10,
  },
  list: {
    flexGrow: 0,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  applyButton: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
});
