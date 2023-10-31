const apiKey = 'ef33a96b0f7e4e488bb63498044aac80';
// '1d8e205d231542548f75f8be9391d509' // used 
// '42d0741f34194e32ad48aa85fefe25e1'; // used
// '2886e781d9574d92bfa049cefe0af1d6'; // used
// 'e2c561980b2541d0aa63c3a050eedb12'; // used
// 'fc01f946b23c4e8480d5860dae1cd136'; //used
// '329a152fdb5f43be85d641742810a7d3'; // used
// '0c76fca9ec2a41c58093b2c8a8a042e1';

const cars = new Array();


var refTableButton = document.getElementById("refresh-table");
refTableButton.addEventListener('click', clearMealplan);

let commaSeparatedText;
var wrapperDiv;
var calories;
let numberofmeals;
let diet;
var m;



function clearMealplan(event) {
  var wrapperDiv = document.getElementById("wrapper");

  while (wrapperDiv.hasChildNodes) {
    // console.log(wrapperDiv.childNodes)
    wrapperDiv.removeChild(wrapperDiv.firstChild);
  }
}



function generateNutrientsHTML(nutritionData) {

  const nutrientShortcuts = {
      "Calories": "CAL",
      "Fat": "FAT",
      "Carbohydrates": "CARBS",
      "Sugar": "SUGAR",
      "Cholesterol": "CHOL",
      "Protein": "PROTEIN",
    };

  const desiredNutrients = Object.keys(nutrientShortcuts);

  console.log(nutritionData)

  const filteredNutritionData = nutritionData.filter(nutrient => desiredNutrients.includes(nutrient.name));

  const nutrientsHTML = `
  <div class="nutrients-container">
      <h2>Nutrients</h2>
      <div class="nutrients-list">
          ${filteredNutritionData.map(nutrient => `
          <div class="nutrient-item">
              <div class="nutrient-shortcut">${nutrientShortcuts[nutrient.name]}</div>
              <div class="nutrient-amount">${nutrient.amount} ${nutrient.unit}</div>
          </div>
          `).join('')}
      </div>
  </div>
  `;

  return nutrientsHTML;
}

function generatemeal(){
  

   commaSeparatedText = cars.join(", ");
   wrapperDiv = document.getElementById("#wrapper");
   calories = document.getElementById("cals").value;
   numberofmeals = document.querySelector("#meals").value;
   diet = document.querySelector("#dietFilter").value;
   m = numberofmeals.match(/(\d+)/)[0];

   if (document.getElementById("breakfast")) {
    alert("Please reset the meal plan below to proceed.")
    return;
   }



    if (calories == "") {
      alert("Please complete the fields to proceed.")
    } 
    if (cars.length == 0) {
      
    } else {
      var s;
      cars.forEach(element => {
        s += element;

        if (element != cars[cars.length - 1])
        s += ' ,'
      });
    }

    console.log(s);
   

    if (m == 3) {
      var i = 1;
      if (i == 1){
      const ul = document.createElement('ul');
      ul.className = "dropzone";
      ul.setAttribute("id", "breakfast");

   
      var parent = document.getElementById("wrapper");
      parent.appendChild(ul);

      parent = document.getElementById("breakfast");

      const headermarkup = '<div class="meal-div"><label class="meal-label">Breakfast </label></div>';
      parent.insertAdjacentHTML("afterbegin", headermarkup);
    } 

    fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${calories}&diet=${diet}&exclude=${commaSeparatedText}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      data.meals.forEach(element => {
        const request = `https://api.spoonacular.com/recipes/${element.id}/information?apiKey=${apiKey}&includeNutrition=false`
    
        fetch(request)
        .then(res => {
          return res.json();
        })
        .then(data => {

 
          fetch(`https://api.spoonacular.com/recipes/${element.id}/nutritionWidget.json?apiKey=${apiKey}`)
          .then (res => {
            return res.json();
          })
          .then(nutritionData => {

            console.log(nutritionData);
            console.log(i);
            const markup =
            `<li draggable="true" id="${element.id}">
            <div class="inside-li">
              <div class="food-image">
                <img id="image-li" src="${data.image}" style="width: 100px;" alt="${element.id}">
              </div>
              <div class="food-name-serving">
                <div class="row" >
                  <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${element.title}</div>
                </div>
                <div class= "row" style="color": black; font-size="12px";>
                  <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${element.servings}</div>
                </div>
                <div class="row"> 
                <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
            </div>
                
              </div>
              <div class="refresh-button" style="margin-left: auto;">
              <i class="fa fa-refresh" style="font-size:22px;"></i>  
              </div>
            </div>
 
            </li>`

          switch(i) {
            case 1:
              document.getElementById("breakfast").insertAdjacentHTML('beforeend', markup);
              const ul = document.createElement('ul');
              ul.className = "dropzone";
              ul.setAttribute("id", "lunch");
              console.log("breakfast added");
    
              var parent = document.getElementById("wrapper");
              parent.appendChild(ul);

              parent = document.getElementById("lunch");

              var headermarkup = '<div class="meal-div"><label class="meal-label">Lunch </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup);

              break;
            case 2:
              document.getElementById("lunch").insertAdjacentHTML('beforeend',   markup);
              var ul2 = document.createElement('ul');  
              ul2.className = "dropzone";
              ul2.setAttribute("id", "dinner");
              console.log("lunch added");

          
              var parent2 = document.getElementById("wrapper");
              parent2.appendChild(ul2);

              parent = document.getElementById("dinner");

              headermarkup1 = '<div class="meal-div"><label class="meal-label">Dinner </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup1);

              
              break;
            case 3:
              document.getElementById("dinner").insertAdjacentHTML('beforeend', markup);

              console.log("dinner added");
                 // The next lines are for regeneration of meals (REFRESH BUTTON)
              var breakfastList = document.getElementById("breakfast");
              var lunchList = document.getElementById("lunch");
              var dinnerList = document.getElementById("dinner");
              var snackList = document.getElementById("snack");

              breakfastList.addEventListener("click", handleRefreshButtonClick);
              lunchList.addEventListener("click", handleRefreshButtonClick);
              dinnerList.addEventListener("click", handleRefreshButtonClick);
              snackList.addEventListener("click", handleRefreshButtonClick);

              break;
          }
           console.log("food inserted")
            i++;
         
          })
          .catch(error => console.log("ERROR!"));
        })
        .catch(error => console.log("ERROR!"));
      });
    })
    .catch(error => console.log("ERROR!"));
  } else {
      if (m == 4) {
        var i = 1;
      if (i == 1){
      const ul = document.createElement('ul');
      ul.className = "dropzone";
      ul.setAttribute("id", "breakfast");

   
      var parent = document.getElementById("wrapper");
      parent.appendChild(ul);

      parent = document.getElementById("breakfast");

      const headermarkup = '<div class="meal-div"><label class="meal-label">Breakfast </label></div>';
      parent.insertAdjacentHTML("afterbegin", headermarkup);
    }  else if (i == 4) {
      console.log("before snack")
    }

    fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${calories-500}&diet=${diet}&exclude=${commaSeparatedText}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      data.meals.forEach(element => {
        const request = `https://api.spoonacular.com/recipes/${element.id}/information?apiKey=${apiKey}&includeNutrition=false`
    
        fetch(request)
        .then(res => {
          return res.json();
        })
        .then(data => {

 
          fetch(`https://api.spoonacular.com/recipes/${element.id}/nutritionWidget.json?apiKey=${apiKey}`)
          .then (res => {
            return res.json();
          })
          .then(nutritionData => {

            console.log(nutritionData);
            console.log(i);
            const markup =
            `<li draggable="true" id="${element.id}">
            <div class="inside-li">
              <div class="food-image">
                <img id="image-li" src="${data.image}" style="width: 100px;" alt="${element.id}">
              </div>
              <div class="food-name-serving">
                <div class="row" >
                  <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${element.title}</div>
                </div>
                <div class= "row" style="color": black; font-size="12px";>
                  <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${element.servings}</div>
                </div>
                <div class="row"> 
                <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
            </div>
                
              </div>
              <div class="refresh-button" style="margin-left: auto;">
              <i class="fa fa-refresh" style="font-size:22px;"></i>  
              </div>
            </div>
 
            </li>`

          switch(i) {
            case 1:
              document.getElementById("breakfast").insertAdjacentHTML('beforeend', markup);
              const ul = document.createElement('ul');
              ul.className = "dropzone";
              ul.setAttribute("id", "lunch");
              console.log("breakfast added");
    
              var parent = document.getElementById("wrapper");
              parent.appendChild(ul);

              parent = document.getElementById("lunch");

              const headermarkup = '<div class="meal-div"><label class="meal-label">Lunch </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup);

              break;
            case 2:
              document.getElementById("lunch").insertAdjacentHTML('beforeend',   markup);
              var ul2 = document.createElement('ul');  
              ul2.className = "dropzone";
              ul2.setAttribute("id", "dinner");
              console.log("lunch added");

          
              var parent2 = document.getElementById("wrapper");
              parent2.appendChild(ul2);

              parent = document.getElementById("dinner");

              var headermarkup1 = '<div class="meal-div"><label class="meal-label">Dinner </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup1);

              
              break;
            case 3:
              document.getElementById("dinner").insertAdjacentHTML('beforeend', markup);
              ul2 = document.createElement('ul');  
              ul2.className = "dropzone";
              ul2.setAttribute("id", "snack");

          
              var parent2 = document.getElementById("wrapper");
              parent2.appendChild(ul2);

              parent = document.getElementById("snack");

              headermarkup1 = '<div class="meal-div"><label class="meal-label">Snack </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup1);

              console.log("dinner added");
              break;

          }
           console.log("food inserted")
            i++;
         
        })
          .catch(error => console.log("ERROR!"));
      })

      .catch(error => console.log("ERROR!"));
    });
    
    setTimeout(() => {
      
    fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=snack`)
    .then(res => {
      return res.json();
    })
    .then ( data => {
      const d = data.recipes[0];
      console.log(d);
      console.log(d.image);

      

      fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
      .then (res => {
        return res.json();
      }).then (nutritionData => {

        const markup = 
        `<li draggable="true" id="${data.id}">
        <div class="inside-li">
          <div class="food-image">
            <img id="image-li" src="${d.image}" style="width: 100px;" alt="${data.id}">
          </div>
          <div class="food-name-serving">
            <div class="row" >
              <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
            </div>
            <div class= "row" style="color": black; font-size="12px";>
              <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${d.servings}</div>
            </div>
            <div class="row"> 
            <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
        </div>
            
          </div>
          <div class="refresh-button" style="margin-left: auto;">
          <i class="fa fa-refresh" style="font-size:22px;"></i>  
          </div>
        </div>
    
        </li>`

        const el = document.getElementById("snack")
        if (el) {
          el.insertAdjacentHTML("beforeend", markup);
        } else {
          console.error('Element not found!')
        }

        
        
      // The next lines are for regeneration of meals (REFRESH BUTTON)
      var breakfastList = document.getElementById("breakfast");
      var lunchList = document.getElementById("lunch");
      var dinnerList = document.getElementById("dinner");
      var snackList = document.getElementById("snack");

      breakfastList.addEventListener("click", handleRefreshButtonClick);
      lunchList.addEventListener("click", handleRefreshButtonClick);
      dinnerList.addEventListener("click", handleRefreshButtonClick);
      snackList.addEventListener("click", handleRefreshButtonClick);



      });
    });

    }, 2000);

  
  }
  )
  .catch(error => console.log("ERROR!"));
    } else if (m == 5) {
      var i = 1;
      if (i == 1){
      const ul = document.createElement('ul');
      ul.className = "dropzone";
      ul.setAttribute("id", "breakfast");

   
      var parent = document.getElementById("wrapper");
      parent.appendChild(ul);

      parent = document.getElementById("breakfast");

      const headermarkup = '<div class="meal-div"><label class="meal-label">Breakfast </label></div>';
      parent.insertAdjacentHTML("afterbegin", headermarkup);
    }  else if (i == 4) {
      console.log("before snack")
    }

    fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${calories-1000}&diet=${diet}&exclude=${commaSeparatedText}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      data.meals.forEach(element => {
        const request = `https://api.spoonacular.com/recipes/${element.id}/information?apiKey=${apiKey}&includeNutrition=false`
    
        fetch(request)
        .then(res => {
          return res.json();
        })
        .then(data => {

 
          fetch(`https://api.spoonacular.com/recipes/${element.id}/nutritionWidget.json?apiKey=${apiKey}`)
          .then (res => {
            return res.json();
          })
          .then(nutritionData => {

            console.log(nutritionData);
            console.log(i);
            const markup =
            `<li draggable="true" id="${element.id}">
            <div class="inside-li">
              <div class="food-image">
                <img id="image-li" src="${data.image}" style="width: 100px;" alt="${element.id}">
              </div>
              <div class="food-name-serving">
                <div class="row" >
                  <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${element.title}</div>
                </div>
                <div class= "row" style="color": black; font-size="12px";>
                  <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${element.servings}</div>
                </div>
                <div class="row"> 
                <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
            </div>
                
              </div>
              <div class="refresh-button" style="margin-left: auto;">
              <i class="fa fa-refresh" style="font-size:22px;"></i>  
              </div>
            </div>
 
            </li>`

          switch(i) {
            case 1:
              document.getElementById("breakfast").insertAdjacentHTML('beforeend', markup);
              const ul = document.createElement('ul');
              ul.className = "dropzone";
              ul.setAttribute("id", "lunch");
              console.log("breakfast added");
    
              var parent = document.getElementById("wrapper");
              parent.appendChild(ul);

              parent = document.getElementById("lunch");

              const headermarkup = '<div class="meal-div"><label class="meal-label">Lunch </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup);

              break;
            case 2:
              document.getElementById("lunch").insertAdjacentHTML('beforeend',   markup);
              var ul2 = document.createElement('ul');  
              ul2.className = "dropzone";
              ul2.setAttribute("id", "dinner");
              console.log("lunch added");

          
              var parent2 = document.getElementById("wrapper");
              parent2.appendChild(ul2);

              parent = document.getElementById("dinner");

              var headermarkup1 = '<div class="meal-div"><label class="meal-label">Dinner </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup1);

              
              break;
            case 3:
              document.getElementById("dinner").insertAdjacentHTML('beforeend', markup);
              ul2 = document.createElement('ul');  
              ul2.className = "dropzone";
              ul2.setAttribute("id", "snack");

          
              var parent2 = document.getElementById("wrapper");
              parent2.appendChild(ul2);

              parent = document.getElementById("snack");

              headermarkup1 = '<div class="meal-div"><label class="meal-label">Snack </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup1);

              console.log("dinner added");
              break;

          }
           console.log("food inserted")
            i++;
         
        })
          .catch(error => console.log("ERROR!"));
      })

      .catch(error => console.log("ERROR!"));
    });
    setTimeout(() => {
      
    console.log("neak4")

    fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=snack`)
    .then(res => {
      return res.json();
    })
    .then ( data => {
      const d = data.recipes[0];
      console.log(d);
      console.log(d.image);

      

      fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
      .then (res => {
        return res.json();
      }).then (nutritionData => {

        const markup = 
        `<li draggable="true" id="${data.id}">
        <div class="inside-li">
          <div class="food-image">
            <img id="image-li" src="${d.image}" style="width: 100px;" alt="${data.id}">
          </div>
          <div class="food-name-serving">
            <div class="row" >
              <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
            </div>
            <div class= "row" style="color": black; font-size="12px";>
              <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${d.servings}</div>
            </div>
            <div class="row"> 
            <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
        </div>
            
          </div>
          <div class="refresh-button" style="margin-left: auto;">
          <i class="fa fa-refresh" style="font-size:22px;"></i>  
          </div>
        </div>
    
        </li>`

        const el = document.getElementById("snack")
        if (el) {
          el.insertAdjacentHTML("beforeend", markup);
        } else {
          console.error('Element not found!')
        }

        
        
      // The next lines are for regeneration of meals (REFRESH BUTTON)
      var breakfastList = document.getElementById("breakfast");
      var lunchList = document.getElementById("lunch");
      var dinnerList = document.getElementById("dinner");
      var snackList = document.getElementById("snack");

      breakfastList.addEventListener("click", handleRefreshButtonClick);
      lunchList.addEventListener("click", handleRefreshButtonClick);
      dinnerList.addEventListener("click", handleRefreshButtonClick);
      snackList.addEventListener("click", handleRefreshButtonClick);

      });
    });


    
    fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=snack`)
    .then(res => {
      return res.json();
    })
    .then ( data => {
      const d = data.recipes[0];
      console.log(d);
      console.log(d.image);

      

      fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
      .then (res => {
        return res.json();
      }).then (nutritionData => {

        const markup = 
        `<li draggable="true" id="${nutritionData.id}">
        <div class="inside-li">
          <div class="food-image">
            <img id="image-li" src="${d.image}" style="width: 100px;" alt="${nutritionData.id}">
          </div>
          <div class="food-name-serving">
            <div class="row" >
              <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
            </div>
            <div class= "row" style="color": black; font-size="12px";>
              <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${d.servings}</div>
            </div>
            <div class="row"> 
            <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
        </div>
            
          </div>
          <div class="refresh-button" style="margin-left: auto;">
          <i class="fa fa-refresh" style="font-size:22px;"></i>  
          </div>
        </div>
    
        </li>`

        const el = document.getElementById("snack")
        if (el) {
          el.insertAdjacentHTML("beforeend", markup);
        } else {
          console.error('Element not found!')
        }

        
        
      // The next lines are for regeneration of meals (REFRESH BUTTON)
      var breakfastList = document.getElementById("breakfast");
      var lunchList = document.getElementById("lunch");
      var dinnerList = document.getElementById("dinner");
      var snackList = document.getElementById("snack");

      breakfastList.addEventListener("click", handleRefreshButtonClick);
      lunchList.addEventListener("click", handleRefreshButtonClick);
      dinnerList.addEventListener("click", handleRefreshButtonClick);
      snackList.addEventListener("click", handleRefreshButtonClick);

      });
    });
  
    }, 2000);

  }
  )
  .catch(error => console.log("ERROR!"));
    } else if (m == 6) {
      var i = 1;
      if (i == 1){
      const ul = document.createElement('ul');
      ul.className = "dropzone";
      ul.setAttribute("id", "breakfast");

   
      var parent = document.getElementById("wrapper");
      parent.appendChild(ul);

      parent = document.getElementById("breakfast");

      const headermarkup = '<div class="meal-div"><label class="meal-label">Breakfast </label></div>';
      parent.insertAdjacentHTML("afterbegin", headermarkup);
    }  else if (i == 4) {
      console.log("before snack")
    }

    fetch(`https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=day&targetCalories=${calories-1500}&diet=${diet}&exclude=${commaSeparatedText}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      data.meals.forEach(element => {
        const request = `https://api.spoonacular.com/recipes/${element.id}/information?apiKey=${apiKey}&includeNutrition=false`
    
        fetch(request)
        .then(res => {
          return res.json();
        })
        .then(data => {

 
          fetch(`https://api.spoonacular.com/recipes/${element.id}/nutritionWidget.json?apiKey=${apiKey}`)
          .then (res => {
            return res.json();
          })
          .then(nutritionData => {

            console.log(nutritionData);
            console.log(i);
            const markup =
            `<li draggable="true" id="${element.id}">
            <div class="inside-li">
              <div class="food-image">
                <img id="image-li" src="${data.image}" style="width: 100px;" alt="${element.id}">
              </div>
              <div class="food-name-serving">
                <div class="row" >
                  <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${element.title}</div>
                </div>
                <div class= "row" style="color": black; font-size="12px";>
                  <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${element.servings}</div>
                </div>
                <div class="row"> 
                <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
            </div>
                
              </div>
              <div class="refresh-button" style="margin-left: auto;">
              <i class="fa fa-refresh" style="font-size:22px;"></i>  
              </div>
            </div>
 
            </li>`

          switch(i) {
            case 1:
              document.getElementById("breakfast").insertAdjacentHTML('beforeend', markup);
              const ul = document.createElement('ul');
              ul.className = "dropzone";
              ul.setAttribute("id", "lunch");
              console.log("breakfast added");
    
              var parent = document.getElementById("wrapper");
              parent.appendChild(ul);

              parent = document.getElementById("lunch");

              const headermarkup = '<div class="meal-div"><label class="meal-label">Lunch </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup);

              break;
            case 2:
              document.getElementById("lunch").insertAdjacentHTML('beforeend',   markup);
              var ul2 = document.createElement('ul');  
              ul2.className = "dropzone";
              ul2.setAttribute("id", "dinner");
              console.log("lunch added");

          
              var parent2 = document.getElementById("wrapper");
              parent2.appendChild(ul2);

              parent = document.getElementById("dinner");

              var headermarkup1 = '<div class="meal-div"><label class="meal-label">Dinner </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup1);

              
              break;
            case 3:
              document.getElementById("dinner").insertAdjacentHTML('beforeend', markup);
              ul2 = document.createElement('ul');  
              ul2.className = "dropzone";
              ul2.setAttribute("id", "snack");

          
              var parent2 = document.getElementById("wrapper");
              parent2.appendChild(ul2);

              parent = document.getElementById("snack");

              headermarkup1 = '<div class="meal-div"><label class="meal-label">Snack </label></div>';
              parent.insertAdjacentHTML("afterbegin", headermarkup1);

              console.log("dinner added");
              break;

          }
           console.log("food inserted")
            i++;
         
        })
          .catch(error => console.log("ERROR!"));
      })

      .catch(error => console.log("ERROR!"));
    });
    setTimeout(() => {
      
    console.log("neak4")

    fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=snack`)
    .then(res => {
      return res.json();
    })
    .then ( data => {
      const d = data.recipes[0];
      console.log(d);
      console.log(d.image);

      

      fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
      .then (res => {
        return res.json();
      }).then (nutritionData => {

        const markup = 
        `<li draggable="true" id="${nutritionData.id}">
        <div class="inside-li">
          <div class="food-image">
            <img id="image-li" src="${d.image}" style="width: 100px;" alt="${nutritionData.id}">
          </div>
          <div class="food-name-serving">
            <div class="row" >
              <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
            </div>
            <div class= "row" style="color": black; font-size="12px";>
              <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${d.servings}</div>
            </div>
            <div class="row"> 
            <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
        </div>
            
          </div>
          <div class="refresh-button" style="margin-left: auto;">
          <i class="fa fa-refresh" style="font-size:22px;"></i>  
          </div>
        </div>
    
        </li>`

        const el = document.getElementById("snack")
        if (el) {
          el.insertAdjacentHTML("beforeend", markup);
        } else {
          console.error('Element not found!')
        }

        
        
      // The next lines are for regeneration of meals (REFRESH BUTTON)
      var breakfastList = document.getElementById("breakfast");
      var lunchList = document.getElementById("lunch");
      var dinnerList = document.getElementById("dinner");
      var snackList = document.getElementById("snack");

      breakfastList.addEventListener("click", handleRefreshButtonClick);
      lunchList.addEventListener("click", handleRefreshButtonClick);
      dinnerList.addEventListener("click", handleRefreshButtonClick);
      snackList.addEventListener("click", handleRefreshButtonClick);

      });
    });


    
    fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=snack`)
    .then(res => {
      return res.json();
    })
    .then ( data => {
      const d = data.recipes[0];
      console.log(d);
      console.log(d.image);

      

      fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
      .then (res => {
        return res.json();
      }).then (nutritionData => {

        const markup = 
        `<li draggable="true" id="${nutrition.id}">
        <div class="inside-li">
          <div class="food-image">
            <img id="image-li" src="${d.image}" style="width: 100px;" alt="${nutrition.id}">
          </div>
          <div class="food-name-serving">
            <div class="row" >
              <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
            </div>
            <div class= "row" style="color": black; font-size="12px";>
              <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${d.servings}</div>
            </div>
            <div class="row"> 
            <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
        </div>
            
          </div>
          <div class="refresh-button" style="margin-left: auto;">
          <i class="fa fa-refresh" style="font-size:22px;"></i>  
          </div>
        </div>
    
        </li>`

        const el = document.getElementById("snack")
        if (el) {
          el.insertAdjacentHTML("beforeend", markup);
        } else {
          console.error('Element not found!')
        }

        
        
      // The next lines are for regeneration of meals (REFRESH BUTTON)
      var breakfastList = document.getElementById("breakfast");
      var lunchList = document.getElementById("lunch");
      var dinnerList = document.getElementById("dinner");
      var snackList = document.getElementById("snack");

      breakfastList.addEventListener("click", handleRefreshButtonClick);
      lunchList.addEventListener("click", handleRefreshButtonClick);
      dinnerList.addEventListener("click", handleRefreshButtonClick);
      snackList.addEventListener("click", handleRefreshButtonClick);

      });
    });

    
    fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=snack`)
    .then(res => {
      return res.json();
    })
    .then ( data => {
      const d = data.recipes[0];
      console.log(d);
      console.log(d.image);


      fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
      .then (res => {
        return res.json();
      }).then (nutritionData => {

        const markup = 
        `<li draggable="true" id="${nutritionData.id}">
        <div class="inside-li">
          <div class="food-image">
            <img id="image-li" src="${d.image}" style="width: 100px;" alt="${nutritionData.id}">
          </div>
          <div class="food-name-serving">
            <div class="row" >
              <div class="food-name" style="font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
            </div>
            <div class= "row" style="color": black; font-size="12px";>
              <div class="food-name-servings" style="font-size: 14px; color: gray; margin-left: 20px;"> Servings: ${d.servings}</div>
            </div>
            <div class="row"> 
            <div class="nutrition" style="font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>
        </div>
            
          </div>
          <div class="refresh-button" style="margin-left: auto;">
          <i class="fa fa-refresh" style="font-size:22px;"></i>  
          </div>
        </div>
    
        </li>`

        const el = document.getElementById("snack")
        if (el) {
          el.insertAdjacentHTML("beforeend", markup);
        } else {
          console.error('Element not found!')
        }

        
        
      // The next lines are for regeneration of meals (REFRESH BUTTON)
      var breakfastList = document.getElementById("breakfast");
      var lunchList = document.getElementById("lunch");
      var dinnerList = document.getElementById("dinner");
      var snackList = document.getElementById("snack");

      breakfastList.addEventListener("click", handleRefreshButtonClick);
      lunchList.addEventListener("click", handleRefreshButtonClick);
      dinnerList.addEventListener("click", handleRefreshButtonClick);
      snackList.addEventListener("click", handleRefreshButtonClick);


      
      breakfastList.addEventListener('click', showInfo(event, recipe.id));


      });
    });
    }, 2000);

  }
  )
  .catch(error => console.log("ERROR!"));
    }
  }  
}

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

      if (data.results.length === 0) {
          noResultsMessage.textContent = `Found 0 search results for "${query}"`;
      } else {
          noResultsMessage.textContent = '';
      }

      showInfo(data.results);

      console.log(data.results)
  } catch (error) {
      console.error('Error fetching recipes:', error);
  }
}

function displayRecipes(recipes) {

}

async function fetchNutritionData(recipeId) {
  const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${apiKey}`;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      return data.json();
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

function generateNutritionHTML(recipeId) {
  const nutritionHTML = `
      <div class="nutrition-info">
          <canvas id="nutritionChart-${recipeId}"></canvas>
      </div>
  `;
  return nutritionHTML;
}

async function fetchRecipeInfo(recipeId) {
  const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching recipe information:', error);
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

function generateStepsHTML(recipeInfo) {
  const analyzedInstructions = recipeInfo.analyzedInstructions;

  if (analyzedInstructions.length === 0) {
      return '';
  }

  const stepsHTML = `
  <div class="steps-container">
      <h2>Steps</h2>
      <ol>
          ${analyzedInstructions[0].steps.map((step, index) => `<li>${index + 1}. ${step.step}</li>`).join('')}
      </ol>
  </div>
  `;

  return stepsHTML;
}


var inputText = document.getElementById("allergens-ingredients");

inputText.addEventListener('keypress', comma)

function comma (event) {
  var name = event.key;
  var code= event.code;
  var inputValue = inputText.value;

  var h4el = document.createElement('h4');
  h4el.setAttribute('id', 'hidden-text')
  var cont = document.createTextNode("");
  h4el.appendChild(cont);
  var parent = document.querySelector(".allergens-div");

  parent.appendChild(h4el)      

  // alert(`Key pressed ${name} \r\n Key code value: ${code}`)

  if (event.key == 'Enter') {
    // make first letter uppercase

  

    inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1)

    alert(`${inputValue} will be added to the list of Allergens and Excluded Ingredients.`)
    cars.push(inputValue);
    var pparent = document.getElementById("allergens-div");
    var el = document.createElement('p');
    var cont = document.createTextNode("Clear.");
    el.appendChild(cont);
    // pparent.

    var parent = document.getElementById("hidden-text");
    var text = document.createTextNode(inputValue);

    if (cars.length == 1) {
    var dt = document.createTextNode('Allergens: ');
    parent.appendChild(dt);
    parent.appendChild(text);
    } else  {
      var t = document.createTextNode(", ");
      parent.appendChild(t);
      parent.appendChild(text)
    }
    inputText.value = "";
  }
}


// Define the click event handler function for refresh button
function handleRefreshButtonClick(event) {
  var meal = event.target.parentNode.parentNode.parentNode.parentNode.id;

  console.log(meal)


  if (event.target.classList.contains("fa-refresh")) {
    if (meal == "lunch") {
        // Handle the click event here
        const parent = event.target.parentNode.parentNode.parentNode;
    
        // parent.addEventListener("click", handleRefreshRotation())

       const div = parent.querySelector('.food-name-serving')

       

       while (div.firstChild) {
          div.removeChild(div.firstChild);
       }

       const div1 = parent.querySelector('.food-image');

       const imgElement = div1.querySelector('img');
       if (imgElement)
        imgElement.parentNode.removeChild(imgElement);

       fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=${meal}`)
      .then(res => {
        return res.json();
      })
      .then ( data => {
        const d = data.recipes[0];
        console.log(d);
        console.log(d.image);

        console.log(div1)

        fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
        .then (res => {
          return res.json();
        }).then (nutritionData => {

          const imgmarkup =
          `<img id="image-li"  src="${d.image}" style="width: 100px;" alt="asdasdcsa">`;
          div1.insertAdjacentHTML("beforeend", imgmarkup)
          const markup = `
          <div class="row" >
                     <div class="food-name" style="font-family: 'Roboto', sans-serif;font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
                   </div>
                   <div class= "row" style="color": black; font-size="12px";>
                     <div class="food-name-servings" style="font-family: 'Roboto', sans-serif;font-size: 14px; color: gray; margin-left: 20px;"> Serving: ${nutritionData.weightPerServing.amount} ${nutritionData.weightPerServing.unit} </div>
                   </div>
                   <div class="row"> 
                   <div class="nutrition" style="font-family: 'Roboto', sans-serif; font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>`
   
   
         div.insertAdjacentHTML("beforeend", markup);

        });
      });

        console.log("Refresh button clicked on Lunch");

        
    } else if (meal == "breakfast") {

      
        // Handle the click event here
        const parent = event.target.parentNode.parentNode.parentNode;
        const refbutton = parent.querySelector('.refresh-button');

        console.log(refbutton)
       const div = parent.querySelector('.food-name-serving')

       while (div.firstChild) {
          div.removeChild(div.firstChild);
       }

       const div1 = parent.querySelector('.food-image');

       const imgElement = div1.querySelector('img');
       if (imgElement)
        imgElement.parentNode.removeChild(imgElement);

       fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=${meal}`)
      .then(res => {
        return res.json();
      })
      .then ( data => {
        const d = data.recipes[0];
        console.log(d);
        console.log(d.image);

        console.log(div1)



        fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
        .then (res => {
          return res.json();
        }).then (nutritionData => {

          const imgmarkup =
          `<img id="image-li"  src="${d.image}" style="width: 100px;" alt="asdasdcsa">`;
          div1.insertAdjacentHTML("beforeend", imgmarkup)
          const markup = `
          <div class="row" >
                     <div class="food-name" style="font-family: 'Roboto', sans-serif;font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
                   </div>
                   <div class= "row" style="color": black; font-size="12px";>
                     <div class="food-name-servings" style="font-family: 'Roboto', sans-serif;font-size: 14px; color: gray; margin-left: 20px;"> Serving: ${nutritionData.weightPerServing.amount} ${nutritionData.weightPerServing.unit} </div>
                   </div>
                   <div class="row"> 
                   <div class="nutrition" style="font-family: 'Roboto', sans-serif; font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>`
   
   
         div.insertAdjacentHTML("beforeend", markup);

        });
      });

    console.log("Refresh button clicked on Breakfast");
    } else if (meal == "dinner") {
      // Handle the click event here

      // parent.addEventListener("click", handleRefreshRotation)

      const parent = event.target.parentNode.parentNode.parentNode;
    

      const div = parent.querySelector('.food-name-serving')

      while (div.firstChild) {
         div.removeChild(div.firstChild);
      }

      const div1 = parent.querySelector('.food-image');

      const imgElement = div1.querySelector('img');
      if (imgElement)
       imgElement.parentNode.removeChild(imgElement);

      fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=${meal}`)
     .then(res => {
       return res.json();
     })
     .then ( data => {
       const d = data.recipes[0];
       console.log(d);
       console.log(d.image);

       console.log(div1)



       fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
       .then (res => {
         return res.json();
       }).then (nutritionData => {

         const imgmarkup =
         `<img id="image-li"  src="${d.image}" style="width: 100px;" alt="asdasdcsa">`;
         div1.insertAdjacentHTML("beforeend", imgmarkup)
         const markup = `
         <div class="row" >
                    <div class="food-name" style="font-family: 'Roboto', sans-serif;font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
                  </div>
                  <div class= "row" style="color": black; font-size="12px";>
                    <div class="food-name-servings" style="font-family: 'Roboto', sans-serif;font-size: 14px; color: gray; margin-left: 20px;"> Serving: ${nutritionData.weightPerServing.amount} ${nutritionData.weightPerServing.unit} </div>
                  </div>
                  <div class="row"> 
                  <div class="nutrition" style="font-family: 'Roboto', sans-serif; font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>`
  
  
        div.insertAdjacentHTML("beforeend", markup);

       });
     });

   console.log("Refresh button clicked on Snack");
    }else if (meal == "snack") {
        // Handle the click event here
        const parent = event.target.parentNode.parentNode.parentNode;
        // parent.addEventListener("click", handleRefreshRotation())


       const div = parent.querySelector('.food-name-serving')

       while (div.firstChild) {
          div.removeChild(div.firstChild);
       }

       const div1 = parent.querySelector('.food-image');

       const imgElement = div1.querySelector('img');
       if (imgElement)
        imgElement.parentNode.removeChild(imgElement);

       fetch(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=1&tags=${meal}`)
      .then(res => {
        return res.json();
      })
      .then ( data => {
        const d = data.recipes[0];
        console.log(d);
        console.log(d.image);

        console.log(div1)



        fetch(`https://api.spoonacular.com/recipes/110022/nutritionWidget.json?apiKey=${apiKey}`)
        .then (res => {
          return res.json();
        }).then (nutritionData => {

          const imgmarkup =
          `<img id="image-li"  src="${d.image}" style="width: 100px;" alt="asdasdcsa">`;
          div1.insertAdjacentHTML("beforeend", imgmarkup)
          const markup = `
          <div class="row" >
                     <div class="food-name" style="font-family: 'Roboto', sans-serif;font-size: 14px; color: black; margin-left: 10px;">${d.title}</div>
                   </div>
                   <div class= "row" style="color": black; font-size="12px";>
                     <div class="food-name-servings" style="font-family: 'Roboto', sans-serif;font-size: 14px; color: gray; margin-left: 20px;"> Serving: ${nutritionData.weightPerServing.amount} ${nutritionData.weightPerServing.unit} </div>
                   </div>
                   <div class="row"> 
                   <div class="nutrition" style="font-family: 'Roboto', sans-serif; font-size: 14px; color:gray; margin-left: 20px;"> ${nutritionData.calories} cals</div>`
   
   
         div.insertAdjacentHTML("beforeend", markup);

        });
      });

    console.log("Refresh button clicked on Snack");
    }
   
  } else if (event.target.id == "image-li") {
    console.log("image is clicked")

    var im = document.getElementById("image-li");
    var parent = event.target.parentNode.parentNode.parentNode;

  
    var altvalue = im.getAttribute("alt");

    
    document.querySelector('.container').addEventListener('click', function(event) {
      let rowDiv = event.target.closest('.row');
      if (rowDiv) {
          let foodNameDiv = rowDiv.querySelector('.food-name');
          if (foodNameDiv) {
              console.log('Food Name:', foodNameDiv.textContent);
          }
      }
  });


    

    im.addEventListener('click', async () => {
      console.log("inside event listener")

    
      fetch(`https://api.spoonacular.com/recipes/${altvalue}/information?apiKey=${apiKey}`)
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data)
        // console.log(data.spoonacularSourceUrl)

        location.assign(`${data.spoonacularSourceUrl}`);
    
      })
      .catch(error => console.log("ERROR!" + error));



  } );

  }
}

(function() {
    var dragged, listener;

    console.clear();

    dragged = null;

    listener = document.addEventListener;

    listener("dragstart", (event) => {
      console.log("start !");
      return dragged = event.target;
    });

    listener("dragend", (event) => {
      return console.log("end !");
    });

    listener("dragover", function(event) {
      return event.preventDefault();
    });

    listener("drop", (event) => {
      console.log("dro  p !");
      event.preventDefault();
      if (event.target.className === "dropzone") {
        dragged.parentNode.removeChild(dragged);
        return event.target.appendChild(dragged);
      }
    });

  }).call(this);


const clearButton = document.getElementById("clear-button");
clearButton.addEventListener("click", clearAllergens)

function clearAllergens(event) {
  var allergens = document.getElementById("hidden-text");
  allergens.remove();

 cars.length = 0;
  console.log(cars.length)
}

