import {useReducer, useEffect} from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const ADD_SPOT = "ADD_SPOT";
const REMOVE_SPOT = "REMOVE_SPOT";


export default function useApplicationData(){
  const reducer = (state, action) => {
    switch(action.type){
      case SET_DAY:
        return {...state, ...action.value}
  
      case SET_APPLICATION_DATA:
        return {...state, ...action.value}
  
      case SET_INTERVIEW: {
  
        const appointment = {
          ...state.appointments[action.value.id],
          interview: action.value.interview
        };
            
        const appointments = {
          ...state.appointments,
          [action.value.id]: appointment
        };
  
        return {...state, appointments}
      }
  
      case ADD_SPOT: {
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

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:8001");
    
    webSocket.onmessage = function(event){
      const msg = JSON.parse(event.data);

      if(msg.type === "SET_INTERVIEW"){
        dispatch({type: SET_INTERVIEW, value: {interview: msg.interview, id:msg.id}})
      }
    }
  }, [])
  
  const setDay = day => dispatch({type: SET_DAY, value: {day}});

  function bookInterview(id, interview){   
    
    return axios.put(`/api/appointments/${id}`, {
      interview
    })
      .then(res => {
        if(!state.appointments[id].interview){
          dispatch({type: REMOVE_SPOT})
        }
        dispatch({type: SET_INTERVIEW, value: {id, interview}})
      });
  }
  
  function cancelInterview(id){   

    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
        dispatch({type: SET_INTERVIEW, value: {id, interview:null}})
        dispatch({type: ADD_SPOT});
      });  
  }
  return {state, setDay, bookInterview, cancelInterview}
}