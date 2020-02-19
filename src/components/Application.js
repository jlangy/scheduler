import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import axios from "axios";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors"

export default function Application(props) {
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

  const interviewers = getInterviewersForDay(state, state.day)                       

  const bookedAppointments = getAppointmentsForDay(state, state.day)
                        .map(appointment => (
                          <Appointment 
                            key={appointment.id} 
                            id={appointment.id}
                            time={appointment.time}
                            interview={getInterview(state, appointment.interview)}
                            interviewers={interviewers}
                            bookInterview={bookInterview}
                          />));
  
  function bookInterview(id, interview){

    
  }
  

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {bookedAppointments}
        <Appointment time='5pm' key='last' />
      </section>
    </main>
  );
}
