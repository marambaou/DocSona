import { FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import ReviewCard from "./reviewCard";
import { useRef } from "react";
import "../index.css";

export default function Reviews(){
 {/* reviews array*/}
    const reviews = [
  {
    id: 1,
    name: "Michael",
    role: "Patient",
    message: "Amazing team and amazing treatment from the best doctor in the world.",
    image: "images/Shape.png",
  },
  {
    id: 2,
    name: "Lerato",
    role: "Patient",
    message: "Amazing team and amazing treatment from the best doctor in the world.",
    image: "images/Shape.png",
  },
  {
    id: 3,
    name: "James",
    role: "Patient",
    message: "Amazing team and amazing treatment from the best doctor in the world.",
    image: "images/Shape.png",
  },
  {
    id: 4,
    name: "Amina",
    role: "Patient",
    message: "Amazing team and amazing treatment from the best doctor in the world.",
    image: "images/Shape.png",
  },
   {
    id: 5,
    name: "Michael",
    role: "Patient",
    message: "Amazing team and amazing treatment from the best doctor in the world.",
    image: "images/Shape.png",
  },
  {
    id: 6,
    name: "Lerato",
    role: "Patient",
    message: "Amazing team and amazing treatment from the best doctor in the world.",
    image: "images/Shape.png",
  },
  {
    id: 7,
    name: "James",
    role: "Patient",
    message: "Amazing team and amazing treatment from the best doctor in the world.",
    image: "images/Shape.png",
  },
  {
    id: 8,
    name: "Amina",
    role: "Patient",
    message: "Amazing team and amazing treatment from the best doctor in the world.",
    image: "images/Shape.png",
  },
];

 const sliderRef = useRef();
    {/* function to scroll the cards*/}
  const scrollByCards = (direction) => {
    const scrollAmount = sliderRef.current.offsetWidth;  {/* container width will determine how many cards will be scrolled*/}
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
    return(
        
      <section id="reviews" className="scrollbar-hide bg-[#ECF6FF] py-10 px-4 sm:px-10 lg:px-20 relative ">

<div id="container"  className="scrollbar-hide flex justify-between items-center  p-20 mt-2 flex-wrap ">

<h1 className="text-[#234A6B] text-[40px] mb-2 mt-18 pl-6 mr-50 pr-15 font-bold">Read feedback about our
 Services and wonderful team!</h1>

 <h3 className="text-[#757575] text-[18px] mb-40 mt-2 pl-6 mr-30 pr-15 pb-15">We take care of our patients just like a family
 member . Read the testimonials from our patients.</h3>


 {/* scroll button */}
<div id="scroll button" class="flex justify-end  gap-5 mt-4 md:mt-0 absolute right-8 pr-30 pb-35">

  <button  onClick={() => scrollByCards("left")} class="bg-[#0086FF] hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
    <FaChevronLeft className="w-4 h-4" />
   
  </button>

 
  <button  onClick={() => scrollByCards("right")} class="bg-[#0086FF] hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md">
        <FaChevronRight className="w-4 h-4" />
  </button>
</div>
 {/* imports the review card */}
 <div
        ref={sliderRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
      >
        {reviews.map((review) => (
          <div className="min-w-[280px] max-w-[2800px] snap-start" key={review.id}>
            <ReviewCard {...review} />
          </div>
        ))}
      </div>


</div>

      </section>
    )
}