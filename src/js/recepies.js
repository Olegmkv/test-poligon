export class RecepiesAPI {
  #BASE_URL = "https://tasty-treats-backend.p.goit.global/api/";
  #PER_PAGE = 9;
  
  getAllCategories() {
    const url = `${this.#BASE_URL}categories`;
    console.log(url);

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
      .catch(error => console.log(error))
  };
  
    getAreas() {
        const url = `${this.#BASE_URL}areas`;
        console.log(url);

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
      .catch(error => console.log(error))
  };
  
    getIngredients() {
        const url = `${this.#BASE_URL}ingredients`;
        console.log(url);

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
      .catch(error => console.log(error))
    };
    
    getRecipes(params) {
        const url = `${this.#BASE_URL}recipes?${params}`;
        console.log(url);

    return fetch(url,params).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
      .catch(error => console.log(error))
    };
    
};