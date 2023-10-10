const apiKey = '1f8a5a4bebbe4428b9e3597002636eae'; 

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
        // Add more colors as needed
        ],
        borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        // Add more colors as needed
        ],
        borderWidth: 1
        }]
        },
        options: {
        legend: {
        display: false,
        },
        plugins: {
            tooltip: {
            enabled: true,
            displayColors: false,
            callbacks: {
            label: function (context) {
            var label = context.label || '';
            if (label) {
            label += ': ';
            }
            label += Math.round(context.parsed * 100) / 100;
            return label;
            },
            }
            }
            },
        },
        });
       }
});