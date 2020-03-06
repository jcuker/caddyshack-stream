import { createStore, combineReducers, StateFromReducersMapObject } from "redux";
import authReducer from "./Reducers/AuthReducer";

const allReducers = {
    authReducer,
};

const CombinedReducer = combineReducers(allReducers);

const store = createStore(CombinedReducer);

export type ApplicationState = StateFromReducersMapObject<typeof allReducers>;

export default store;