import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer from "reducers/application"
import { SET_APPLICATION_DATA, SET_DAY, SET_INTERVIEW, SET_ID } from "reducers/application";

export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, { days: [], appointments: {}, interviewers: {}, day: "Monday", clientId:null});

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8001');

    setInterval(() => {
      webSocket.send('ping');
    }, 10000);

    webSocket.onmessage = function (event) {

      const msg = JSON.parse(event.data);

      if(msg.type === "SET_ID"){
        dispatch({type:SET_ID, value: msg.id});
      }

      if (msg.type === "SET_INTERVIEW") {
        dispatch({ type: SET_INTERVIEW, value: { interview: msg.interview, id: msg.id, clientId: msg.clientId } })
      }
    }
  }, [])

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
            interviewers: interviewersResponse.data
          }
        });
      });
  }, []);

  const setDay = day => dispatch({ type: SET_DAY, value: { day } });

  function bookInterview(id, interview) {

    return axios.put(`/api/appointments/${id}`, {
      interview, 
      clientId: state.clientId
    })
      .then(res => {
        dispatch({ type: SET_INTERVIEW, value: { id, interview} })
      });
  }

  function cancelInterview(id) {

    return axios.delete(`/api/appointments/${id}`, {data: {clientId: state.clientId}})
      .then(res => {
        dispatch({ type: SET_INTERVIEW, value: { id, interview: null} })
      });
  }
  return { state, setDay, bookInterview, cancelInterview }
}