import React from 'react';

const GradientDescription = ({ 
    headerText,
    bodyText,
    gradientColors = {
        inside: "#8EFF7A",
        outside: "#D7FFF8"
    }
}) => {
    return (
        <div 
            style={{
                background: `radial-gradient(circle at center, ${gradientColors.inside} 0%, ${gradientColors.outside} 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            className="
                w-full
                lg:max-w-[1340px]
                px-4 sm:px-6 md:px-8 lg:px-[50px]
                py-4 sm:py-6 md:py-8 lg:py-[32px]
                mx-auto
                rounded-[8px] sm:rounded-[10px] md:rounded-[12px] lg:rounded-[16px]
                text-left
                md:w-[calc(100%+32px)] lg:w-[calc(100%+50px)]
                md:-mx-4 lg:-mx-[25px]
            "
        >
            <h2 
                style={{
                    fontFamily: '"Bricolage Grotesque", sans-serif',
                    fontWeight: 520,
                    lineHeight: '120%',
                }}
                className="
                    text-[24px] sm:text-[24px] md:text-[32px] lg:text-[40px]
                    text-[#211F20]
                    mb-[16px] sm:mb-[16px] md:mb-[20px] lg:mb-[24px]
                "
            >
                → {headerText}
            </h2>
            <p 
                style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    lineHeight: '150%',
                }}
                className="
                    text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px]
                    text-[#211F20]
                "
            >
                {bodyText}
            </p>
        </div>
    );
};

export default GradientDescription;