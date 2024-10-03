import React, { useState, useEffect } from "react";
import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import MaskedView from '@react-native-masked-view/masked-view';
import Reanimated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const SkeletonLoading = ({ children, background="#E1E9EE" ,highlight="#F2F8FC" }) => {
    const [layout, setLayout] = useState(null);
    const shared = useSharedValue(0);

    const animStyle = useAnimatedStyle(() => {
        if (!layout) return { transform: [{ translateX: 0 }] };
        
        const x = interpolate(shared.value, [0, 1], [-layout.width, layout.width]);
        return {
            transform: [{ translateX: x }],
        };
    });

    useEffect(() => {
        shared.value = withRepeat(
            withTiming(1, { duration: 1000 }),
            Infinity
        );
    }, [shared]);

    const handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
    };

    if (!layout) {
        return (
            <View onLayout={handleLayout}>
                {children}
            </View>
        );
    }

    return (
        <MaskedView
            maskElement={<View>{children}</View>}
            style={{ width: layout.width, height: layout.height }}
        >
            <View style={[styles.container, { backgroundColor: background }]} />
            <Reanimated.View style={[StyleSheet.absoluteFill, animStyle]}>
                <MaskedView
                    style={StyleSheet.absoluteFill}
                    maskElement={
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={StyleSheet.absoluteFill}
                            colors={['transparent', 'black', 'transparent']}
                        />
                    }
                >
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: highlight }]} />
                </MaskedView>
            </Reanimated.View>
        </MaskedView>
    );
};

export default SkeletonLoading;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        overflow: 'hidden',
    },
});
