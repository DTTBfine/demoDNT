import { View, Text, Modal, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'

const ConfirmModal = ({ handleName, handleFunction, showConfirmModal, setShowConfirmModal }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showConfirmModal}
            onRequestClose={() => setShowConfirmModal(false)}
        >
            <Pressable style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)'

            }}>
                <View style={{
                    zIndex: 1,
                    backgroundColor: '#fff',
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    borderRadius: 15
                }}>
                    <Text style={{
                        textAlign: 'center',
                        fontWeight: '500',
                        fontSize: 20
                    }}>Bạn chắc chắn muốn {handleName}
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                        <TouchableOpacity onPress={() => { setShowConfirmModal(false) }}
                            style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#AA0000', borderRadius: 18, width: 100 }}>
                            <Text style={{ fontSize: 16, fontWeight: '400', color: 'white', fontWeight: '600' }}>Hủy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleFunction}
                            style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'limegreen', borderRadius: 18, width: 100 }}>
                            <Text style={{ fontSize: 16, fontWeight: '400', color: 'white', fontWeight: '600' }}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}

export default ConfirmModal