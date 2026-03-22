import React, { useContext,useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {

    const {docId} = useParams()
    const {doctors,currencySymbol } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo,setDocInfo] = useState(null)
    const [docSlots,setDocSlots] = useState([])
    const [slotIndex,setSlotIndex] = useState(0)
    const [slotTime,setSlotTime] = useState('')

    // ⭐ NEW: payment state
    const [paymentOption, setPaymentOption] = useState("half")

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
        
    }

    const getAvailableSlots= async () => {
       setDocSlots([])

       // getting current date
       let today= new Date()

       for(let i=0; i<7; i++){
        // getting date with index
        let currentDate = new Date(today)
        currentDate.setDate(today.getDate()+i)

        // setting end time of the date with index
        let endTime = new Date()
        endTime.setDate(today.getDate() + i)
        endTime.setHours(21,0,0,0)

        // setting hours
        if(today.getDate() === currentDate.getDate()){
            currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
            currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
        }else{
            currentDate.setHours(10)
            currentDate.setMinutes(0)
        }

        let timeSlots=[]

        while(currentDate < endTime){
            let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit',minute: '2-digit'})

            // add slot to array
            timeSlots.push({
                datetime: new Date(currentDate),
                time: formattedTime
            })

            // Increment current time by 30 minutes
            currentDate.setMinutes(currentDate.getMinutes() + 30)
        }

        setDocSlots(prev => ([...prev, timeSlots]))
       }
    }

    useEffect(()=>{
        fetchDocInfo()

    },[doctors,docId])

    useEffect(()=>{
      getAvailableSlots()
    },[docInfo] )
    
    useEffect(()=>{
      console.log(docSlots);
    },[])

    return docInfo && (
        <div>
            {/* -------- Doctor Details ----- */}
            
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    {/* --------- Doc Info : name, degree, experience ------- */}
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name}
                         <img  className='w-5'src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* ------- Doctor About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    <p className='text-gray-500 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/*-------- Booking Slots ------- */}
            <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
                <p>Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {
                      docSlots.length && docSlots.map((item, index) => (
                        <div 
                            onClick={()=> setSlotIndex(index)} 
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
                            key={index}
                        >
                           <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                           <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                      ))
                    }
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                       <p 
                         key={index}
                         onClick={()=>setSlotTime(item.time)} 
                         className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}>
                        {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>

                {/* ⭐⭐⭐ PAYMENT OPTIONS SECTION ⭐⭐⭐ */}
                <div className="mt-6 border p-4 rounded-lg">
                  <p className="font-semibold text-lg text-zinc-700">Choose Payment Option</p>

                  <div className="flex flex-col gap-3 mt-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="full"
                        checked={paymentOption === "full"}
                        onChange={(e) => setPaymentOption(e.target.value)}
                      />
                      Pay Full Amount (₹{docInfo.fees})
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="half"
                        checked={paymentOption === "half"}
                        onChange={(e) => setPaymentOption(e.target.value)}
                      />
                      Pay 50% Now (₹{docInfo.fees / 2})
                      <span className="text-sm text-zinc-500 ml-1">
                        Remaining ₹{docInfo.fees / 2} at clinic
                      </span>
                    </label>
                  </div>
                </div>
                {/* END PAYMENT OPTIONS */}

                {/* -------- Book Button with Logic -------- */}
                <button
                    onClick={() => {
                        if (!slotTime) {
                            alert("Please select a time slot before booking.");
                            return;
                        }

                        if (paymentOption === "half") {
                          alert(
                            `Paid ₹${docInfo.fees / 2}. Remaining ₹${docInfo.fees / 2} will be paid at clinic.`
                          );
                        } else {
                          alert(`Paid full amount ₹${docInfo.fees}. Appointment confirmed.`);
                        }
                    }}
                    className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 '
                >
                    {paymentOption === "half"
                      ? `Pay ₹${docInfo.fees / 2} & Book`
                      : `Pay ₹${docInfo.fees} & Book`}
                </button>

            </div>

            {/* Listing Related Doctors */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
          
        </div>
    )
}

export default Appointment
