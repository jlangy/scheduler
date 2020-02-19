import React from "react";
import "./styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import useVisualMode from "hooks/useVisualMode"

  
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";

export default function Appointment(props){
  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer){
    const interview = {
      student:name,
      interviewer
    }
    transition(SAVING)
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
  }

  function cancel(){
    transition(DELETING)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY));
  }

  return (
      <article className="appointment">
        <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === CREATE && <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save} />}
        {mode === SHOW && <Show  student={props.interview.student} interviewer={props.interview.interviewer} onDelete={cancel}/>}
        {mode === SAVING && <Status  message={SAVING}/>}
        {mode === DELETING && <Status  message={DELETING}/>}
      </article>
  )
}