export const validateEmail = (email) => {
    var regex = /^\w+([.-]?\w+)*@hust\.edu\.vn$/;
    return regex.test(email);
}