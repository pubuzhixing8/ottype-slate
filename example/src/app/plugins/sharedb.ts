import ReconnectingWebSocket from 'reconnecting-websocket';
import { Connection, types } from 'sharedb/lib/client';
import { Editor, Operation } from 'slate';
import { type } from '../../../../dist';
import { OTTypeEditor } from './with-ottype';
types.register(type as any);

export function initailizeShareDB(collection: string, id: string, url: string, callback: (doc: any) => void, editor: OTTypeEditor) {
    var socket = new ReconnectingWebSocket(url);
    var connection = new Connection(socket as any);
    const doc = connection.get(collection, id);
    doc.subscribe((error: any) => {
        if (error) throw error;
        doc.on('op', (op: Operation | Operation[], source: any, clientId: string) => {
            if (!op) {
                return;
            }
            if (source) {
                return;
            }
            const isNormalizing = Editor.isNormalizing(editor);
            Editor.setNormalizing(editor, false);

            OTTypeEditor.asRemote(editor, () => {
                const operations = Array.isArray(op) ? op : [op];
                operations.map((operation: Operation) => {
                    editor.apply(operation);
                });
            })

            Editor.setNormalizing(editor, isNormalizing);
        });
        callback(doc)
    });
}