
const apiKey = '71b69fc73b0248edb265c0ec9bcc7ad3'; 

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
        recipeResults.innerHTML = ''; // Clear previous results

        recipes.forEach((recipe) => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipeCard');

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;

            const recipeName = document.createElement('p');
            recipeName.textContent = recipe.title;

            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(recipeName);
            recipeResults.appendChild(recipeCard);
        });
    }
});