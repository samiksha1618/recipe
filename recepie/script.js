const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeDetails = document.querySelector('.recipe-details');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

const fetchRecipes = async (query) => {
    try {
        recipeContainer.innerHTML = "Fetching Recipes...";
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        
        // Clear previous results
        recipeContainer.innerHTML = '';

        // Display results
        if (data.meals) {
            data.meals.forEach(meal => {
                const mealElement = document.createElement('div');
                mealElement.classList.add('recipe');
                mealElement.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `;

                // Create a button and append it to mealElement
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                mealElement.appendChild(button);
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });

                // Append the mealElement to recipeContainer
                recipeContainer.appendChild(mealElement);
            });
        } else {
            recipeContainer.innerHTML = '<p>No recipes found.</p>';
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}

const openRecipePopup = (meal) => {
    // Collect ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${ingredient} (${measure})`);
        }
    }

    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    `;
    recipeDetails.style.display = "block"; // Show the popup
}

recipeCloseBtn.addEventListener('click', () => {
    recipeDetails.style.display = "none"; // Close the popup
});

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
});
