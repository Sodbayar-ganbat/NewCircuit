import * as React from "react";
import { useNavigate } from "react-router-dom";

const thirdDateSteps = [
  {
    step: "STEP 01",
    title: "Do your first speed date",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac."
  },
  {
    step: "STEP 02",
    title: "Connect with a spark",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac."
  },
  {
    step: "STEP 03",
    title: "Go on 3 dates with a spark & take pictures",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac."
  }
];

export function ThirdDatesOnUs() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#FAFFE7] flex flex-col items-center gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[32px] px-4 sm:px-6 md:px-8 lg:px-[50px] py-[100px]">
      {/* Title */}
      <h2
        style={{
          color: '#211F20',
          textAlign: 'center',
          fontFamily: '"Bricolage Grotesque", sans-serif',
          fontWeight: 520,
          lineHeight: '120%',
          alignSelf: 'stretch',
          marginBottom: '24px',
        }}
        className="text-[32px] sm:text-[32px] md:text-[40px] lg:text-[48px] mb-[24px] sm:mb-[50px] md:mb-[75px] lg:mb-[100px]"
      >
        The third date's on us
      </h2>

      {/* Card Grid */}
      <div className="flex flex-col items-center w-full gap-[16px]
        sm:flex-col sm:items-center sm:justify-center sm:gap-[20px] sm:mx-auto
        md:flex-row md:items-stretch md:justify-center md:gap-[24px] md:w-[calc(100%+64px)] md:-mx-8
        lg:flex-row lg:items-stretch lg:justify-between lg:gap-[32px] lg:w-full lg:mx-auto lg:max-w-[1340px]">
        {thirdDateSteps.map((card, index) => (
          <div
            key={index}
            className="w-[358px] h-[202px] sm:w-[690px] sm:h-[246px] md:w-[calc(33.33%-16px)] md:h-[350px] lg:w-[426px] lg:h-[450px] flex flex-col justify-end items-start rounded-[8px] sm:rounded-[10px] md:rounded-[12px] lg:rounded-[16px] border-[1.5px] border-[#211F20] bg-[#FAFFE7] relative p-[12px] sm:p-[16px] md:p-[20px] lg:p-[24px] shrink-0"
          >
            {/* Icon container in top left corner */}
            <div
              className="absolute top-[12px] left-[12px] sm:top-[16px] sm:left-[16px] md:top-[20px] md:left-[20px] lg:top-[24px] lg:left-[24px] flex items-center justify-center w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] lg:w-[100px] lg:h-[100px]"
            >
              {index === 0 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100" fill="none"
                  className="w-full h-full"
                >
                  <path d="M48.6657 1.18531C48.8534 -0.395103 51.1466 -0.395103 51.3343 1.18531L52.9075 14.4435C54.9388 31.5634 68.4366 45.0612 85.5563 47.0925L98.8146 48.6657C100.395 48.8534 100.395 51.1466 98.8146 51.3343L85.5563 52.9075C68.4366 54.9388 54.9388 68.4366 52.9075 85.5563L51.3343 98.8146C51.1466 100.395 48.8534 100.395 48.6657 98.8146L47.0925 85.5563C45.0612 68.4366 31.5634 54.9388 14.4435 52.9075L1.18531 51.3343C-0.395103 51.1466 -0.395103 48.8534 1.18531 48.6657L14.4435 47.0925C31.5634 45.0612 45.0612 31.5634 47.0925 14.4435L48.6657 1.18531Z" fill="#211F20"/>
                </svg>
              )}
              {index === 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 101 64" fill="none"
                  className="w-full h-full"
                >
                  <path fillRule="evenodd" clipRule="evenodd" d="M100.333 32C100.333 32 77.9473 63.2749 50.333 63.2749C22.7189 63.2749 0.333008 32 0.333008 32C0.333008 32 22.7189 0.725098 50.333 0.725098C77.9473 0.725098 100.333 32 100.333 32ZM73.1533 32C73.1533 44.5669 62.9366 54.7546 50.333 54.7546C37.7294 54.7546 27.5126 44.5669 27.5126 32C27.5126 19.4331 37.7294 9.24538 50.333 9.24538C62.9366 9.24538 73.1533 19.4331 73.1533 32ZM50.333 45.039C57.5553 45.039 63.4099 39.2012 63.4099 32C63.4099 24.7988 57.5553 18.961 50.333 18.961C43.1107 18.961 37.2561 24.7988 37.2561 32C37.2561 39.2012 43.1107 45.039 50.333 45.039Z" fill="#211F20"/>
                </svg>
              )}
              {index === 2 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 57 100" fill="none"
                  className="w-full h-full"
                >
                  <path d="M56.4207 0H19.8568L0.914062 53.0974H16.7731L3.55723 100L49.3722 35.3982H33.0727L56.4207 0Z" fill="#211F20"/>
                </svg>
              )}
            </div>
            {/* Dots in top right corner */}
            <div 
              style={{ 
                position: 'absolute', 
                top: '12px',
                right: '12px',
                display: 'flex', 
                flexDirection: 'row',
                maxWidth: 'calc(50% - 12px)',
              }}
              className="gap-[6px] sm:gap-[8px] sm:top-[16px] sm:right-[16px] md:top-[20px] md:right-[20px] lg:top-[24px] lg:right-[24px]"
            >
              {[0, 1, 2, 3].map((dotIdx) => (
                <div
                  key={dotIdx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    borderRadius: '100px',
                    border: '1.5px solid #211F20',
                    background: dotIdx <= index ? '#E2FF65' : 'transparent',
                  }}
                  className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px]"
                />
              ))}
            </div>
            {/* Text content */}
            <div className="w-full ">
              <p
                className="font-bricolage uppercase text-[#211F20]/75 mb-2 sm:mb-2 md:mb-2.5 lg:mb-3 text-left
                          text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px]"
                style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 400 }}
              >
                {card.step}
              </p>
              <h3
                className="font-bricolage text-[#211F20] mb-2 sm:mb-2 md:mb-2.5 lg:mb-3 text-left
                          text-[14px] sm:text-[16px] md:text-[20px] lg:text-[24px]"
                style={{ fontFamily: '"Bricolage Grotesque", sans-serif', fontWeight: 400 }}
              >
                {card.title}
              </h3>
              <p
                className="font-poppins font-normal text-[#211F20] mb-0 pb-0 text-left
                          text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px]"
              >
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Image Section */}
      <div
        className="w-[358px] h-[259px] sm:w-[690px] sm:h-[217px] md:w-[calc(100%+64px)] md:h-[350px] lg:w-[1340px] lg:h-[450px] relative flex flex-col justify-end items-end overflow-hidden rounded-[8px] sm:rounded-[10px] md:rounded-[12px] lg:rounded-[16px] md:-mx-8"
      >
        {/* Background image with overlays */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              background: `url('/WomanWineGlass.png') lightgray 50% / cover no-repeat`,
            }}
          />
          {/* Noise overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'2.5\' numOctaves=\'6\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              opacity: 0.95,
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />
          {/* Black gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Dots in top right corner of image section */}
        <div 
          style={{ 
            position: 'absolute', 
            top: 24, 
            right: 24, 
            display: 'flex', 
            flexDirection: 'row',
            maxWidth: 'calc(50% - 24px)',
            zIndex: 10,
          }}
          className="gap-[6px] sm:gap-[8px]"
        >
          {[0, 1, 2, 3].map((dotIdx) => (
            <div
              key={dotIdx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderRadius: '100px',
                border: '1.5px solid #211F20',
                background: '#E2FF65',
              }}
              className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px]"
            />
          ))}
        </div>

        {/* Content container */}
        <div className="relative z-10 flex flex-col w-full p-[16px] sm:p-[24px] md:p-[32px] lg:p-[50px]">
          {/* Text content */}
          <span className="text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-[#FAFFE7] font-bricolage font-medium leading-[130%] uppercase mb-[8px]">
            STEP 04
          </span>
          <span className="text-[32px] sm:text-[32px] md:text-[48px] lg:text-[64px] text-[#FAFFE7] font-bricolage font-medium leading-[110%]">
            The third date includes a drink on us
          </span>
          <span className="text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-[#FAFFE7] font-poppins leading-normal mt-[8px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mattis metus neque, ac hendrerit risus pharetra ac.
          </span>
        </div>
      </div>
      {/* Button */}
      <button
        onClick={() => navigate('/create-account')}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--Gap-XXS, 12px)',
          background: 'var(--Raisin_Black, #211F20)',
          color: 'var(--Mindaro_Light, #FAFFE7)',
          fontFamily: 'Poppins, sans-serif',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'normal',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease-in-out',
        }}
        className="text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px] whitespace-nowrap px-[20px] sm:px-[20px] md:px-[20px] lg:px-[24px] py-[8px] sm:py-[8px] md:py-[10px] lg:py-[12px] mt-[24px] sm:mt-[50px] md:mt-[75px] lg:mt-[100px] rounded-[4px] sm:rounded-[6px] md:rounded-[6px] lg:rounded-[8px] hover:scale-[1.02] active:scale-[0.98]"
        onMouseOver={(e) => e.currentTarget.style.opacity = '0.6'}
        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      >
        Claim my free drink
      </button>
    </div>
  );
}