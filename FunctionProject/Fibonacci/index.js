const bigInt = require("big-integer");
module.exports = async function fibonacciHandler(context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const bodyNth = req.body?.nth;
    const queryNth = req.query?.nth;
    const rawNth = bodyNth ?? queryNth;

    if (rawNth === undefined || rawNth === null || rawNth === "") {
        context.res = {
            status: 400,
            body: "Parameter 'nth' is required in query string or body."
        };
        return;
    }

    const nth = Number(rawNth);
    if (!Number.isInteger(nth) || nth < 0) {
        context.res = {
            status: 400,
            body: "Parameter 'nth' must be a non-negative integer."
        };
        return;
    }

    let nth_1 = bigInt.one;
    let nth_2 = bigInt.zero;
    let answer = bigInt.zero;

    if (nth === 0)
        answer = nth_2
    else if (nth === 1)
        answer = nth_1
    else {
        for (let i = 0; i < nth - 1; i++) {
            answer = nth_2.add(nth_1)
            nth_2 = nth_1
            nth_1 = answer
        }
    }

    context.res = {
        status: 200,
        body: answer.toString()
    };
}