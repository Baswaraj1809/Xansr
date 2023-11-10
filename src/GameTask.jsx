import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Box,
} from '@mui/material';

const GameTask = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [boxColor, setBoxColor] = useState('');
  const [prevBoxColor, setPrevBoxColor] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(40);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');

  useEffect(() => {
    let intervalId;
    let timeoutId;

    const changeBoxColor = () => {
      const colors = ['green', 'red'];
      let randomColor;
      do {
        randomColor = colors[Math.floor(Math.random() * colors.length)];
      } while (randomColor === prevBoxColor);

      setPrevBoxColor(randomColor);
      setBoxColor(randomColor);
    };

    if (gameStarted && !gameOver) {
      intervalId = setInterval(changeBoxColor, Math.floor(Math.random() * 1000) + 1000);

      timeoutId = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime === 0) {
            setGameOver(true);
            clearInterval(intervalId);
            clearInterval(timeoutId);
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
      clearInterval(timeoutId);
    };
  }, [gameStarted, gameOver, prevBoxColor]);

  const handleBoxClick = () => {
    if (boxColor === 'green' && !gameOver) {
      setScore(score + 1);
      const winningScore = getWinningScore();
      if (score + 1 === winningScore) {
        setGameOver(true);
      }
    } else {
      setGameOver(true);
    }
  };

  const getWinningScore = () => {
    switch (difficulty) {
      case 'Easy':
        return 10;
      case 'Medium':
        return 15;
      case 'Hard':
        return 25;
      default:
        return 10;
    }
  };

  const handleStartGame = () => {
    let nameErrorMessage = '';
    let emailErrorMessage = '';
    let mobileNumberErrorMessage = '';

    if (name.length < 3) {
      nameErrorMessage = 'Name should contain more than 3 characters';
    }

    if (!email.includes('@')) {
      emailErrorMessage = 'Enter a valid Email id';
    }

    if (mobileNumber.length !== 10) {
      mobileNumberErrorMessage = 'Mobile Number should be 10 characters';
    }

    setNameError(nameErrorMessage);
    setEmailError(emailErrorMessage);
    setMobileNumberError(mobileNumberErrorMessage);

    if (nameErrorMessage === '' && emailErrorMessage === '' && mobileNumberErrorMessage === '') {
      setGameStarted(true);
    }
  };

  const handleTryAgain = () => {
    setGameStarted(false);
    setGameOver(false);
    setTimeRemaining(40);
    setScore(0);
    setName('');
    setEmail('');
    setMobileNumber('');
    setDifficulty('Easy');
    setNameError('');
    setEmailError('');
    setMobileNumberError('');
    setPrevBoxColor('');
  };

  return (
    <Container maxWidth="sm" style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '30px', backgroundColor: '#fff' }}>
        <Typography variant="h4" align="center" gutterBottom>
          React Color Game
        </Typography>
        {!gameStarted && !gameOver ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter your details and choose the difficulty level to start the game.
            </Typography>
            <form>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={nameError !== ''}
                helperText={nameError}
              />
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError !== ''}
                helperText={emailError}
              />
              <TextField
                label="Mobile Number"
                type="tel"
                variant="outlined"
                fullWidth
                margin="normal"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                error={mobileNumberError !== ''}
                helperText={mobileNumberError}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="difficulty-label">Difficulty Level</InputLabel>
                <Select
                  labelId="difficulty-label"
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Hard">Hard</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" color="primary" onClick={handleStartGame}>
                Start Game
              </Button>
            </form>
          </Box>
        ) : (
          <Box>
            {gameOver ? (
              <div style={{ textAlign: 'center' }}>
                <Typography variant="h5" align="center" gutterBottom>
                  {difficulty === 'Easy' && score === 10 ? (
                    <span>Congratulations! You won! Score: {score}/10</span>
                  ) : difficulty === 'Medium' && score === 15 ? (
                    <span>Congratulations! You won! Score: {score}/15</span>
                  ) : difficulty === 'Hard' && score === 25 ? (
                    <span>Congratulations! You won! Score: {score}/25</span>
                  ) : (
                    <span>Game Over. Your score: {score}</span>
                  )}
                </Typography>
                <Button variant="contained" color="primary" onClick={handleTryAgain}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    backgroundColor: boxColor,
                    width: '150px',
                    height: '150px',
                    margin: 'auto',
                    marginTop: '30px',
                    cursor: 'pointer',
                    borderRadius: '5px',
                  }}
                  onClick={handleBoxClick}
                ></div>
                <Box mt={3}>
                  <Typography variant="h6" align="center" gutterBottom>
                    Difficulty: {difficulty}
                  </Typography>
                  <Typography variant="h6" align="center" gutterBottom>
                    Score: {score}/{getWinningScore()}
                  </Typography>
                  <Typography variant="h6" align="center">
                    Time Remaining: {timeRemaining}
                  </Typography>
                </Box>
              </div>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default GameTask;
