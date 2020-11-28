import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPageRoutingModule } from './recipes-routing.module';

import { RecipesPage } from './recipes.page';
import { RecipesService } from './recipes.service';
import { RecipesDetailPageModule } from './recipes-detail/recipes-detail.module';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesPageRoutingModule,
    RecipesDetailPageModule
  ],
  providers: [RecipesService],
  declarations: [RecipesPage, RecipeItemComponent]
})
export class RecipesPageModule {}
