
import {
    CLEAR_TOLL_ERROR,
    CLEAR_TOLL_MESSAGE,
    LOADING_TOLL_DATA,
    SET_TOLL_DATA,
    SET_TOLL_ERROR,
    SET_TOLL_MESSAGE,
} from './toll.types'


const initialState = {
    loading: false,
    data: {},
    errors: null,
    message: null,
  };
export const tollReducer = (state = initialState, action)=> {

    switch (action.type) {
        case SET_TOLL_DATA:
            return {
                ...state,
                data: action.payload,
                loading: false,
            };
        
        
        case CLEAR_TOLL_ERROR:
            return {
                ...state,
                error: null,
                loading: false,
            };

        
        
        case LOADING_TOLL_DATA:
            return {
                ...state,
                loading: true,
            };

        
        case SET_TOLL_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case SET_TOLL_MESSAGE:
            return {
                ...state,
                message: action.payload,
                loading: false,
            };
        case CLEAR_TOLL_MESSAGE:
            return {
                ...state,
                message: null,
                loading: false,
            };


        
        default:
            return state;
    }
}