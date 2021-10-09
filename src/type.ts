import { Operation, Range, Path, createEditor, Descendant, Editor } from "slate";
import { transformInsertText } from "./transfrom/insert-text";
import { transformRemoveText } from "./transfrom/remove-text";

const type = {
    name: 'ottype-slate',
    uri: 'https://github.com/pubuzhixing8/ottype-slate',
    editor: createEditor(),

    create: function (data: Descendant[]) {
        return data;
    },

    /**
     * Apply op to snapshot. Return the new snapshot.
     * The snapshot is shallow copied as its edited, so the previous snapshot
     * 
     * reference is still valid.
     * @param snapshot 
     * @param op 
     */
    apply (data: Descendant[], op: Operation): Descendant[] {
        // Apply doesn't make use of cursors. It might be a little simpler to
        // implement apply using them. The reason they aren't used here is merely
        // historical - the cursor implementation was written after apply() was
        // already working great.
        Editor.setNormalizing(this.editor, false);
        this.editor.children = data;
        this.editor.apply(op);
        return this.editor.children;
    },

    transform (op1: Operation, op2: Operation, side: 'left' | 'right'): Operation[] {
        return transform(op1, op2, side);
    },

    transformPresence: function(range: Range, op: Operation, isOwnOp: boolean) {
        if (!isOwnOp && Range.isCollapsed(range) && op.type === 'insert_text') {
            if (Path.equals(range.anchor.path, op.path) && range.anchor.offset === op.offset) {
                return range;
            }
        }
        return Range.transform(range, op);
    },
};
export { type };

export function transform(op1: Operation, op2: Operation, side: 'left' | 'right') {
    let op: Operation | Operation[] | null | undefined;
    switch (op1.type) {
        case 'insert_text':
            op = transformInsertText(op1, op2, side);
            break;
        case 'remove_text':
            op = transformRemoveText(op1, op2, side);
            break;
        case 'insert_node':
            break;
        case 'remove_node':
            break;
        case 'split_node':
            break;
        case 'merge_node':
            break;
        case 'set_node':
            break;
        case 'move_node': 
            break;
        case 'set_selection':
            break;
        default:
            break;
    }
    if (op === null) {
        return [];
    }
    if (op === undefined) {
        if (side === 'left') {
            op = op2;
        } else {
            op = op1;
        }
    }
    return Array.isArray(op) ? op : [op];
}