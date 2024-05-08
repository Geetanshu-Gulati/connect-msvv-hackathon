import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import useWindowSize from './useWindowSize';

const settings = {
  maxTilt: 25, // degrees
  rotationPower: 50,
  swipeThreshold: 0.5 // adjust as needed
};

const TinderCard = ({ entrepreneur, onSwipe }) => {
  const { width, height } = useWindowSize();
  const [{ xyrot }, setSpringTarget] = useSpring(() => ({ xyrot: [0, 0, 0] }));

  const handleSwipe = (direction) => {
    onSwipe(direction, entrepreneur.id);
    setSpringTarget.start({ xyrot: [0, 0, 0] });
  };

  const swipeRight = () => handleSwipe('right');
  const swipeLeft = () => handleSwipe('left');

  return (
    <animated.div
      style={{
        transform: xyrot.to((x, y, rot) => `translate3d(${x}px, ${y}px, 0px) rotate(${rot}deg)`),
        touchAction: 'none', 
        userSelect: 'none', 
        position: 'absolute',
        width: '100%',
        height: '100%',
        willChange: 'transform', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'lightgray',
        borderRadius: '10px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)'
      }}
      onMouseDown={swipeRight}
      onDoubleClick={swipeLeft}
    >
      <div style={{ textAlign: 'center' }}>
        <h2>{entrepreneur.name}</h2>
        <p>{entrepreneur.company}</p>
        <p>{entrepreneur.location}</p>
        <p>{entrepreneur.email}</p>
        <p>{entrepreneur.gender}</p>
      </div>
    </animated.div>
  );
};

const App = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/entrepreneurs')
      .then(response => response.json())
      .then(data => setEntrepreneurs(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSwipe = (direction, entrepreneurId) => {
    console.log(`Swiped ${direction} on entrepreneur with ID ${entrepreneurId}`);
    fetch('http://localhost:5000/swipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entrepreneur_id: entrepreneurId, direction: direction })
    })
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.error('Error handling swipe:', error));
  };

  return (
    <div style={{ position: 'relative', width: '300px', height: '400px', margin: '50px auto' }}>
      {entrepreneurs.map((entrepreneur) => (
        <TinderCard key={entrepreneur.id} entrepreneur={entrepreneur} onSwipe={handleSwipe} />
      ))}
    </div>
  );
};

export default App;
