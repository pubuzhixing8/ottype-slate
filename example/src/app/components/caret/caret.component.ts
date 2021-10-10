import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'demo-caret',
    templateUrl: './caret.component.html',
})
export class DemoCaretComponent implements OnInit {

    @Input() decorate: any;

    @Input() isForward: boolean | undefined;

    constructor() { }

    ngOnInit(): void {
    }
}
