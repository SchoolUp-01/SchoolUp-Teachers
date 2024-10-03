import { View, Text, StyleSheet } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
} from "../../utils/Color";
import SkeletonLoading from "./SkeletonLoader";

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
    <SkeletonLoading borderRadius={4}>
      {renderItem()}
      {renderItem()}
      {renderItem()}
    </SkeletonLoading>
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
    backgroundColor: defaultImageBgColor
  },
  subText: {
    width: 144,
    height: 16,
    marginTop: 4,
    backgroundColor: defaultImageBgColor
  },
  editView: {
    width: 80,
    height: 20,
    borderRadius: 4,
    backgroundColor: defaultImageBgColor
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
    backgroundColor: defaultImageBgColor
  },
  previewItem:{width:120,height:160,borderRadius:4,marginEnd:16,backgroundColor: defaultImageBgColor}
});
