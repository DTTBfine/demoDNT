import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import NoteItem from '../components/NoteItem';
import { apiGetNotifications } from '../../data/api/notification';
import { useSelector } from 'react-redux';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useSelector((state) => state.auth); // Lấy token từ Redux

    const fetchNotifications = async () => {
        console.log('Start fetching notifications'); // Log bắt đầu hàm
        setLoading(true);
        try {
            console.log('Token:', token); // Log token
            const response = await apiGetNotifications({
                token: token,
                index: 0, // Bắt đầu từ index 0
                count: 1000,
            });
            console.log('API response:', response.data); // Log kết quả trả về từ API

            if (response.data ) {
                console.log('Fetched notifications:', response.data.data); // Log thông báo
                setNotifications(response.data.data);
            } else {
                console.log('No notifications found'); // Log khi không có dữ liệu
                setNotifications([]);
            }
        } catch (error) {
            console.error('API call failed:', error); // Log lỗi
            Alert.alert('Lỗi', 'Không thể tải danh sách thông báo. Vui lòng thử lại.');
        } finally {
            console.log('Finished fetching notifications'); // Log khi kết thúc hàm
            setLoading(false);
        }
    };

    useEffect(() => {
            fetchNotifications();
    }, []);

    console.log(notifications)

    return (
        <ScrollView style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
            ) : notifications.length > 0 ? (
                <View style={styles.body}>
                    {notifications.map((notification) => {
                        console.log('Rendering Notification:', notification); // Log từng thông báo trước khi truyền
                        return <NoteItem key={notification.id} data={notification} />;
                    })}
                </View>
            ) : (
                <Text style={styles.noData}>Hiện tại bạn chưa có thông báo nào.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
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
