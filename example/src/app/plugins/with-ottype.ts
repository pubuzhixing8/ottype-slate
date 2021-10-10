import { Editor, BaseEditor, NodeEntry, Range } from "slate";
import { CursorInfo } from "../model/presence";
import { getLocalPresenceData } from "./sharedb";

const IS_REMOTE: WeakSet<Editor> = new WeakSet();

export interface OTTypeEditor extends BaseEditor {
    doc: any;
    localPresence: any;
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
    },
    generateCursorsDecorate(cursors: CursorInfo[]) {
        return ([, path]: NodeEntry) => {
            const ranges: CursorInfo[] = [];
            if (path && path.length === 1 && cursors?.length) {
                cursors.forEach((cursor) => {
                    if (Range.includes(cursor, path)) {
                        const { focus, anchor, data } = cursor;
                        const isForward = Range.isForward({ anchor, focus });
                        ranges.push({
                            data,
                            isForward,
                            originAnchorPath: anchor.path,
                            originFocusPath: focus.path,
                            anchor,
                            focus
                        });
                    }
                });
            }
            return ranges;
        };
    }
};

export const withOTType = <T extends Editor>(editor: T) => {
    const e = editor as T & OTTypeEditor;
    const { onChange } = editor;

    editor.onChange = () => {
        if (!OTTypeEditor.isRemote(editor)) {
            editor.operations.map((operation) => {
                if (operation.type === 'set_selection') {
                    // Ignore blurring, so that we can see lots of users in the
                    // same window. In real use, you may want to clear the cursor.
                    // if (!range) return;
                    // In this particular instance, we can send extra information
                    // on the presence object. This ability will vary depending on
                    // type.
                    const localPresenceData = getLocalPresenceData(e.localPresence)
                    const cursorInfo = {
                        anchor: editor.selection ? editor.selection.anchor : null,
                        focus: editor.selection ? editor.selection.focus : null,
                        data: {
                            color: localPresenceData.color,
                            name: localPresenceData.name
                        }
                    };
                    e.localPresence.submit(cursorInfo, function (error: any) {
                        if (error) throw error;
                    });
                    return;
                }
                e.doc.submitOp(operation, undefined, (error: any) => {
                    if (error) {
                        console.error(error);
                    }
                });
            });
        }
        onChange();
    }

    return e;
}

