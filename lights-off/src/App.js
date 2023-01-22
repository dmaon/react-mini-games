import React, { useState, useEffect } from 'react';
import UIfx from 'uifx'
import './App.css';
import levelupURL from './sounds/levelup.mp3'
import toggleURL from './sounds/toggle.mp3'

// Images from freepik.com
// Sounds from Zapsplat.com and soundbible.com

function App() {
  let levelup, toggle
  const styles = getComputedStyle(document.documentElement)
  const offColor = styles.getPropertyValue('--cell-light-off-color')
  const onColor = styles.getPropertyValue('--cell-light-on-color')
  const [moveCount, setMoveCount] = useState(0)
  const [level, setLevel] = useState(1)
  const [lights, setLights] = useState([])
  const [startState, setStartState] = useState(true)

  const formatMovesCount = (value) => {
    if (value<=0) 
      return 'Turn All the Lights Off'
    return  `${value} moves`
  }
  
  useEffect(() => {
    const box = document.querySelector('.box')
    levelup = new UIfx(levelupURL)
    toggle = new UIfx(toggleURL)

    const parseBoolean = (value) => {
      if (value === 'true' )
        return true
      return false
    } 

    const checkSelectedTargetState = (target) => {
      let targetSelected = target.getAttribute('selected')
      targetSelected = parseBoolean(targetSelected) ? 'false':'true'
      return targetSelected
    }

    const lightOn = (target) => {
      let targetSelected = checkSelectedTargetState(target)
      target.setAttribute('selected', targetSelected)
      target.style.backgroundColor =  parseBoolean(targetSelected) ? onColor:offColor
    }

    const doToggle = (row, col) => {
      
      let selectedTarget, targetSelectedAttr
      const targets = []
      let lightsState = [...lights]
      let condition, item, cell

      // toggle center
      targets.push(`${row},${col}`)
      
      // toggle north
      if (row-1 >= 0) {
        targets.push(`${row-1},${col}`)
      }

      // toggle east
      if (col+1 < 5) {
        targets.push(`${row},${col+1}`)
      }
      
      // toggle south
      if (row+1 < 5) {
        targets.push(`${row+1},${col}`)
      }
      
      // toggle west
      if (col-1 >= 0) {
        targets.push(`${row},${col-1}`)
      }
      
      // toggling all lights
      for (item of targets) {
        cell = item.split(',')
        row = cell[0]
        col = cell[1]
        condition = `${row},${col}`
        selectedTarget = document.querySelector(`.cell[row|="${row}"].cell[col|="${col}"]`)
        targetSelectedAttr = checkSelectedTargetState(selectedTarget)
        if (parseBoolean(targetSelectedAttr)) {
          lightsState.push(condition)
        } else {
          lightsState = lightsState.filter(item => item !== condition)
        }
      } 
      setLights(lightsState)

      toggle.play()
      setMoveCount(oldValue => {
          return oldValue+1
      })
  
      if (lightsState.length < 1) {
        levelup.play()
        setMoveCount(0)
        setLevel(oldValue => {
            return oldValue+1
          })
          setStartState(true)
      }

    }

    const setLightsOn = () => {

      let cells = [...lights]
      let cell, row, col
      cells.map(item => {
        cell = item.split(',')
        row = cell[0]
        col = cell[1]
        lightOn( document.querySelector(`.cell[row|="${row}"].cell[col|="${col}"]`))
      })
    }

    const randomLightsOnList = (count) => {
      let randomPosition = []
      let row, col
      let condition
      while (count>0) {
        row = Math.floor(Math.random() * 5)
        col = Math.floor(Math.random() * 5)
        condition = `${row},${col}`
        if (randomPosition.indexOf(condition) === -1) {
          randomPosition.push(condition)
          count -= 1
        }
      }
      return randomPosition
    }

    const handleToggle = (event) => {

      let target = event.target
      const targetRow = parseInt(target.getAttribute('row'))
      const targetCol = parseInt(target.getAttribute('col'))
      
      doToggle(targetRow, targetCol)  

    }
    
    let i = 0
    let j = 0
    let boxes = ""
    while(1) {
      if (j !== 0 && j % 5 === 0) {
        i += 1
        j = 0
      }
      if (i>=5) 
      break
      
      boxes += `<div class='cell' selected='false' row='${i}' col='${j}'></div>`
      j += 1
    }
    
    box.innerHTML = boxes
    
    document.querySelectorAll('.box div').forEach(cell => {
      cell.addEventListener('click', handleToggle)
    })

    if (startState) {
      setLights(randomLightsOnList(5))
      setStartState(false)
    }
    setLightsOn()
    
    return (() => {
      levelup = null
      toggle = null
      document.querySelectorAll('.box div').forEach(cell => {
        cell.removeEventListener('click', handleToggle)
      })      
    })

  }, [moveCount, level, lights, startState])

  return (
    <React.Fragment>
      <div className='container'>
        <div className='menu'>
          <span className='level'>Level : {level}</span>
          <span className='moves'>{formatMovesCount(moveCount)}</span>
        </div>
        <div className='box'></div>
      </div>
    </React.Fragment>
  );

}

export default App;
