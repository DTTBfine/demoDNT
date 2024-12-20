export const formatDate = (string_date) => {

    // Tạo một đối tượng Date từ chuỗi
    var date_object = new Date(string_date);
    let date = ''

    // Lấy các thành phần ngày, tháng, năm
    var day = date_object.getDate();
    var month = date_object.getMonth() + 1; // Vì getUTCMonth trả về từ 0 đến 11
    var year = date_object.getFullYear();

    // Định dạng lại chuỗi
    return date + (day < 10 ? '0' : '') + day + '-' + (month < 10 ? '0' : '') + month + '-' + year;
}

export const formatSQLDate = (string_date) => {
    // Tạo một đối tượng Date từ chuỗi
    var date_object = new Date(string_date);
    let date = ''

    // Lấy các thành phần ngày, tháng, năm
    var day = date_object.getDate();
    var month = date_object.getMonth() + 1; // Vì getUTCMonth trả về từ 0 đến 11
    var year = date_object.getFullYear();

    // Định dạng lại chuỗi
    return date + year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
}

export const getHourMinute = (dateStr) => {
    // Chuyển chuỗi thành đối tượng Date
    const date = new Date(dateStr);
    // Lấy giờ và phút từ đối tượng Date
    let hour = date.getHours();
    let minute = date.getMinutes();

    const dayInWeek = date.getDay() + 1;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear()

    // Đảm bảo giờ và phút có 2 chữ số
    hour = String(hour).padStart(2, '0');
    minute = String(minute).padStart(2, '0');

    return { hour, minute, dayInWeek, day, month, year };
}

export const convertVNDate = (string_date) => {
    // Tạo một đối tượng Date từ chuỗi
    var date_object = new Date(string_date);
    let date = ''

    // Lấy các thành phần ngày, tháng, năm
    var day = date_object.getDate();
    var month = date_object.getMonth() + 1; // Vì getUTCMonth trả về từ 0 đến 11
    var year = date_object.getFullYear();

    return date + day + ' Tháng ' + month + ', ' + year
}

export const tinhThoiGianTuMocThoiGianDenNay = (date) => {
    // Chuyển mốc thời gian vào đối tượng Date
    var mocThoiGian = new Date(date);

    // Lấy thời gian hiện tại
    var thoiGianHienTai = new Date();

    // Tính khoảng thời gian giữa hai thời điểm
    var khoangThoiGian = thoiGianHienTai - mocThoiGian;

    // Chuyển đổi khoảng thời gian từ milliseconds sang ngày
    var khoangThoiGianNgay = khoangThoiGian / (1000 * 3600 * 24);

    // Nếu khoảng thời gian lớn hơn 365 ngày, trả về theo năm
    if (khoangThoiGianNgay > 365) {
        return Math.floor(khoangThoiGianNgay / 365) + " năm";
    }
    // Nếu khoảng thời gian lớn hơn 30 ngày, trả về theo tháng
    else if (khoangThoiGianNgay > 30) {
        return Math.floor(khoangThoiGianNgay / 30) + " tháng";
    }
    // Ngược lại, trả về theo ngày
    else {
        return Math.floor(khoangThoiGianNgay) + " ngày";
    }
}

export const convertToHHMM = (timeString) => {
    var splitTime = timeString.split(':');
    let result = ''
    var hours = parseInt(splitTime[0]);
    result += hours
    result += ':'
    var minutes = parseInt(splitTime[1]);
    result += minutes < 10 ? '0' + minutes : minutes
    var seconds = parseInt(splitTime[2]);

    return result;
}


export const days = [
    {
        id: 2,
        name: 'Thứ Hai',
        engName: 'Mon'
    }, {
        id: 3,
        name: 'Thứ Ba',
        engName: 'Tue'
    }, {
        id: 4,
        name: 'Thứ Tư',
        engName: 'Web'
    }, {
        id: 5,
        name: 'Thứ Năm',
        engName: 'Thu'
    }, {
        id: 6,
        name: 'Thứ Sáu',
        engName: 'Fri'
    }, {
        id: 7,
        name: 'Thứ Bảy',
        engName: 'Sat'
    }, {
        id: 8,
        name: 'Chủ Nhật',
        engName: 'Sun'
    }
]

export const getDaysOfWeek = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayIndex = date.getDay(); // Lấy chỉ số ngày trong tuần (0: Chủ nhật, 1: Thứ Hai, ..., 6: Thứ Bảy)
    const currentDay = days[dayIndex]; // Lấy ngày hiện tại dựa vào chỉ số

    // Tính toán các ngày còn lại trong tuần
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(date); // Tạo một đối tượng Date mới để không ảnh hưởng đến đối tượng gốc
        nextDay.setDate(date.getDate() + i - dayIndex); // Đặt ngày mới cho ngày tiếp theo
        daysOfWeek.push({
            day: days[nextDay.getDay()],
            date: nextDay
        });
    }

    return daysOfWeek;
}

export const DayToId = (day) => {
    switch (day) {
        case 'Mon':
            return 2
        case 'Tue':
            return 3
        case 'Web':
            return 4
        case 'Thu':
            return 5
        case 'Fri':
            return 6
        case 'Sat':
            return 7
        case 'Sun':
            return 8
        default:
            break;
    }
}

export const classNameCode = (fullName) => {
    let code = ''

    // Tách tên thành các từ riêng biệt
    var nameParts = fullName.split(" ");

    let len = Math.min(nameParts.length, 2)
    // Lấy chữ cái đầu tiên của mỗi từ và nối lại
    for (let i = 0; i < len; i++) {
        code += nameParts[i][0];
    }
    // Chuyển đổi chữ cái thành chữ hoa
    code = code.toUpperCase();

    return code

}

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const getRandomBasicColor = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange',];
    return colors[Math.floor(Math.random() * colors.length)];
};

const colorMap = new Map();

export const getColorForId = (id) => {
    if (!colorMap.has(id)) {
        const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#6A5ACD', '#FF4500', '#2E8B57', '#FF69B4'];
        const color = colors[colorMap.size % colors.length]; // Chọn màu từ danh sách
        colorMap.set(id, color);
    }
    return colorMap.get(id);
};

export const getIconForFileType = (fileType) => {
    // Tạo một đối tượng ánh xạ giữa định dạng file và icon tương ứng
    const fileIcons = {
        'image/png': 'image',
        'image/jpeg': 'image',
        'application/pdf': 'file-pdf-o',
        'text/plain': 'file-text-o',
        'application/msword': 'file-word-o',
        'application/vnd.ms-excel': 'file-excel-o',
        'application/zip': 'file-archive-o',
    };

    // Trả về icon tương ứng với kiểu file, nếu không có trả về một icon mặc định
    return fileIcons[fileType] || 'file';
};

export const getDisplayedAvatar = (driveUrl) => {
    if (driveUrl?.length > 0 && driveUrl.startsWith("https://drive.google.com")) {
        const fileId = driveUrl.split('/d/')[1].split('/')[0];
        return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    return ''
}