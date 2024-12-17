import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import * as apis from '../../data/api';
import { useSelector } from 'react-redux';

const NoteItem = ({ data, onNotificationRead }) => {
    const { title_push_notification, message, sent_time, id, status } = data; 
    const { token } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(false); 

    const handlePress = async () => {
        setIsLoading(true);
        const payload = {
            token: token,
            notification_id: id
        };

        try {
            const response = await apis.apiMarkNotificationAsRead(payload);
            if (response.data?.meta.code === '1000') {
                console.log(`Thông báo với ID ${id} đã được đánh dấu là đã đọc.`);
                onNotificationRead(id); // Gọi callback để cập nhật trạng thái
            } else {
                console.error('Không thể đánh dấu thông báo là đã đọc:', response.data);
            }
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container,{backgroundColor:status==='READ'?'gainsboro':'white', opacity:status==='READ'?0.8:1}] }>
            {/* Chấm tròn màu xanh hiển thị khi thông báo chưa đọc */}
            {status === 'UNREAD' && <View style={styles.unreadDot} />}

            <View style={styles.header}>
                <Text style={styles.title}>AIIHust</Text>
                <Text style={styles.date}>{sent_time.split('T')[0]}</Text>
            </View>

            <Text style={styles.notificationTitle}>{title_push_notification}</Text>

            <View style={styles.messageContainer}>
                <Text>{message}</Text>
            </View>

            <TouchableOpacity 
                onPress={handlePress} 
                style={styles.button} 
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#00CCEE" />
                ) : (
                    <Text style={styles.buttonText}>Chi tiết</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        position: 'relative', 
        elevation:6
    },
    unreadDot: {
        width: 12,
        height: 12,
        backgroundColor: '#AA0000', 
        borderRadius: 6, 
        position: 'absolute',
        top: -3,
        right: -3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    title: {
        color: '#AA0000',
        fontWeight: '500',
    },
    date: {
        color: 'gray',
        fontSize: 12,
    },
    notificationTitle: {
        fontWeight: '600',
        fontSize: 16,
        marginVertical: 5,
    },
    messageContainer: {
        borderTopWidth: 1,
        borderTopColor: '#DDDDDD',
        marginTop: 10,
        paddingVertical: 5,
    },
    button: {
        marginTop: 10,
        alignSelf: 'flex-end',
    },
    buttonText: {
        color: '#00CCEE',
        fontSize: 13,
        textDecorationLine: 'underline',
    },
});

export default NoteItem;
