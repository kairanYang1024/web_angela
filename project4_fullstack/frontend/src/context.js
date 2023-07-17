import React, { createContext, useReducer } from "react";

export const Context = createContext();

//define the initial state for the app display flow
const initialState = {
    auth: false,
    user: null,
    token: null
}; //user defined in the backend, token is the acquired token after a successful login

//define the finite state machine for the app display flow
const reducer = (state, action) => {
    switch(action.type) {
        case "LOGIN":
            return {
                ...state,
                auth: true,
                user: action.payload.user,
                token: action.payload.token,
            }; //modify the fields based on action
        case "LOGOUT":
            return {
                ...state,
                auth: false,
                user: null,
            }; //modify the fields based on action
        default:
            return state; //no change
    }
}

const ContextProvider = ({children}) => { //children is plural
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        //define value for the context provider be the pair of state & hook function
        <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
    )
}

export default ContextProvider;