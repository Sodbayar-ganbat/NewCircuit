import React, { useRef, useEffect, useState } from 'react';
import './SlidingBar.css';

const DEFAULT_PHRASE = (
  <>
    Find your next match on circuit
    <span className="sliding-bar__heart" role="img" aria-label="blue heart">💙</span>
  </>
);

const SlidingBar = ({
  phrase = DEFAULT_PHRASE,
  background = '#211F20',
  textColor = '#F3F3F3',
  heartColor = '#0E49E8',
}) => {
  const containerRef = useRef(null);
  const phraseRef = useRef(null);
  const [repeatCount, setRepeatCount] = useState(8);

  useEffect(() => {
    function updateRepeats() {
      if (!containerRef.current || !phraseRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const phraseWidth = phraseRef.current.offsetWidth;
      if (!containerWidth || !phraseWidth) return;
      // Ensure at least 2x container width for seamless looping
      const minWidth = containerWidth * 2;
      const count = Math.ceil(minWidth / phraseWidth) + 1;
      setRepeatCount(count);
    }
    updateRepeats();
    window.addEventListener('resize', updateRepeats);
    return () => window.removeEventListener('resize', updateRepeats);
  }, []);

  return (
    <div className="sliding-bar" data-testid="sliding-bar" style={{ background }} ref={containerRef}>
    <div className="sliding-bar__marquee">
        {/* Hidden phrase for measurement only */}
        <span
          ref={phraseRef}
          className="sliding-bar__text"
          style={{ color: textColor, visibility: 'hidden', position: 'absolute', left: 0, top: 0 }}
        >
          {React.cloneElement(
            phrase,
            {},
            React.Children.map(phrase.props.children, child =>
              typeof child === 'object' && child?.props?.className === 'sliding-bar__heart'
                ? React.cloneElement(child, { style: { color: heartColor } })
                : child
            )
          )}
        </span>
        <div className="sliding-bar__track sliding-bar__track--animate">
          {Array.from({ length: repeatCount }).map((_, i) => (
            <span
              className="sliding-bar__text"
              style={{ color: textColor }}
              key={i}
            >
              {React.cloneElement(
                phrase,
                {},
                React.Children.map(phrase.props.children, child =>
                  typeof child === 'object' && child?.props?.className === 'sliding-bar__heart'
                    ? React.cloneElement(child, { style: { color: heartColor } })
                    : child
                )
              )}
            </span>
          ))}
      </div>
    </div>
  </div>
);
};

export default SlidingBar; 