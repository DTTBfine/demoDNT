import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import NoteItem from '../components/NoteItem';
import { apiGetNotifications, apiMarkNotificationAsRead } from '../../data/api';
import { useSelector } from 'react-redux';

const Notification = ({refreshTrigger}) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false); // Trạng thái loading của nút "Đánh dấu tất cả đã đọc"
    const { token } = useSelector(state => state.auth);

    // Hàm lấy danh sách thông báo
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await apiGetNotifications({
                token: token,
                index: 0,
                count: 1000,
            });

            if (response.data) {
                setNotifications(response.data.data);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải danh sách thông báo. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm đánh dấu một thông báo là đã đọc
    const handleNotificationRead = (id) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, status: 'READ' } : notification
            )
        );
    };

    // Hàm đánh dấu tất cả thông báo là đã đọc
    const handleMarkAllAsRead = async () => {
        setMarkingAll(true); // Hiển thị trạng thái loading cho nút

        // Lọc tất cả các thông báo chưa đọc
        const unreadNotifications = notifications.filter(notification => notification.status === 'UNREAD');
        
        try {
            // Gọi API cho từng thông báo chưa đọc
            for (const notification of unreadNotifications) {
                await apiMarkNotificationAsRead({ 
                    token, 
                    notification_id: notification.id 
                });
            }

            // Cập nhật trạng thái của tất cả thông báo thành 'READ'
            setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, status: 'READ' }))
            );
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể đánh dấu tất cả thông báo là đã đọc.');
        } finally {
            setMarkingAll(false); // Ẩn trạng thái loading cho nút
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
            ) : (
                <>
                    {notifications.length > 0 && (
                        <TouchableOpacity 
                            style={[styles.markAllButton, markingAll && styles.markAllButtonDisabled]} 
                            onPress={handleMarkAllAsRead} 
                            disabled={markingAll}
                        >
                            {markingAll ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={styles.markAllButtonText}>Đánh dấu tất cả đã đọc</Text>
                            )}
                        </TouchableOpacity>
                    )}

                    <ScrollView style={styles.notificationList}>
                        {notifications.length > 0 ? (
                            <View style={styles.body}>
                                {notifications.map((notification) => (
                                    <NoteItem 
                                        key={notification.id} 
                                        data={notification} 
                                        onNotificationRead={() => handleNotificationRead(notification.id)} 
                                    />
                                ))}
                            </View>
                        ) : (
                            <Text style={styles.noData}>Hiện tại bạn chưa có thông báo nào.</Text>
                        )}
                    </ScrollView>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    notificationList: {
        flex: 1,
    },
    markAllButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginHorizontal: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Đổ bóng cho Android
    },
    markAllButtonDisabled: {
        backgroundColor: '#A5A5A5', // Màu khi nút bị disabled
    },
    markAllButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    body: {
        flexDirection: 'column',
        padding: 15,
        gap: 15,
    },
    loading: {
        marginTop: 20,
    },
    noData: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
        marginTop: 20,
    },
});

export default Notification;
