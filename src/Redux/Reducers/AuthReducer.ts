import { AuthActions, LOGIN, LOGOUT } from "../Actions/AuthActions";

export interface AuthReducerState {
    user?: firebase.User;
}

const initialAuthReducerState = {
}

export default function AuthReducer(state: AuthReducerState = initialAuthReducerState, action: AuthActions) {
    switch (action.type) {
        case LOGIN:
            state = {
                ...state,
                user: { ...action.payload }
            }
            break;
        case LOGOUT:
            state = {
                ...state,
                user: undefined
            };
    }

    return state;
}