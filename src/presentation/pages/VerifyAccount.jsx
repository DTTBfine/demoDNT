import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const VerifyAccountScreen = () => {
    const [verifyCode, setVerifyCode] = useState('');

    const handleGetVerifyCode = () => {
        // Logic to generate or send the verification code
        console.log("Verification code sent!");
    };

    const handleCheckVerifyCode = () => {
        // Logic to check the verification code
        console.log("Checking verify code:", verifyCode);
    };

    return (
        <View style={styles.container}>
            <Button title="Get Verify Code" onPress={handleGetVerifyCode} />

            <Text style={styles.label}>Enter Verify Code:</Text>
            <TextInput
                style={styles.input}
                value={verifyCode}
                onChangeText={setVerifyCode}
                placeholder="Verification Code"
                keyboardType="numeric"
            />

            <Button title="Check Verify Code" onPress={handleCheckVerifyCode} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
    },
    input: {
        width: '80%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        textAlign: 'center',
    }
});

export default VerifyAccountScreen;
