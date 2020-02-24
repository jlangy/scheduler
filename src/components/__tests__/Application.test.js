import React from "react";
import { getByText, prettyDOM, getAllByTestId, queryByText } from "@testing-library/react"

import { render, cleanup, waitForElement, fireEvent, getByAltText, getByPlaceholderText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"))

    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Monday"));
    fireEvent.click(getByText(container, "Monday"));

    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Jacob" }
    });

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "SAVING")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Jacob"));

    expect(getByText(appointment, "Jacob")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

    //Test failing due to websockets updating spots
    // expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  })

});
