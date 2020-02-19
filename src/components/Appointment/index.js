import React from "react";
import "./styles.scss";
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode"

  
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDITING = "EDITING";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


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
      .catch(() => transition(ERROR_SAVE, true));
  }

  function cancel(){
    transition(DELETING, true)
    props.cancelInterview(props.id)
      .then(() => { console.log('hi'); return transition(EMPTY);})
      .catch(() => transition(ERROR_DELETE, true));
  }

  return (
      <article className="appointment">
        <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === CREATE && <Form interviewers={props.interviewers} onCancel={back} onSave={save} />}
        {mode === SHOW && <Show  student={props.interview.student} 
                                 interviewer={props.interview.interviewer} 
                                 onDelete={() => transition(CONFIRM)}
                                 onEdit={() => transition(EDITING)}/>}
        {mode === EDITING && <Form interviewer={props.interview.interviewer.id} name={props.interview.student} interviewers={props.interviewers} onSave={save} onCancel={back}/>}
        {mode === SAVING && <Status  message={SAVING}/>}
        {mode === DELETING && <Status  message={DELETING}/>}
        {mode === ERROR_SAVE && <Error  message={"Server error while saving. Please try again"} onClose={back}/>}
        {mode === ERROR_DELETE && <Error  message="Server error while deleting. Please try again" onClose={back}/>}
        {mode === CONFIRM && <Confirm  onCancel={back} onConfirm={cancel} message="Are you sure you want to delete?" />}
      </article>
  )
}