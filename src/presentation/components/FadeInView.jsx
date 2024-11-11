import React, { useRef, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

function FadeInView(props) {
    const opacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        const startBlinking = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 0, // Giảm opacity xuống 0 để làm mờ box
                        duration: 800, // Thời gian thực hiện (500ms)
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1, // Tăng opacity lên 1 để hiển thị box
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        startBlinking();
    }, [opacity]);

    return (
        <Animated.View style={{
            ...props.style,
            opacity, // Bind opacity to animated value
        }}>
            {props.children}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: 100,
        height: 100,
        backgroundColor: 'red',
    },
});

export default FadeInView;