import { InsertTextOperation, Range, Path, Point, RemoveTextOperation, SplitNodeOperation, SetNodeOperation } from "slate";

/**
 * done
 * left  -> op2 operation is submitted earlier
 * right -> op2 operation is submitted later
 * @param op1 
 * @param op2 
 * @param side 
 * @returns 
 */
export function insertTextInsertText(op1: InsertTextOperation, op2: InsertTextOperation, side: 'left' | 'right') {
    if (Path.equals(op1.path, op2.path)) {
        if (op1.offset > op2.offset || (op1.offset === op2.offset && side === 'left')) {
            return { ...op1, offset: op1.offset + op2.text.length };
        }
    }
    return undefined;
}

export function insertTextRemoveText(op1: InsertTextOperation, op2: RemoveTextOperation, side: 'left' | 'right') {
    if (Path.equals(op1.path, op2.path)) {
        if (op1.offset >= op2.offset + op2.text.length) {
            return { ...op1, offset: op1.offset - op2.text.length }
        }
        if (op1.offset >= op2.offset && op1.offset < op2.offset + op2.text.length && side === 'left') {
            // todo
            return op1;
        }
    }
    return undefined;
}

export function removeTextInsertText(op1: RemoveTextOperation, op2: InsertTextOperation, side: 'left' | 'right') {
    if (Path.equals(op1.path, op2.path)) {
        if (op1.offset >= op2.offset) {
            return { ...op1, offset: op1.offset + op2.text.length }
        }

        if (op1.offset < op2.offset && op1.offset + op1.text.length > op2.offset && side === 'left') {
            // todo
        }
    }
    return undefined;
}
/**
 * refactor
 * @param op1 
 * @param op2 
 * @returns 
 */
export function insertTextSplitNode(op1: InsertTextOperation, op2: SplitNodeOperation) {
    const point = { path: op1.path, offset: op1.offset };
    const newPoint = Point.transform(point, op2) as Point;
    if (!Point.equals(point, newPoint)) {
        return { ...op1, ...newPoint }
    }
    return undefined;
}

export function removeTextRemoveText(op1: RemoveTextOperation, op2: RemoveTextOperation, side: 'left' | 'right') {
    if (Path.equals(op1.path, op2.path)) {
        if (op1.offset >= op2.offset + op2.text.length) {
            return { ...op1, offset: op1.offset - op2.text.length };
        }
        if (op1.offset > op2.offset && op1.offset < op2.offset + op2.text.length && side === 'left') {
            // todo
        }
    }
    return undefined;
}
/**
 * refactor
 * @param op1 
 * @param op2 
 * @param side 
 * @returns 
 */
export function removeTextSplitNode(op1: RemoveTextOperation, op2: SplitNodeOperation) {
    const removeRange = {
        anchor: { path: op1.path, offset: op1.offset },
        focus: { path: op1.path, offset: op1.offset + op1.text.length }
    };
    const splitPosition = isSplitText(op2) && { path: op2.path, offset: op2.position };
    if (splitPosition && Range.includes(removeRange, splitPosition)) {
        // TODO
    }

    // same handle with insertTextSplitNode
    const point = { path: op1.path, offset: op1.offset };
    const newPoint = Point.transform(point, op2) as Point;
    if (!Point.equals(point, newPoint)) {
        return { ...op1, ...newPoint }
    }
    return undefined;
}

export function splitNodeSplitNode(op1: SplitNodeOperation, op2: SplitNodeOperation, side: 'left' | 'right') {
    if (isSplitText(op1) && isSplitText(op2)) {
        if (Path.equals(op1.path, op2.path)) {
            if (op1.position > op2.position || (op1.position === op2.position && side === 'left')) {
                const newSplitPoint = Point.transform({ path: op1.path, offset: op1.position }, op2) as Point;
                return { ...op1, path: newSplitPoint.path, position: newSplitPoint.offset };
            }
        } else {
            if (Point.isAfter({ path: op1.path, offset: op1.position }, { path: op2.path, offset: op2.position })) {
                const newSplitPoint = Point.transform({ path: op1.path, offset: op1.position }, op2) as Point;
                return { ...op1, path: newSplitPoint.path, position: newSplitPoint.offset };
            }
        }
    }
    //todo
    return undefined;
}

export function setNodeSplitNode(op1: SetNodeOperation, op2: SplitNodeOperation, side: 'left' | 'right') {
    if (isSplitText(op2)) {
        if (Path.isAfter(op1.path, op2.path)) {
            const newPath = Path.transform(op1.path, op2) as Path;
            return { ...op1, path: newPath };
        }
        if (Path.equals(op1.path, op2.path) && side === 'left') {
            // need return two operations
            // todo
            return op1;
        }
    }
    return undefined;
}

export function isSplitBlock(operation: SplitNodeOperation) {
    return (operation.properties as Node & { type?: String }).type;
}

export function isSplitText(operation: SplitNodeOperation) {
    return !isSplitBlock(operation);
}