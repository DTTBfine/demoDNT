import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import * as apis from '../../data/api/index'
import IconI from 'react-native-vector-icons/Ionicons'
import * as actions from '../redux/actions'
import Spinner from 'react-native-loading-spinner-overlay'


const testList = [
    {
        "class_id": "IT1004",
        "class_name": "Android",
        "attached_code": null,
        "class_type": "LT_BT",
        "lecturer_name": "Đoàn Văn Nam",
        "lecturer_account_id": "461",
        "student_count": "0",
        "start_date": "2024-12-14",
        "end_date": "2025-01-31",
        "status": "ACTIVE"
    },
    {
        "class_id": "IT1003",
        "class_name": "TKXDPM",
        "attached_code": null,
        "class_type": "BT",
        "lecturer_name": "Đoàn Văn Nam",
        "lecturer_account_id": "461",
        "student_count": "0",
        "start_date": "2024-12-12",
        "end_date": "2025-01-25",
        "status": "ACTIVE"
    },
    {
        "class_id": "IT1001",
        "class_name": "ĐBCLPM",
        "attached_code": null,
        "class_type": "LT",
        "lecturer_name": "Đoàn Văn Nam",
        "lecturer_account_id": "461",
        "student_count": "0",
        "start_date": "2024-12-12",
        "end_date": "2025-01-31",
        "status": "ACTIVE"
    },
    {
        "class_id": "IT1000",
        "class_name": "Đa nền tảng",
        "attached_code": null,
        "class_type": "LT",
        "lecturer_name": "Đoàn Văn Nam",
        "lecturer_account_id": "461",
        "student_count": "1",
        "start_date": "2024-12-14",
        "end_date": "2025-01-18",
        "status": "ACTIVE"
    },
    {
        "class_id": "PH1111",
        "class_name": "Vat ly dai cuong",
        "attached_code": null,
        "class_type": "BT",
        "lecturer_name": "Giang Vien123",
        "lecturer_account_id": "459",
        "student_count": "3",
        "start_date": "2024-11-30",
        "end_date": "2024-12-30",
        "status": "ACTIVE"
    },
    {
        "class_id": "SSH303",
        "class_name": "Test 1",
        "attached_code": null,
        "class_type": "LT",
        "lecturer_name": "Giang Vien123",
        "lecturer_account_id": "459",
        "student_count": "1",
        "start_date": "2024-11-30",
        "end_date": "2024-12-29",
        "status": "ACTIVE"
    },
    {
        "class_id": "IT3003",
        "class_name": "TEST123",
        "attached_code": null,
        "class_type": "LT_BT",
        "lecturer_name": "Giang Vien123",
        "lecturer_account_id": "459",
        "student_count": "1",
        "start_date": "2024-11-30",
        "end_date": "2024-12-30",
        "status": "ACTIVE"
    },
    {
        "class_id": "686868",
        "class_name": "TTTH",
        "attached_code": null,
        "class_type": "LT_BT",
        "lecturer_name": "thẩm  Phong",
        "lecturer_account_id": "41",
        "student_count": "0",
        "start_date": "2024-01-14",
        "end_date": "2024-05-05",
        "status": "ACTIVE"
    },
    {
        "class_id": "666888",
        "class_name": "CNPM",
        "attached_code": null,
        "class_type": "LT",
        "lecturer_name": "thẩm  Phong",
        "lecturer_account_id": "41",
        "student_count": "0",
        "start_date": "2024-12-19",
        "end_date": "2025-04-10",
        "status": "ACTIVE"
    },
    {
        "class_id": "plk999",
        "class_name": "Học phần gì đó",
        "attached_code": null,
        "class_type": "LT",
        "lecturer_name": "Nuyễn Dương",
        "lecturer_account_id": "277",
        "student_count": "0",
        "start_date": "2024-12-12",
        "end_date": "2024-12-28",
        "status": "ACTIVE"
    }
]

const DEFAULT_PAGE_SIZE = 10

const ListOpenClasses = () => {
    const dispatch = useDispatch()
    const { isLoggedIn, msg, update, token, role, userId } = useSelector(state => state.auth)
    const { filteredClassesInfo } = useSelector(state => state.learning)


    const HeaderItem = {
        class_id: 'Mã lớp',
        class_name: 'Tên lớp',
        attached_code: 'Mã lớp kèm',
        class_type: 'Loại lớp',
        lecturer_name: 'Giảng viên',
        student_count: 'Sĩ số',
        start_date: 'Ngày bắt đầu',
        end_date: 'Ngày kết thúc',
        status: 'Trạng thái lớp',
    }

    const [isLoading, setIsLoading] = useState(false)
    const [dispatchData, setDispatchData] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPage, setMaxPage] = useState(0)
    const [classList, setClassList] = useState(testList)
    const [className, setClassName] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const [filterFields, setFilterFields] = useState({
        status: null,
        class_type: null
    })
    const [payload, setPayload] = useState({
        token: token,
        class_id: null,
        status: null, //ACTIVE, COMPLETED, UPCOMING
        class_name: null,
        class_type: null, //LT, BT, LT_BT
        pageable_request: {
            page: 0,
            page_size: DEFAULT_PAGE_SIZE
        } 
    })

    // console.log('currentPage: ' + currentPage)

    useEffect(() => {
        if (dispatchData) {
            dispatch(actions.getClassesByFilter({
                token: token,
                class_id: payload.class_id,
                status: payload.status,
                class_name: payload.class_name,
                class_type: payload.class_type,
                pageable_request: {
                    page: 0,
                    page_size: DEFAULT_PAGE_SIZE
                }
            }))
            setDispatchData(false)
        }
    },[])

    useEffect(() => {
        const totalPage = parseInt(filteredClassesInfo?.page_info?.total_page || "0", 10)
        // console.log("total page: " + totalPage)
        setMaxPage(totalPage)
    }, [filteredClassesInfo])

    useEffect(() => {
        // console.log("class name: " + className)
        // console.log("payload: " + JSON.stringify(payload))
        // console.log("current page: " + currentPage)
        setIsLoading(true)
        dispatch(actions.getClassesByFilter({
            token: token,
            class_id: payload.class_id,
            status: payload.status,
            class_name: className,
            class_type: payload.class_type,
            pageable_request: {
                page: currentPage - 1 >= 0 ? currentPage - 1 : 0,
                page_size: DEFAULT_PAGE_SIZE
            }
        }))
        setIsLoading(false)
    }, [payload, className, currentPage])

    const handleRefresh = () => {
        setRefreshing(true)
        //gọi api load lại dữ liệu
        setTimeout(() => {
            setShowFilter(false)
            setClassName('')
            setPayload({
                token: token,
                class_id: null,
                status: null, //ACTIVE, COMPLETED, UPCOMING
                class_name: null,
                class_type: null, //LT, BT, LT_BT
                pageable_request: {
                    page: 0,
                    page_size: DEFAULT_PAGE_SIZE
                } 
            })
            setFilterFields({
                status: null,
                class_type: null
            })
            setCurrentPage(1)
            setRefreshing(false)
        }, 500);
    }

    const [showFilter, setShowFilter] = useState(false)
   

    const handleFilter = () => {
        setShowFilter(false)
        setPayload(prev => ({
            ...prev,
            status: filterFields.status,
            class_type: filterFields.class_type
        }))
        setCurrentPage(1)
    }

    const RadioChoice = ({ type, text }) => {
        return (
            <TouchableOpacity onPress={() => {
                filterFields[type] === text ? setFilterFields(prev => ({ ...prev, [type]: null })) :
                    setFilterFields(prev => ({ ...prev, [type]: text }))
            }} style={{ minWidth: '50%' }}>
                {
                    filterFields[type] === text ? <View style={{ flexDirection: 'row', paddingVertical: 10, gap: 8 }}>
                        <IconI name='radio-button-on' color='#BB0000' size={20} />
                        <Text style={{ fontWeight: '500', color: '#BB0000' }}>{text}</Text>
                    </View> : <View style={{ flexDirection: 'row', paddingVertical: 10, gap: 8 }}>
                        <IconI name='radio-button-off' color='gray' size={20} />
                        <Text style={{ fontWeight: '500' }}>{text}</Text>
                    </View>

                }
            </TouchableOpacity>
        )
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            <Spinner
                visible={isLoading}
                textContent=''
                textStyle={{
                    color: '#FFF'
                }}
            />
            <View style={{
                paddingHorizontal: 10
            }}>
                <View style={{
                    backgroundColor: 'gainsboro',
                    flexDirection: 'row',
                    borderRadius: 20,
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    gap: 10
                }}>
                    <Icon name='search' color='darkgray' size={20} />
                    <TextInput
                        style={{
                            fontSize: 16,
                            height:40
                        }}
                        placeholder='Tìm kiếm theo tên lớp'
                        placeholderTextColor="gray"
                        value={className}
                        onChangeText={(text) => setClassName(text)}
                    />
                </View>
                {/* <TouchableOpacity
                        style={{
                            flex: 5,
                            backgroundColor: "#BB0000",
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 15
                        }}
                        onPress={() => {
                            setClassList(myClasses?.length > 0 ? myClasses.filter(classItem => classItem.class_id === classId) : [])
                        }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontStyle: 'italic', fontSize: 16 }}> Tìm kiếm</Text>
                    </TouchableOpacity> */}
                <View style={{ marginVertical: 10, gap: 10 }}>
                    <TouchableOpacity onPress={() => setShowFilter(!showFilter)} style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                        <IconI name="filter" color='gray' size={18} />
                        <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500' }}>Bộ lọc</Text>
                    </TouchableOpacity>
                    {
                        showFilter && <View style={{
                            padding: 10,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 10,
                            backgroundColor: 'white',
                            // position: 'absolute',
                            // top: 30,
                            // left: 30,
                            zIndex: 1
                        }}>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Trạng thái :</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <RadioChoice type={'status'} text={'ACTIVE'} />
                                    <RadioChoice type={'status'} text={'COMPLETED'} />
                                    <RadioChoice type={'status'} text={'UPCOMING'} />
                                </View>
                            </View>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '500' }}>Loại lớp :</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                    <RadioChoice type={'class_type'} text={'LT'} />
                                    <RadioChoice type={'class_type'} text={'BT'} />
                                    <RadioChoice type={'class_type'} text={'LT_BT'} />
                                </View>
                            </View>
                            <TouchableOpacity onPress={handleFilter}
                                style={{ backgroundColor: '#BB0000', borderRadius: 10, padding: 5, marginTop: 10 }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: 'white' }}>Lọc</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
            <View style={{
                padding: 10
            }}>
                <ScrollView horizontal={true}>
                    <View style={{
                        gap: 10
                    }}>
                        <ClassBasicInfoItem isHeader classItem={HeaderItem} />
                        <ScrollView>
                            {classList?.length === 0 && <Text style={{
                                fontStyle: 'italic',
                                color: 'gray',
                                paddingHorizontal: 20,
                                paddingVertical: 10
                            }}>Không có lớp phù hợp</Text>}
                            {filteredClassesInfo?.page_content?.length > 0 && filteredClassesInfo?.page_content?.map((item) => {
                                return (
                                    <View key={item.class_id} style={{
                                        backgroundColor: 'white',
                                        borderRadius: 10,
                                        marginBottom: 15
                                    }}>
                                        <ClassBasicInfoItem classItem={item} />
                                    </View>
                                )
                            })}
                        </ScrollView>
                    </View>
                </ScrollView>
                <Pagination count={maxPage || 1} currentPage={currentPage} setCurrentPage={setCurrentPage} length={10} />
            </View>
        </ScrollView>
    )
}

const Pagination = ({ count, length, currentPage, setCurrentPage }) => {
    return (
        <View style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
            marginBottom: 20
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
                {currentPage < count && (
                    <PageItem
                        icon={<Icon name='chevron-right' />}
                        setCurrentPage={setCurrentPage}
                        text={+currentPage + 1}
                    />
                )}
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

const ClassBasicInfoItem = ({ isHeader, classItem }) => {
    return (
        <View style={{
            backgroundColor: isHeader && '#BB0000',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Cell isHeader={isHeader} width={150} data={classItem?.class_id} />
            <Cell isHeader={isHeader} width={200} data={classItem?.class_name} />
            <Cell isHeader={isHeader} width={120} data={classItem?.attached_code || classItem?.class_id} />
            <Cell isHeader={isHeader} width={100} data={classItem?.class_type} />
            <Cell isHeader={isHeader} width={150} data={classItem?.lecturer_name} />
            <Cell isHeader={isHeader} width={100} data={classItem?.student_count || classItem?.max_student_amount} />
            <Cell isHeader={isHeader} width={150} data={classItem?.start_date} />
            <Cell isHeader={isHeader} width={150} data={classItem?.end_date} />
            <Cell isHeader={isHeader} width={150} data={classItem?.status} />
        </View >
    )
}

const Cell = ({ isHeader, width, data }) => {
    return (
        <View style={[styles.cell, { width: width }]}>
            <Text style={[styles.dataCell, { color: isHeader && 'white', fontSize: isHeader ? 16 : 14, fontWeight: isHeader ? '600' : '400' }]}>{data} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15
    },
    cell: {
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: '#BBBBBB',
        alignItems: 'center'
    },
    dataCell: {
        textAlign: 'center',
        paddingVertical: 10
    }
})

export default ListOpenClasses