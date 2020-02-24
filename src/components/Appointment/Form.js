import React, { useState } from "react";
import Button from "../Button";
import InterviewerList from "../InterviewerList";

function reset(setName, setInterviewer){
  setName("");
  setInterviewer(null);
}

export default function Form(props){
  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  function cancel(){
    props.onCancel();
    reset(setName, setInterviewer);
  }

  function validate(){
    if(name === ""){
      setError("Student name cannot be blank")
      return; 
    }
    setError("");
    props.onSave(name, interviewer)
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">  
        <input
          className="appointment__create-input text--semi-bold"
          name="name"
          type="text"
          placeholder="Enter Student Name"
          onChange={event => setName(event.target.value)}
          value={name}
          data-testid="student-name-input"
        />
        <section className="appointment__validation">{error}</section>
        <InterviewerList interviewers={props.interviewers} 
                        value={interviewer} 
                        onChange={id => setInterviewer(id)} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger 
                  onClick={cancel}> Cancel
          </Button>

          <Button confirm 
                  onClick={validate}>Save
          </Button>
        </section>
      </section>
    </main>
  );
}