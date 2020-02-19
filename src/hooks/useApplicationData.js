import {useState, useEffect} from "react";
import axios from "axios";

export default function useApplicationData(){

  const [state, setState] = useState({days: [], appointments: {}, interviewers: {}, day: ""});
  
  useEffect(() => {
    const daysPromise = axios.get("/api/days");
    const appointmentsPromise = axios.get("/api/appointments");
    const interviewersPromise = axios.get("/api/interviewers");
    Promise.all([daysPromise, appointmentsPromise, interviewersPromise])
    .then(([daysResponse, appointmentsResponse, interviewersResponse]) => {
      setState({day: "", 
      days: daysResponse.data, 
      appointments: appointmentsResponse.data, 
      interviewers:interviewersResponse.data});
    });
  }, [])
  
  const setDay = day => setState({...state, day});

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
      .then(res => setState({...state, appointments}))
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
      .then(res => setState({...state, appointments}))  
  }

  return {state, setDay, bookInterview, cancelInterview}
}