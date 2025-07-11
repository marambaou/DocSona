import { FaQuoteLeft } from "react-icons/fa";

export default function ReviewCard({ name, role, message, image }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 pb-12">
      <FaQuoteLeft className="text-[#234A6B] text-xl mb-4" />
      <p className="text-[#757575] mb-4">{message}</p>
      <div className="flex items-center gap-4">
        <img
          src={image}
          alt={`${name} - ${role}`}
          className="w-10 h-10 object-cover rounded-full shadow"
        />
        <div>
          <h4 className="text-[#234A6B] font-semibold">{name}</h4>
          <h5 className="text-[#B3B3B3] text-sm">{role}</h5>
        </div>
      </div>
    </div>
  );
}