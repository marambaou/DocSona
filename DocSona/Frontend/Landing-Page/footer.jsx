 import {FaFacebook, FaTwitter,FaInstagram } from 'react-icons/fa';
 export default function Footer(){
    return(
          <section id="footer"  className="h-auto  "> 
        <div id="main footer" className="bg-cover bg-[#13324F] p-24 flex flex-col md:flex-row justify-between gap-10 ">
            <div>
<h2 className="text-[#FFFFFF] text-[25px] font-semibold mb-4 pl-14">DocSona</h2>
<p className="text-[#9BABBA] mb-4  mr-9">The ultimate destination for
 <br></br>all of your medical needs</p>
 <div id="icons" className="flex gap-4 mt-2 pl-14"> 
  <FaFacebook className="text-[#9BABBA] w-6 h-8 md:w-9h-10" />
   <FaTwitter className="text-[#9BABBA] w-6 h-8 md:w-9h-10" />
    <FaInstagram className="text-[#9BABBA] w-6 h-8 md:w-9h-10" />
    </div>
</div>
<div>
<h2 className="text-[#FFFFFF] text-[25px] font-semibold mb-4">Explore</h2>
<p className="text-[#9BABBA]"> Home</p>
<p className="text-[#9BABBA]">Surgery</p>
<p className="text-[#9BABBA]">OPD</p>
<p className="text-[#9BABBA]">Speciality</p>
<p className="text-[#9BABBA]">Consultation</p>
</div>
<div>
<h2 className="text-[#FFFFFF] text-[25px] font-semibold mb-4">About Us</h2>
<p className="text-[#9BABBA]">Who we are</p>
<p className="text-[#9BABBA]">Our Vision</p>
<p className="text-[#9BABBA]">Our Team</p>
<p className="text-[#9BABBA]">Terms & Conditions</p>
<p className="text-[#9BABBA]">FAQs</p>
</div>
<div>
<h2 className="text-[#FFFFFF] text-[25px] font-semibold mb-4">Contact Us</h2>
<p className="text-[#9BABBA]">+254115040564</p>
<p className="text-[#9BABBA]"> docsona@doctor.com</p>
<p className="text-[#9BABBA]">Glassplace, Near
 Cool <br></br>Avenue, Boson</p>
</div>
        </div>

        <div id="lower footer" className="text-[#FFFFFF] bg-[#1E3C58] bg-cover text-center  p-8">
         <p className="text-[#FFFFFF] text-center " >  Copyright 2025 DocSona, All Rights Reserved </p>
        </div>

      </section>
    )
}