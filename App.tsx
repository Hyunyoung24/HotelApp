/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useState } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import GlobalTabBar from './src/components/GlobalTabBar.tsx';
import Menu from './src/components/Menu';
import { MenuProvider } from './src/context/MenuContext.tsx';
import type { RootStackParamList } from './src/navigation/types';
import GlobalHeader from './src/components/GlobalHeader';

function App() {
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const [routeName, setRouteName] = useState<string>();

  return (
    <SafeAreaProvider>
      <MenuProvider>
        <NavigationContainer
          ref={navigationRef}
          onReady={() => setRouteName(navigationRef.getCurrentRoute()?.name)}
          onStateChange={() => setRouteName(navigationRef.getCurrentRoute()?.name)}
        >
          <View style={styles.root}>
            <View style={styles.fill}>
              <RootNavigator/>
            </View>
            <View style={styles.fill}>
              <GlobalTabBar routeName={routeName} navigationRef={navigationRef}/>
            </View>
            <GlobalHeader routeName={routeName} />
            <Menu navigationRef={navigationRef}/>
          </View>
        </NavigationContainer>
      </MenuProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { ...StyleSheet.absoluteFill },
});

export default App;