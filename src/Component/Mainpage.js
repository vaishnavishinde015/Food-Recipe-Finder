import React, { useState, useEffect } from 'react';
import Mealcards from './Mealcards';

export const Mainpage = () => {
  const [meals, setMeals] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [randomMeal, setRandomMeal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch random meal and categories on component mount
  useEffect(() => {
    fetchRandomMeal();
    fetchCategories();
  }, []);

  const fetchRandomMeal = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      setRandomMeal(data.meals?.[0]);
    } catch (error) {
      console.error("Error fetching random meal:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handleSearch = async () => {
    const searchTermToUse = searchTerm.trim();
    
    if (!searchTermToUse) {
      setErrorMessage("Please enter a dish name");
      setMeals(null);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTermToUse)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals(null);
        setErrorMessage(`No meals found for "${searchTermToUse}". Try a different search term.`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to fetch meals. Please check your connection and try again.");
      setMeals(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySearch = async (category) => {
    setSelectedCategory(category);
    try {
      setIsLoading(true);
      setErrorMessage("");
      
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.meals) {
        setMeals(data.meals);
        setSearchTerm("");
      } else {
        setMeals(null);
        setErrorMessage(`No meals found in category "${category}".`);
      }
    } catch (error) {
      console.error("Error fetching category meals:", error);
      setErrorMessage("Failed to fetch meals by category. Please try again.");
      setMeals(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRandomMeal = () => {
    fetchRandomMeal();
    setMeals(null);
    setSearchTerm("");
    setSelectedCategory("");
  };

  return (
    <div className="main-page" style={styles.mainPage}>
      <h1 style={styles.header}>Food Recipe Finder</h1>
      <div style={styles.container}>
        <div style={styles.searchContainer}>
          <div style={styles.searchBar}>
            <input 
              type="text" 
              placeholder="Search for a dish (e.g., pizza, pasta)" 
              value={searchTerm}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              aria-label="Search for dishes"
              style={styles.searchInput}
            />
            <button 
              onClick={handleSearch} 
              disabled={isLoading}
              style={{
                ...styles.searchButton,
                ...(isLoading ? styles.searchButtonDisabled : {}),
              }}
            >
              {isLoading ? (
                <span style={styles.buttonContent}>
                  <span style={styles.spinnerSmall}></span> Searching...
                </span>
              ) : 'Search'}
            </button>
            <button 
              onClick={handleRandomMeal}
              style={styles.randomButton}
              title="Get random meal"
            >
              <span style={styles.buttonContent}>🎲 Random</span>
            </button>
          </div>
        </div>
        
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

        {/* Categories */}
        <div style={styles.categoriesContainer}>
          {categories.map(category => (
            <button
              key={category.strCategory}
              onClick={() => handleCategorySearch(category.strCategory)}
              style={{
                ...styles.categoryButton,
                ...(selectedCategory === category.strCategory ? styles.categoryButtonActive : {})
              }}
            >
              {category.strCategory}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Searching recipes...</p>
          </div>
        ) : (
          <div style={styles.contentContainer}>
            {/* Show random meal if no search results */}
            {!meals && randomMeal && (
              <div style={styles.featuredMeal}>
                <h2 style={styles.featuredTitle}>Featured Meal</h2>
                <Mealcards detail={randomMeal} featured={true} />
              </div>
            )}

            {/* Show search results */}
            {meals && (
              <>
                <h2 style={styles.resultsTitle}>
                  {selectedCategory ? `${selectedCategory} Meals` : `Results for "${searchTerm}"`}
                </h2>
                <div style={styles.mealGrid}>
                  {meals.map((meal) => (
                    <Mealcards key={meal.idMeal} detail={meal} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Embedded CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// CSS-in-JS styles
const styles = {
  mainPage: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    color: '#333',
    minHeight: '100vh',
  },
    header: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2.5rem',
    fontWeight: '600',
    background: 'linear-gradient(to right, #3498db, #e74c3c)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  searchContainer: {
    width: '100%',
    maxWidth: '800px',
    marginBottom: '20px',
  },
  searchBar: {
    display: 'flex',
    width: '100%',
    boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
    borderRadius: '50px',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    padding: '15px 25px',
    border: 'none',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    padding: '0 25px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '120px',
  },
  randomButton: {
    padding: '0 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  searchButtonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  },
  errorMessage: {
    color: '#e74c3c',
    textAlign: 'center',
    margin: '10px 0',
    fontWeight: '500',
    fontSize: '16px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
  },
  spinner: {
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #e74c3c',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  spinnerSmall: {
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite',
    display: 'inline-block',
  },
  loadingText: {
    color: '#7f8c8d',
    fontSize: '18px',
  },
  contentContainer: {
    width: '100%',
    marginTop: '20px',
  },
  featuredMeal: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  featuredTitle: {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '1.8rem',
    fontWeight: '600',
  },
  resultsTitle: {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '1.5rem',
    fontWeight: '600',
    textAlign: 'center',
  },
  mealGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '30px',
    width: '100%',
  },
  categoriesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    maxWidth: '800px',
  },
  categoryButton: {
    padding: '10px 20px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  categoryButtonActive: {
    backgroundColor: '#3498db',
    color: 'white',
    transform: 'scale(1.05)',
  },
};

export default Mainpage;
