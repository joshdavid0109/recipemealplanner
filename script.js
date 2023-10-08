
const apiKey = 'cea59ef24546496894acd5f36606d04d'; 

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.searchInput');
    const recipeResults = document.querySelector('.recipeResults');

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value;
            if (query.trim() !== '') {
                fetchRecipes(query);
            }
        }
    });

    async function fetchRecipes(query) {
        const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=10&apiKey=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            displayRecipes(data.results);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    function displayRecipes(recipes) {
        recipeResults.innerHTML = ''; 

        recipes.forEach((recipe) => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipeCard');

            recipeCard.addEventListener('click', () => {
                const popupContainer = document.getElementById('popupContainer');
                const popupContent = document.querySelector('.popupContent');
                popupContent.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <p>${recipe.title}</p>
                    <!-- Add more recipe details here -->
                `;
                popupContainer.style.display = 'block';
            });

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;

            const nutritionInfo = document.createElement('div');
            nutritionInfo.classList.add('nutritionInfo');

            recipeCard.addEventListener('mouseenter', async () => {
                try {
                  const nutritionData = await fetchNutritionData(recipe.id);
                  nutritionInfo.innerHTML = generateNutritionHTML(nutritionData);
                } catch (error) {
                  console.error('Error fetching nutrition data:', error);
                }
              });
        
              recipeCard.addEventListener('mouseleave', () => {
                nutritionInfo.innerHTML = '';
              });

            const recipeName = document.createElement('p');
            recipeName.textContent = recipe.title;

            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(recipeName);
            recipeCard.appendChild(nutritionInfo);
            recipeResults.appendChild(recipeCard);
        });
    }
    async function fetchNutritionData(recipeId) {
        const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${apiKey}`;
    
        try {
          const response = await fetch(apiUrl);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error('Error fetching nutrition data:', error);
          throw error;
        }
      }

    function generateNutritionHTML(nutritionData) {
    const nutrients = nutritionData.nutrients;
    
    const nutrientsHTML = nutrients.map((nutrient) => `
        <div class="nutrient">
        <strong>${nutrient.name}:</strong> ${nutrient.amount} ${nutrient.unit} (${nutrient.percentOfDailyNeeds}%)
        </div>
    `).join('');
    
    const nutritionHTML = `
        <div class="nutrition-info">
        <h3>Nutrition Information</h3>
        <div class="nutrients">
            ${nutrientsHTML}
        </div>
        </div>
    `;
    
    return nutritionHTML;
    }

    const popupContainer = document.getElementById('popupContainer');
    popupContainer.addEventListener('click', (event) => {
        if (event.target === popupContainer) {
            popupContainer.style.display = 'none';
        }
    });
});