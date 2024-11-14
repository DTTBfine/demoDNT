// RootReducer.js
import authReducer from "./authReducer";
import userReducer from './userReducer'
import { combineReducers } from "redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import { persistReducer } from "redux-persist";

const commonConfig = {
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
};

const authConfig = {
    ...commonConfig,
    key: 'auth',
    whitelist: ['userId', 'role'],
};

const rootReducer = combineReducers({
    //auth: persistReducer(authConfig, authReducer),
    auth: authReducer,
    user: userReducer
});

export default rootReducer;
