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

// Updated parser: does not expect correct answer markers
function parseQuiz(text) {
  // Split the input by the word "Question " (assuming each question starts with it)
  const blocks = text.split(/Question\s+\d+/).filter((blk) => blk.trim() !== "");
  const cards = [];

  blocks.forEach((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter((line) => line !== "");
    let card = {
      question: "",
      choices: [],
      correctAnswer: "",
      userAnswer: ""
    };

    // Assume first line is score, second is question
    if (lines.length >= 2) {
      card.question = lines[1];
    }

    // Choices: lines after the question (skip score and question)
    for (let i = 2; i < lines.length; i++) {
      // Only add lines that look like choices (e.g., start with a quote or letter or are indented)
      if (lines[i]) {
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

  // New: state for correct answer selection step
  const [selectingAnswers, setSelectingAnswers] = useState(false);
  const [answerSelections, setAnswerSelections] = useState([]);
  // New for improved answer selection UI
  const [answerSelectIndex, setAnswerSelectIndex] = useState(0);

  // New: for managing sets
  const [savedSets, setSavedSets] = useState({});
  const [saveSetName, setSaveSetName] = useState("");
  const [showSavePanel, setShowSavePanel] = useState(false);

  // Load all saved sets on mount
  useEffect(() => {
    const sets = localStorage.getItem("canvasFlashcardSets");
    if (sets) {
      try {
        setSavedSets(JSON.parse(sets));
      } catch (e) {
        setSavedSets({});
      }
    }
  }, []);

  // Helper to update localStorage and state
  const updateSavedSets = (newSets) => {
    setSavedSets(newSets);
    localStorage.setItem("canvasFlashcardSets", JSON.stringify(newSets));
  };

  const handleParse = () => {
    const parsedCards = parseQuiz(inputText);
    setCards(parsedCards);
    setAnswerSelections(Array(parsedCards.length).fill(null));
    setSelectingAnswers(true);
    setAnswerSelectIndex(0);
    setCurrentCardIndex(0);
    setFlipped(false);
    setKeyboardHintShown(false);
  };

  // After all answers are selected, set correctAnswer for each card and proceed
  const handleConfirmAnswers = () => {
    const updatedCards = cards.map((card, idx) => ({
      ...card,
      correctAnswer: card.choices[answerSelections[idx]]
    }));
    setCards(updatedCards);
    setSelectingAnswers(false);
    setCurrentCardIndex(0);
    setFlipped(false);
    setKeyboardHintShown(true);
    setTimeout(() => setKeyboardHintShown(false), 5000);
    // No auto-save here
  };

  // Save current cards as a named set
  const handleSaveSet = () => {
    if (!saveSetName.trim() || cards.length === 0) return;
    const newSets = { ...savedSets, [saveSetName.trim()]: cards };
    updateSavedSets(newSets);
    setShowSavePanel(false);
    setSaveSetName("");
  };

  // Load a set by name
  const handleLoadSet = (name) => {
    setCards(savedSets[name]);
    setSelectingAnswers(false);
    setCurrentCardIndex(0);
    setFlipped(false);
    setKeyboardHintShown(true);
    setTimeout(() => setKeyboardHintShown(false), 5000);
  };

  // Delete a set by name
  const handleDeleteSet = (name) => {
    const newSets = { ...savedSets };
    delete newSets[name];
    updateSavedSets(newSets);
    // If currently loaded set is deleted, clear cards
    if (cards === savedSets[name]) {
      setCards([]);
      setCurrentCardIndex(0);
      setFlipped(false);
    }
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
      {/* Saved Sets Panel */}
      <div className="saved-sets-panel">
        <h3>Saved Flashcard Sets</h3>
        {Object.keys(savedSets).length === 0 && <div style={{color:'#aaa'}}>No saved sets.</div>}
        <ul className="saved-sets-list">
          {Object.keys(savedSets).map((name) => (
            <li key={name} className="saved-set-item">
              <button onClick={() => handleLoadSet(name)}>Load</button>
              <span className="saved-set-name">{name}</span>
              <button onClick={() => handleDeleteSet(name)} style={{marginLeft:8, background:'#a33'}}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {/* Save Set Panel */}
      {showSavePanel && (
        <div className="save-set-modal">
          <div className="save-set-content">
            <h4>Save Current Flashcards</h4>
            <input
              type="text"
              placeholder="Enter set name"
              value={saveSetName}
              onChange={e => setSaveSetName(e.target.value)}
              style={{padding:'6px', borderRadius:'4px', border:'1px solid #333', marginBottom:'10px'}}
            />
            <br />
            <button onClick={handleSaveSet} disabled={!saveSetName.trim() || cards.length === 0}>Save</button>
            <button onClick={() => setShowSavePanel(false)} style={{marginLeft:8}}>Cancel</button>
          </div>
        </div>
      )}
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
      ) : selectingAnswers ? (
        // Improved: Per-question answer selection UI
        <div className="select-answers-step improved">
          <h2>Select the correct answer</h2>
          <div className="select-progress-bar">
            {cards.map((_, idx) => (
              <button
                key={idx}
                className={`select-progress-dot${idx === answerSelectIndex ? " active" : ""}${answerSelections[idx] !== null ? " answered" : ""}`}
                onClick={() => setAnswerSelectIndex(idx)}
                aria-label={`Go to question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="select-answer-card improved">
            <div className="select-question">
              <b>Q{answerSelectIndex + 1}:</b> {cards[answerSelectIndex].question}
            </div>
            <ul className="select-choices improved">
              {cards[answerSelectIndex].choices.map((choice, cidx) => (
                <li
                  key={cidx}
                  className={`select-choice-item${answerSelections[answerSelectIndex] === cidx ? " selected" : ""}`}
                  onClick={() => {
                    const newSelections = [...answerSelections];
                    newSelections[answerSelectIndex] = cidx;
                    setAnswerSelections(newSelections);
                  }}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      const newSelections = [...answerSelections];
                      newSelections[answerSelectIndex] = cidx;
                      setAnswerSelections(newSelections);
                    }
                  }}
                  aria-label={`Select answer: ${choice}`}
                >
                  <input
                    type="radio"
                    name={`answer-${answerSelectIndex}`}
                    checked={answerSelections[answerSelectIndex] === cidx}
                    readOnly
                  />
                  <span className="choice-text">{choice}</span>
                </li>
              ))}
            </ul>
            <div className="select-nav-buttons">
              <button
                onClick={() => setAnswerSelectIndex(i => Math.max(0, i - 1))}
                disabled={answerSelectIndex === 0}
              >
                Previous
              </button>
              <button
                onClick={() => setAnswerSelectIndex(i => Math.min(cards.length - 1, i + 1))}
                disabled={answerSelectIndex === cards.length - 1}
              >
                Next
              </button>
            </div>
            <div className="select-confirm-bar">
              <button
                className="confirm-btn"
                onClick={handleConfirmAnswers}
                disabled={answerSelections.some(sel => sel === null)}
              >
                Confirm Answers & Start Flashcards
              </button>
              <button
                onClick={() => {
                  setCards([]);
                  setInputText("");
                  setSelectingAnswers(false);
                  setAnswerSelections([]);
                }}
                style={{ marginLeft: 10 }}
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
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
            <button
              onClick={() => setShowSavePanel(true)}
              style={{marginLeft:10}}
              disabled={cards.length === 0}
            >
              Save Set
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;