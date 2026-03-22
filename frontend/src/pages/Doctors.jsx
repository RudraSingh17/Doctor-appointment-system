import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("")
  const [listening, setListening] = useState(false)

  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

 
  const startVoiceSearch = () => {
    if (!recognition) {
      alert("Voice search is not supported on this browser.");
      return;
    }

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setSearchTerm(spokenText);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
  };

  
  const applyFilter = () => {
    let filtered = doctors;
    if (speciality) {
      filtered = filtered.filter(doc => doc.speciality === speciality);
    }

    
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    
    if (sortBy === "feesLow") {
      filtered = [...filtered].sort((a, b) => a.fees - b.fees);
    }
    if (sortBy === "feesHigh") {
      filtered = [...filtered].sort((a, b) => b.fees - a.fees);
    }
    if (sortBy === "expHigh") {
      filtered = [...filtered].sort((a, b) => b.experience - a.experience);
    }

    setFilterDoc(filtered);
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality, searchTerm, sortBy])

  return (
    <div>
      <p className='text-gray-600'>Browse through the doctors specialist.</p>

      {/* ✅ SEARCH + VOICE + SORT BAR */}
      <div className='flex flex-col sm:flex-row items-center gap-3 mt-5'>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search doctor by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full sm:w-64"
        />

        {/* Voice Button */}
        <button
          onClick={startVoiceSearch}
          className="px-3 py-2 border rounded-md">
          {listening ? "🎤 Listening..." : "🎤 Voice"}
        </button>

        
        <select
          className="border p-2 rounded w-full sm:w-48"
          onChange={(e) => setSortBy(e.target.value)}>

          <option value="">Sort By</option>
          <option value="feesLow">Fees: Low to High</option>
          <option value="feesHigh">Fees: High to Low</option>
          <option value="expHigh">Experience: High to Low</option>
        </select>
      </div>

      
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
        >
          Filters
        </button>

        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"].map((spec) => (
            <p
              key={spec}
              onClick={() => speciality === spec ? navigate('/doctors') : navigate(`/doctors/${spec}`)}
              className={`pl-3 py-1.5 pr-16 border rounded cursor-pointer ${speciality === spec ? 'bg-indigo-100 text-black' : ''}`}
            >
              {spec}
            </p>
          ))}
        </div>

        
        <div className='w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6'>
          {filterDoc.map((item, index) => (
            <div
              onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }}
              className='border border-indigo-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500'
              key={index}
            >
              <img className='bg-indigo-50' src={item.image} alt="" />
              <div className='p-4'>
                <div className='flex items-center gap-2 text-sm text-green-500'>
                  <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                </div>
                <p className='text-neutral-800 text-lg font-medium whitespace-normal break-words'>
                  {item.name}
                </p>
                <p className='text-zinc-600 text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Doctors
