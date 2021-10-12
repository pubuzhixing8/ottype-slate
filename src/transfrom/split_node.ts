import { Operation, SplitNodeOperation } from "slate";
import { splitNodeSplitNode } from "./common";

export function transformSplitNode(op1: SplitNodeOperation, op2: Operation, side: 'left' | 'right') {
    let op: Operation | undefined | null;
    switch (op2.type) {
        case 'insert_text':
            break;
        case 'remove_text':
            break;
        case 'insert_node':
            break;
        case 'remove_node':
            break;
        case 'split_node':
            op = splitNodeSplitNode(op1, op2, side);
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
    return op;
}