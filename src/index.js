import { RecepiesAPI } from "./js/recepies"
import { searchEvents, searchCategories, searchRecipesFilter, searchRecipesPopular, searchRecipesId, searchRecipesIdRating, searchIngredients, searchAreas, searchAddOrders, searchRecipesFlexFilter } from './js/apiDenis.js'
// import * as APIModule from "./js/apiDenis.js"


const api = new RecepiesAPI();

const PER_PAGE = 9;
let currentPage = 1;
const params = new URLSearchParams({
    page: currentPage,
    limit: PER_PAGE,
});


const refs = {
    allCategiries: document.querySelector(".categories-btn-all-js"),
    categories: document.querySelector(".categories-js"),
    areas: document.querySelector(".areas-js"),
    ingredients: document.querySelector(".ingredients-js"),
    recepies: document.querySelector(".recepies-js"),
};

// формування переліку категорій мій фпи
// api.getAllCategories().then((categories) => {
//     const markup = categories.map(({ id, name }) => {
//         return `<li class="categories-list-js"><button type="button" data-set="${name}" class="categories-btn-js">${name}</button></li>`
//     }).join("");
//     refs.categories.insertAdjacentHTML('beforeend', markup);
// }).catch(() => { });


// приклад 
// changeParams('area', 'Irish');
// changeParams('category', 'Beef');

// searchRecipesFlexFilter(params).then((recepies) => {
//      const { data } = recepies
//     console.log("Denisa zapyt",data);
// }).catch(() => {console.log("error!")});



// формування переліку категорій черз Дениса API

searchCategories().then(( categories ) => {
    refs.categories.insertAdjacentHTML('beforeend', makeMarkupCategories(categories));
}).catch(() => { });


function makeMarkupCategories(obj) {
    const { data } = obj;
    const markup = data.map(({ name }) => {
        return `<li class="categories-list-js"><button type="button" data-set="${name}" class="categories-btn-js">${name}</button></li>`
    }).join("");
    return markup;
};

// формування переліку області походження рецепту
api.getAreas().then((areas) => {
    const markup = areas.map(({ id, name }) => { return `<option value="${name}">${name}</option>` }).join("");
    refs.areas.insertAdjacentHTML('beforeend', markup);
}).catch(() => {});

// формування переліку інгридієнтів
api.getIngredients().then((ingredients) => {
    const markup = ingredients.map(({ id, name }) => { return `<option value="${id}">${name}</option>` }).join("");
    refs.ingredients.insertAdjacentHTML('beforeend', markup);
}).catch(() => {});

showSearchRecipes();

// слухачі подій
refs.allCategiries.addEventListener('click', onClickAllCategories);
refs.categories.addEventListener('click', onClickCategories);
refs.areas.addEventListener('change', onChangeAreas);
refs.ingredients.addEventListener('change', onChangeIngredients);

// додавання/зміна параметру для пошуку
function changeParams(key, value) {
    if (params.has(key)) {
        params.delete(key);
    }
    params.append(key, value)
    showSearchRecipes();
};

// вилучення параметра пошуку
function removeParams(key) {
    while (params.has(key)) {
        params.delete(key);
    };
    showSearchRecipes();
};

// перемальовка блоку рецептів за зміненими параметрами
function showSearchRecipes() {
    api.getRecipes(params).then(({ results }) => {
        const markup = results.map(( { title, description, rating, preview, thumb  }) =>
        { return `<p>${title}</p>` }).join("");
        console.log("recep",markup);
    refs.recepies.innerHTML= markup;        
    }).catch(()=>{});
};

// обробка вибору "всіх категорій"
function onClickAllCategories() {
    unselectCategories();
    refs.allCategiries.classList.add('is-active');
    removeParams('category');
};

// обробка вибору конкретної категорії
function onClickCategories(evt) {
    if (evt.target.nodeName !== "BUTTON") {
        return;
    };
    unselectAllCategories();
    unselectCategories();
    evt.target.classList.add('is-active');
    const selectedCategories = evt.target.dataset.set;
    changeParams('category', selectedCategories);
};

// оробка зміни країни походження
function onChangeAreas(evt) {
    const selectedAreas = evt.currentTarget.value;
    changeParams('area', selectedAreas);
};

// обробка зміни інредієнта
function onChangeIngredients(evt) {
    const selectedIngredients = evt.currentTarget.value;
    changeParams('ingredients', selectedIngredients);
};

// знімамо помітку активної категорії
function unselectCategories(){
    const oldSelect = refs.categories.querySelector('.is-active');
    if (oldSelect) {
        oldSelect.classList.remove('is-active');
    };
};

// знімаємо помітку з "AllCategories"
function unselectAllCategories(){
    if (refs.allCategiries.classList.contains('is-active')) {
        refs.allCategiries.classList.remove('is-active');
    };
};