import React from 'react';
import Navbar from '../components/Navbar/NavBar';
import PersonalityQuiz from "../components/PersonalityQuiz";
import ClientTestimonials from "../components/ClientTestimonials";
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Pricing from '../components/Pricing';
import FAQSection from '../components/FAQ/FAQSection';
import {HowItWorks} from '../components/CircuitHowItWorks';
import {AboutSection} from '../components/About'
import {RestaurantPartnerships} from '../components/RestaurantPartnerships';
import MapPage from '../components/MapPage/MapPage'
import Dashboard from '../pages/Dashboard.js';
import { MyConnectionsPage } from '../components/Dashboard/My Connections.js';


const Home = () => {
    return (
        <>            
            
            <Dashboard />
            <MyConnectionsPage />
            <Navbar />
            <Hero />
            <HowItWorks />
            <MapPage />
            <ClientTestimonials />
            <PersonalityQuiz />
            <div id="partnerships">
                <RestaurantPartnerships/>
            </div>
            <div id="about">
                <AboutSection />
            </div>
            <Pricing/>
            <FAQSection/>
            <Footer />
        </>

    )
}

export default Home;
