import { Directive } from '@angular/core';

@Directive({
    selector: '[ui-sortable]'
})

export class SortableDirective {



    constructor() { }



    ngOnInit() {
        //this.renderer.setStyle(this.elRef.nativeElement, 'background-color', 'blue', false, false);
        //this.backgroundColor = this.defaultColor;
    }



}
