export function actionTemplate<T, P = {}>(type: T, payload: P) {
    return {
        type,
        payload
    }
};

export function actionTemplateSideEffect<T, P, S = P>(type: T, payload: P, sideEffect: (params: P) => S) {
    return {
        type,
        payload: sideEffect(payload)
    }
};