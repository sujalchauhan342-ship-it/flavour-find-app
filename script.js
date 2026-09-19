const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipeContainer = document.getElementById("recipeContainer");
const message = document.getElementById("message");

const modal = document.getElementById("recipeModal");
const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const ingredients = document.getElementById("ingredients");
const instructions = document.getElementById("instructions");

async function searchRecipes() {
    const query = searchInput.value.trim();

    if (query === "") {
        message.textContent = "Please enter a food name.";
        return;
    }

    message.textContent = "Searching...";
    recipeContainer.innerHTML = "";

    try {
        const url =
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Network error");
        }

        const data = await response.json();

        console.log(data);

        if (!data.meals) {
            message.textContent = "No recipe found. Try Pizza, Chicken, Pasta, Burger etc.";
            return;
        }

        message.textContent = `${data.meals.length} recipe(s) found`;

        data.meals.forEach((meal) => {
            createRecipeCard(meal);
        });

    } catch (error) {
        console.error(error);
        message.textContent =
            "Unable to load recipes. Check your internet connection.";
    }
}

function createRecipeCard(meal) {

    const card = document.createElement("div");

    card.className = "recipe-card";

    card.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

        <div class="recipe-info">

            <h2>${meal.strMeal}</h2>

            <p>
                ${meal.strCategory || "Food"}
                •
                ${meal.strArea || "International"}
            </p>

            <button class="view-btn">
                View Recipe
            </button>

        </div>
    `;

    card.querySelector(".view-btn").addEventListener("click", () => {
        showRecipe(meal);
    });

    recipeContainer.appendChild(card);
}

function showRecipe(meal) {

    modalImage.src = meal.strMealThumb;
    modalTitle.textContent = meal.strMeal;
    instructions.textContent = meal.strInstructions;

    ingredients.innerHTML = "";

    for (let i = 1; i <= 20; i++) {

        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {

            const li = document.createElement("li");

            li.textContent =
                `${ingredient} - ${measure || ""}`;

            ingredients.appendChild(li);
        }
    }

    modal.style.display = "flex";
}

searchBtn.addEventListener("click", searchRecipes);

searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchRecipes();
    }

});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {

    if (event.target === modal) {
        modal.style.display = "none";
    }

});