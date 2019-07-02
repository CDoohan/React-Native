import * as ActionTypes from './ActionTypes'

export const promotions = (state = {
    isLoading: true,
    errMess : null,
    promos : []
}, action) => {

    switch(action.type){

        case ActionTypes.ADD_PROMOS:
            return {...state, isLoading: false, errMess: null, promos: action.payload}

        case ActionTypes.PROMOS_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, promos: []}
        
        case ActionTypes.PROMOS_LOADING:
            return {...state, isLoading: true, errMess: null, promos: []}

        default:
            return state

    }

}