import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

import { RecepiesAPI } from "./js/recepies"
import { searchEvents, searchCategories, searchRecipesFilter, searchRecipesPopular, searchRecipesId, searchRecipesIdRating, searchIngredients, searchAreas, searchAddOrders, searchRecipesFlexFilter } from './js/apiDenis.js'
// import * as APIModule from "./js/apiDenis.js"
import {createMarkup} from "./js/markup-card"

const refs = {
    allCategiries: document.querySelector(".categories-btn-all-js"),
    categories: document.querySelector(".categories-js"),
    paginationShow: document.querySelector("#tui-pagination-container"),
    pagination: document.getElementById("tui-pagination-container"),

    areas: document.querySelector(".areas-js"),
    ingredients: document.querySelector(".ingredients-js"),
    recepies: document.querySelector(".recepies-js"),
};

const api = new RecepiesAPI();

let perPageRecipes = getPerPageRecipes();
let currentPage = 1;
let visiblePages = window.innerWidth < 768 ? 2 : 3;

const paramsRecepies = new URLSearchParams({
    page: currentPage,
    limit: perPageRecipes,
});

const optionsPagination = {
    totalItems: 0,
    itemsPerPage: perPageRecipes,
    visiblePages: visiblePages,
    page: currentPage,
}

const paginationRecipes = new Pagination(refs.pagination, optionsPagination);

// слухачі подій
refs.allCategiries.addEventListener('click', onClickAllCategories);
refs.categories.addEventListener('click', onClickCategories);

// слухачі подій Віталика, ці прибрати
refs.areas.addEventListener('change', onChangeAreas);
refs.ingredients.addEventListener('change', onChangeIngredients);

showSearchRecipes();

// формування переліку категорій 
searchCategories().then(( categories ) => {
    refs.categories.insertAdjacentHTML('beforeend', makeMarkupCategories(categories));
}).catch(() => { });

// формування розмітки переліку категорій
function makeMarkupCategories(obj) {
    const { data } = obj;
    const markup = data.map(({ name }) => {
        return `<li class="categories-list-js"><button type="button" data-set="${name}" class="categories-btn-js">${name}</button></li>`
    }).join("");
    return markup;
};

// запит переліку популярних рецептів
// searchRecipesPopular().then(( popular ) => {
//     refs.categories.insertAdjacentHTML('beforeend', makeMarkupPopular(popular));
// }).catch(() => { });

// -------------------------------------------------------------------------------замінити на Віталика фукції -------------------------
// формування переліку області походження рецепту (замінити на Віталіка функцію)
api.getAreas().then((areas) => {
    const markup = areas.map(({ id, name }) => { return `<option value="${name}">${name}</option>` }).join("");
    refs.areas.insertAdjacentHTML('beforeend', markup);
}).catch(() => {});

// формування переліку інгридієнтів (замінити на Віталіка функцію)
api.getIngredients().then((ingredients) => {
    const markup = ingredients.map(({ id, name }) => { return `<option value="${id}">${name}</option>` }).join("");
    refs.ingredients.insertAdjacentHTML('beforeend', markup);
}).catch(() => {});

// оробка зміни країни походження (Віталіка функція, замінити)
function onChangeAreas(evt) {
    const selectedAreas = evt.currentTarget.value;
    changeParams('area', selectedAreas);
    showSearchRecipes();
};

// обробка зміни інредієнта (Віталіка функція, замінити)
function onChangeIngredients(evt) {
    const selectedIngredients = evt.currentTarget.value;
    changeParams('ingredients', selectedIngredients);
    showSearchRecipes();
};
//-------------------------------------------------------------------------------------------------------------------------------


// перемальовка блоку рецептів після зміни параметрів запиту з 1 сторынки з перемальовкою пагінації
//(функцію відмальовки makeMarkupRecipes замінити на Кірину)

function showSearchRecipes() {
    paginationRecipes.off('afterMove', onMovePagination);
    changeParams('page', 1);
    searchRecipesFlexFilter(paramsRecepies).then((recipes) => {
        refs.recepies.innerHTML = makeMarkupRecipes(recipes);
        console.log(paramsRecepies.toString());
        // refs.recepies.innerHTML = createMarkup (recipes.data.rezults);
        paginationListenerOn(recipes.data.totalPages);  
    }).catch(() => { });  
}

// перемальовка блоку рецептів після змщення пагінації (функцію відмальовкиmake MarkupRecipes замінити на Кірину)
function reShowSearchRecipes() {
      searchRecipesFlexFilter(paramsRecepies).then((recipes) => {
        refs.recepies.innerHTML = makeMarkupRecipes(recipes);
    }).catch(() => { });  
}

// перемальовка блоку рецептів за зміненими параметрами (потім вилучити)
function makeMarkupRecipes(obj) {
    const { data: {results: arr} } = obj;
    const markup = arr.map(({ title, description, rating, preview, thumb }) => {return `<p>${title}</p>`}).join("");
    return markup;
};

// встановлення слухача пагінації, відображення її
function paginationListenerOn(totalPages) {
    paginationRecipes.reset(totalPages*perPageRecipes);
    console.log('pag---',totalPages);
    if (totalPages > 1) {
        paginationRecipes.on('afterMove', onMovePagination);
        refs.paginationShow.classList.remove('is-hidden');
        return;
    } else {
        if (!refs.paginationShow.classList.contains('is-hidden')) {
        refs.paginationShow.classList.add('is-hidden');
        };
    }
    if (!totalPages) {
        console.log("згідно параметрів пошуку рецептів не знайдено");
        // Notiflix.Notify.info("Вибачте, згідно параметрів пошуку рецептів не знайдено");
    }
};

// перемальовка рецептів при зміщенні пагінації 
function onMovePagination() {
    currentPage = paginationRecipes.getCurrentPage();
    changeParams('page', currentPage);
    reShowSearchRecipes();
};

// вибір "всіх категорій" по натисканню "AllCategories"
function onClickAllCategories() {
    unselectCategories();
    refs.allCategiries.classList.add('is-active');
    removeParams('category');
    showSearchRecipes();
};

// вибір конкретної категорії
function onClickCategories(evt) {
    if (evt.target.nodeName !== "BUTTON") {
        console.log(evt.target.nodeName);
        return;
    };
    unselectAllCategories();
    unselectCategories();
    evt.target.classList.add('is-active');
    const selectedCategories = evt.target.dataset.set;
    changeParams('category', selectedCategories);
    showSearchRecipes();
};

// знімаємо помітку з кнопки "AllCategories"
function unselectAllCategories(){
    if (refs.allCategiries.classList.contains('is-active')) {
        refs.allCategiries.classList.remove('is-active');
    };
};
    
    // знімаємо помітку з активної категорії
    function unselectCategories(){
        const oldSelect = refs.categories.querySelector('.is-active');
        if (oldSelect) {
            oldSelect.classList.remove('is-active');
        };
    };
 
      
    // додавання/зміна параметру в об'єкт для пошуку рецепту
    function changeParams(key, value) {
        if (paramsRecepies.has(key)) {
            paramsRecepies.delete(key);
        }
        paramsRecepies.append(key, value);
        console.log(paramsRecepies.toString());
    };
    
    // вилучення параметра в об'єкті пошуку рецепту
    function removeParams(key) {
        while (paramsRecepies.has(key)) {
            paramsRecepies.delete(key);
        };
         console.log(paramsRecepies.toString());
    };
    
    // кількість карток реціптів в залежності від вьюпорту 
    function getPerPageRecipes() {
        if (window.innerWidth < 768) {
            return 6;    
        };
        if (window.innerWidth < 1280) { 
            return 8;
        };
        return 9;
    };


function makeMarkupPopular(arr) {

    return arr.map(elem => {
    return `
     <li class="popular-item-js">
        <button type="button">
          <div class="popular-card-js">
            <div class="popular-tumb-js">
            <img class="popular-img" src="${elem.thumb}" alt="${elem.title}" loading="lazy"/>
            </div>
            <div class="popular-recipes-info-js">
              <h3 class="popular-recipes-name-js">Omlete</h3>
              <p class="popular-recipes-text-js">v smyatku</p>
            </div>
          </div>
        </button>
      </li>



          <img class="photo-img" src="${elem.thumb}" alt="${elem.title}" loading="lazy"/>

  `
  }).join("");
}


// Кірина розмітка    
// function createMarkup(params) {

//     return params.map(elem => {
//     return `
//     <li class="item">
//     <div class="photo-card">
//     <div class="photo-exp"></div>
//         <div class="photo-thumb">
//           <img class="photo-img" src="${elem.thumb}" alt="${elem.title}" loading="lazy"/>
//         </div>
//         <button type="button" class="btn-favorite" >
//                 <svg class="icon-favorite" width="22" height="22" viewBox="0 0 32 32">
// <path fill="none" opacity="0.5" stroke="#f8f8f8" stroke-linejoin="round" stroke-linecap="round" stroke-miterlimit="4" stroke-width="2.9091" d="M15.992 6.848c-2.666-3.117-7.111-3.955-10.451-1.101s-3.81 7.625-1.187 11c2.181 2.806 8.781 8.725 10.944 10.641 0.242 0.214 0.363 0.321 0.504 0.364 0.123 0.037 0.258 0.037 0.381 0 0.141-0.042 0.262-0.149 0.504-0.364 2.163-1.916 8.763-7.834 10.944-10.641 2.623-3.375 2.21-8.177-1.187-11.001s-7.785-2.015-10.451 1.101z"></path>
//                 </svg>
//         </button>
//         <div class="info">
//             <p class="info-title">
//                   ${elem.title}
//             </p>
//             <p class="info-text">
//                 ${elem.description}
//             </p>
//             <div class="info-bottom">
//             <div class="info-div">
//             <p class="info-rating">${elem.rating}</p>
//                 <svg class="info-star" width="14" height="14" viewBox="0 0 32 32">                
// <path fill="#EEA10C" d="M13.826 3.262c0.684-2.106 3.663-2.106 4.348 0l1.932 5.945c0.306 0.942 1.184 1.579 2.174 1.579h6.251c2.214 0 3.135 2.833 1.344 4.135l-5.057 3.674c-0.801 0.582-1.136 1.614-0.83 2.556l1.931 5.945c0.684 2.106-1.726 3.857-3.517 2.555l-5.057-3.674c-0.801-0.582-1.886-0.582-2.687 0l-5.057 3.674c-1.791 1.302-4.202-0.45-3.517-2.555l1.932-5.945c0.306-0.942-0.029-1.973-0.83-2.556l-5.057-3.674c-1.791-1.302-0.871-4.135 1.344-4.135h6.251c0.99 0 1.868-0.638 2.174-1.579l1.932-5.945z"></path>
//                 </svg>
//                 <svg class="info-star" width="14" height="14" viewBox="0 0 32 32">                
// <path fill="#f8f8f8" opacity="0.3" d="M13.826 3.262c0.684-2.106 3.663-2.106 4.348 0l1.932 5.945c0.306 0.942 1.184 1.579 2.174 1.579h6.251c2.214 0 3.135 2.833 1.344 4.135l-5.057 3.674c-0.801 0.582-1.136 1.614-0.83 2.556l1.931 5.945c0.684 2.106-1.726 3.857-3.517 2.555l-5.057-3.674c-0.801-0.582-1.886-0.582-2.687 0l-5.057 3.674c-1.791 1.302-4.202-0.45-3.517-2.555l1.932-5.945c0.306-0.942-0.029-1.973-0.83-2.556l-5.057-3.674c-1.791-1.302-0.871-4.135 1.344-4.135h6.251c0.99 0 1.868-0.638 2.174-1.579l1.932-5.945z"></path>
//                 </svg>
//                 <svg class="info-star" width="14" height="14" viewBox="0 0 32 32">                
// <path fill="#f8f8f8" opacity="0.3" d="M13.826 3.262c0.684-2.106 3.663-2.106 4.348 0l1.932 5.945c0.306 0.942 1.184 1.579 2.174 1.579h6.251c2.214 0 3.135 2.833 1.344 4.135l-5.057 3.674c-0.801 0.582-1.136 1.614-0.83 2.556l1.931 5.945c0.684 2.106-1.726 3.857-3.517 2.555l-5.057-3.674c-0.801-0.582-1.886-0.582-2.687 0l-5.057 3.674c-1.791 1.302-4.202-0.45-3.517-2.555l1.932-5.945c0.306-0.942-0.029-1.973-0.83-2.556l-5.057-3.674c-1.791-1.302-0.871-4.135 1.344-4.135h6.251c0.99 0 1.868-0.638 2.174-1.579l1.932-5.945z"></path>
//                 </svg>
//                 <svg class="info-star" width="14" height="14" viewBox="0 0 32 32">                
// <path fill="#f8f8f8" opacity="0.3" d="M13.826 3.262c0.684-2.106 3.663-2.106 4.348 0l1.932 5.945c0.306 0.942 1.184 1.579 2.174 1.579h6.251c2.214 0 3.135 2.833 1.344 4.135l-5.057 3.674c-0.801 0.582-1.136 1.614-0.83 2.556l1.931 5.945c0.684 2.106-1.726 3.857-3.517 2.555l-5.057-3.674c-0.801-0.582-1.886-0.582-2.687 0l-5.057 3.674c-1.791 1.302-4.202-0.45-3.517-2.555l1.932-5.945c0.306-0.942-0.029-1.973-0.83-2.556l-5.057-3.674c-1.791-1.302-0.871-4.135 1.344-4.135h6.251c0.99 0 1.868-0.638 2.174-1.579l1.932-5.945z"></path>
//                 </svg>
//                 <svg class="info-star" width="14" height="14" viewBox="0 0 32 32">                
// <path fill="#f8f8f8" opacity="0.3" d="M13.826 3.262c0.684-2.106 3.663-2.106 4.348 0l1.932 5.945c0.306 0.942 1.184 1.579 2.174 1.579h6.251c2.214 0 3.135 2.833 1.344 4.135l-5.057 3.674c-0.801 0.582-1.136 1.614-0.83 2.556l1.931 5.945c0.684 2.106-1.726 3.857-3.517 2.555l-5.057-3.674c-0.801-0.582-1.886-0.582-2.687 0l-5.057 3.674c-1.791 1.302-4.202-0.45-3.517-2.555l1.932-5.945c0.306-0.942-0.029-1.973-0.83-2.556l-5.057-3.674c-1.791-1.302-0.871-4.135 1.344-4.135h6.251c0.99 0 1.868-0.638 2.174-1.579l1.932-5.945z"></path>
//                 </svg>
//             </div>
//               <button class="info-btn">
//                  See recipe
//               </button>
//               </div>
//           </div>
//         </div>
//     </li>
//   `
//   }).join("");
// }