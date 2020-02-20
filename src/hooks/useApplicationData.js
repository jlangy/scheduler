import {useReducer, useEffect} from "react";
import axios from "axios";

export default function useApplicationData(){
  
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const ADD_SPOT = "ADD_SPOT";
  const REMOVE_SPOT = "REMOVE_SPOT";

  const reducer = (state, action) => {
    switch(action.type){
      case SET_DAY:
        return {...state, ...action.value}
        case SET_APPLICATION_DATA:
          return {...state, ...action.value}
        case SET_INTERVIEW: {
          return {...state, ...action.value}
        }
        case ADD_SPOT: {
          //Increment spots for the day with current days name
          const updatedDays = state.days.map(day => day.name === state.day ? {...day, spots: day.spots + 1} : day);
          return {...state, days: updatedDays}
        }
        case REMOVE_SPOT: {
          const updatedDays = state.days.map(day => day.name === state.day ? {...day, spots: day.spots - 1} : day);
          return {...state, days: updatedDays}
        }
        default:
          throw new Error(
            `Tried to reduce with unsupported action type: ${action.type}`
          );
      }
    }

  const [state, dispatch] = useReducer(reducer, {days: [], appointments: {}, interviewers: {}, day: ""});

  
  useEffect(() => {
    const daysPromise = axios.get("/api/days");
    const appointmentsPromise = axios.get("/api/appointments");
    const interviewersPromise = axios.get("/api/interviewers");
    Promise.all([daysPromise, appointmentsPromise, interviewersPromise])
    .then(([daysResponse, appointmentsResponse, interviewersResponse]) => {
      dispatch({
        type: SET_APPLICATION_DATA, 
        value: {
          days: daysResponse.data, 
          appointments: appointmentsResponse.data, 
          interviewers:interviewersResponse.data}});
    });
  }, [])
  
  const setDay = day => dispatch({type: SET_DAY, value: {day}});

  function bookInterview(id, interview){

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    
    return axios.put(`/api/appointments/${id}`, {
      interview
    })
      .then(res => {

        if(!state.appointments[id].interview){
          dispatch({type: REMOVE_SPOT})
        }

        dispatch({type: SET_INTERVIEW, value: {appointments}})
      });
  }
  
  function cancelInterview(id){
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
          dispatch({type: ADD_SPOT});
          dispatch({type: SET_INTERVIEW, value: {appointments}})
        });  
  }
  return {state, setDay, bookInterview, cancelInterview}
}