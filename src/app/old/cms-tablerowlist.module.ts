import { NgModule } from '@angular/core';

//import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';

import { CmsTablerowAComponent } from './cms-tablerowA.component';
import { CmsTablerowBComponent } from './cms-tablerowB.component';
import { CmsTablerowCComponent } from './cms-tablerowC.component';
//import { CmsTablerowDComponent } from './cms-tablerowD.component';
//import { CmsTablerowEComponent } from './cms-tablerowE.component';


@NgModule({
  declarations: [
      CmsTablerowAComponent,
      CmsTablerowBComponent, CmsTablerowCComponent
      //CmsTablerowDComponent, CmsTablerowEComponent
  ],
  imports: [
      //DynamicComponentLoaderModule.forChild(CmsTablerowAComponent),
     // DynamicComponentLoaderModule.forChild(CmsTablerowBComponent),
      //DynamicComponentLoaderModule.forChild(CmsTablerowCComponent),
      //DynamicComponentLoaderModule.forChild(CmsTablerowDComponent),
      //DynamicComponentLoaderModule.forChild(CmsTablerowEComponent)
  ],
})
export class TableRowListModule {}
