import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon

const PulsatingIcon = (props) => {
    const animatedValue = useRef(new Animated.Value(1)).current; // Khởi tạo animated value

    useEffect(() => {
        const startAnimation = () => {
            animatedValue.setValue(1); // Reset value
            Animated.timing(animatedValue, {
                toValue: 1.5, // Kích thước tối đa
                duration: 500, // Thời gian tăng
                easing: Easing.linear, // Easing function
                useNativeDriver: true, // Sử dụng native driver
            }).start(() => {
                // Đảo ngược animation
                Animated.timing(animatedValue, {
                    toValue: 1, // Kích thước tối thiểu
                    duration: 500, // Thời gian giảm
                    easing: Easing.linear, // Easing function
                    useNativeDriver: true, // Sử dụng native driver
                }).start(startAnimation); // Bắt đầu lại animation
            });
        };

        startAnimation(); // Bắt đầu animation
    }, [animatedValue]);

    // Thiết lập scale cho biểu tượng
    const scaleStyle = {
        transform: [{ scale: animatedValue }],
    };

    return (
        <Animated.View style={{
            ...props.style,
            ...scaleStyle,
        }}>
            <Icon name="thumbs-up" size={150} color="#3498db" />
        </Animated.View>
    ); x
};

export default PulsatingIcon;
