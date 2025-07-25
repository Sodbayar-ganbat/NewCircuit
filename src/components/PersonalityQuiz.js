import React from "react";
import { useNavigate } from "react-router-dom";

const PersonalityQuiz = () => {
  const navigate = useNavigate(); 
  return (
    <div
      className="flex flex-col items-center px-16 pt-8 pb-12 text-3xl text-center text-blue-700 bg-[#F3F3F3] max-md:px-5"
      data-name="Section"
    >
      <div className="flex flex-col max-w-full w-[800px]">
        <div
          className="font-poppins font-bold max-md:max-w-full text-2xl"
          data-name="We match you to your ideal partner based on our highly comprehensive personality indicator."
        >
          We match you to your ideal partner based <br />
          on our highly comprehensive personality indicator.
        </div>
        <button
          onClick={() => navigate('/quiz-start')}
          className="font-poppins self-center px-6 py-4 mt-6 ml-3.5 max-w-full font-semibold bg-lime-300 rounded-[30px] shadow-[0px_5px_4px_rgba(0,0,0,0.25)] w-[500px] max-md:pr-5 max-md:max-w-full text-center cursor-pointer hover:bg-lime-400 transition text-2xl"
        >
          Take the Personality Indicator
        </button>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
