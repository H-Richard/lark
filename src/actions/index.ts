export const updateCaretPos: (arg1: Number) => any = (newPos: Number) => {
    return {
        type: "UPDATE_CARET_POS",
        payload: { newPos }
    };
}
