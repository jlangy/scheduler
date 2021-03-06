export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";
export const SET_ID = "SET_ID";

export default function reducer(state, action){
  switch (action.type) {
    case SET_DAY:
      return { ...state, ...action.value }

    case SET_APPLICATION_DATA:
      return { ...state, ...action.value }

    case SET_ID:
      return {...state, clientId: action.value}

    case SET_INTERVIEW: {
      const { id, interview, clientId } = action.value;

      /*If the id from server matches users id,
        Skip since state had been already updated locally
      */
      if(clientId === state.clientId){
        return state;
      }

      //Handle updating spots
      let newDays = state.days;

      //null interview incoming -> one more spot available
      //null appointment interview in state -> something being booked, one fewer spots
      if (interview === null) {
        newDays = state.days.map(day => day.appointments.includes(id) ? { ...day, spots: day.spots + 1 } : day);
      } else if (state.appointments[id].interview === null) {
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
