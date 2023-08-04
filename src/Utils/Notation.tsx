// //To Convert chess.js Format (a2, e5) to actual position in Board
export const toTranslation = (to: any) => {
    "worklet";
    // worklet don't support destructuring yet
    const tokens = to.split("");
    const col = tokens[0];
    const row = tokens[1];
    if (!col || !row) {
        throw new Error("Invalid notation: " + to);
    }

    const indexes = {
        x: col.charCodeAt(0) - "a".charCodeAt(0),
        y: parseInt(row, 10) - 1, //// minus 1 because chess notation uses numbers from 1 to 8, but array indices start from 0
    };
    return {
        x: indexes.x * 45,
        y: 7 * 40 - indexes.y * 40,
    };
};

// //To Convert Piece Position on Board to Format Chess.js can Understand
export const toPosition = ({ x, y }: any) => {
    "worklet";
    const col = String.fromCharCode(97 + Math.round(x / 45));
    const row = `${8 - Math.round(y / 40)}`;
    return `${col}${row}` as string;
};
