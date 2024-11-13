### Môi trường chạy dự án: Node.js v20.14.0
https://nodejs.org/download/release/v20.14.0/

===

Các bước cài đặt: (chế độ development)
1. clone code
2. cài đặt thư viện: npm i
3. Update file .env (nếu cần thiết)
4. Chạy dự án:  npm start | hoặc | npm run dev 

demoDNT/
├── assets/
│   ├── adaptive-icon.png
│   ├── default-avatar.jpg
│   ├── favicon.png
│   ├── icon.png
│   ├── logo-hust.png
│   ├── logo-removebg-preview.png
│   ├── logo.jpg
│   ├── logo.png
│   └── splash.png
├── node_modules/
├── src/
│   ├── di/
│   │   └── dependencies.ts       # Quản lý các phụ thuộc cho ứng dụng
│   ├── presentation/
│   │   ├── components/           # Thành phần giao diện UI
│   │   │   ├── assignmentItem.jsx
│   │   │   ├── classItem.jsx
│   │   │   ├── customHeader.jsx
│   │   │   ├── FadeInView.jsx
│   │   │   ├── func.jsx
│   │   │   ├── NoteItem.jsx
│   │   │   └── PulsatingIcon.jsx
│   │   ├── navigation/            # Điều hướng trong ứng dụng
│   │   │   └── AppNavigation.jsx
│   │   └── pages/                 # Các trang chính của ứng dụng
│   │       ├── Login.jsx
│   │       ├── Notification.jsx
│   │       ├── Profile.jsx
│   │       ├── Register.jsx
│   │       ├── Setting.jsx
│   │       ├── student/           # Trang dành riêng cho sinh viên
│   │       │   ├── AbsenceRequest.jsx
│   │       │   ├── AssignmentList.jsx
│   │       │   ├── ClassRegister.jsx
│   │       │   ├── StudentClasses.jsx
│   │       │   └── StudentScreen.jsx
│   │       └── teacher/           # Trang dành riêng cho giảng viên
│   │           ├── AddClass.jsx
│   │           ├── AddSurvey.jsx
│   │           ├── ClassManage.jsx
│   │           └── TeacherScreen.jsx
│   └── utils/                     # Các hàm tiện ích chung cho ứng dụng
│       └── constant.js
├── App.tsx                        # Điểm khởi đầu của ứng dụng
├── app.json                       # Cấu hình Expo
├── babel.config.js                # Cấu hình Babel
├── package.json                   # Quản lý các thư viện
├── package-lock.json
├── README.md                      # Tài liệu giới thiệu dự án
└── tsconfig.json                  # Cấu hình TypeScript

