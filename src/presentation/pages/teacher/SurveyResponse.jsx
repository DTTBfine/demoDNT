import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Button, Modal, TextInput } from 'react-native';
import { apiGetSurveyResponse,apiSendNotification } from '../../../data/api';
import { useSelector } from 'react-redux';
import { Linking } from 'react-native';
import IconI from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'

const SurveyResponse = ({ route }) => {
    const { currentSurvey, currentClass } = route.params;
    const { token } = useSelector(state => state.auth);
    const [responses, setResponses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [grade, setGrade] = useState('');

    const [showFilter, setShowFilter] = useState(false)
    const [arrange, setArrange] = useState("newest") 
    const [refreshing, setRefreshing] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)

    const fetchSurveyResponse = async () => {
        try {
            const response = await apiGetSurveyResponse({
                token: token,
                survey_id: currentSurvey.id,
            });

            if (response.data) {
                let filteredResponses = response.data.data;

                if (arrange === 'newest') {
                    filteredResponses.sort((a, b) => new Date(b.submission_time) - new Date(a.submission_time));
                } else if (arrange === 'pending') {
                    filteredResponses = filteredResponses.filter(item => item.grade === null);
                } else if (arrange === 'graded') {
                    filteredResponses = filteredResponses.filter(item => item.grade !== null);
                }

                setResponses(filteredResponses);
            } else {
                console.log('No survey response found');
            }
        } catch (error) {
            console.error('API call failed:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách bài nộp. Vui lòng thử lại.');
        }
    };

    useEffect(() => {
        fetchSurveyResponse();
    }, [arrange]);

    const renderItem = (item) => (
        <View key={item.id} style={styles.itemContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.studentName}>{item.student_account.first_name} {item.student_account.last_name}</Text>
                <View style={styles.gradeContainer}>
                    {item.grade === null ? (
                        <Text style={styles.noGradeText}>Chưa có điểm</Text>
                    ) : (
                        <Text style={styles.gradeText}>{item.grade}</Text>
                    )}
                </View>
            </View>
            <Text style={styles.infoText}>Email: {item.student_account.email}</Text>
            <Text style={styles.infoText}>Mã sinh viên: {item.student_account.student_id}</Text>
            <Text style={styles.infoText}>Thời gian nộp: {new Date(item.submission_time).toLocaleString()}</Text>
            <Text style={styles.infoText}>Phản hồi văn bản: {item.text_response}</Text>
            <TouchableOpacity onPress={() => handleOpenFile(item.file_url)}>
                <Text style={styles.fileLink}>Xem bài nộp</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() =>  handleGradeSubmission(item)}
                style={[
                    styles.gradeButton, 
                    item.grade !== null ? styles.gradedButton : styles.ungradedButton
                ]}
            >
                <Text style={styles.buttonText}>{item.grade !== null ? 'Đã chấm điểm' : 'Chấm điểm'}</Text>
            </TouchableOpacity>
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
        if (!grade) {
            Alert.alert('Lỗi', 'Vui lòng nhập điểm.');
            return;
        }
        console.log(`Chấm điểm cho bài nộp của ${selectedSubmission.student_account.first_name} ${selectedSubmission.student_account.last_name}: ${grade}`);
        try {
            const response = await apiGetSurveyResponse({
                token: token,
                survey_id: currentSurvey.id,
                grade: {
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
        }
        const payloadSN = {
            token: token,
            message: `${currentSurvey.title} | Lớp: ${currentClass.class_name} - ${currentClass.class_id} | Điểm: ${grade}`,
            toUser: selectedSubmission.student_account.account_id,
            type: 'ASSIGNMENT_GRADE',
        };

        console.log("SN accept payload",payloadSN)
    
        let responseSN;
        try {
            responseSN = await apiSendNotification(payloadSN);
            console.log('Send notification response:', responseSN);
        } catch (error) {
            console.error('Error in send notification API:', error);
            return;
        }
        setModalVisible(false);
        setGrade('');
    };

    console.log(responses)
    return (
        <View style={styles.container}>
            <View style={{
                alignItems: 'flex-end',
                paddingRight: 10
            }}>
                <TouchableOpacity onPress={() => setShowFilter(!showFilter)} style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                    <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500' }}>Sắp xếp theo</Text>
                    <IconI name="filter" color='gray' size={18} />
                </TouchableOpacity>
                {
                    showFilter && <View style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: 30,
                        zIndex: 1,
                        borderRadius: 10,
                        padding: 10,
                        elevation: 5
                    }}>
                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange('newest')
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: '#AA0000', fontWeight: '500' }}>Mới nhất</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange('pending')
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'goldenrod', fontWeight: '500' }}>Chờ xử lý</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ padding: 5 }} onPress={() => {
                            setShowFilter(false)
                            setArrange('graded')
                        }}>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: 'forestgreen', fontWeight: '500' }}>Đã chấm điểm</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} length={10} />

            <ScrollView>
                {responses.length > 0 ? (
                    responses.map(item => renderItem(item))
                ) : (
                    <Text style={{ textAlign: 'center', color: 'gray', paddingTop: 10 }}>Không có bài nộp nào.</Text>
                )}
            </ScrollView>

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

const Pagination = ({ count, length, currentPage, setCurrentPage }) => {
    return (
        <View style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderColor: '#ddd'
        }}>
            <View style={{ flexDirection: 'row', gap: 10, flex: 1, justifyContent: 'space-between' }}>
                {currentPage > 2 ? <PageItem icon={<Icon name='chevron-left' />} setCurrentPage={setCurrentPage} text={+currentPage - 1} /> :
                    <PageItem currentPage={currentPage} setCurrentPage={setCurrentPage} text={1} />
                }
                {
                    currentPage > 2 && <PageItem text={'...'} />
                }
            </View>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                {currentPage > 1 && <PageItem currentPage={currentPage} setCurrentPage={setCurrentPage} text={currentPage} />}
            </View>

            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end' }}>
                {/* {!isHideEnd && <PageItem text={'...'} />} */}

                <PageItem
                    icon={<Icon name='chevron-right' />}
                    setCurrentPage={setCurrentPage}
                    text={+currentPage + 1}
                />

            </View>
        </View>
    )
}

const PageItem = ({ text, currentPage, icon, setCurrentPage }) => {
    const handleChangePage = () => {
        if (text === '...') {
            return
        }
        setCurrentPage(+text)
    }
    return (
        <TouchableOpacity onPress={handleChangePage}
            style={{
                backgroundColor: +text === +currentPage ? '#BB0000' : text !== '...' ? '#ccc' : '',
                width: 30,
                height: 30,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            {
                <Text style={{ textAlign: 'center', color: +text === +currentPage ? 'white' : 'gray', fontWeight: '500' }}>{icon || text}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    gradeButton: {
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    ungradedButton: {
        backgroundColor: '#4CAF50',
    },
    gradedButton: {
        backgroundColor: '#9E9E9E',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
        gap: 20
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
    gradeText: {
        fontSize: 16,
        color: 'green',
    },
    infoText: {
        fontSize: 14,
        paddingVertical: 4,
    },
    fileLink: {
        fontSize: 14,
        color: 'blue',
        textDecorationLine: 'underline',
        marginBottom: 15,
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
        marginTop: 10
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
