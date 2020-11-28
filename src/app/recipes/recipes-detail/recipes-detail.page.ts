import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipesService } from '../recipes.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.page.html',
  styleUrls: ['./recipes-detail.page.scss'],
})
export class RecipesDetailPage implements OnInit {

  recipe: Recipe;
  recipeId: string;
  constructor(
    private route: ActivatedRoute,
    private recipesService: RecipesService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    route.params.subscribe(param => {
      this.recipeId =  param['recipes-detail'];
      console.log(this.recipeId);
      this.recipe = this.recipesService.getRecipe(this.recipeId);
      console.log(this.recipe);
    });
   }

  ngOnInit() {
  }

  onDelete() {
    this.alertCtrl.create({
      header: 'Are you sure?', 
      message: 'Do you really want to delete the recipe?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.recipesService.deleteRecipe(this.recipeId);
            this.router.navigate(['/recipes']);
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }
}
