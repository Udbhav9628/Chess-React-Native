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
        y: parseInt(row, 10) - 1,
    };
    return {
        x: indexes.x * 45,
        y: 7 * 40 - indexes.y * 40,
    };
};

export const toPosition = ({ x, y }: any) => {
    "worklet";
    console.log('****');

    console.log(x);

    // // 97 = a
    const col = String.fromCharCode(97 + Math.round(x / 45));
    const row = `${8 - Math.round(y / 40)}`;
    return `${col}${row}` as string;
};
