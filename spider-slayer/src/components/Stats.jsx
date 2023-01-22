import React, { Component, useEffect } from 'react';

function Stats(props) {
    useEffect(() => {
        const timerTarget = document.querySelector('.timer span')
        let timer = setTimeout(() => {    
            const repeatTimer = () => {
                timer = setTimeout(() => {    
                    if (!timerTarget.getAttribute(props.attribute))
                        return
                    const newValue = parseInt(timerTarget.getAttribute(props.attribute))-1
                    if ( newValue < 0) {
                        clearTimeout(timer)
                        props.timesUp()
                    }
                    else {
                        timerTarget.setAttribute( props.attribute, newValue )
                        timerTarget.textContent = props.formatTimer(newValue)
                        repeatTimer()
                    }
                }, props.interval);
            } 
            repeatTimer()
        }, props.interval);

        return (
            () => {
                clearTimeout(timer)
            }
        )
    }, [])

    return ( 
        <div className='navbar'>
            <div className="score">
            Score: <span>{props.score}</span>
            </div>
            <div className="accuracy">
            Accuracy: <span>{props.accuracy}%</span>
            </div>
            <div className="timer">
            <span>00:00</span>
            </div>
        </div>
     );
}

export default Stats;