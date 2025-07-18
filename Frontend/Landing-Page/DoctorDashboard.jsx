import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorDashboard = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/"); // redirect to login if no token
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/loginRouter/doctor-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMessage(res.data.message);
      } catch (err) {
        console.error("Unauthorized or error fetching data:", err);
        navigate("/"); // redirect if unauthorized
      }
    };

    fetchDoctorData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl mb-6">👨‍⚕️ Doctor Dashboard</h1>



      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default DoctorDashboard;
