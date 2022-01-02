import * as React from "react";
import * as actions from "./actions";
import * as context from "./contexts";
import moment from "moment";

const initialState = {
    logs: [],
}

function reducer(state, action) {
    switch(action.type) {
        case actions.ADD_LOG:
            let _logs = state.logs;
            _logs.push(action.payload);
            return {...state, logs: _logs}
        case actions.RESET_LOG:
            return {...state, logs: []}
        default:
            return state;
    }
}

export const CbnLogsContext = React.createContext(context.LOGS_CONTEXT);

export default function LogsProvider({children}) {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const value = {
        logs: state.logs,
        addLog: (msg) => {
            dispatch({type: actions.ADD_LOG, payload: createMsg(msg, "INFO")});
        },
        addWarn: (msg) => {
            dispatch({type: actions.ADD_LOG, payload: createMsg(msg, "WARN")});
        },
        addError: (msg) =>{
            dispatch({type: actions.ADD_LOG, payload: createMsg(msg, "ERR")});
        },
        resetLogs: () => {
            dispatch({type: actions.RESET_LOG})
        }
    }
    return <CbnLogsContext.Provider value={value}>{children}</CbnLogsContext.Provider>
}

function createMsg(msg, type) {
    let currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let msgWithTime;
    if(type === undefined || type === null || type === 'INFO') {
        msgWithTime = currentTime + " : " + msg;
    } else {
        msgWithTime =  currentTime + " : " + `(${type}) ` + msg;
    }
    return msgWithTime;
}