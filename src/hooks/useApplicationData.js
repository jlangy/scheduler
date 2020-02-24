import { useReducer, useEffect } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return { ...state, ...action.value }

    case SET_APPLICATION_DATA:
      return { ...state, ...action.value }

    case SET_INTERVIEW: {
      //updateSpots only true from websocket calls, to prevent double updating
      const { id, interview, updateSpots } = action.value;

      //Handle updating spots
      let newDays = state.days;

      //null interview incoming -> one more spot available
      //null appointment interview in state -> something being booked, one fewer spots
      if (updateSpots && interview === null) {
        newDays = state.days.map(day => day.appointments.includes(id) ? { ...day, spots: day.spots + 1 } : day);
      } else if (updateSpots && state.appointments[id].interview === null) {
        newDays = state.days.map(day => day.appointments.includes(id) ? { ...day, spots: day.spots - 1 } : day);
      }

      //build new appoitnments object
      const appointment = {
        ...state.appointments[id],
        interview: interview
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      return { ...state, appointments, days: newDays }
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}


export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, { days: [], appointments: {}, interviewers: {}, day: "" });

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
  }, [])

  useEffect(() => {
    // const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    const webSocket = new WebSocket('ws://localhost:8001');

    webSocket.onmessage = function (event) {
      const msg = JSON.parse(event.data);

      if (msg.type === "SET_INTERVIEW") {
        //update spots in the socket connection
        dispatch({ type: SET_INTERVIEW, value: { interview: msg.interview, id: msg.id, updateSpots: true } })
      }
    }
  }, [])

  const setDay = day => dispatch({ type: SET_DAY, value: { day } });

  function bookInterview(id, interview) {

    return axios.put(`/api/appointments/${id}`, {
      interview
    })
      .then(res => {
        dispatch({ type: SET_INTERVIEW, value: { id, interview } })
      });
  }

  function cancelInterview(id) {

    return axios.delete(`/api/appointments/${id}`)
      .then(res => {
        dispatch({ type: SET_INTERVIEW, value: { id, interview: null } })
      });
  }
  return { state, setDay, bookInterview, cancelInterview }
}