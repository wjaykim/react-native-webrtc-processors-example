import { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@react-navigation/native';

import type { RootStackParamList } from './App';

const DEFAULT_URL = 'wss://example.livekit.cloud';
const DEFAULT_TOKEN = 'your-token-here';

const URL_KEY = 'url';
const TOKEN_KEY = 'token';

export const PreJoinPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'PreJoinPage'>) => {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [token, setToken] = useState(DEFAULT_TOKEN);
  useEffect(() => {
    AsyncStorage.getItem(URL_KEY).then(value => {
      if (value) {
        setUrl(value);
      }
    });

    AsyncStorage.getItem(TOKEN_KEY).then(value => {
      if (value) {
        setToken(value);
      }
    });
  }, []);

  const { colors } = useTheme();

  let saveValues = (saveUrl: string, saveToken: string) => {
    AsyncStorage.setItem(URL_KEY, saveUrl);
    AsyncStorage.setItem(TOKEN_KEY, saveToken);
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.text }}>URL</Text>
      <TextInput
        style={{
          color: colors.text,
          borderColor: colors.border,
          ...styles.input,
        }}
        onChangeText={setUrl}
        value={url}
      />

      <Text style={{ color: colors.text }}>Token</Text>
      <TextInput
        style={{
          color: colors.text,
          borderColor: colors.border,
          ...styles.input,
        }}
        onChangeText={setToken}
        value={token}
      />

      <View style={styles.spacer} />

      <Button
        title="Connect"
        onPress={() => {
          navigation.push('RoomPage', {
            url,
            token,
          });
        }}
      />

      <View style={styles.spacer} />

      <Button
        title="Save Values"
        onPress={() => {
          saveValues(url, token);
        }}
      />

      <View style={styles.spacer} />

      <Button
        title="Reset Values"
        onPress={() => {
          saveValues(DEFAULT_URL, DEFAULT_TOKEN);
          setUrl(DEFAULT_URL);
          setToken(DEFAULT_TOKEN);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  input: {
    width: '90%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  spacer: {
    height: 10,
  },
});
