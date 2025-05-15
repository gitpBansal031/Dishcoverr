let searchBtn = document.querySelector(".headerButton");
let input = document.querySelector(".headerInput");
let mainBody = document.querySelector(".main");
let apiLink = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
let jsonData;
let recipeDiv = document.querySelector(".recipe");
let recipeBtn = document.querySelector(".recipeBtn");


recipeDiv.style.display = 'none';

//Search button on click command
searchBtn.addEventListener('click', e => {
    e.preventDefault();
    // showPopUp(1);
    let searchInput = input.value.trim();
    input.value = "";
    if (searchInput == "") {
        displayMsg(false);
        return;
    } else {
        displayMsg(true, searchInput);
    }
})

//On screen Message display
let displayMsg = (status, searchInput) => {
    if (!status) {
        mainBody.innerHTML = `
        <div class="mainDiv">
            Please search any recipe...
        </div>
    `;
    } else {
        mainBody.innerHTML = `
        <div class="mainDiv">
            Fetching Recipes for you...
        </div>
    `;
        getApiResponse(searchInput);
    }
}

//Getting jsonData from api 
let getApiResponse = async (query) => {
    try {
        let data = await fetch(`${apiLink}${query}`);
        jsonData = await data.json();
        makingCard(jsonData);
    } catch {
        mainBody.innerHTML = `
        <div class="mainDiv">
            Something went wrong... Please try again later or try some different keywords...
        </div>
    `;
    }
}

//Adding fetched data to the cards
let makingCard = (jsonData) => {
    mainBody.innerHTML = "";
    jsonData.meals.forEach(meal => {
        let cardDiv = document.createElement("div");
        let mealName = meal.strMeal;
        let mealCategory = `Category : ${meal.strCategory}`;
        let mealArea = `${meal.strArea} dish`;
        if (mealName.length > 25) {
            mealName = `${mealName.substring(0, 25)}...`;
        }
        if (mealCategory.length > 25) {
            mealName = `${mealCategory.substring(0, 25)}...`;
        }
        if (mealArea.length > 25) {
            mealName = `${mealArea.substring(0, 25)}...`;
        }
        cardDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="FoodImage" class="foodImage">
            <h2 class="foodName">${mealName}</h2>
            <h3 class="foodCategory">${mealCategory}</h3>
            <h3 class="foodArea">${mealArea}</h3>
        `;
        cardDiv.classList.add("card");
        let foodBtn = document.createElement("button");
        foodBtn.classList.add("foodBtn");
        foodBtn.innerText = "View Recipe";
        cardDiv.appendChild(foodBtn);
        mainBody.appendChild(cardDiv);
        foodBtn.addEventListener('click', () => {
            showPopUp(meal);
        });
    });
}

//Adding recipe details
let showPopUp = (meal) => {
    recipeDiv.style.display = 'block';
    fetchingRecipeData(meal, recipeDiv);
    mainBody.appendChild(recipeDiv);
    recipeBtn = document.querySelector(".recipeBtn");
    recipeBtn.addEventListener("click", () => {
        recipeDiv.style.display = 'none';
    });
}

let fetchingRecipeData = (meal, recipeDiv) => {
    recipeDiv.innerHTML = `
            <button class="recipeBtn">X</button>
            <h1 class="recipeName">${meal.strMeal}</h1>
            <h3 class="recipeIngredients">Ingredients</h3>
    `;
    //Creating a unordered list
    let recipeList = document.createElement("ul");
    recipeList.classList.add("recipeList");
    //Adding item to it
    for (let i = 1; i <= 20; i++) {
        let inst = `strIngredient${i}`;
        let measure = `strMeasure${i}`;
        if (meal[inst]) {
            let item = document.createElement("li");
            item.classList.add("recipeItem");
            item.innerText = `${meal[measure]} ${meal[inst]}`;
            recipeList.appendChild(item);
        } else break;
    }
    recipeDiv.appendChild(recipeList);

    //Adding instruction youtube and blog links
    let para1 = document.createElement("p");
    para1.classList.add("recipeLink");
    para1.innerText = meal.strInstructions;
    let para2 = document.createElement("p");
    para2.classList.add("recipeLink");
    para2.innerHTML = `<a href="${meal.strYoutube}" target="_blank">Click here </a>for YouTube tutorial`;
    let para3 = document.createElement("p");
    para3.classList.add("recipeLink");
    para3.innerHTML = `<a href="${meal.strSource}" target="_blank">Click here </a>for related blogs`;
    recipeDiv.appendChild(para1);
    recipeDiv.appendChild(para2);
    recipeDiv.appendChild(para3);
}