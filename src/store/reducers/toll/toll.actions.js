
import axios from "axios";

import {
    CLEAR_TOLL_ERROR,
    LOADING_TOLL_DATA,
    SET_TOLL_DATA,
    SET_TOLL_ERROR,
    SET_TOLL_MESSAGE,
} from './toll.types'


const setAuthorizationHeader = () => {
    if(localStorage.getItem('access_token') && localStorage.getItem('access_token') != '') {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('access_token');

    }
};

export const getAllTolls = (sort_by = 'created_at', page = 1, perPage = 100) => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_TOLL_DATA })
    axios.get('toll?per_page='+perPage+'&page='+page+'&sort_by='+sort_by)
    .then((res)=>{

        dispatch({ type: CLEAR_TOLL_ERROR})
        dispatch({
            type: SET_TOLL_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {

        dispatch({
            type: SET_TOLL_ERROR,
            payload: error.response.data
        })
    })

}

export const setNewToll = (newData, user_id, navigate) => (dispatch) => {

    dispatch({ type: LOADING_TOLL_DATA })
    axios.post('users/'+user_id+'/toll', newData)
    .then((res)=>{

        dispatch({ type: CLEAR_TOLL_ERROR})
        dispatch({
            type: SET_TOLL_MESSAGE,
            payload: res.data.message
        })

        navigate('/gecis-ucre')

    })
    .catch((error)=> {
        dispatch({
            type: SET_TOLL_ERROR,
            payload: error.response.data
        })
    })

}

export const updateToll = (newData, user_id, toll_id) => (dispatch) => {

    dispatch({ type: LOADING_TOLL_DATA })
    axios.post('users/'+user_id+'/toll/'+toll_id, newData)
    .then((res)=>{

        dispatch({ type: CLEAR_TOLL_ERROR})
        dispatch({
            type: SET_TOLL_MESSAGE,
            payload: res.data.message
        })
        dispatch(getAllTolls())

    })
    .catch((error)=> {
        dispatch({
            type: SET_TOLL_ERROR,
            payload: error.response.data
        })
    })

}

export const searchTollsData = (data,sort_by = 'created_at', page = 1, perPage = 100, payStatus = "all") => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_TOLL_DATA })
    axios.post('toll-search?per_page='+perPage+'&page='+page+'&sort_by='+sort_by, data)
    .then((res)=>{

        dispatch({ type: CLEAR_TOLL_ERROR})
        dispatch({
            type: SET_TOLL_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {

        dispatch({
            type: SET_TOLL_ERROR,
            payload: error.response.data
        })
    })

}

export const filterTollData = (data,sort_by = 'created_at', page = 1, perPage = 100, payStatus = "all") => (dispatch) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_TOLL_DATA })
    axios.post('toll-filter?per_page='+perPage+'&page='+page+'&sort_by='+sort_by, data)
    .then((res)=>{

        dispatch({ type: CLEAR_TOLL_ERROR})
        dispatch({
            type: SET_TOLL_DATA,
            payload: res.data
        })


    })
    .catch((error)=> {

        dispatch({
            type: SET_TOLL_ERROR,
            payload: error.response.data
        })
    })

}

export const deleteToll = (user_id, toll_id) => (dispatch) => new Promise((successFun,errorFun) => {

    setAuthorizationHeader()
    dispatch({ type: LOADING_TOLL_DATA })
    axios.delete('users/'+parseInt(user_id)+'/delete/toll/'+parseInt(toll_id))
    .then((res)=>{
        successFun(res)

        // dispatch({ type: CLEAR_TOLL_ERROR})
        // dispatch({
        //     type: SET_TOLL_MESSAGE,
        //     payload: res.data
        // })
        dispatch(getAllTolls())

    })
    .catch(errorFun)
    // .catch((error)=> {

    //     dispatch({
    //         type: SET_PENALTY_ERROR,
    //         payload: error.response.data
    //     })
    // })

})

export const setFilteredTollData = (data) => (dispatch) => {
    dispatch({ type: LOADING_TOLL_DATA })
    dispatch({
        type: SET_TOLL_DATA,
        payload: data
    })
}

export const deleteMultipleToll = (user_id, toll_ids) => new Promise((successFun, errorFun) => {


    setAuthorizationHeader()
    axios.post('users/toll/delete', {
        ids: toll_ids
    })
    .then((res)=>{
        successFun(res)
    })
    .catch(errorFun)
})
