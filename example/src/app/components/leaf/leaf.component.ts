import { ChangeDetectorRef, Component, ElementRef } from "@angular/core";
import { AngularEditor, BaseLeafComponent } from "slate-angular";
import { Path } from 'slate'
import { CursorInfo } from "../../model/presence";

@Component({
    selector: 'span[caretLeaf]',
    template: `
    <span [ngStyle]="{position:'relative',backgroundColor: alphaColor}">
        <demo-caret *ngIf="isFocusNode" [decorate]="leafData?.data" [isForward]="leafData?.isForward"></demo-caret>
        <span slateString [context]="context" [viewContext]="viewContext"
      ></span>
    </span>
    `,
})
export class DemoCaretLeafComponent extends BaseLeafComponent {
    constructor(
        public elementRef: ElementRef,
        public cdr: ChangeDetectorRef,
    ) {
        super(elementRef, cdr);
    }

    leafData!: (Text & CursorInfo);

    alphaColor: string | undefined;

    isFocusNode: boolean | undefined;

    onContextChange() {
        super.onContextChange();
        this.leafData = this.leaf as any;
        const path = AngularEditor.findPath(this.editor, this.context.text);
        this.isFocusNode = Path.equals(this.leafData.originFocusPath, path);
        this.alphaColor = this.leafData.data.color.slice(0, -2) + '0.2)';
    }
}