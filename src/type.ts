import { Operation, Range, createEditor, Descendant, Editor, Point, Path } from "slate";
import { transformInsertText } from "./transfrom/insert-text";
import { transformRemoveText } from "./transfrom/remove-text";
import { transformSetNode } from "./transfrom/set_node";
import { transformSplitNode } from "./transfrom/split_node";

const type = {
    name: 'ottype-slate',
    uri: 'https://github.com/pubuzhixing8/ottype-slate',
    editor: createEditor(),

    create: function (data: Descendant[]) {
        return data ? data : [];
    },

    /**
     * Apply op to snapshot. Return the new snapshot.
     * The snapshot is shallow copied as its edited, so the previous snapshot
     * 
     * reference is still valid.
     * @param snapshot 
     * @param op 
     */
    apply(data: Descendant[], op: Operation): Descendant[] {
        // Apply doesn't make use of cursors. It might be a little simpler to
        // implement apply using them. The reason they aren't used here is merely
        // historical - the cursor implementation was written after apply() was
        // already working great.
        Editor.setNormalizing(this.editor, false);
        this.editor.children = data;
        this.editor.apply(op);
        return this.editor.children;
    },

    transform(op1: Operation, op2: Operation, side: 'left' | 'right'): Operation | null | undefined {
        const _op1 = transform(op1, op2, side);
        console.log(`-----transform-----: ${side}`)
        console.log('op1: ', op1);
        console.log('op2: ', op2);
        console.log('op1`: ', _op1);
        return _op1;
    },

    transformPresence(range: Range, op: Operation, isOwnOp: boolean) {
        if (!range || !range.anchor || !range.focus) {
            return false;
        }
        if (!isOwnOp && Range.isCollapsed(range) && op.type === 'insert_text') {
            if (Path.equals(range.anchor.path, op.path) && range.anchor.offset === op.offset) {
                return range;
            }
        }
        for (const [point, key] of Range.points(range)) {
            range[key] = Point.transform(point, op)!
        }
        return range;
    }
};
export { type };

export function transform(op1: Operation, op2: Operation, side: 'left' | 'right') {
    let op: Operation | null | undefined;
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
            op = transformSplitNode(op1, op2, side);
            break;
        case 'merge_node':
            break;
        case 'set_node':
            op = transformSetNode(op1, op2, side);
            break;
        case 'move_node':
            break;
        case 'set_selection':
            break;
        default:
            break;
    }
    if (op === undefined) {
        op = op1;
    }
    return op;
}