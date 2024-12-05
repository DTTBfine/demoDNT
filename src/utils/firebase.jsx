import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';

export async function requestPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Quyền thông báo đã được cấp');
  } else {
    console.log('Quyền thông báo bị từ chối');
    Linking.openSettings();
  }
}

export async function getFCMToken() {
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('FCM Token:', token);
        // Gửi token này lên server của bạn để lưu trữ
        sendTokenToServer(token);
      } else {
        console.log('Không thể lấy FCM Token');
      }
    } catch (error) {
      console.error('Lỗi khi lấy FCM Token:', error);
    }
  }