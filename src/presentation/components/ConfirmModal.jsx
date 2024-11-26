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

                    <TouchableOpacity onPress={() => { setShowConfirmModal(false) }}
                        style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFunction}
                        style={{ flexDirection: 'row', gap: 15, padding: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: '400' }}>Xác nhận</Text>
                    </TouchableOpacity>

                </View>
            </Pressable>
        </Modal>
    )
}

export default ConfirmModal