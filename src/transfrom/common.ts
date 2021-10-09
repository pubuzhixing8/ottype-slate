import { InsertTextOperation, Range, Path, Point, RemoveTextOperation, SplitNodeOperation } from "slate";

export function insertTextInsertText(op1: InsertTextOperation, op2: InsertTextOperation, side: 'left' | 'right') {
    if (Path.equals(op1.path, op2.path)) {
        if (side === 'left' && op1.offset <= op2.offset) {
            return { ...op2, offset: op2.offset + op1.text.length }
        }
        if (side === 'right' && op1.offset > op2.offset) {
            return { ...op1, offset: op1.offset + op2.text.length };
        }
    }
    return undefined;
}

export function insertTextRemoveText(op1: InsertTextOperation, op2: RemoveTextOperation, side: 'left' | 'right') {
    if (Path.equals(op1.path, op2.path)) {
        // a[bc]d[ef]gh
        // op1 remove [bc] op2 remove [ef]
        if (side === 'left' && op1.offset + op1.text.length <= op2.offset) {
            return { ...op2, offset: op2.offset - op1.text.length }
        }
        // op1 remove [ef] op2 remove [bc]
        if (side === 'right' && op1.offset >= op2.offset + op2.text.length) {
            return { ...op1, offset: op1.offset - op2.text.length }
        }
        // TODO: 
        // ab[cd[[ef]gh]]
    }
    return undefined;
}

export function insertTextSplitNode(op1: InsertTextOperation, op2: SplitNodeOperation, side: 'left' | 'right') {
    if (side === 'left') {
        // split block do nothing
        // split text need transfrom position
        if (!(op2.properties as Node & { type?: String }).type) {
            const point = { path: op2.path, offset: op2.position };
            const newPoint = Point.transform(point, op1) as Point;
            if (newPoint.offset !== op2.position) {
                return { ...op2, position: newPoint.offset }
            }
        }
    }
    if (side === 'right') {
        const point = { path: op1.path, offset: op1.offset };
        const newPoint = Point.transform(point, op2) as Point;
        if (!Point.equals(point, newPoint)) {
            return { ...op1, ...newPoint }
        }
    }
    return undefined;
}

export function removeTextRemoveText(op1: RemoveTextOperation, op2: RemoveTextOperation, side: 'left' | 'right') {
    if (Path.equals(op1.path, op2.path)) {
        const isBefore = op1.offset <= op2.offset;
        if (side === 'left' && isBefore) {
            return { ...op2, offset: op2.offset + op1.text.length }
        }
        if (side === 'right' && op1.offset >= op2.offset + op2.text.length) {
            return { ...op1, offset: op1.offset - op2.text.length };
        }
        if (side === 'right' && op1.offset > op2.offset && op1.offset < op2.offset + op2.text.length) {
            return null;
        }
    }
    return undefined;
}

export function removeTextSplitNode(op1: RemoveTextOperation, op2: SplitNodeOperation, side: 'left' | 'right') {
    const isSplitText = !(op2.properties as Node & { type?: String }).type;
    const removeRange = {
        anchor: { path: op1.path, offset: op1.offset },
        focus: { path: op1.path, offset: op1.offset + op1.text.length }
    };
    const splitPosition = isSplitText && { path: op2.path, offset: op2.position };
    if (splitPosition && Range.includes(removeRange, splitPosition)) {
        // TODO
    }

    // same handle with insertTextSplitNode
    if (side === 'left') {
        // split block do nothing
        // split text need transfrom position
        if (!(op2.properties as Node & { type?: String }).type) {
            const point = { path: op2.path, offset: op2.position };
            const newPoint = Point.transform(point, op1) as Point;
            if (newPoint.offset !== op2.position) {
                return { ...op2, position: newPoint.offset }
            }
        }
    }
    if (side === 'right') {
        const point = { path: op1.path, offset: op1.offset };
        const newPoint = Point.transform(point, op2) as Point;
        if (!Point.equals(point, newPoint)) {
            return { ...op1, ...newPoint }
        }
    }
    return undefined;
}