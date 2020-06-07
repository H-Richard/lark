// @ts-ignore
interface store {
    currentCaretPos: Number
}

interface action {
    type: string,
    payload: any
}

const initialState : store = {
    currentCaretPos: 0
}

export const rootReducer = (state: any = initialState, action: action) => {
    const { type, payload } = action;
    console.log("ACTION", action);
    switch(type){
        case "UPDATE_CARET_POS":
            return { ...state, currentCaretPos: payload.newPos };
        default: 
            return initialState; 
    }
}