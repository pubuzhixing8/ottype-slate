import ReconnectingWebSocket from 'reconnecting-websocket';
import { Connection, types } from 'sharedb/lib/client';
import { Editor, Operation } from 'slate';
import { type } from '../../../../dist';
import { CursorInfo, LocalPresenceInfo } from '../model/presence';
import { OTTypeEditor } from './with-ottype';
import randomColor from "randomcolor";
import { User } from '../model/user';
types.register(type as any);

export function initailizeShareDB(collection: string, id: string, url: string, editor: OTTypeEditor, user: User,callback: (doc: any) => void, onReceiveCursor: (newCursors: CursorInfo[]) => void) {
    var socket = new ReconnectingWebSocket(url);
    var connection = new Connection(socket as any);
    const doc = connection.get(collection, id);
    const caretMap = new Map<string, CursorInfo>();

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
        editor.doc = doc;
        callback(doc);
    });

    // presence cursors
    var presence = doc.connection.getDocPresence(collection, id);
    presence.subscribe(function (error: any) {
        if (error) throw error;
    });
    presence.on('receive', function (id: string, cursor: CursorInfo) {
        caretMap.set(id, cursor);
        const cursors = Array.from(caretMap.entries()).filter(([key, item]) => item && item.anchor && item.focus).map(([key, item]) => item);
        onReceiveCursor(cursors);
    });
    var localPresence = presence.create();
    const color = randomColor({
        luminosity: "dark",
        format: "rgba",
        alpha: 1,
    });
    setLocalPresenceData(localPresence, { color, name: user.name });
    editor.localPresence = localPresence;
}

const LOCAL_PRESENCE_DATA_EKY = '__LOCAL_PRESENCE_DATA__';

export function setLocalPresenceData(localPresence: any, data: LocalPresenceInfo) {
    localPresence[LOCAL_PRESENCE_DATA_EKY] = data;
}

export function getLocalPresenceData(localPresence: any): LocalPresenceInfo {
    return localPresence[LOCAL_PRESENCE_DATA_EKY];
}