import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

const NoteItem = ({ data }) => {
    const { title_push_notification, message, sent_time, image_url } = data;

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ color: '#AA0000', fontWeight: '500' }}>AIIHust</Text>
                <Text style={{ color: 'gray', fontSize: 12 }}>{sent_time.split('T')[0]}</Text>
            </View>
            <Text style={{ fontWeight: '600', fontSize: 16, marginVertical: 5 }}>{title_push_notification}</Text>
            {/* {image_url && (
                <Image
                    source={{ uri: image_url }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => console.warn('Lỗi tải hình ảnh')}
                />
            )} */}
            <View style={{ borderTopWidth: 1, borderTopColor: '#DDDDDD', marginTop: 10, paddingVertical: 5 }}>
                <Text>{message}</Text>
            </View>
            <Text style={{ textDecorationLine: 'underline', color: '#00CCEE', fontSize: 13, textAlign: 'right' }}>
                Chi tiết
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 15,
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
        marginTop: 10,
    },
});

export default NoteItem;
