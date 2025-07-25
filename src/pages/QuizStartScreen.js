import React from 'react';
import HeaderBar from '../components/HeaderBar';
import vistaBlueLogo from '../images/logomark_vistablue.png';
import { useNavigate } from 'react-router-dom';

const QuizStartScreen = () => {
    const navigate = useNavigate();
    const handleBack = () => navigate('/locations');
    return (
        <div className="min-h-screen flex flex-col">
            <HeaderBar 
        
                title = 'Personality Indicator'
                showBack={true}
                logo={vistaBlueLogo}
                logoHeight="h-20"
                titleSize='text-4xl'
                className = 'w-full flex justify-center items-center text-center relative'
                onBack={handleBack}
            />

            {/* Main content */}
            <div className="bg-[85A2F2#] flex-grow flex flex-col justify-between px-8 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-[#151D48] text-5xl font-bold">
                        Let's get to know you better
                    </h1>
                </div>

                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-[#151D48] text-xl mb-4">
                        Take our personality quiz to help us find your perfect connection
                    </p>
                    <p className="text-[#151D48] text-lg">
                        The higher the score, the stronger the connection!
                    </p>
                </div>

                <div className="max-w-2xl mx-auto text-center">
                    <button 
                        onClick={() => navigate('/personalityquizpage/1')}
                        className="bg-white text-[#151D48] px-8 py-4 rounded-xl text-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg"
                    >
                        Begin Your Journey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizStartScreen;
