import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './LocationScreen.module.css';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { IoChevronBack } from 'react-icons/io5';

// Import all images at the top
import atlantaImg from '../images/atlanta.jpeg';
import chicagoImg from '../images/chicago.jpeg';
import dallasImg from '../images/dallas.jpg';
import houstonImg from '../images/houston.jpeg';
import losAngelesImg from '../images/la.jpeg';
import louisvilleImg from '../images/louisville.jpg';
import miamiImg from '../images/miami.jpeg';
import newYorkImg from '../images/nyc.jpeg';
import sacramentoImg from '../images/sacremento.jpg';
import seattleImg from '../images/seattle.jpeg';
import washingtonDCImg from '../images/washington.jpeg';
import sanfranciscoImg from '../images/sf.jpeg';

const cities = [
    { name: 'Atlanta', image: atlantaImg },
    { name: 'Chicago', image: chicagoImg },
    { name: 'Dallas', image: dallasImg },
    { name: 'Houston', image: houstonImg },
    { name: 'Los Angeles', image: losAngelesImg },
    { name: 'Louisville', image: louisvilleImg },
    { name: 'Miami', image: miamiImg },
    { name: 'New York City', image: newYorkImg },
    { name: 'Sacramento', image: sacramentoImg },
    { name: 'San Francisco / Bay Area', image: sanfranciscoImg },
    { name: 'Seattle', image: seattleImg },
    { name: 'Washington D.C.', image: washingtonDCImg }
];

const LocationScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const initialUserData = location.state?.userData || {};
    const [userData] = useState(initialUserData || {});
    const [selectedCity, setSelectedCity] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        Promise.all(cities.map(city => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = city.image;
                img.onload = resolve;
                img.onerror = reject;
            });
        }))
        .then(() => {
            setImagesLoaded(true);
        })
        .catch(err => console.log("Error loading images", err));
    }, []);

    const handleCityClick = (cityName) => {
      setSelectedCity(cityName);
      setShowModal(true);
    };

    const handleConfirm = async () => {
      try {
        const uid = userData.userId || (auth.currentUser && auth.currentUser.uid);
        if (!uid) throw new Error('No user ID available');
        await updateDoc(doc(db, 'users', uid), {
          location: selectedCity,
          locationSet: true,
        });
      } catch (error) {
        console.error('Error updating user location:', error);
      }
      setShowModal(false);
      navigate('/quiz-start');
    };

    if (!imagesLoaded) {
        return (
            <div className="min-h-screen bg-[#211F20] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className={styles.bgFull}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => navigate('/preferencePage')}>
                    <IoChevronBack className={styles.backIcon} />
                </button>
                <span className={styles.locationText}>LOCATION</span>
            </div>
            {/* Progress Bar Margin Layout */}
            <div className={styles.progressBarMarginLayout}>
            <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: '60%' }} />
                </div>
            </div>
            {/* Main Content */}
            <div className={styles.contentWrapper}>
                <h2 className={styles.selectCityTitle}>Select City</h2>
                <p className={styles.selectCitySubtitle}>You can change this later</p>
                <div className={styles.cityGrid}>
                    {cities.map((city, idx) => (
                        <div
                            key={city.name + idx}
                            className={styles.cityCard}
                            style={{ backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.65) 100%), url(${city.image})` }}
                            onClick={() => handleCityClick(city.name)}
                        >
                            <span className={styles.cityName}>{city.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Confirmation Modal */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalBox}>
                        <h3 className={styles.modalTitle}>
                            You have selected {selectedCity}
                        </h3>
                        <p className={styles.modalSubtitle}>Please confirm your selection</p>
                        <div className={styles.modalActions}>
                            <button 
                                onClick={() => setShowModal(false)}
                                className={styles.modalBtnCancel}
                            >
                                No
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className={styles.modalBtnConfirm}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationScreen;
