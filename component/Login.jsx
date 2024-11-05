import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Login({ navigation, route }) {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={{
                        width: 200,
                    }}
                    resizeMode="contain"
                />
            </View>
            <View>
                <Text>Form điền thông tin</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'darkred'
    },
    imageContainer: {
        borderBottomColor: 'white',
        borderBottomWidth: 3,
    }
})

export default Login;