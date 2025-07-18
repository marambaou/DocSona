import { useState } from "react";

export default function Integrity() {
 const [showModal, setShowModal] = useState(false);

     
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
 {/* form validation */}
    const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to send');

    console.log('Message sent:', data.message);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setErrors({});
    setTimeout(() => setShowModal(false), 2000);
  } catch (err) {
    setErrors({ form: err.message });
    console.error(err.message);
  
}

  };
    return(

 <section className=" bg-[#FFFFFF]  px-4 py-8 lg:py-20" id="integrity">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8  items-center">

        <div className="grid grid-cols-2 gap-3" id="Images">
<div className="ml-4 lg:ml-16 mb-6">
        <img
            src="/Frontend/assets/image__1_-removebg-preview (1).png"
            alt="Our values"
            className="rounded-3xl shadow-md w-60 h-70"
          />
           <img
            src="/Frontend/assets/image-removebg-preview.png"
            alt="Our values"
            className="rounded-3xl shadow-md w-60 h-70 mt-4"
          />

          </div >
          <div className="mr-4 lg:mr-14 mt-6 lg:mt-16 pl-6" >
           <img
            src= "/Frontend/assets/image__3_-removebg-preview.png"
            alt="Our values"
            className="rounded-3xl shadow-md w-60 h-70 "
          />
           <img
            src="/Frontend/assets/image__2_-removebg-preview.png"
            alt="Our values"
            className="rounded-3xl shadow-md w-60 h-70 mt-4"
          /> 
          </div>
          </div> 
          <div id="right text" className="  flex-1 mr-18">
<h3 className="text-[#0086FF] h-full text-[18px] font-semibold" >Integrity</h3>
<h1  className="text-[#234A6B] text-[30px] font-bold">Our Stellar Values</h1>

<p  className="text-[#757575] ">The cornerstone of our establishment is ‘Making the
 benefits of exceptional medical services reach the people
 without Discrimination.’ We strive to live up to this
 philosophy through our stellar values, that are the pillars
 of every service that we offer under the banner of our
 prestigious hospital</p>

 <button  onClick={() => setShowModal(true)} className="text-[#FFFFFF] bg-[#0086FF] items-center justify-center px-6 py-2 rounded mt-8 ">Contact Us</button>
     </div>
     </div>
   {/* Modal for contact form*/}
      {showModal && (
        <div className="fixed inset-0 bg-[#757575] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-[#234A6B] mb-4">Contact Us</h2>

 {/* form*/}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

                <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 p-2 rounded"
                 value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 p-2 rounded"
                 value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
               </div>

               <div>
              <textarea
                placeholder="Your Message"
                className="w-full border border-gray-300 p-2 rounded h-24"
                 value={formData.message}
      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
 {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
             </div>

               {isSubmitted && (
    <p className="text-green-600 text-sm">Message sent! We'll get back to you soon.</p>
  )}
              <button
                type="submit"
                className="bg-[#0086FF] text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Send Message
              </button>
            </form>


          </div>
        </div>

   )}



      </section>

    )
}