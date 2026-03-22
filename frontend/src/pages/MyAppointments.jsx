import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import jsPDF from "jspdf";

const MyAppointments = () => {

  const { doctors, prescriptions } = useContext(AppContext)
  const [openPrescription, setOpenPrescription] = useState(null)

  // Helper → Get prescription by appointmentId
  const getPrescription = (appointmentId) => {
    return prescriptions.find(p => p.appointmentId === appointmentId)
  }
  const downloadPDF = (data) => {
  const doc = new jsPDF();
  

  doc.setFontSize(18);
  doc.text("Prescription Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`Doctor: ${data.doctorName}`, 14, 40);
  doc.text(`Date: ${data.date}`, 14, 50);
  doc.text(`Medicine: ${data.medicine}`, 14, 60);
  doc.text(`Dosage: ${data.dosage}`, 14, 70);

  doc.text("Notes:", 14, 85);
  doc.text(data.notes, 14, 95, { maxWidth: 180 });

  doc.save("prescription.pdf");
};

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>

      <div>
        {doctors.slice(0, 4).map((item, index) => (
          <div
            className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b'
            key={index}
          >
            <div>
              <img className='w-32 bg-indigo-50' src={item.image} alt="" />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.name}</p>
              <p>{item.speciality}</p>

              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.address.line1}</p>
              <p className='text-xs'>{item.address.line2}</p>

              <p className='text-xs mt-1'>
                <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span>
                25 Nov 2025 | 11:30
              </p>
            </div>

            <div></div>

            <div className='flex flex-col gap-2 justify-end'>
              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                Pay Online
              </button>

              <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                Cancel appointment
              </button>

              {/* 📌 NEW BUTTON: View Prescription */}
              <button
                onClick={() => setOpenPrescription(getPrescription(index + 101))}

                className='text-sm text-blue-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-600 hover:text-white transition-all duration-300'
              >
                View Prescription
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 📌 PRESCRIPTION POPUP */}
      {/* 📌 PRESCRIPTION POPUP */}
{openPrescription && (
  <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center'>
    <div className='bg-white p-6 rounded-lg w-96 shadow-lg'>
      <h2 className='text-xl font-semibold mb-3'>Prescription</h2>

      <p><strong>Doctor:</strong> {openPrescription.doctorName}</p>
      <p><strong>Date:</strong> {openPrescription.date}</p>
      <p><strong>Medicine:</strong> {openPrescription.medicine}</p>
      <p><strong>Dosage:</strong> {openPrescription.dosage}</p>
      <p><strong>Notes:</strong> {openPrescription.notes}</p>

      {/* 📌 DOWNLOAD PDF BUTTON */}
      <button
        onClick={() => downloadPDF(openPrescription)}
        className='mt-4 w-full py-2 border rounded bg-green-600 text-white hover:bg-green-700 transition-all'
      >
        Download PDF
      </button>

      <button
        onClick={() => setOpenPrescription(null)}
        className='mt-2 w-full py-2 border rounded hover:bg-gray-200'
      >
        Close
      </button>
    </div>
  </div>
)}


  </div>
  )
}

export default MyAppointments
