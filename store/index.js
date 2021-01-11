import {createStore} from 'redux';

const INITIAL_STATE = {
    token: '',
}

function token(state=INITIAL_STATE, action){
    switch(action.type){
        case 'TOKEN':
            return {...state, token: action.title}
        default:
            return state 
    }
}

const store=createStore(token)


export default store
