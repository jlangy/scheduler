import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import "components/Application.scss";
import Appointment from "components/Appointment";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors"

export default function Application(props) {
  const [state, setState] = useState({days: [], appointments: {}, day: ""});

  useEffect(() => {
    const daysPromise = axios.get("/api/days")
    const appointmentsPromise = axios.get("/api/appointments")
    Promise.all([daysPromise, appointmentsPromise])
      .then(([daysResponse, appointmentsResponse]) => setState({day: "", days: daysResponse.data, appointments: appointmentsResponse.data}));
  }, [])

  const setDay = day => setState({...state, day});

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
        {getAppointmentsForDay(state, state.day).map(appointment => <Appointment key={appointment.id} {...appointment} />)}
        <Appointment time='5pm' key='last' />
      </section>
    </main>
  );
}
