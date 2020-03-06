import { actionTemplate } from './ActionTemplate';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export interface LoginParams extends firebase.User { }

export interface LoginAction {
    type: typeof LOGIN;
    payload: LoginParams;
}

export interface LogoutAction {
    type: typeof LOGOUT
}

export const login = (params: LoginParams): LoginAction => actionTemplate<typeof LOGIN, LoginParams>(LOGIN, params);
export const logout = (): LogoutAction => actionTemplate<typeof LOGOUT>(LOGOUT, {});

export type AuthActions = LoginAction | LogoutAction;