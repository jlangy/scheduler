export function getAppointmentsForDay(state, day){
  const currentDay = state.days.find(dayObj => dayObj.name === day);
  const daysAppointments = currentDay && currentDay.appointments.map(appointmentId => state.appointments[appointmentId]);
  return daysAppointments ? daysAppointments : [];
}

export function getInterview(state, interview){
  if(!interview){
    return null;
  }
  const interviewer = state.interviewers[interview.interviewer];
  return {student: interview["student"], interviewer}
}

export function getInterviewersForDay(state, day){
  const currentDay = state.days.find(dayObj => dayObj.name === day);
  const daysInterviews = currentDay && currentDay.interviewers.map(interviewerId => state.interviewers[interviewerId]);
  return daysInterviews ? daysInterviews : [];
}