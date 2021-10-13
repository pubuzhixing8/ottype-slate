import { Operation, Path, SetNodeOperation } from "slate";
import { setNodeSplitNode } from "./common";

export function transformSetNode(op1: SetNodeOperation, op2: Operation, side: 'left' | 'right') {
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
            op = setNodeSplitNode(op1, op2, side);
            break;
        case 'merge_node':
            break;
        case 'set_node':
            op = setNodeSetNode(op1, op2, side);
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

/**
 * done
 * @param op1 
 * @param op2 
 * @param side 
 * @returns 
 */
export function setNodeSetNode(op1: SetNodeOperation, op2: SetNodeOperation, side: 'left' | 'right') {
    if (Path.equals(op1.path, op2.path) && side === 'right') {
        return { ...op1, ...op2 };
    }
    return op1;
}