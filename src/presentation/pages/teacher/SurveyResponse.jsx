import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button, Modal, TextInput } from 'react-native';
import { apiGetSurveyResponse } from '../../../data/api';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';

const SurveyResponse = ({ route }) => {
    const { currentSurvey } = route.params;
    const { token } = useSelector(state => state.auth);
    const [responses, setResponses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [grade, setGrade] = useState('');

    const fetchSurveyResponse = async () => {
        console.log('Start fetching SurveyResponse'); 
        try {
            console.log('Token:', token);
            const response = await apiGetSurveyResponse({
                token: token,
                survey_id: currentSurvey.id,
            });
            console.log('API response:', response.data);

            if (response.data) {
                setResponses(response.data.data);
                console.log('Fetched survey-response:', response.data.data);
            } else {
                console.log('No survey response found');
            }
        } catch (error) {
            console.error('API call failed:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách bài nộp. Vui lòng thử lại.');
        } finally {
            console.log('Finished fetching notifications');
        }
    };

    useEffect(() => {
        fetchSurveyResponse();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.studentName}>{item.student_account.first_name} {item.student_account.last_name}</Text>
                {item.grade === null ? (
                    <View style={styles.gradeContainer}>
                        <Text style={styles.noGradeText}>Chưa có điểm</Text>
                    </View>         
                ):(
                    <View style={styles.gradeContainer}>
                        <Text style={styles.GradeText}>{item.grade}</Text>
                    </View> 
                )}
            </View>
            <Text style={styles.infoText}>Email: {item.student_account.email}</Text>
            <Text style={styles.infoText}>Mã sinh viên: {item.student_account.student_id}</Text>
            <Text style={styles.infoText}>Thời gian nộp: {new Date(item.submission_time).toLocaleString()}</Text>
            <Text style={styles.infoText}>Phản hồi văn bản: {item.text_response}</Text>
            <TouchableOpacity onPress={() => handleOpenFile(item.file_url)}>
                <Text style={styles.fileLink}>Xem tài liệu</Text>
            </TouchableOpacity>
            <Button title="Chấm điểm" onPress={() => handleGradeSubmission(item)} />
        </View>
    );

    const handleOpenFile = (url) => {
        try {
            Linking.openURL(url);
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể mở tài liệu.');
        }
    };

    const handleGradeSubmission = (item) => {
        setSelectedSubmission(item);
        setModalVisible(true);
    };

    const submitGrade = async () => {
        console.log(selectedSubmission.id);
        if (!grade) {
            Alert.alert('Lỗi', 'Vui lòng nhập điểm.');
            return;
        }
        console.log(`Chấm điểm cho bài nộp của ${selectedSubmission.student_account.first_name} ${selectedSubmission.student_account.last_name}: ${grade}`);
        try {
            console.log('Token:', token);
            const response = await apiGetSurveyResponse({
                token: token,
                survey_id: currentSurvey.id,
                grade:{
                    score: grade,
                    submission_id: selectedSubmission.id
                }
            });
            console.log('API response:', response.data);

            if (response.data) {
                setResponses(response.data.data);
                console.log('Fetched survey-response:', response.data.data);
            } else {
                console.log('No survey response found');
            }
        } catch (error) {
            console.error('API call failed:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách bài nộp. Vui lòng thử lại.');
        } finally {
            console.log('Finished fetching notifications');
        }
        setModalVisible(false);
        setGrade('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách bài nộp</Text>
            <FlatList
                data={responses}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text>Không có bài nộp nào.</Text>}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chấm điểm</Text>
                        {selectedSubmission && (
                            <Text>Chấm điểm cho bài nộp của {selectedSubmission.student_account.first_name} {selectedSubmission.student_account.last_name}</Text>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder='Nhập điểm'
                            value={grade}
                            onChangeText={setGrade}
                            keyboardType='numeric'
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.confirmButton} onPress={submitGrade}>
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 2,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    studentName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    gradeContainer: {
        alignItems: 'flex-end',
    },
    noGradeText: {
        fontSize: 14,
        color: 'red',
    },
    GradeText: {
        fontSize: 16,
        color: 'green',
    },
    infoText: {
        fontSize: 14,
    },
    fileLink: {
        fontSize: 14,
        color: 'blue',
        textDecorationLine: 'underline',
        marginBottom:15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 8,
        marginTop:10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        width: '48%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default SurveyResponse;
