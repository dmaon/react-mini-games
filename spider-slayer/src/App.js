import React, { useState, useEffect } from 'react'
import Stats from './components/Stats';
import Target from './components/Target';
import UIfx from 'uifx'
import gunshotURL from './sounds/gunshot.mp3'
import BugLaughURL from './sounds/bug laugh.mp3'
import bugScreamURL from './sounds/bug scream.mp3'
import './index.css';
import './App.css';

function App() {

  // Images from freepik.com
  // Sounds from Zapsplat.com, fesliyanstudios.com and soundbible.com

  let x, y, target, navbar, timerLabel, width, height, repeaterTimer, gunshot, bugLaugh, bugScream;
  const limit = 10; const attribute = "timer"
  const interval = 1000
  
  const [gameStart, setGameStart] = useState(true)
  const [totalClick, setTotalClick] = useState(0);
  const [delay, setDelay] = useState(1000);
  const [accuracy, setAccuracy] = useState(0);
  const [score, setScore] = useState(0);
  const [size, setSize] = useState({ width: 56, height: 48 });
  const [period, setPeriod] = useState(0)

  const calculateAccuracy = () => {
    console.clear(); console.log("Total Click:", totalClick)
    if (totalClick>0) {
      let accuracy = Math.floor((score / totalClick) * 100)
      return accuracy
    }
    return 0
  }

  const randomPosition = (width, height) => {
    const randX = Math.floor(Math.random() * (width - (2 * size.width))) + size.width;
    const randY = Math.floor(Math.random() * (height - (3 * size.width))) + size.height;
    return [ randX, randY ];
  }

  const centerPosition = (width, height) => {
    let x = (width / 2) - (size.width / 2);
    let y = (height / 2) - (size.height / 2);  
    return [ x, y ]
  }

  const decalare = () => {
    let navbar = document.querySelector(".navbar");
    let target = document.querySelector(".target");
    let timerLabel = document.querySelector(".timer span");
    const width = parseFloat(window.innerWidth);
    const height = parseFloat(window.innerHeight);

    if (!timerLabel.getAttribute(attribute)) {
      timerLabel.setAttribute(attribute, limit)
      timerLabel.textContent = formatTimer(limit)  
    }

    return [ navbar, target, timerLabel, width, height ];
  }

  const refreshTarget = (target, x, y) => {
    target.style.width = size.width + "px";
    target.style.height = size.height + "px";
    target.style.left = x + "px";
    target.style.top = y + "px";
  }

  const shootTarget = () => {
    bugScream.play()
    setScore((oldScore) => {
      return (oldScore + 1)
    });
  }

  const bugSometimesLaugh = () => {
    let probability = Math.random()
    if (probability <= 0.6)
      bugLaugh.play()
  }

  const incrementTotalClick = (event) => {
    gunshot.play()

    // if missed
    if (event.target.className != target.className)
      bugSometimesLaugh()
    
    setTotalClick((oldScore) => {
      return (oldScore + 1);
    });
  }

  const timesUp = () => {
    setGameStart(false)
    clearTimeout(repeaterTimer)
    console.log("time's up")
  }

  const formatTimer = (time) => {
    let minute = Math.floor(time/60)
    let second = time%60
    return `${minute}:${second}`
  }

  useEffect(() => {
    if (gameStart) {
      [ navbar, target, timerLabel, width, height ] = decalare();

      gunshot = new UIfx(gunshotURL)
      bugLaugh = new UIfx(BugLaughURL)
      bugScream = new UIfx(bugScreamURL)

      window.addEventListener('click', incrementTotalClick);
      target.addEventListener('click', shootTarget);
      setAccuracy ( calculateAccuracy() );

    
      const repeatMoveTarget = () => {
        [x, y] = randomPosition(width, height);
        refreshTarget(target, x, y);
        repeaterTimer = setTimeout(() => {
          repeatMoveTarget()
        }, delay);
      } 
      repeatMoveTarget()

      return (
        () => {
          clearTimeout(repeaterTimer)
          window.removeEventListener('click', incrementTotalClick);
          target.removeEventListener('click', shootTarget);
          gunshot = null
          bugLaugh = null
          bugScream = null
        }
        )
      }
    }, [score, totalClick, gameStart]);
  
  return (
    <React.Fragment>

    <Stats accuracy={accuracy} score={score} attribute={attribute} timesUp={timesUp} interval={interval} formatTimer={formatTimer} />
    <div className="scene">
      <Target />
    </div>
    </React.Fragment>
  );

  
}

export default App;
