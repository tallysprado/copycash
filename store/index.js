import {createStore} from 'redux';

const INITIAL_STATE = {
    isLogged: false,
}

function token(state=INITIAL_STATE, action){
    switch(action.type){
        case 'LOGIN':
            return {...state, isLogged: action.title}
        default:
            return state 
    }
}

const store=createStore(token)


export default store
