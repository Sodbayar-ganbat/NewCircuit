import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PersonalityQuizPage.module.css';

const FinalQuizPage = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.quizBg}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <svg className={styles.backIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <span className={styles.locationText}>PERSONALITY TEST</span>
            </div>
            {/* Progress Bar */}
            <div className={styles.progressBarMarginLayout}>
                <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: '100%' }} />
                </div>
            </div>
            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.finalMessage}>
                    What a winning personality!
                </div>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className={styles.dashboardBtn}
                >
                    Navigate to Dashboard
                </button>
            </div>
        </div>
    );
};

export default FinalQuizPage;
