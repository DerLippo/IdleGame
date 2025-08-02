/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @formatr
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import Make_text from './text.js';

enum PAGE {
  STARTINGPAGE,
  MAINPAGE,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

function h1_text() {
  return { fontSize: 25 };
}

function App() {
  const [SELECTEDPAGE, SET_SELECTEDPAGE] = useState(PAGE.STARTINGPAGE);
  const [WOOD, SET_WOOD] = useState(0);

  function HARVEST() {
    setTimeout(() => {
      SET_WOOD(WOOD + 1);
    }, 100);
  }

  const isDarkMode = useColorScheme() === 'dark';

  const new_h1_text = h1_text();
  new_h1_text['backgroundColor'] = '#ff0000';
  new_h1_text['textAlign'] = 'center';

  /**
   *
   * https://reactpatterns.js.org/docs/conditional-rendering-with-enum
   */

  switch (SELECTEDPAGE) {
    case PAGE.MAINPAGE:
      new_h1_text['backgroundColor'] = '#ff0000';

      return (
        <View style={styles.container}>
          <Make_text args={new_h1_text} string={'hello MAINPAGE'} />
          <Button
            title={'Click me'}
            onPress={() => SET_SELECTEDPAGE(PAGE.STARTINGPAGE)}
          />
          <Make_text args={new_h1_text} string={`WOOD: ${WOOD}`} />
          <Button title={'Harvest'} onPress={() => HARVEST()} />
        </View>
      );
    default:
      new_h1_text['backgroundColor'] = 'green';

      return (
        <View style={styles.container}>
          <Make_text args={new_h1_text} string={'hello STARTINGPAGE'} />
          <Button
            title={'Click me'}
            onPress={() => SET_SELECTEDPAGE(PAGE.MAINPAGE)}
          />
        </View>
      );
  }
}

export default App;
