import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../DashboardHelperComponents/ConfirmationModal";
import { FaShoppingCart, FaCheck } from "react-icons/fa";
import { auth, db } from "../../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import homePurchaseMoreDates from "../../../images/home_purchase_more_dates.jpg";
import imgNoise from "../../../images/noise.png";
import { ReactComponent as FiveDots } from "../../../images/5 Dots.svg";
import { ReactComponent as Team } from "../../../images/Team.svg";
import { ReactComponent as Hole } from "../../../images/Hole.svg";
import { ReactComponent as Butterfly } from "../../../images/Butterfly.svg";
import { ReactComponent as Ellipse } from "../../../images/Ellipse.svg";
import { ReactComponent as SoftFlower } from "../../../images/Soft Flower.svg";

const DatePlan = ({ title, time, price, venue, onBuyNow }) => {
  // Get the correct icon based on title
  const getIcon = () => {
    switch (title) {
      case "Brunch":
        return <Ellipse className="w-full h-full" />;
      case "Happy Hour":
        return <Butterfly className="w-full h-full" />;
      case "Dinner":
        return <SoftFlower className="w-full h-full" />;
      default:
        return <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-600">{title}</span>
        </div>;
    }
  };

  // Get features based on title
  const getFeatures = () => {
    switch (title) {
      case "Brunch":
        return ["Brunch Speed Date", "12:30pm - 2:00 pm", "Advanced Matching Algorithm"];
      case "Happy Hour":
        return ["Happy Hour Speed Date", "3:00pm - 4:30pm", "Advanced Matching Algorithm"];
      case "Dinner":
        return ["Dinner Speed Date", "6:00pm - 7:30pm", "Advanced Matching Algorithm"];
      default:
        return ["Speed Date", "Advanced Matching Algorithm"];
    }
  };

  return (
    <div className="relative w-full lg:max-w-[425px] mx-auto">
      <div className="flex flex-col bg-white border border-[#211F20] rounded-2xl overflow-hidden 
      pt-[0px] sm:pt-[0px] md:pt-[0px] lg:pt-[72px]
      min-h-[297px] sm:min-h-[343px] md:min-h-[419px] lg:min-h-[650px]">
        {/* The main card container */}
        <div className="relative flex flex-col flex-1 bg-white pt-[0px] sm:pt-[0px] md:pt-[0px]">
          
          {/* Upper Content */}
          <div className="flex flex-col flex-1 p-3 sm:p-4 lg:p-5 xl:p-6">
            {/* Icon */}
            <div className="flex justify-start w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] md:w-[75px] md:h-[75px] lg:w-[100px] lg:h-[100px]"> 
              {getIcon()}
            </div>
            
            {/* Text Content */}
            <div className="mt-auto">
              <div className="mb-[16px] sm:mb-[20px] md:mb-[24px] lg:mb-[32px]">
                <h3 className="self-stretch text-[#211F20] font-bricolage text-[18px] sm:text-[20px] md:text-[28px] lg:text-[32px] font-normal leading-[130%] mb-[8px] sm:mb-[8px] md:mb-[10px] lg:mb-[12px]">{title}</h3>
                <div className="gap-[4px] self-stretch text-[#211F20] font-poppins text-[28px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-medium leading-[100%] flex items-baseline">
                  <span className="text-[28px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-medium text-[#211F20]">{price}</span>
                  <span className="text-[#211F20] font-poppins text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] font-normal leading-[130%]">/Date</span>
                </div>
              </div>
              
              {/* Purchase Section */}
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-6" style={{ alignSelf: 'stretch' }}>
                <button
                  onClick={() => onBuyNow({ packageType: "Individual", title, venue, price })}
                  className="bg-[#211F20] text-white font-poppins
                  px-[20px] py-[4px] sm:px-[20px] sm:py-[4px] md:px-[20px] md:py-[5px] lg:px-[24px] lg:py-[6px]
                  rounded-lg text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px] font-normal hover:bg-gray-800 transition-colors"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
          
          {/* Features */}
          <div className="mt-auto bg-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-b-2xl sm:rounded-b-xl lg:rounded-b-2xl xl:rounded-b-2xl border-t border-black">
            <ul className="">
              {getFeatures().map((feature, index) => (
                <li key={index} className="self-stretch text-[#211F20] font-poppins text-[14px] md:text-[16px] lg:text-[20px] font-normal leading-[130%] flex items-start">
                  <span className="text-black-500 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const BundlePlan = ({ title, features, dates, price, venue, onBuyNow }) => {
  // Calculate price per date for bundles
  const pricePerDate = Math.round(parseInt(price.replace('$', '')) / dates);
  const oldPrice = "$38";
  const isAdventure = title === "The Adventure";
  
  // Get the correct icon based on title
  const getIcon = () => {
    switch (title) {
      case "The Adventure":
        return <Team className="w-full h-full" />;
      case "The Connection":
        return <FiveDots className="w-full h-full" />;
      case "The Introduction":
        return <Hole className="w-full h-full" />;
      default:
        return <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-600">{dates}</span>
        </div>;
    }
  };
  
  return (
    <div className="relative w-full lg:max-w-[425px] mx-auto">
      <div className={`flex flex-col bg-white border border-[#211F20] rounded-2xl overflow-hidden 
      sm:min-h-[450px] md:min-h-[500px] lg:min-h-[650px] ${isAdventure ? 'min-h-[400px]' : 'min-h-[340px]'}`}>
      {/* The main card container needs to be relative for the absolute tag */}
        <div className={`relative flex flex-col flex-1 bg-white pt-[0px]   ${isAdventure ? 'pt-[40px] sm:pt-[38px] md:pt-[45px] lg:pt-[55px]' : 'sm:pt-[0px] md:pt-[10px] lg:pt-[52px]'}`}>
        
        {/* Tag for BEST DEAL*/}
        {isAdventure && (
          <div className="absolute top-0 left-0 right-0 z-10 border-b border-white">
            <div className="self-stretch text-[#F3F3F3] bg-[#1C50D8] text-center font-poppins 
            text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] font-medium leading-[110%] 
             pt-3 rounded-t-2xl">
              BEST DEAL 🔥
              <div className="pt-2"> </div>
              <div className="w-full bg-white pb-[16px] sm:pb-[16px] md:pb-[20px] lg:pb-[24px] rounded-t-2xl"> 
              </div>
            </div>
            
          </div>
        )}
        
        {/* Upper Content */}
        <div className="flex flex-col flex-1 p-3 sm:p-4 lg:p-5 xl:p-6">
          {/* Icon */}
          <div className="flex justify-start w-[50px] h-[50px] sm:w-[75px] sm:h-[75px] md:w-[75px] md:h-[75px] lg:w-[100px] lg:h-[100px] "> 
            {getIcon()}
          </div>
          
          {/* Text Content */}
          <div className="mt-auto">
            <div className="mb-[16px] sm:mb-[20px] md:mb-[24px] lg:mb-[32px]">
              <div className="self-stretch text-[#211F20] font-bricolage text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[16px] font-medium leading-[130%] uppercase mb-[8px] sm:mb-[8px] md:mb-[10px] lg:mb-[12px]">{dates} Dates</div>
              <h3 className="self-stretch text-[#211F20] font-bricolage text-[18px] sm:text-[20px] md:text-[28px] lg:text-[32px]  font-normal leading-[130%] mb-[8px] sm:mb-[8px] md:mb-[10px] lg:mb-[12px]">{title}</h3>
              <div className="self-stretch text-gray-500 font-poppins text-[14px] md:text-[16] lg:text-[20] font-normal leading-[130%] line-through mb-[8px] sm:mb-[8px] md:mb-[10px] lg:mb-[12px]">{oldPrice}</div>
              <div className="gap-[4px] self-stretch text-[#211F20] font-poppins text-[28px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-medium leading-[100%] flex items-baseline">
                <span className="text-[28px] sm:text-[30px] md:text-[36px] lg:text-[40px] font-medium text-[#211F20]">${pricePerDate}</span>
                <span className="text-[#211F20] font-poppins text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] font-normal leading-[130%]">/Date</span>
              </div>
            </div>
            
            {/* Purchase Section */}
            <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-6" style={{ alignSelf: 'stretch' }}>
              <button
                onClick={() => onBuyNow({ packageType: "Bundle", title, numDates: dates, venue, price })}
                className="bg-[#211F20] text-white font-poppins
                px-[20px] py-[4px] sm:px-[20px] sm:py-[4px] md:px-[20px] md:py-[5px] lg:px-[24px] lg:py-[6px]
                rounded-lg text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px] font-normal hover:bg-gray-800 transition-colors"
              >
                Purchase
              </button>
              <div className="text-[12px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-[#211F20]">Billed at USD${parseInt(price.replace('$', ''))}</div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="bg-white p-3 sm:p-4 lg:p-5 xl:p-6 rounded-b-2xl sm:rounded-b-xl lg:rounded-b-2xl xl:rounded-b-2xl border-t border-black">
          <ul className="">
            {features.map((feature, index) => (
              <li key={index} className="self-stretch text-[#211F20] font-poppins text-[14px] md:text-[16px] lg:text-[20px] font-normal leading-[130%] flex items-start">
                <span className="text-black-500 mr-2 ">•</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>


      </div>
      </div>
    </div>
  );
};

const DashDateCalendar = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [datesRemaining, setDatesRemaining] = useState(100);

  // Function to check if dates remaining is greater than 0
  const shouldShowCard = () => {
    return datesRemaining > 0;
  };

  const handleBuyNow = (plan) => {
    setCart((prevCart) => [...prevCart, plan]); 
    setIsCartOpen(true); 
  };

  const removeFromCart = (title, venue, packageType) => {
    setCart((prevCart) => {
      const indexToRemove = prevCart.findIndex(
        (plan) =>
          plan.title === title &&
          plan.venue === venue &&
          plan.packageType === packageType
      );

      if (indexToRemove !== -1) {
        const newCart = [...prevCart];
        newCart.splice(indexToRemove, 1);
        return newCart;
      }

      return prevCart;
    });
  };

  const datePlans = [
    { title: "Brunch", time: "12:30pm - 2:00pm", venue: "San Francisco / Bay Area", price: "$28" },
    { title: "Happy Hour", time: "3:00pm - 4:30pm", venue: "New York City", price: "$28" },
    { title: "Dinner", time: "6:00pm - 7:30pm", venue: "Los Angeles", price: "$38" },
  ];

  const bundlePlans = [
    {
      title: "The Adventure",
      features: ["All eligible venues", "Advanced Matching Algorithm", "Boosted Visibility and Matching", "3 Dinners"],
      dates: 10,
      venue: "Los Angeles",
      price: "$220",
    },
    {
      title: "The Connection",
      features: ["All eligible venues", "Advanced Matching Algorithm", "2 Dinners"],
      dates: 6,
      venue: "New York City",
      price: "$144",
    },
    {
      title: "The Introduction",
      features: ["All eligible venues", "Basic Matching Algorithm", "1 Dinner"],
      dates: 3,
      venue: "San Francisco / Bay Area",
      price: "$78",
    },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const data = userDoc.data();
          
          // Load saved cart
          const savedCart = data?.cart;
          if (savedCart) {
            setCart(savedCart);
          }
          
          // Fetch datesRemaining from Firestore (same logic as DashHome.js)
          if (data) {
            const fetchedRemaining = typeof data.datesRemaining === 'number'
              ? data.datesRemaining
              : Number(data.datesRemaining);
            setDatesRemaining(Number.isFinite(fetchedRemaining) ? fetchedRemaining : 0);
          }
        } catch (err) {
          console.error("Failed to load cart:", err);
        } finally {
          setCartLoaded(true);
        }
      } else {
        setCartLoaded(true); 
      }
    });
  
    return () => unsubscribe();
  }, []);
   
  useEffect(() => {
    const saveCartToFirestore = async (newCart) => {
      if (!user) return;
      try {
        await setDoc(doc(db, "users", user.uid), { cart: newCart }, { merge: true });
      } catch (err) {
        console.error("Failed to save cart:", err);
      }
    };
  
    if (user && cartLoaded) {
      saveCartToFirestore(cart);
    }
  }, [cart, user, cartLoaded]);
  

  return (
    <div className="px-[16px] sm:px-[24px] md:px-[32px] lg:px-[50px]">
    <div className="pt-[16px] sm:pt-[24px] md:pt-[32px] lg:pt-[50px] pb-[16px] sm:pb-[24px] md:pb-[32px] lg:pb-[50px] bg-white rounded-3xl border border-gray-50 max-w-[1340px] mx-auto">
      <div className="flex flex-col max-w-full text-3xl w-full">

        {/* Purchase more dates card */}
        {shouldShowCard() && (
          <div className="relative w-full rounded-2xl overflow-hidden flex items-center mb-6">
          <img src={homePurchaseMoreDates} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <img src={imgNoise} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" style={{ mixBlendMode: 'soft-light' }} />
          <div className="absolute inset-0 bg-[#211F20] bg-opacity-10" 
              style={{
                background: `
                  linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.50) 100%),
                  linear-gradient(0deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.30) 100%),
                  linear-gradient(0deg, rgba(226,255,101,0.25) 0%, rgba(226,255,101,0.25) 100%)
                `
              }}/>
          <div className="relative z-10 flex flex-col items-start p-6">
            <span
            className="
              flex items-center
              font-medium
              text-white
              leading-[130%]
              font-bricolage
              text-[14px] sm:text-[16px] lg:text-[20px] 2xl:text-[24px]
              
            "
          >
              Dates Remaining: {datesRemaining}
            </span>
          </div>
        </div>
        )}

        <h2 className="flex-1 text-[18px] sm:text-[20px] md:text-[28px] lg:text-[32px] font-bricolage font-medium leading-[130%] text-[#211F20] mb-6">
          Bundles
        </h2>

        {/* Bundle Dates */}
        <div className="grid grid-cols-3 gap-[16px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] max-lg:grid-cols-1">
          {bundlePlans.map((plan, index) => (
            <div key={index} className="w-full">
              <BundlePlan {...plan} onBuyNow={handleBuyNow} />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-20 mb-6 max-md:mt-10"> 
          <h2 className="self-start text-3xl font-semibold leading-snug text-black">
            Individual
          </h2>
        </div>

        {/* Individual Dates */}
        <div className="grid grid-cols-3 gap-[16px] sm:gap-[16px] md:gap-[20px] lg:gap-[24px] max-lg:grid-cols-1">
          {datePlans.map((plan, index) => (
            <div key={index} className="w-full">
              <DatePlan {...plan} onBuyNow={handleBuyNow} />
            </div>
          ))}
        </div>

        {/* Cart */}
        <ConfirmationModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          removeFromCart={removeFromCart}
          navigate={navigate}
        />
      </div>
    </div>
    </div>
  );
};

export default DashDateCalendar;
