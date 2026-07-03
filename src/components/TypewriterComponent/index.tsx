import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  words: string[];
}

const TypewriterComponent: React.FC<TypewriterProps> = ({ words }) => {
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);
  const [erase, setErase] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const typeDelayInMs = 150;
  const pauseDelayInMs = 2500;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (typing) {
      if (charIndex < words[wordIndex].length) {
        timer = setTimeout(() => {
          setText((prev) => prev + words[wordIndex][charIndex]);
          setCharIndex((prev) => prev + 1);
        }, typeDelayInMs);
      } else {
        setTyping(false);
        setErase(true);
        timer = setTimeout(() => {}, pauseDelayInMs);
      }
    } else if (erase) {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        }, typeDelayInMs);
      } else {
        setErase(false);
        setTyping(true);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, typing, erase, words, wordIndex]);

  return <span>{text}</span>;
};

export default TypewriterComponent;