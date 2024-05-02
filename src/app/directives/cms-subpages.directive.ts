import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[CmsSubPages]'
})

export class CmsSubPagesDirective implements OnInit {
    constructor(private elementRef: ElementRef) {

    }

    ngOnInit() {
        this.elementRef.nativeElement.style.backgroundColor = 'green';
    }
}
