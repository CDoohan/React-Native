import * as ActionTypes from './ActionTypes';

// Um Reducer possui 2 parametros, um state e outro action
// o state é um objeto que possui as propriedades desse state, como isLoading, mensagens de erro e conteudo
// action possui o valor da chamada vinda do servidor
export const comments = (state = {
    errMess: null,
    comments: []
}, action) => {

    switch(action.type){

        case ActionTypes.ADD_COMMENTS:
            return { ...state, errMess: null, comments: action.payload }
        
        case ActionTypes.COMMENTS_FAILED:
            return { ...state, errMess: action.payload, comments: [] }

        default:
            return state;

    }

}