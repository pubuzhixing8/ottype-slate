import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { createEditor, Editor, Element, Transforms, NodeEntry } from 'slate';
import { withHistory } from 'slate-history';
import { withAngular } from 'slate-angular';
import { DemoMarkTextComponent, MarkTypes } from '../components/text/text.component';
import isHotkey from 'is-hotkey';
import { OTTypeEditor, withOTType } from '../plugins/with-ottype';
import { initailizeShareDB } from '../plugins/sharedb';
import { DemoCaretLeafComponent } from '../components/leaf/leaf.component';
import { CursorInfo } from '../model/presence';
import { createUser, User } from '../model/user';

const SLATE_DEV_MODE_KEY = 'slate-dev';

const HOTKEYS = {
    'mod+b': MarkTypes.bold,
    'mod+i': MarkTypes.italic,
    'mod+u': MarkTypes.underline,
    'mod+`': MarkTypes.strike,
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

@Component({
    selector: 'demo-client',
    templateUrl: 'client.component.html'
})
export class DemoClientComponent implements OnInit {
    value: any | undefined;

    doc: any | undefined;

    client = 0;

    user!: User;

    online = true;

    toggleBlock = (format: any) => {
        const isActive = this.isBlockActive(format)
        const isList = LIST_TYPES.includes(format)

        Transforms.unwrapNodes(this.editor, {
            match: (n: any) =>
                LIST_TYPES.includes(n.type),
            split: true,
        })
        const newProperties = {
            type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        }
        Transforms.setNodes(this.editor, newProperties as any)

        if (!isActive && isList) {
            const block = { type: format, children: [] }
            Transforms.wrapNodes(this.editor, block)
        }
    }

    toggleMark = (format: any) => {
        const isActive = this.isMarkActive(format)

        if (isActive) {
            Editor.removeMark(this.editor, format)
        } else {
            Editor.addMark(this.editor, format, true)
        }
    }

    isBlockActive = (format: any) => {
        const [match] = Editor.nodes(this.editor, {
            match: (n: any) => n.type === format,
        })

        return !!match
    }

    isMarkActive = (format: any) => {
        const marks = Editor.marks(this.editor) as any;
        return marks ? marks[format] === true : false
    }

    toolbarItems = [
        {
            format: MarkTypes.bold,
            icon: 'format_bold',
            active: this.isMarkActive,
            action: this.toggleMark
        },
        {
            format: MarkTypes.italic,
            icon: 'format_italic',
            active: this.isMarkActive,
            action: this.toggleMark
        },
        {
            format: MarkTypes.underline,
            icon: 'format_underlined',
            active: this.isMarkActive,
            action: this.toggleMark
        },
        {
            format: MarkTypes.code,
            icon: 'code',
            active: this.isMarkActive,
            action: this.toggleMark
        },
        {
            format: 'heading-one',
            icon: 'looks_one',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
        {
            format: 'heading-two',
            icon: 'looks_two',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
        {
            format: 'block-quote',
            icon: 'format_quote',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
        {
            format: 'numbered-list',
            icon: 'format_list_numbered',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
        {
            format: 'bulleted-list',
            icon: 'format_list_bulleted',
            active: this.isBlockActive,
            action: this.toggleBlock
        },
    ];

    @ViewChild('heading_1', { read: TemplateRef, static: true })
    headingOneTemplate!: TemplateRef<any>;

    @ViewChild('heading_2', { read: TemplateRef, static: true })
    headingTwoTemplate!: TemplateRef<any>;

    @ViewChild('heading_3', { read: TemplateRef, static: true })
    headingThreeTemplate!: TemplateRef<any>;

    @ViewChild('blockquote', { read: TemplateRef, static: true })
    blockquoteTemplate!: TemplateRef<any>;

    @ViewChild('ul', { read: TemplateRef, static: true })
    ulTemplate!: TemplateRef<any>;

    @ViewChild('ol', { read: TemplateRef, static: true })
    olTemplate!: TemplateRef<any>;

    @ViewChild('li', { read: TemplateRef, static: true })
    liTemplate!: TemplateRef<any>;

    editor = withOTType(withHistory(withAngular(createEditor())));

    decorate: (nodeEntry: NodeEntry) => CursorInfo[] = () => [];

    ngOnInit(): void {
        if (!localStorage.getItem(SLATE_DEV_MODE_KEY)) {
            console.log(`open dev mode use code：window.localStorage.setItem('${SLATE_DEV_MODE_KEY}', true);`);
        }
        this.user = createUser();
        initailizeShareDB('rooms', 'ottype-slate', 'ws://localhost:8080', this.editor, this.user, (doc: any) => {
            this.doc = doc;
            this.value = doc.data;
        }, (cursors: CursorInfo[]) => {
            this.decorate = OTTypeEditor.generateCursorsDecorate(cursors);
        });
    }

    valueChange(value: Element[]) {
        if (localStorage.getItem(SLATE_DEV_MODE_KEY)) {
            console.log(`anchor: ${JSON.stringify(this.editor.selection?.anchor)}\nfocus:  ${JSON.stringify(this.editor.selection?.focus)}`);
            console.log('operations: ', this.editor.operations);
        }
    }

    renderElement = (element: any) => {
        if (element.type === 'heading-one') {
            return this.headingOneTemplate;
        }
        if (element.type === 'heading-two') {
            return this.headingTwoTemplate;
        }
        if (element.type === 'heading-three') {
            return this.headingThreeTemplate;
        }
        if (element.type === 'block-quote') {
            return this.blockquoteTemplate;
        }
        if (element.type === 'numbered-list') {
            return this.olTemplate;
        }
        if (element.type === 'bulleted-list') {
            return this.ulTemplate;
        }
        if (element.type === 'list-item') {
            return this.liTemplate;
        }
        return null;
    }

    renderText = (text: any) => {
        if (text[MarkTypes.bold] || text[MarkTypes.italic] || text[MarkTypes.code] || text[MarkTypes.underline]) {
            return DemoMarkTextComponent;
        }
        return null;
    }

    renderLeaf = (text: any) => {
        if (text.data) {
            return DemoCaretLeafComponent;
        }
        return null;
    }

    keydown = (event: KeyboardEvent) => {
        for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark = (HOTKEYS as any)[hotkey];
                this.toggleMark(mark);
            }
        }
    }

    toggleOnline(event: MouseEvent) {
        if (this.online) {
            this.doc.disconnect();
        } else {
            this.doc.connect();
        }
        this.online = !this.online;
    }
}
