import reducer from "reducers/application"
import { SET_APPLICATION_DATA, SET_DAY, SET_INTERVIEW } from "reducers/application";

describe("reducer", () => {
  it("throws an error with an unsupported type", () => {
    const emptyState = {};
    const dispatch = {type: null};
    expect(() => reducer(emptyState, dispatch)).toThrowError(`Tried to reduce with unsupported action type:`)
  })
});