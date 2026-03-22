import React, { useState } from "react";
import MyAppointments from "../pages/MyAppointments";
import MyProfile from "../pages/MyProfile";


const PatientDashboard = () => {
  const [tab, setTab] = useState("appointments");

  return (
    <div className="p-6">

      {/* TAB BUTTONS */}
      <div className="flex gap-4 border-b pb-3 mb-4">
        <button
          className={tab === "appointments" ? "font-bold" : ""}
          onClick={() => setTab("appointments")}
        >
          My Appointments
        </button>

        <button
          className={tab === "profile" ? "font-bold" : ""}
          onClick={() => setTab("profile")}
        >
          My Profile
        </button>
      </div>

      {/* ✅ STEP 4 — LOAD COMPONENTS BASED ON TAB */}
      {tab === "appointments" && <MyAppointments />}
      {tab === "profile" && <MyProfile />}

    </div>
  );
};

export default PatientDashboard;
