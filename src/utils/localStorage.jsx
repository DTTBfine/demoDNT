import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveValue = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        console.log("Data successfully saved");
    } catch (error) {
        console.error("Failed to save data", error);
    }
};

export const getValue = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            console.log("Retrieved data:", value);
            return value;
        }
    } catch (error) {
        console.error("Failed to retrieve data", error);
    }
};

export const removeValue = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log("Data successfully removed");
    } catch (error) {
        console.error("Failed to remove data", error);
    }
};