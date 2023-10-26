// API KEYS:
// 71b69fc73b0248edb265c0ec9bcc7ad3 (Used up for 10/26/2023)
// caf48c542cf34b56bc4c3926b208a94b (Used up for 10/26/2023)
// cea59ef24546496894acd5f36606d04d (Used up for 10/26/2023)
// d11c4d40523f46a5a767e57254b8fe2d (Used up for 10/26/2023)
// 118e02b187ec440387921fa4646524e7 (Used up for 10/26/2023)
// 1763e0afde7a465f9a24dc4cef3fdf37 (Used up for 10/26/2023)
// 
// 

const apiKey = '89db2d3f161943dbb7bff3f0eab5bc60'; 

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.searchInput');
    const recipeResults = document.querySelector('.recipeResults');
    const cuisineFilter = document.getElementById('cuisineFilter');
    const dietFilter = document.getElementById('dietFilter');
    const intoleranceFilter = document.getElementById('intoleranceFilter');
    const typeFilter = document.getElementById('typeFilter');
    const filterControls = [cuisineFilter, dietFilter, intoleranceFilter, typeFilter];

    // search input recipes
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value;
            const selectedCuisine = cuisineFilter.value;
            const selectedDiet = dietFilter.value;
            const selectedIntolerance = intoleranceFilter.value;
            const selectedType = typeFilter.value;
            fetchRecipes(query, selectedCuisine, selectedDiet, selectedIntolerance, selectedType);
        }
    });
    
    // automatically fetch for recipes
    fetchRecipes('', 'Any', 'Any', 'None', 'Any');

    filterControls.forEach((control) => {
        control.addEventListener('change', () => {
            const selectedCuisine = cuisineFilter.value;
            const selectedDiet = dietFilter.value;
            const selectedIntolerance = intoleranceFilter.value;
            const selectedType = typeFilter.value;
            fetchRecipes(searchInput.value, selectedCuisine, selectedDiet, selectedIntolerance, selectedType);
        });
    });

    
    // fetching of data
    async function fetchRecipes(query, cuisine, diet, intolerance, type, duration) {
        let apiUrl;

        // object to hold the query parameters
        const queryParams = {
            number: 10,
            apiKey: apiKey,
        };
    
        if (query) {
            queryParams.query = query;
        }
    
        if (cuisine !== 'Any') {
            queryParams.cuisine = cuisine;
        }
    
        if (diet !== 'Any') {
            queryParams.diet = diet;
        }
    
        if (intolerance !== 'None') {
            queryParams.intolerances = intolerance;
        }
    
        if (type !== 'Any') {
            queryParams.type = type;
        }
    
        // Construct the API URL with all the query parameters
        apiUrl = `https://api.spoonacular.com/recipes/complexSearch?${new URLSearchParams(queryParams)}`;
    
        try {
            const response = await fetch(apiUrl);
    
            if (!response.ok) {
                console.error('Failed to fetch recipes. Response status:', response.status);
                return;
            }
    
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

            const spoonacularContainer = document.createElement('div');
            spoonacularContainer.classList.add('spoonacular');
            const spoonacularLogo = document.createElement('img');
            spoonacularLogo.classList.add('spoonacular-logo');
            spoonacularLogo.src = './images/spoonacular.png';
            spoonacularLogo.alt = 'https://spoonacular.com/';
            const spoonacularName = document.createElement('p');
            spoonacularName.classList.add('spoonacular-name');
            spoonacularName.textContent = 'spoonacular';

            spoonacularContainer.appendChild(spoonacularLogo);
            spoonacularContainer.appendChild(spoonacularName);

            recipeCard.addEventListener('click', async () => {
                const popupContainer = document.getElementById('popupContainer');
                const popupContent = document.querySelector('.popupContent');
                popupContent.innerHTML = `
                    <img class = "recipe-img" src="${recipe.image}" alt="${recipe.title}">
                    <p class = "recipe-title">${recipe.title}</p>
                `;
                popupContainer.style.display = 'block';
            });

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.image;

            const heartContainer = document.createElement('div');
            heartContainer.classList.add('heart-container');
            const heart = document.createElement('div');
            heart.classList.add('heart', 'darkgreen-heart');
            const darkgreenHeart = document.createElement('img');
            darkgreenHeart.src = './images/darkgreen-heart.png';
            darkgreenHeart.alt = 'https://clipart-library.com/free/green-heart-transparent-background.html';
            const lightgreenHeart = document.createElement('div');
            lightgreenHeart.classList.add('lightgreen-heart');
            const lightgreenHeartImg = document.createElement('img');
            lightgreenHeartImg.src = './images/lightgreen-heart.png';
            lightgreenHeartImg.alt = 'https://clipart-library.com/free/green-heart-transparent-background.html';
    
            lightgreenHeart.appendChild(lightgreenHeartImg);
            heart.appendChild(darkgreenHeart);
            heart.appendChild(lightgreenHeart);

            const titleContainer = document.createElement('div');
            titleContainer.classList.add('recipe-title-container');

            const recipeTitle = document.createElement('p');
            recipeTitle.classList.add('recipe-title');
            recipeTitle.textContent = recipe.title;

            const nutritionInfo = document.createElement('div');
            nutritionInfo.classList.add('nutritionInfo');

            recipeCard.addEventListener('mouseenter', async () => {
                try {
                    const nutritionData = await fetchNutritionData(recipe.id);
                    nutritionInfo.innerHTML = generateNutritionHTML(recipe.id, nutritionData);
                    drawNutritionChart(recipe.id, nutritionData.nutrients);
                } catch (error) {
                    console.error('Error fetching nutrition data:', error);
                }
            });

            recipeCard.addEventListener('mouseleave', () => {
                nutritionInfo.innerHTML = '';
            });

            const recipeName = document.createElement('p');
            recipeName.textContent = recipe.title;

            heartContainer.appendChild(heart);

            titleContainer.appendChild(heartContainer);
            titleContainer.appendChild(recipeTitle);

            recipeCard.appendChild(spoonacularContainer);
            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(titleContainer);
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

    function generateNutritionHTML(recipeId) {
        const nutritionHTML = `
            <div class="nutrition-info">
                <canvas id="nutritionChart-${recipeId}"></canvas>
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

    function drawNutritionChart(recipeId, nutrients) {
        const labels = nutrients.map((nutrient) => nutrient.name);
        const values = nutrients.map((nutrient) => nutrient.amount);
    
        const ctx = document.getElementById(`nutritionChart-${recipeId}`).getContext('2d');
    
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(255, 0, 0, 0.7)', 
                        'rgba(0, 255, 0, 0.7)', 
                        'rgba(0, 0, 255, 0.7)', 
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 0, 0, 1)', 
                        'rgba(0, 255, 0, 1)', 
                        'rgba(0, 0, 255, 1)', 
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false, 
                    },
                    tooltip: {
                        enabled: true,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + Math.round(context.parsed * 100) / 100;
                            },
                        }
                    },
                },
            },
        });
    }
    
});