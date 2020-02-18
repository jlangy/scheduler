export function getAppointmentsForDay(state, day){
  const currentDay = state.days.find(dayObj => dayObj.name === day);
  const daysAppointments = currentDay && currentDay.appointments.map(appointmentId => state.appointments[appointmentId]);
  return daysAppointments ? daysAppointments : [];
}