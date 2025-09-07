import React, { memo } from 'react';

const Hero = memo(function Hero() {
  return (
   <div className="hero">
     <h1>Welcome to Our Car Dealership</h1>
     <p>Find your dream car today!</p>
   </div>
  );
});

export default Hero;