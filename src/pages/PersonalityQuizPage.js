import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PersonalityQuizPage.module.css";
import { IoChevronBack } from 'react-icons/io5';
import { db, auth } from "../pages/firebaseConfig"; 
import { doc, setDoc, collection, updateDoc } from "firebase/firestore"; 
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TOTAL_STEPS = 17;

const QUESTIONS = [
  "What is your current employment status?", 
  "Which best describes your political views?", 
  "Are you a morning person or night owl?", 
  "Would you date someone who has kids?", 
  "Which romantic setting sounds more appealing to you?", 
  "Do you often worry about things out of your control?", 
  "Which type of intelligence do you value the most?", 
  "How open are you with your emotions", 
  "What kind of connection are you hoping to find?", 
  "What is your religion", 
  "How important is religion or belief in your life?",
  "What's your love language?", 
  "What's your communication style in a relationship?", 
  "Which relationship dynamic do you prefer?", 
  "How do you handle conflict in a relationship?", 
  "When you're upset, what do you need most from your partner?", 
  "Rank the following traits in order of importance to you in a partner (drag and rank)"
];

const RESPONSES = [
  ["Full-time", "Part-time", "Student", "Unemployed"],
  ["Liberal/left leaning", "Conservative / right leaning", "Moderate", "other/choose not to disclose"],
  ["I'm an early bird", "Definitely a night owl", "Depends on my schedule or mood that week", "I adapt to whatever life throws at me"],
  ["Yes, I love kids!", "I'm open to it, but i'd like to take things slow", "Id prefer not to, but never say never", "I'm not comfortable dating someone with kids"],
  ["Watching the sunset on the beach", "Stargazing in the middle of nowhere", "Exploring a new city together"],
  ["I worry about those things more than I'd like to admit", "Only if it directly affects people I care about", "I try not to, but it depends on how big the situation feels", "I focus on what i can control most of the time"],
  ["Logical", "Emotional", "Practical", "I just appreciate someone who's open to learning and growing"],
  ["I'm an open book", "Depends on how much I trust the person", "I tend to keep my emotions to myself", "It's rare for me to share my emotions"],
  ["Life partner", "Long-term relationship", "Short-term relationship", "Long-term, open to short", "Short term open to long"],
  ["Agnostic", "Atheist", "Buddhist", "Catholic", "Christian", "Hindu", "Jewish", "Muslim", "Other", "Prefer not to say"],
  ["Very important", "Somewhat important", "Not very important", "Not important at all"],
  ["Words of affirmation", "Acts of service", "Quality time", "Physical touch", "Receiving gifts"],
  ["Constant communication every day", "Periodic meaningful check-ins", "I appreciate thoughtful texts", "I express myself deeply when it matters"],
  ["Partners who are best friends", "A romantic spark with passion", "A relationship built on independence and trust", "A calm connection with emotional stability"],
  ["Talk it out immediately", "Take some time to cool down and discuss", "Write a thoughtful message about your feelings", "Avoid confrontation and wait for things to settle"],
  ["Reassurance and affection", "Space to cool off", "Someone to listen without trying to fix things", "A distraction"],
  ["Loyalty", "Communication", "Ambition", "Empathy", "Humor"]
];

const PersonalityQuizPage = () => {
  const { step } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(step);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [rankList, setRankList] = useState(RESPONSES[16]);

  useEffect(() => {
    if (currentStep === 1) {
      setProgress(0);
    } else {
      setProgress(((currentStep)/ TOTAL_STEPS) * 100);
    }
    setSelected(answers[`Question ${currentStep}`] || null);
    if (currentStep === 17 && answers[`Question 17`]) {
      setRankList(answers[`Question 17`]);
    } else if (currentStep === 17) {
      setRankList(RESPONSES[16]);
    }
  }, [currentStep]);

  const handleAnswerClick = (answer) => {
    setSelected(answer);
    const updatedAnswers = {
      ...answers,
      [`Question ${currentStep}`]: answer,
    };
    setAnswers(updatedAnswers);
    setTimeout(() => {
    if (currentStep < TOTAL_STEPS) {
      navigate(`/personalityquizpage/${currentStep + 1}`);
    } else {
      handleQuizSubmit(updatedAnswers); 
    }
    }, 200);
  };

  const handleQuizSubmit = async (updatedAnswers) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const quizResponseRef = collection(userDocRef, "quizResponses");
      const latestDocRef = doc(quizResponseRef, "latest");
      try {
        await setDoc(latestDocRef, { answers: updatedAnswers, id: "latest", timestamp: new Date() }, { merge: true });
        await updateDoc(userDocRef, { quizComplete: true });
        navigate("/finalQuizPage");
      } catch (error) {
        console.error("Error saving quiz answers:", error);
      }
    } else {
      console.warn("User is not authenticated!");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      navigate(`/personalityquizpage/${currentStep - 1}`);
    } else {
      navigate('/quiz-start');
    }
  };
  
  // Drag and drop handlers for last question
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(rankList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setRankList(items);
    setAnswers({
      ...answers,
      [`Question 17`]: items,
    });
  };

  return (
    <div className={styles.quizBg}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={prevStep}>
          <IoChevronBack className={styles.backIcon} />
        </button>
        <span className={styles.locationText}>PERSONALITY TEST</span>
      </div>
        {/* Progress Bar */}
      <div className={styles.progressBarMarginLayout}>
        <div className={styles.progressBarBg}>
          <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
        </div>
          </div>
      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.question}>
          {QUESTIONS[currentStep - 1] || "Loading..."}
        </div>
        <div className={styles.optionsWrapper}>
          {QUESTIONS[currentStep - 1] === 'What is your religion' ? (
            <select
              className={styles.optionBtn}
              value={selected || ''}
              onChange={e => handleAnswerClick(e.target.value)}
            >
              <option value='' disabled>Select your religion</option>
              {RESPONSES[currentStep - 1].map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          ) : QUESTIONS[currentStep - 1] === 'Rank the following traits in order of importance to you in a partner (drag and rank)' ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="rankList">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {rankList.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.optionBtn}
                            style={{
                              ...provided.draggableProps.style,
                              marginBottom: '16px',
                              background: snapshot.isDragging ? '#E2FF65' : '',
                              color: '#211F20',
                              boxShadow: snapshot.isDragging ? '0 2px 8px rgba(226,255,101,0.15)' : 'none',
                              cursor: 'grab',
                            }}
                          >
                            {item}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            (QUESTIONS[currentStep - 1] === 'Which type of intelligence do you value the most?'
              ? RESPONSES[currentStep - 1].slice(0, 3)
              : RESPONSES[currentStep - 1]
            )?.map((option, index) => (
              <button
              key={index}
              onClick={() => handleAnswerClick(option)}
                className={
                  `${styles.optionBtn} ` +
                  (selected === option ? styles.selected + ' ' : '') +
                  (QUESTIONS[currentStep - 1] === 'Do you often worry about things out of your control?' ? styles.optionBtnSmall : '')
                }
              >
                {option}
              </button>
            ))
          )}
          {QUESTIONS[currentStep - 1] === 'Rank the following traits in order of importance to you in a partner (drag and rank)' && (
            <button
              className={styles.doneBtn}
              style={{ marginTop: 24 }}
              onClick={() => handleQuizSubmit({ ...answers, [`Question 17`]: rankList })}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuizPage;
