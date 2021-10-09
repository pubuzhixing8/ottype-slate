import { Operation, SplitNodeOperation } from "slate";
import { insertTextSplitNode, removeTextSplitNode } from "./common";
import { invertSide } from "./utils";

export function transformSplitNode(op1: SplitNodeOperation, op2: Operation, side: 'left' | 'right') {
    let op: Operation | undefined | null;
    switch (op2.type) {
        case 'insert_text':
            op = insertTextSplitNode(op2, op1, invertSide(side));
            break;
        case 'remove_text':
            op = removeTextSplitNode(op2, op1, invertSide(side));
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
    return op;
}