import { createContext } from "react";
import { doctors } from "../assets/assets";

export const AppContext = createContext()

const AppContextProvider = (props) => {

  const currencySymbol = '₹'

  // ✅ Add Prescriptions Here (Frontend Only Dummy Data)
  const prescriptions = [
  {
    id: 1,
    appointmentId: 101,
    doctorName: "Dr. Richard James",
    date: "2025-11-25",
    medicine: "Paracetamol 500mg",
    dosage: "1-0-1",
    notes: "Drink warm water and take rest."
  },
  {
    id: 2,
    appointmentId: 102,
    doctorName: "Dr. Emily Larson",
    date: "2025-11-25",
    medicine: "Folic Acid 5mg",
    dosage: "1-0-0",
    notes: "Stay hydrated and avoid heavy physical work."
  },
  {
    id: 3,
    appointmentId: 103,
    doctorName: "Dr. Sarah Patel",
    date: "2025-11-25",
    medicine: "Cetirizine 10mg",
    dosage: "0-0-1",
    notes: "Avoid dust and use moisturizer daily."
  },
  {
    id: 4,
    appointmentId: 104,
    doctorName: "Dr. Christopher Lee",
    date: "2025-11-25",
    medicine: "Zincovit",
    dosage: "1-0-0",
    notes: "Maintain a balanced diet and proper sleep."
  }
];


  const value = {
    doctors,
    currencySymbol,
    prescriptions      // 👈 Add it in value object
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}

export default AppContextProvider