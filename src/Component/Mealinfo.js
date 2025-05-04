import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaYoutube, FaArrowLeft, FaUtensils, FaGlobeAmericas, FaHeart } from 'react-icons/fa';

const MealInfo = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMealDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch meal details');

        const data = await response.json();
        
        if (!data.meals || data.meals.length === 0) {
          throw new Error('Meal not found');
        }

        setMeal(data.meals[0]);
        // Check if meal is in favorites
        const favorites = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
        setIsFavorite(favorites.includes(id));
      } catch (err) {
        console.error("Error fetching meal details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMealDetails();
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteMeals') || '[]');
    const newFavorites = isFavorite
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    localStorage.setItem('favoriteMeals', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]?.trim()) {
        ingredients.push({
          ingredient: meal[`strIngredient${i}`],
          measure: meal[`strMeasure${i}`] || '',
        });
      }
    }
    return ingredients;
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Preparing your culinary journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>Recipe Lost in the Kitchen</h2>
          <p style={styles.errorMessage}>{error}</p>
          <Link to="/" style={styles.backButton}>
            <FaArrowLeft style={styles.buttonIcon} />
            Back to Safety
          </Link>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div style={styles.notFoundContainer}>
        <div style={styles.notFoundCard}>
          <h2 style={styles.notFoundTitle}>Recipe Not Found</h2>
          <p style={styles.notFoundMessage}>This dish seems to have escaped our cookbook.</p>
          <Link to="/" style={styles.backButton}>
            <FaArrowLeft style={styles.buttonIcon} />
            Explore Other Recipes
          </Link>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients();

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <div style={styles.headerRow}>
          <Link to="/" style={styles.backLink}>
            <FaArrowLeft style={styles.backIcon} />
            Back to Recipes
          </Link>
          <button 
            onClick={toggleFavorite}
            style={isFavorite ? styles.favoriteButtonActive : styles.favoriteButton}
          >
            <FaHeart style={styles.heartIcon} />
            {isFavorite ? 'Saved' : 'Save Recipe'}
          </button>
        </div>

        <div style={styles.mealCard}>
          {/* Compact Image Section */}
          <div style={styles.imageContainer}>
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              style={styles.mealImage}
            />
            <div style={styles.titleContainer}>
              <h1 style={styles.mealTitle}>{meal.strMeal}</h1>
              <div style={styles.tagContainer}>
                <span style={styles.categoryTag}>
                  <FaUtensils style={styles.tagIcon} />
                  {meal.strCategory}
                </span>
                <span style={styles.areaTag}>
                  <FaGlobeAmericas style={styles.tagIcon} />
                  {meal.strArea}
                </span>
              </div>
            </div>
          </div>

          {/* Meal Content - Single Column Layout */}
          <div style={styles.mealContent}>
            {/* Ingredients Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Ingredients</h2>
              <div style={styles.ingredientsGrid}>
                {ingredients.map((item, index) => (
                  <div key={index} style={styles.ingredientCard}>
                    <span style={styles.ingredientName}>{item.ingredient}</span>
                    <span style={styles.ingredientMeasure}>{item.measure}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Instructions</h2>
              <div style={styles.instructionsText}>
                {meal.strInstructions.split('\n').filter(para => para.trim()).map((paragraph, i) => (
                  <p key={i} style={styles.instructionParagraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Footer Section */}
            <div style={styles.footerSection}>
              {meal.strTags && (
                <div style={styles.tagsContainer}>
                  {meal.strTags.split(',').map(tag => (
                    <span key={tag} style={styles.tagLabel}>
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {meal.strYoutube && (
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.youtubeButton}
                >
                  <FaYoutube style={styles.youtubeIcon} />
                  Watch Tutorial
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern, Compact Styles
const styles = {
  // Layout
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#fff9f5', // warm off-white background
    padding: '2rem',
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem 0',
    borderBottom: '1px solid rgba(232, 185, 160, 0.3)', // warm subtle border
  },

  // Modern food-friendly color palette
  colors: {
    primary: '#FF7B54', // warm orange
    primaryLight: '#FFB26B', // lighter orange
    primaryDark: '#D94B2B', // deeper orange
    secondary: '#6C4A3A', // chocolate brown
    accent: '#5C9EAD', // teal blue
    success: '#7AA874', // natural green
    warning: '#F7B801', // golden yellow
    danger: '#E76161', // soft red
    light: '#FFF9F5', // warm off-white
    dark: '#2C2C2C', // almost black
    textPrimary: '#2C2C2C',
    textSecondary: '#6C4A3A', // using secondary color for text
    background: '#FFF9F5',
    cardBackground: '#FFFFFF',
  },

  // Typography
  typography: {
    heading: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#2C2C2C',
      lineHeight: '1.2',
      fontFamily: '"Playfair Display", serif', // elegant serif for headings
    },
    subheading: {
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#6C4A3A',
      fontFamily: '"Playfair Display", serif',
      marginBottom: '1rem',
    },
    body: {
      fontSize: '1.1rem',
      lineHeight: '1.7',
      color: '#2C2C2C',
      fontFamily: '"Open Sans", sans-serif',
    },
    small: {
      fontSize: '0.9rem',
      color: '#6C4A3A',
      fontFamily: '"Open Sans", sans-serif',
    },
  },

  // Shadows
  shadows: {
    small: '0 2px 4px rgba(108, 74, 58, 0.1)',
    medium: '0 4px 8px rgba(108, 74, 58, 0.15)',
    large: '0 8px 16px rgba(108, 74, 58, 0.2)',
    floating: '0 15px 30px rgba(108, 74, 58, 0.2)',
  },

  // Border radius
  radii: {
    small: '6px',
    medium: '12px',
    large: '16px',
    full: '9999px',
  },

  // Spacing system
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },

  // Back Link
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#6C4A3A',
    textDecoration: 'none',
    fontWeight: '600',
    padding: '0.5rem 0',
    transition: 'color 0.2s',
    fontFamily: '"Open Sans", sans-serif',
    '&:hover': {
      color: '#FF7B54',
    },
  },
  backIcon: {
    marginRight: '0.5rem',
    fontSize: '1.2rem',
  },

  // Favorite Button
  favoriteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.6rem 1.2rem',
    backgroundColor: 'transparent',
    color: '#6C4A3A',
    border: '2px solid #6C4A3A',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: '600',
    '&:hover': {
      backgroundColor: 'rgba(108, 74, 58, 0.1)',
    },
  },
  favoriteButtonActive: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#FF7B54',
    color: 'white',
    border: '2px solid #FF7B54',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: '"Open Sans", sans-serif',
    fontWeight: '600',
    '&:hover': {
      backgroundColor: '#D94B2B',
      borderColor: '#D94B2B',
    },
  },
  heartIcon: {
    marginRight: '0.5rem',
    fontSize: '1.2rem',
  },

  // Meal Card
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(108, 74, 58, 0.15)',
    overflow: 'hidden',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 24px rgba(108, 74, 58, 0.2)',
    },
  },

  // Image Section
  imageContainer: {
    position: 'relative',
    height: '250px',
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  titleContainer: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    padding: '1.5rem',
    background: 'linear-gradient(to top, rgba(44, 44, 44, 0.7), transparent)',
    color: 'white',
  },
  mealTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    fontFamily: '"Playfair Display", serif',
  },
  tagContainer: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  categoryTag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.3rem 0.9rem',
    backgroundColor: 'rgba(255, 123, 84, 0.9)',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textShadow: 'none',
  },
  areaTag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.3rem 0.9rem',
    backgroundColor: 'rgba(122, 168, 116, 0.9)',
    borderRadius: '50px',
    fontSize: '0.85rem',
    fontWeight: '600',
    textShadow: 'none',
  },
  tagIcon: {
    marginRight: '0.3rem',
    fontSize: '0.8rem',
  },

  // Meal Content
  mealContent: {
    padding: '1.5rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#6C4A3A',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid rgba(232, 185, 160, 0.5)',
    fontFamily: '"Playfair Display", serif',
  },

  // Ingredients
  ingredientsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
  },
  ingredientCard: {
    backgroundColor: '#FFF9F5',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.3s',
    border: '1px solid rgba(232, 185, 160, 0.3)',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 8px rgba(108, 74, 58, 0.1)',
    },
  },
  ingredientImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginBottom: '0.5rem',
    border: '2px solid #FFB26B',
  },
  ingredientName: {
    fontWeight: '600',
    marginBottom: '0.3rem',
    color: '#2C2C2C',
  },
  ingredientMeasure: {
    fontSize: '0.85rem',
    color: '#6C4A3A',
    fontWeight: '500',
  },

  // Instructions
  instructionsText: {
    color: '#2C2C2C',
    lineHeight: '1.8',
    fontSize: '1.1rem',
  },
  instructionParagraph: {
    marginBottom: '1.5rem',
    paddingLeft: '1rem',
    borderLeft: '3px solid #FFB26B',
  },

  // Footer
  footerSection: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(232, 185, 160, 0.3)',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tagLabel: {
    padding: '0.4rem 0.9rem',
    backgroundColor: '#FFF9F5',
    borderRadius: '50px',
    fontSize: '0.85rem',
    color: '#6C4A3A',
    fontWeight: '500',
    border: '1px solid rgba(232, 185, 160, 0.5)',
  },

  // YouTube Button
  youtubeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.7rem 1.3rem',
    backgroundColor: '#FF0000',
    color: 'white',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s',
    fontFamily: '"Open Sans", sans-serif',
    '&:hover': {
      backgroundColor: '#CC0000',
      transform: 'translateY(-2px)',
    },
  },
  youtubeIcon: {
    marginRight: '0.5rem',
    fontSize: '1.2rem',
  },

  // Loading State
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#FFF9F5',
  },
  spinner: {
    width: '4rem',
    height: '4rem',
    border: '4px solid rgba(255, 123, 84, 0.2)',
    borderTopColor: '#FF7B54',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1.5rem',
    color: '#6C4A3A',
    fontSize: '1.2rem',
    fontFamily: '"Playfair Display", serif',
  },

  // Error State
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '1rem',
    backgroundColor: '#FFF9F5',
  },
  errorCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 8px 16px rgba(108, 74, 58, 0.15)',
    maxWidth: '500px',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#E76161',
    marginBottom: '1rem',
    fontFamily: '"Playfair Display", serif',
  },
  errorMessage: {
    color: '#6C4A3A',
    marginBottom: '2rem',
    fontSize: '1.1rem',
  },

  // Not Found State
  notFoundContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '1rem',
    backgroundColor: '#FFF9F5',
  },
  notFoundCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '2.5rem',
    boxShadow: '0 8px 16px rgba(108, 74, 58, 0.15)',
    maxWidth: '500px',
    textAlign: 'center',
  },
  notFoundTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#6C4A3A',
    marginBottom: '1rem',
    fontFamily: '"Playfair Display", serif',
  },
  notFoundMessage: {
    color: '#6C4A3A',
    marginBottom: '2rem',
    fontSize: '1.1rem',
  },

  // Back Button (for error/not found states)
  backButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.7rem 1.5rem',
    backgroundColor: '#FF7B54',
    color: 'white',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s',
    fontFamily: '"Open Sans", sans-serif',
    '&:hover': {
      backgroundColor: '#D94B2B',
      transform: 'translateY(-2px)',
    },
  },
  buttonIcon: {
    marginRight: '0.5rem',
    fontSize: '1.2rem',
  },

  // Recipe Grid
  recipeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },

  // Search and Filter
  searchContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: '1',
    minWidth: '250px',
    padding: '0.8rem 1.2rem',
    border: '2px solid rgba(108, 74, 58, 0.3)',
    borderRadius: '50px',
    fontSize: '1rem',
    fontFamily: '"Open Sans", sans-serif',
    transition: 'all 0.3s',
    '&:focus': {
      outline: 'none',
      borderColor: '#FF7B54',
      boxShadow: '0 0 0 3px rgba(255, 123, 84, 0.2)',
    },
  },
  filterButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: 'white',
    color: '#6C4A3A',
    border: '2px solid rgba(108, 74, 58, 0.3)',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: '"Open Sans", sans-serif',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
      backgroundColor: '#FFF9F5',
      borderColor: '#FF7B54',
    },
  },

  // Animation
  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
};

export default MealInfo;