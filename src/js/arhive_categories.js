import { searchEvents, searchCategories, searchRecipesFilter, searchRecipesPopular, searchRecipesId, searchRecipesIdRating, searchIngredients, searchAreas, searchAddOrders } from './js/createAPI'

const PER_PAGE = 9;
let currentPage = 1;
const params = new URLSearchParams({
    page: currentPage,
    limit: PER_PAGE,
});

const refs = {
    allCategiries: document.querySelector(".categories-btn-all-js"),
    categories: document.querySelector(".categories-js"),
};

// слухачі подій
refs.allCategiries.addEventListener('click', onClickAllCategories);
refs.categories.addEventListener('click', onClickCategories);

// початкова відмальовка переліку категорій
searchCategories().then(( categories ) => {
    refs.categories.insertAdjacentHTML('beforeend', makeMarkupCategories(categories));
}).catch(() => { });

// розмітка переліку категорій
function makeMarkupCategories(obj) {
    const { data } = obj;
    const markup = data.map(({ name }) => {
        return `<li class="categories-list-js"><button type="button" data-set="${name}" class="categories-btn-js">${name}</button></li>`
    }).join("");
    return markup;
};

// обробка вибору "всіх категорій"
function onClickAllCategories() {
    unselectCategories();
    refs.allCategiries.classList.add('is-active');
    removeParams('category');
    //запит/перемальовка рецептів 
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
    //запит/перемальовка рецептів 
};

// додавання/зміна параметру для пошуку в екземпляр URLSearchParams
function changeParams(key, value) {
    if (params.has(key)) {
        params.delete(key);
    }
    params.append(key, value)
};

// вилучення параметра пошуку в екземплярі URLSearchParams
function removeParams(key) {
    while (params.has(key)) {
        params.delete(key);
    };
};

// знімаємо виділення активної категорії
function unselectCategories(){
    const oldSelect = refs.categories.querySelector('.is-active');
    if (oldSelect) {
        oldSelect.classList.remove('is-active');
    };
};

// знімаємо виділення з "AllCategories"
function unselectAllCategories(){
    if (refs.allCategiries.classList.contains('is-active')) {
        refs.allCategiries.classList.remove('is-active');
    };
};




