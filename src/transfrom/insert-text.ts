import { InsertTextOperation, Operation } from "slate";
import { insertTextInsertText, insertTextRemoveText, insertTextSplitNode } from "./common";

export function transformInsertText(op1: InsertTextOperation, op2: Operation, side: 'left' | 'right') {
    let op: Operation | undefined | null;
    switch (op2.type) {
        case 'insert_text':
            op = insertTextInsertText(op1, op2, side);
            break;
        case 'remove_text':
            op = insertTextRemoveText(op1, op2, side);
            break;
        case 'insert_node':
            break;
        case 'remove_node':
            break;
        case 'split_node':
            op = insertTextSplitNode(op1, op2);
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