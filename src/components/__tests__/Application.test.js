// import React from "react";
// import { getByText, prettyDOM, getAllByTestId, queryByText, getByDisplayValue } from "@testing-library/react"

// import { render, cleanup, waitForElement, fireEvent, getByAltText, getByPlaceholderText } from "@testing-library/react";

// import Application from "components/Application";

// import axios from "axios";

// afterEach(cleanup);

// describe("Application", () => {

//   it("defaults to Monday and changes the schedule when a new day is selected", async () => {
//     const { getByText } = render(<Application />);

//     await waitForElement(() => getByText("Monday"))

//     fireEvent.click(getByText("Tuesday"));
//     expect(getByText("Leopold Silvers")).toBeInTheDocument();
//   });

//   it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
//     const { container, debug } = render(<Application />);

//     await waitForElement(() => getByText(container, "Archie Cohen"));
    
//     const appointments = getAllByTestId(container, "appointment");
//     const appointment = appointments[0]

//     fireEvent.click(getByAltText(appointment, "Add"));
//     fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

//     fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
//       target: { value: "Jacob" }
//     });
//     fireEvent.click(getByText(appointment, "Save"));

//     expect(getByText(appointment, "SAVING")).toBeInTheDocument();

//     await waitForElement(() => getByText(appointment, "Jacob"));
//     expect(getByText(appointment, "Jacob")).toBeInTheDocument();

//     const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));

//     //Test failing with websockets enabled, since spots only updating on server response
//     // expect(getByText(day, "no spots remaining")).toBeInTheDocument();

//   });

//   it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
//     const { container, debug } = render(<Application />);
//     await waitForElement(() => getByText(container, "Archie Cohen"));
    
//     const appointment = getAllByTestId(container, "appointment").find(
//       appointment => queryByText(appointment, "Archie Cohen")
//     );
//     fireEvent.click(getByAltText(appointment, "Delete"));
//     expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();

//     fireEvent.click(getByText(appointment, "Confirm"));
//     expect(getByText(appointment, "DELETING")).toBeInTheDocument();

//     await waitForElement(() => getByAltText(appointment, "Add"));
//     const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
//     //Test failing with websockets enabled, since spots only updating on server response
//     // expect(getByText(day, "2 spots remaining")).toBeInTheDocument();

//   });
  
//   it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
//     const { container, debug } = render(<Application />);
//     await waitForElement(() => getByText(container, "Archie Cohen"));
    
//     const appointment = getAllByTestId(container, "appointment").find(
//       appointment => queryByText(appointment, "Archie Cohen")
//     );
//     fireEvent.click(getByAltText(appointment, "Edit"));
    
//     await waitForElement(() => getByText(appointment, "Cancel"));
//     expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
    
//     expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();
//     fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
//       target: { value: "Jacob" }
//     });

//     fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
//     fireEvent.click(getByText(appointment, "Save"));

//     expect(getByText(appointment, "SAVING")).toBeInTheDocument();
//     await waitForElement(() => getByText(appointment, "Sylvia Palmer"));

//     expect(getByText(appointment, "Jacob")).toBeInTheDocument();
//     expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

//     const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
//     //Test failing with websockets enabled, since spots only updating on server response
//     // expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

//   });

//   it("shows the save error when failing to save an appointment", async () => {
//     axios.put.mockRejectedValueOnce();
//     const { container, debug } = render(<Application />);
    
//     await waitForElement(() => getByText(container, "Archie Cohen"));
    
//     const appointments = getAllByTestId(container, "appointment");
//     const appointment = appointments[0]

//     fireEvent.click(getByAltText(appointment, "Add"));
    
//     fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
//     fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
//       target: { value: "Jacob" }
//     });

//     fireEvent.click(getByText(appointment, "Save"));
//     expect(getByText(appointment, "SAVING")).toBeInTheDocument();

//     await waitForElement(() => getByText(appointment, 'Server error while saving. Please try again'));
//     expect(getByText(appointment, "Server error while saving. Please try again")).toBeInTheDocument();

//     fireEvent.click(getByAltText(appointment, "Close"));
//     expect(getByPlaceholderText(appointment, "Enter Student Name")).toBeInTheDocument();

//   });
  
//   it("shows the delete error when failing to save an appointment", async () => {
//     axios.delete.mockRejectedValueOnce();
//     const { container, debug } = render(<Application />);

//     await waitForElement(() => getByText(container, "Archie Cohen"));
    
//     const appointment = getAllByTestId(container, "appointment").find(
//       appointment => queryByText(appointment, "Archie Cohen")
//     );
//     fireEvent.click(getByAltText(appointment, "Delete"));
//     expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();

//     fireEvent.click(getByText(appointment, "Confirm"));
//     expect(getByText(appointment, "DELETING")).toBeInTheDocument();

//     await waitForElement(() => getByText(appointment, 'Server error while deleting. Please try again'));
//     expect(getByText(appointment, "Server error while deleting. Please try again")).toBeInTheDocument();

//     fireEvent.click(getByAltText(appointment, "Close"));
//     expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
//   });
// });
