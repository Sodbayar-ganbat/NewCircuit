import React from 'react';
import GradientDescription from './GradientDescription';
import { Link } from 'react-router-dom';

const HIWDescription = () => {
    return (
        <div className="w-full bg-[#FAFFE7] py-[100px]">
            <div className="w-full px-4 sm:px-6 md:px-10 lg:px-[100px]">
                <div className="flex flex-col items-center text-center">
                    <h1 
                        style={{
                            fontFamily: '"Bricolage Grotesque", sans-serif',
                            fontWeight: 520,
                            lineHeight: '120%',
                        }}
                        className="text-[32px] sm:text-[32px] md:text-[48px] lg:text-[64px] text-[#211F20] mb-[24px] sm:mb-[50px] md:mb-[75px] lg:mb-[100px]"
                    >
                        How It Works
                    </h1>
                    <div className="flex flex-col items-center text-center gap-[18px] sm:gap-[24px] md:gap-[32px] lg:gap-[50px]">
                        <GradientDescription 
                            headerText="Sign up to Circuit"
                            bodyText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac."
                            gradientColors={{
                                inside: "#79FFC7",
                                outside: "#FFF9A1"
                            }}
                        />
                        <GradientDescription 
                            headerText="Find a speed date in your city"
                            bodyText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac."
                            gradientColors={{
                                inside: "#8EFF7A",
                                outside: "#D7FFF8"
                            }}
                        />
                        <GradientDescription 
                            headerText="Join the meeting"
                            bodyText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac."
                            gradientColors={{
                                inside: "#B0EEFF",
                                outside: "#E7E9FF"
                            }}
                        />
                        <GradientDescription 
                            headerText="We match you with 3 sparks"
                            bodyText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac."
                            gradientColors={{
                                inside: "#B4FFF2",
                                outside: "#E1FFD6"
                            }}
                        />
                        <GradientDescription 
                            headerText="Go on dates with them"
                            bodyText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac."
                            gradientColors={{
                                inside: "#E2FF65",
                                outside: "#D2FFD7"
                            }}
                        />
                    </div>
                    <Link to="/create-account" className="inline-block mt-[24px] sm:mt-[50px] md:mt-[75px] lg:mt-[100px]">
                        <button
                            style={{
                                background: '#211F20',
                                borderRadius: '8px',
                                color: '#FAFFE7',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '16px',
                                fontWeight: 500,
                                lineHeight: 'normal',
                                padding: '12px 28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: 'none',
                                textAlign: 'center',
                                boxShadow: 'none',
                                gap: '8px',
                                transition: 'all 0.3s',
                                cursor: 'pointer',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.6'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                            className="transition-colors hover:scale-110 transition-transform"
                        >
                            Sign up now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HIWDescription;
