import * as React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, ScrollView, FlatList } from 'react-native';
//import tw from 'tailwind-react-native-classnames';
import AppNavigation from './src/presentation/navigation/AppNavigation';

export default function App() {
  return (
    <AppNavigation />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
});
