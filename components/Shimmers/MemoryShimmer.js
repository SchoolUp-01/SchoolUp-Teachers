import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import { View, Text, StyleSheet } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
} from "../../utils/Color";

export default function MemoryShimmer() {
  const renderItem = () => {
    return (
      <View style={styles.infoView}>
       
        <View style={styles.container}>
          <View style={styles.middleView}>
            <View style={styles.headerText} />
            <View style={styles.subText} />
          </View>

          <View style={styles.editView} />
        </View>
        <View
          style={{
            marginTop: 16,
          }}
        >
          <View style={{ height: 14, width: "100%", marginBottom: 4 }} />
          <View style={{ height: 14, width: "100%", marginBottom: 4 }} />
          <View style={{ height: 14, width: "60%", marginBottom: 4 }} />
        </View>
        <View style={{flexDirection:"row",overflow:"hidden",marginTop:8,}}>
          <View style={styles.previewItem}/>
          <View style={styles.previewItem}/>
          <View style={styles.previewItem}/>
        </View>
      </View>
    );
  };
  return (
    <SkeletonPlaceholder borderRadius={4}>
      {renderItem()}
      {renderItem()}
      {renderItem()}
    </SkeletonPlaceholder>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  middleView: {
    flex: 1,
  },
  headerText: {
    width: 180,
    height: 20,
  },
  subText: {
    width: 144,
    height: 16,
    marginTop: 4,
  },
  editView: {
    width: 80,
    height: 20,
    borderRadius: 4,
  },
  infoView: {
    marginHorizontal: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 8,
    paddingVertical: 8,
    marginVertical: 8,
    paddingHorizontal:12
  },
  previewImage: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  previewItem:{width:120,height:160,borderRadius:4,marginEnd:16}
});
