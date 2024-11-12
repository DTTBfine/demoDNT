// // Ví dụ về khởi tạo một API client
// import axios from 'axios';

// // API client với base URL cho ứng dụng
// export const apiClient = axios.create({
//   baseURL: 'https://api.example.com', // Thay bằng URL của API của bạn
//   timeout: 1000,
//   headers: { 'Authorization': 'Bearer token' } // Cấu hình header nếu cần
// });

// // Các service có thể sử dụng chung
// export const userService = {
//   getUserProfile: (userId) => apiClient.get(`/user/${userId}`),
//   updateUserProfile: (userId, data) => apiClient.put(`/user/${userId}`, data),
//   // Thêm các API khác nếu cần
// };
