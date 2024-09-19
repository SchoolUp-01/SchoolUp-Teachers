
import { Platform, StatusBar, View,StyleSheet, SafeAreaView } from "react-native";
import { primaryColor_500, primaryColor_800 } from "../utils/Color";

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const CustomStatusBarView = ({backgroundColor="#fff", ...props}) => (
    <View style={[styles.statusBar, { backgroundColor }]}>
      <SafeAreaView>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </SafeAreaView>
    </View>
  );


  const styles = StyleSheet.create({
    statusBar: {
      height: STATUSBAR_HEIGHT,
    }
  });

  export default CustomStatusBarView;