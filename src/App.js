import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function Flashcard({ question, answer, isFlipped, onFlip, cardIndex }) {
  return (
    <div className="flashcard" onClick={() => onFlip(cardIndex)}>
      <div className={`flashcard-inner${isFlipped ? ' flipped' : ''}`}> 
        <div className="flashcard-front">
          {question}
        </div>
        <div className="flashcard-back">
          {answer}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [flippedCardIndex, setFlippedCardIndex] = useState(null);
  const [savedLists, setSavedLists] = useState({});
  const [listName, setListName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  // Load saved lists on component mount
  useEffect(() => {
    const saved = localStorage.getItem('flashcardLists');
    if (saved) {
      setSavedLists(JSON.parse(saved));
    }
  }, []);

  const handleCardFlip = (cardIndex) => {
    if (flippedCardIndex === cardIndex) {
      setFlippedCardIndex(null);
    } else {
      setFlippedCardIndex(cardIndex);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      setFlashcards([...flashcards, { question, answer }]);
      setQuestion('');
      setAnswer('');
    }
  };

  const handleBulkAdd = (e) => {
    e.preventDefault();
    const lines = bulkInput.split('\n');
    const newCards = lines
      .map(line => {
        const parts = line.split('|');
        if (parts.length >= 2) {
          return { question: parts[0].trim(), answer: parts.slice(1).join('|').trim() };
        }
        return null;
      })
      .filter(card => card && card.question && card.answer);
    if (newCards.length > 0) {
      setFlashcards([...flashcards, ...newCards]);
      setBulkInput('');
    }
  };

  const handleClear = () => {
    setFlashcards([]);
    setFlippedCardIndex(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (listName.trim() && flashcards.length > 0) {
      const newSavedLists = {
        ...savedLists,
        [listName.trim()]: flashcards
      };
      setSavedLists(newSavedLists);
      localStorage.setItem('flashcardLists', JSON.stringify(newSavedLists));
      setListName('');
      setShowSaveForm(false);
    }
  };

  const handleLoad = (listName) => {
    setFlashcards(savedLists[listName]);
    setFlippedCardIndex(null);
  };

  const handleDelete = (listName) => {
    const newSavedLists = { ...savedLists };
    delete newSavedLists[listName];
    setSavedLists(newSavedLists);
    localStorage.setItem('flashcardLists', JSON.stringify(newSavedLists));
  };

  return (
    <div className="App">
      <h1>Flashcard Study App</h1>
      
      {/* Saved Lists Section */}
      {Object.keys(savedLists).length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3>Saved Lists</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.keys(savedLists).map(name => (
              <div key={name} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <button
                  onClick={() => handleLoad(name)}
                  style={{
                    padding: '5px 10px',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Load "{name}" ({savedLists[name].length} cards)
                </button>
                <button
                  onClick={() => handleDelete(name)}
                  style={{
                    padding: '5px 8px',
                    background: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form className="flashcard-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter answer"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          required
        />
        <button type="submit">Add Flashcard</button>
      </form>
      
      <form className="bulk-form" onSubmit={handleBulkAdd}>
        <textarea
          placeholder="Paste questions and answers here, one per line, separated by |\nExample: What is 2+2? | 4"
          value={bulkInput}
          onChange={e => setBulkInput(e.target.value)}
          rows={5}
          style={{ width: '100%', marginBottom: '8px', resize: 'vertical' }}
        />
        <button type="submit">Add List</button>
      </form>

      {/* Action Buttons */}
      {flashcards.length > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '16px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => setShowSaveForm(true)}
            style={{
              padding: '8px 16px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Save List
          </button>
          <button 
            onClick={handleClear}
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Clear All Cards
          </button>
        </div>
      )}

      {/* Save Form */}
      {showSaveForm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: '#fff', 
            padding: '20px', 
            borderRadius: '8px', 
            minWidth: '300px' 
          }}>
            <h3>Save Flashcard List</h3>
            <form onSubmit={handleSave}>
              <input
                type="text"
                placeholder="Enter list name"
                value={listName}
                onChange={e => setListName(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Save
                </button>
                <button type="button" onClick={() => setShowSaveForm(false)} style={{ padding: '8px 16px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flashcard-list">
        {flashcards.length === 0 && <p>No flashcards yet. Add some!</p>}
        {flashcards.map((fc, idx) => (
          <Flashcard 
            key={idx}
            cardIndex={idx}
            question={fc.question} 
            answer={fc.answer}
            isFlipped={flippedCardIndex === idx}
            onFlip={handleCardFlip}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
