import { useState } from "react";
import { Link } from "react-router-dom";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
     
      console.log("Form submitted:", formData);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
      setTimeout(() => setShowModal(false), 2000);
    }
  };

    return(

 <section className=" bg-[#FFFFFF]  px-4 py-8 lg:py-20" id="integrity">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8  items-center">

        <div className="grid grid-cols-2 gap-3" id="Images">
<div className="ml-4 lg:ml-16 mb-6">
        <img
            src="/assets/image__1_-removebg-preview (1).png"
            alt="Our values"
            className="rounded-3xl shadow-md w-60 h-70"
          />
           <img
            src="/assets/image-removebg-preview.png"
            alt="Our values"
            className="rounded-3xl shadow-md w-60 h-70 mt-4"
          />

          </div >
          <div className="mr-4 lg:mr-14 mt-6 lg:mt-16 pl-6" >
           <img
            src= "/assets/image__3_-removebg-preview.png"
            alt="Our values"
            className="rounded-3xl shadow-md w-60 h-70 "
          />
           <img
            src="/assets/image__2_-removebg-preview.png"
            alt="Our values"
            className="rounded-3xl shadow-md w-60 h-70 mt-4"
          /> 
          </div>
          </div> 
          <div id="right text" className="  flex-1 mr-18">
<h3 className="text-[#0086FF] h-full text-[18px] font-semibold" >Integrity</h3>
<h1  className="text-[#234A6B] text-[30px] font-bold">Our Stellar Values</h1>

<p className="text-[#757575] ">
  The cornerstone of our establishment is ‘Making the benefits of exceptional medical services reach the people without discrimination.’
  <br />
  <br />
  At DocSona, we are dedicated to connecting patients and doctors seamlessly through our digital platform. Our mission is to ensure that every patient can easily access the right medical professional, receive timely care, and manage their health records efficiently. We believe in transparency, compassion, and innovation—empowering both patients and healthcare providers to communicate, collaborate, and achieve the best health outcomes together.
  <br />
  <br />
  Whether you are seeking a consultation, a second opinion, or ongoing care, our platform bridges the gap between you and trusted medical experts. Join us in building a healthier, more connected community.
</p>

 <Link to="/contact" className="text-[#FFFFFF] bg-[#0086FF] px-5 py-2 rounded mt-8 inline-block text-center hover:bg-blue-700 transition">Contact Us</Link>
     </div>
     </div>
  {/* Modal for contact form*/}


      </section>

    )
}