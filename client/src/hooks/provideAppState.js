import React, { useContext, useReducer, useMemo } from "react";
import { actionTypes } from "../constants/constants";

const AppStateContext = React.createContext();
export const useAppState = () => useContext(AppStateContext);

const initialAppState = {
    activeCommunity: null,
    activeRoom: null,
    activeModal: null
}
  
const AppStateReducer = (state, action) =>{
    switch(action.type){
        case actionTypes.SET_ACTIVE_COMMUNITY:
            return {...state, activeCommunity: action.payload, activeRoom: null}
        case actionTypes.SET_ACTIVE_ROOM:
            return {...state, activeRoom: action.payload}
        case actionTypes.SET_ACTIVE_MODAL:
            return {...state, activeModal: action.payload}
        default:
            throw new Error();
    }
}

export const ProvideAppState = ({children}) =>{
    const appState = useProvideAppState();
    return(
        <AppStateContext.Provider value={appState}>
            {children}
        </AppStateContext.Provider>
    )
}

const useProvideAppState = () => {
    const [appState, appDispatch] = useReducer(AppStateReducer, initialAppState);

    const appStateContextValue = useMemo(() => {
        return { appState, appDispatch };
    }, [appState, appDispatch]);

    return appStateContextValue;
}