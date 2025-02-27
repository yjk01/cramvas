import React, { useState, useEffect } from "react";
import "./App.css";
import logo from './logo.png'; // Import the logo image

// A basic flashcard component with a flip animation.
function Flashcard({ card, index, flipped, setFlipped }) {
  const choicePrefix = ["A.", "B.", "C.", "D.", "E."];

  return (
    <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
      <div className={`flashcard ${flipped ? "flipped" : ""}`}>
        <div className="front">
          <h3>Question {index + 1}:</h3>
          <div className="question-text">
            <p>{card.question}</p>
          </div>
          {card.choices && card.choices.length > 0 && (
            <>
              <h4>Choices:</h4>
              <div className="choices-container">
                <ul>
                  {card.choices.map((choice, i) => (
                    <li key={i}>
                      <span className="choice-prefix">{choicePrefix[i] || "-"}</span>
                      <span className="choice-text">{choice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
        <div className="back">
          <h3>Correct Answer:</h3>
          <div className="answer-container">
            <p>{card.correctAnswer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// A simple parser to convert the pasted text into flashcard objects.
function parseQuiz(text) {
  // Split the input by the word "Question " (assuming each question starts with it)
  const blocks = text.split(/Question\s+\d+/).filter((blk) => blk.trim() !== "");
  const cards = [];

  blocks.forEach((block) => {
    // Split block into lines and trim them.
    const lines = block.split("\n").map((line) => line.trim()).filter((line) => line !== "");
    let card = {
      question: "",
      choices: [],
      correctAnswer: "",
      userAnswer: ""
    };

    // A very simple heuristic:
    // Assume the first non-empty line is the score (which we skip) and the second line is the question.
    // Then we look for markers: "Correct!", "You Answered", "Correct Answer", "Correct Answers".
    if (lines.length >= 2) {
      // We assume the first line is a score line; second is the question.
      card.question = lines[1];
    }

    // Find indices for markers if they exist.
    const idxCorrectExcl = lines.findIndex((l) => l.startsWith("Correct!"));
    const idxYouAnswered = lines.findIndex((l) => l === "You Answered");

    // Extract choices before any markers
    for (let i = 2; i < lines.length; i++) {
      if (lines[i].startsWith("Correct!")) {
        card.correctAnswer = lines[i + 1];
      } else if (lines[i].startsWith("You Answered")) {
        card.userAnswer = lines[i + 1];
      } else if (lines[i].startsWith("Correct Answer")) {
        card.correctAnswer = lines[i + 1];
      } else if (lines[i].startsWith("Correct Answers")) {
        card.correctAnswer = lines[i + 1];
      } else {
        card.choices.push(lines[i]);
      }
    }

    cards.push(card);
  });

  return cards;
}

function App() {
  const [inputText, setInputText] = useState("");
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [keyboardHintShown, setKeyboardHintShown] = useState(false);

  const handleParse = () => {
    const parsedCards = parseQuiz(inputText);
    setCards(parsedCards);
    setCurrentCardIndex(0);
    setFlipped(false);
    // Show keyboard hint when cards are first loaded
    setKeyboardHintShown(true);
    setTimeout(() => {
      setKeyboardHintShown(false);
    }, 5000);
  };

  const handleNext = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setFlipped(false);
  };

  const handlePrev = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (cards.length === 0) return; // Only handle keyboard when cards are loaded
      
      switch (e.key) {
        case " ": // Space bar
          handleFlip();
          e.preventDefault(); // Prevent scrolling from spacebar
          break;
        case "ArrowLeft":
          handlePrev();
          e.preventDefault();
          break;
        case "ArrowRight":
          handleNext();
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    // Clean up event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cards, flipped]); // Re-add listener if cards or flipped state changes

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> {/* Add logo image */}
        <h1>Canvas Quiz Flashcards</h1>
      </header>
      {cards.length === 0 ? (
        <>
          <textarea
            placeholder="Paste your Canvas quiz text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            cols={80}
          />
          <br />
          <button onClick={handleParse}>Parse Quiz</button>
        </>
      ) : (
        <>
          <div className="flashcard-header">
            {showHint && (
              <div className="hint-panel">
                <p>Click the card to see the answer!</p>
              </div>
            )}
            {keyboardHintShown && (
              <div className="hint-panel keyboard-hint">
                <p>Keyboard controls: <span className="key">Space</span> to flip the card, <span className="key">←</span> and <span className="key">→</span> to navigate</p>
              </div>
            )}
            <div className="hint-button" onClick={() => setShowHint(!showHint)}>
              <span role="img" aria-label="hint">💡</span> Get a hint
            </div>
          </div>
          
          <div className="flashcard-navigation">
            <button onClick={handlePrev}>
              <span role="img" aria-label="previous">⬅️</span>
            </button>
            <Flashcard 
              card={cards[currentCardIndex]} 
              index={currentCardIndex} 
              flipped={flipped} 
              setFlipped={setFlipped} 
            />
            <button onClick={handleNext}>
              <span role="img" aria-label="next">➡️</span>
            </button>
          </div>
          
          <div className="progress-tracker">
            <span className="current">{currentCardIndex + 1}</span>
            <span> / </span>
            <span className="total">{cards.length}</span>
          </div>
          
          <div className="flashcard-controls">
            <button onClick={() => {
              setCards([]);
              setInputText("");
              setKeyboardHintShown(false);
            }}>
              Start Over
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;