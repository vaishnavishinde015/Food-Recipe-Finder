import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const Mealcards = ({ detail }) => {
  // Fallback image in case the API doesn't provide one
  const imageSrc = detail.strMealThumb || 'https://via.placeholder.com/300x200?text=No+Image';
  
  return (
    <article className="meal-card" aria-labelledby={`meal-title-${detail.idMeal}`}>
      <div className="meal-image-container">
        <img 
          src={imageSrc} 
          alt={detail.strMeal} 
          className="meal-image" 
          loading="lazy" // lazy loading for better performance
        />
      </div>
      
      <div className="meal-content">
        <h2 id={`meal-title-${detail.idMeal}`} className="meal-title">
          {detail.strMeal}
        </h2>
        
        <div className="meal-meta">
          <p className="meal-cuisine">
            <span role="img" aria-label="Cuisine">🌍</span> {detail.strArea} Cuisine
          </p>
          <p className="meal-category">
            <span role="img" aria-label="Category">🍽️</span> {detail.strCategory}
          </p>
        </div>
        
        <NavLink 
          to={`/meal/${detail.idMeal}`}
          className="recipe-link"
          aria-label={`View recipe for ${detail.strMeal}`}
        >
          <button className="recipe-button">
            View Recipe →
          </button>
        </NavLink>
      </div>
    </article>
  );
};

Mealcards.propTypes = {
  detail: PropTypes.shape({
    idMeal: PropTypes.string.isRequired,
    strMeal: PropTypes.string.isRequired,
    strMealThumb: PropTypes.string,
    strArea: PropTypes.string.isRequired,
    strCategory: PropTypes.string.isRequired,
  }).isRequired,
};

export default Mealcards;