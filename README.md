# Cramvas - Canvas Quiz Flashcards

**Cramvas** was created to help me study for a college class. I was too lazy to go through previous quizzes and did not feel engaged just reading through questions. Hence, this beauty was created where I can dumb a bunch of quiz information in seconds and engage in flashcards to memorize 500+ questions. As a result of this application, I was able to crush my midterm in 04 minutes and 05 seconds with a perfect score of 50/50. _**GGEZ**_

## 🌟 Features

### Core Functionality

- **Canvas Quiz Parser**: Automatically parses Canvas quiz text and converts it into flashcards
- **Interactive Flashcards**: Demur flip animations to reveal answers
- **Answer Selection**: Step-by-step interface to select correct answers for each question
- **Multiple Choice Support**: Handles Canvas multiple choice questions with A, B, C, D, E options

### User Experience

- **Keyboard Navigation**:
  - `Space` - Flip current card
  - `←` / `→` - Navigate between cards
- **Visual Progress Tracking**: See your current position in the flashcard set
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Easy-on-the-eyes dark interface

### Study Management

- **Save & Load Sets**: Store multiple flashcard sets with custom names
- **Local Storage**: All data saved locally in your browser
- **Set Management**: Load, delete, and organize your saved flashcard sets
- **Progress Indicators**: Visual feedback during answer selection process

## 🚀 Demo

At least take a look: [https://yjk01.github.io/cramvas/](https://yjk01.github.io/cramvas/)

## 📖 How to Use

1. **Copy Canvas Quiz Content**: Copy the text from your Canvas quiz (questions and multiple choice options)
2. **Paste & Parse**: Paste the content into the text area and click "Parse Quiz"
3. **Select Correct Answers**: For each question, select the correct answer from the multiple choice options
4. **Study with Flashcards**: Use the interactive flashcards to study
   - Click cards or press `Space` to flip
   - Use arrow keys or buttons to navigate
5. **Save Your Sets**: Save your flashcard sets with custom names for later use

## 🛠️ Installation & Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yjk01/cramvas.git
   cd cramvas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Available Scripts

- **`npm start`** - Runs the app in development mode
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run build`** - Builds the app for production to the `build` folder
- **`npm run deploy`** - Deploys the app to GitHub Pages

## 🏗️ Project Structure

```
canvas-flashcards/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Styling and animations
│   ├── index.js        # React DOM entry point
│   └── logo.png        # Application logo
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🎨 Key Components

### Flashcard Component

- Handles the flip animation and display logic
- Shows questions on the front, answers on the back
- Responsive design with choice formatting

### Quiz Parser

- Parses Canvas LMS quiz text format
- Extracts questions and multiple choice options
- Handles various Canvas text formats

### Answer Selection Interface

- Step-by-step answer selection process
- Progress tracking with visual indicators
- Validation to ensure all questions have selected answers

### Storage Management

- Local browser storage for flashcard sets
- Save/load functionality with custom naming
- Set management (create, load, delete)
