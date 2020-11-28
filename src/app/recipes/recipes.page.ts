import { Component, OnInit, OnDestroy } from '@angular/core';
import { Recipe } from './recipe.model';
import { RecipesService } from './recipes.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  constructor(
    private recipesService: RecipesService,
    private router: Router,
  ) { }

  ngOnInit() {
    console.log('ngOninit');
  }
  ionViewWillEnter(){
    this.recipes = this.recipesService.getAllRecipes();

  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter');
  }
  ionViewWillLeave(){
    console.log('ionViewWillLeave');
    console.log(this.recipes);

  }
  ionViewDidLeave(){
    console.log('ionViewDidLeave')
  }

  onView(id: string) {
    this.router.navigate(['/recipes/', id]);
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy')
  }

}
