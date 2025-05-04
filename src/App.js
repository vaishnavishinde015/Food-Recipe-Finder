import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Mainpage from './Component/Mainpage';
import MealInfo from './Component/Mealinfo';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/meal/:id" element={<MealInfo />} /> {/* Updated to match the imported component name */}
      </Routes>
    </div>
  );
}

export default App;
