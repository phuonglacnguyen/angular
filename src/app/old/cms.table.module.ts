import { NgModule } from '@angular/core';

//import { DynamicComponentLoaderModule } from './../../dynamic-component-loader/dynamic-component-loader.module';


import { CmsTablerowAComponent } from './cms-tablerowA.component';
import { CmsTablerowBComponent } from './cms-tablerowB.component';
import { CmsTablerowCComponent } from './cms-tablerowC.component';
 
@NgModule({
    declarations: [
        CmsTablerowAComponent,
        CmsTablerowBComponent, CmsTablerowCComponent
    ],
    imports: [
        //DynamicComponentLoaderModule.forChild(CmsTablerowAComponent),
        //DynamicComponentLoaderModule.forChild(CmsTablerowBComponent),
        //DynamicComponentLoaderModule.forChild(CmsTablerowCComponent)
    ]
})

export class MessageModule { }
