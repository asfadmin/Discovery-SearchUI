import { Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'navbar',
    templateUrl  : './navbar.component.html',
    styleUrls    : ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {
    _variant: string;

    constructor(
        private _elementRef: ElementRef,
        private _renderer: Renderer2
    ) {
        this._variant = 'vertical-style-2';
    }

    get variant(): string {
        return this._variant;
    }

    @Input()
    set variant(value: string) {
        this._renderer.removeClass(this._elementRef.nativeElement, this.variant);

        this._variant = value;

        this._renderer.addClass(this._elementRef.nativeElement, value);
    }
}
