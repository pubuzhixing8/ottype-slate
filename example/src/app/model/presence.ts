import { Path, Range } from "slate";

export interface CursorInfo extends Range {
    isForward: boolean;
    originAnchorPath: Path;
    originFocusPath: Path;
    data: {
        name: string;
        color: string;
        alphaColor?: string;
    }
}

export interface LocalPresenceInfo {
    color: string;
    name: string;
}