import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private  recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schintzel',
      imageUrl: 'https://res.cloudinary.com/serdy-m-dia-inc/image/upload/f_auto/fl_lossy/q_auto:eco/x_0,y_8,w_3840,h_2160,c_crop/w_576,h_324,c_scale/v1528814537/foodlavie/prod/recettes/casserole-espagnole-d1d4e0f7',
      ingredients: ['French Frite', 'Tchadienne recipe', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl: 'https://imgcdn.circulaire-en-ligne.ca/wp-content/uploads/chili-mac-recette-de-boeuf-hache.jpg',
      ingredients: ['Miate', 'Tchadienne recipe', 'Tomate']
    }
  ];
  constructor() { }


  getAllRecipes(){
    return [...this.recipes];
  }
  getRecipe(recipeId: string) {
    return {...this.recipes.find(item => item.id === recipeId)};
  }
  deleteRecipe(id: string) {
  //   const recipeToIndex = this.recipes.findIndex(recipe => {
  //     if(recipe.id === id) {
  //       return true;
  //     }
  //   });
  //   console.log(recipeToIndex);
  //   this.recipes.splice(recipeToIndex, 1);
  this.recipes = this.recipes.filter(recipe => recipe.id !== id);
  }
}
