import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ReviewCard from "./reviewCard";
import { useRef, useEffect } from "react";
import "../index.css";

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      name: "Michael",
      role: "Patient",
      message: "Amazing team and amazing treatment from the best doctor in the world.",
      image: "/assets/Shape.png",
    },
    {
      id: 2,
      name: "Lerato",
      role: "Patient",
      message: "The doctors were very attentive and caring. Highly recommend!",
      image: "/assets/Shape.png",
    },
    {
      id: 3,
      name: "James",
      role: "Patient",
      message: "I felt like family. The staff is wonderful.",
      image: "/assets/Shape.png",
    },
    {
      id: 4,
      name: "Amina",
      role: "Patient",
      message: "Quick service and very professional doctors.",
      image: "/assets/Shape.png",
    },
    {
      id: 5,
      name: "Sophia",
      role: "Patient",
      message: "The best hospital experience I've ever had.",
      image: "/assets/Shape.png",
    },
    {
      id: 6,
      name: "David",
      role: "Patient",
      message: "Doctors explained everything clearly. Thank you!",
      image: "/assets/Shape.png",
    },
    {
      id: 7,
      name: "Fatima",
      role: "Patient",
      message: "Very clean and modern facilities.",
      image: "/assets/Shape.png",
    },
    {
      id: 8,
      name: "John",
      role: "Patient",
      message: "I was treated with respect and kindness.",
      image: "/assets/Shape.png",
    },
    {
      id: 9,
      name: "Grace",
      role: "Patient",
      message: "The nurses were so helpful and friendly.",
      image: "/assets/Shape.png",
    },
    {
      id: 10,
      name: "Samuel",
      role: "Patient",
      message: "I recovered quickly thanks to the great care.",
      image: "/assets/Shape.png",
    },
    {
      id: 11,
      name: "Emily",
      role: "Patient",
      message: "The online appointment system is so convenient!",
      image: "/assets/Shape.png",
    },
    {
      id: 12,
      name: "Brian",
      role: "Patient",
      message: "Doctors and staff are very knowledgeable.",
      image: "/assets/Shape.png",
    },
    {
      id: 13,
      name: "Olivia",
      role: "Patient",
      message: "I felt safe and well cared for.",
      image: "/assets/Shape.png",
    },
    {
      id: 14,
      name: "Ethan",
      role: "Patient",
      message: "Great experience from start to finish.",
      image: "/assets/Shape.png",
    },
    {
      id: 15,
      name: "Zara",
      role: "Patient",
      message: "The doctors listened to all my concerns.",
      image: "/assets/Shape.png",
    },
    {
      id: 16,
      name: "Noah",
      role: "Patient",
      message: "I would recommend this hospital to everyone.",
      image: "/assets/Shape.png",
    },
    {
      id: 17,
      name: "Mia",
      role: "Patient",
      message: "Very efficient and friendly service.",
      image: "/assets/Shape.png",
    },
    {
      id: 18,
      name: "Lucas",
      role: "Patient",
      message: "The best care I have ever received.",
      image: "/assets/Shape.png",
    },
    {
      id: 19,
      name: "Layla",
      role: "Patient",
      message: "Doctors and nurses are top-notch!",
      image: "/assets/Shape.png",
    },
    {
      id: 20,
      name: "Aiden",
      role: "Patient",
      message: "Thank you for your excellent service!",
      image: "/assets/Shape.png",
    },
  ];

  const sliderRef = useRef();

  // Manual scroll
  const scrollByCards = (direction) => {
    const scrollAmount = sliderRef.current.offsetWidth;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section id="reviews" className="scrollbar-hide bg-[#ECF6FF] py-4 px-2 sm:px-6 lg:px-10 relative">
      <div className="scrollbar-hide flex flex-col items-center p-4 gap-2 w-full">
        <h1 className="text-[#234A6B] text-[28px] mb-1 font-bold text-center">
          Read feedback about our Services and wonderful team!
        </h1>
        <h3 className="text-[#757575] text-[15px] mb-2 text-center">
          We take care of our patients just like a family member. Read the testimonials from our patients.
        </h3>

        {/* Scroll Buttons */}
        <div className="flex justify-center gap-3 mb-2">
          <button
            onClick={() => scrollByCards("left")}
            className="bg-[#0086FF] hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollByCards("right")}
            className="bg-[#0086FF] hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Review Cards Scrollable Container */}
        <div
          ref={sliderRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 w-full justify-center"
        >
          {reviews.map((review) => (
            <div className="min-w-[220px] max-w-[260px] snap-start" key={review.id}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
