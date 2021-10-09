import { Editor, BaseEditor } from "slate";

const IS_REMOTE: WeakSet<Editor> = new WeakSet();

export interface OTTypeEditor extends BaseEditor {
    doc: any;
}

export const OTTypeEditor = {
    isRemote(editor: Editor) {
        return IS_REMOTE.has(editor);
    },
    asRemote(editor: Editor, fn: () => void) {
        const wasRemote = this.isRemote(editor);
        IS_REMOTE.add(editor);

        fn();

        if (!wasRemote) {
            Promise.resolve().then(() => IS_REMOTE.delete(editor));
        }
    }
};

export const withOTType = <T extends Editor>(editor: T) => {
    const e = editor as T & OTTypeEditor;
    const { onChange } = editor;

    editor.onChange = () => {
        if (!OTTypeEditor.isRemote(editor)) {
            editor.operations.map((operation) => {
                if (operation.type === 'set_selection') {
                    return;
                }
                e.doc.submitOp(operation, undefined, (error: any) => {
                    console.error(error);
                });
            });
        }
        onChange();
    }

    return e;
}

