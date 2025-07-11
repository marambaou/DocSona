import React from "react";
import dentistry from "../assets/icons/Pill.png";
import diagnosis from "../assets/icons/Vector.png";
import neurosurgery from "../assets/icons/cloudlike.png";
import cardiology from "../assets/icons/cardiology.png";
import pharmacy from "../assets/icons/pharmacy.png";
import staff from "../assets/icons/staff.png";
import dna from "../assets/icons/dna.png";
import ophthalmology from "../assets/icons/ophthalmology.png";
import aid from "../assets/icons/medicalaid.png";

const specialties = [
  { title: "Dentistry", description: "Get consultation form our Dentistry team", icon: dentistry },
  { title: "General Diagnosis", description: "Get consultation form our General Diagnosis team", icon: diagnosis, highlight: true },
  { title: "Neuro Surgery", description: "Get consultation form our Neuro Surgery team", icon: neurosurgery },
  { title: "Cardiology", description: "Get consultation form our Cardiology team", icon: cardiology },
  { title: "Pharmacy", description: "Get consultation form our Pharmacy team", icon: pharmacy },
  { title: "Trained Staff", description: "Get consultation form our Trained staff team", icon: staff },
  { title: "DNA Mapping", description: "Get consultation form our DNA Mapping team", icon: dna },
  { title: "Ophthalmology", description: "Get consultation form our Ophthalmology team", icon: ophthalmology },
  { title: "Medical Aid", description: "Get consultation form our Emergency Medical Aid Team", icon: aid },
];

const SpecialtySection = () => {
  return (
    <section className="py-20 px-6 md:px-16 bg-[#F8FAFC]">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-2">Our Specialty</h2>
        <p className="text-gray-500 text-sm">We provide the world-class services with the best medical team</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {specialties.map((item, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center text-center p-6 rounded-2xl shadow-sm ${
              item.highlight
                ? "bg-blue-500 text-white shadow-lg"
                : "bg-white text-gray-800 hover:shadow-md"
            } transition duration-300`}
          >
            <img src={item.icon} alt={item.title} className="w-12 h-12 mb-4" />
            <h3 className={`text-lg font-semibold ${item.highlight ? "text-white" : "text-[#1D3557]"}`}>
              {item.title}
            </h3>
            <p className="text-sm mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialtySection;
