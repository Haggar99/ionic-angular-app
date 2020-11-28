import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipesDetailPage } from './recipes-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecipesDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesDetailPageRoutingModule {}
