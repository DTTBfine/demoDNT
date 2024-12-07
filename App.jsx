import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import reduxStore from './redux';
import AppNavigation from './src/presentation/navigation/AppNavigation';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { store } = reduxStore();

// Tạo kênh thông báo
PushNotification.createChannel(
  {
    channelId: "default-channel-id", // ID của kênh
    channelName: "Thông báo quan trọng", // Tên hiển thị
    channelDescription: "Thông báo test hệ thống", // Mô tả kênh
    soundName: "default", // Âm thanh mặc định
    importance: 4, // Độ ưu tiên cao
    vibrate: true, // Cho phép rung
  },
  (created) => console.log(`Channel created: ${created}`) 
);

export default function App() {
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Yêu cầu quyền thông báo
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          console.log('Quyền thông báo đã được cấp:', authStatus);

          // Lấy FCM Token
          const token = await messaging().getToken();
          console.log('FCM Token:', token);

          // Lưu FCM token vào AsyncStorage
          await AsyncStorage.setItem('fcm_token', token);
          console.log("FCM Token đã được lưu vào AsyncStorage");
        } else {
          console.log('Quyền thông báo bị từ chối.');
        }

        // Lắng nghe thông báo foreground
        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
          console.log('Thông báo nhận được trong foreground:', remoteMessage);

          // Hiển thị thông báo
          PushNotification.localNotification({
            channelId: "default-channel-id", // ID kênh
            title: remoteMessage.notification?.title || "Thông báo",
            message: remoteMessage.notification?.body || "Nội dung thông báo",
            playSound: true,
            soundName: 'default',
            importance: 'high',
          });
        });

        return () => {
          unsubscribeForeground();
        };
      } catch (error) {
        console.error('Lỗi khi khởi tạo Firebase hoặc Messaging:', error);
      }
    };

    initializeFirebase();
  }, []);

  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
}
