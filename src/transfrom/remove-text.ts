import { Operation, RemoveTextOperation } from "slate";
import { removeTextInsertText, removeTextRemoveText, removeTextSplitNode } from "./common";

export function transformRemoveText(op1: RemoveTextOperation, op2: Operation, side: 'left' | 'right') {
    let op: Operation | undefined | null;
    switch (op2.type) {
        case 'insert_text':
            op = removeTextInsertText(op1, op2, side);
            break;
        case 'remove_text':
            op = removeTextRemoveText(op1, op2, side);
            break;
        case 'insert_node':
            break;
        case 'remove_node':
            break;
        case 'split_node':
            op = removeTextSplitNode(op1, op2);
            break;
        case 'merge_node':
            break;
        case 'set_node':
            // do nothing
            break;
        case 'move_node':
            break;
        case 'set_selection':
            break;
        default:
            break;
    }
    return op;
}