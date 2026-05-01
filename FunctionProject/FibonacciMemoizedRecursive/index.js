const bigInt = require("big-integer");

// In-memory cache for this function instance only.
const pairMemo = new Map();
pairMemo.set(0, [bigInt.zero, bigInt.one]);

function fibPairRecursiveMemo(n) {
    if (pairMemo.has(n)) {
        return pairMemo.get(n);
    }

    const half = Math.floor(n / 2);
    const [a, b] = fibPairRecursiveMemo(half);

    // Fast-doubling identities:
    // F(2k) = F(k) * (2*F(k+1) - F(k))
    // F(2k+1) = F(k)^2 + F(k+1)^2
    const c = a.multiply(b.multiply(2).subtract(a));
    const d = a.multiply(a).add(b.multiply(b));

    const pair = (n % 2 === 0)
        ? [c, d]
        : [d, c.add(d)];

    pairMemo.set(n, pair);
    return pair;
}

module.exports = async function fibonacciMemoizedRecursiveHandler(context, req) {
    const bodyNth = req.body?.nth;
    const queryNth = req.query?.nth;
    const rawNth = bodyNth ?? queryNth;

    if (rawNth === undefined || rawNth === null || rawNth === "") {
        context.res = {
            status: 400,
            body: {
                error: "Parameter 'nth' is required in query string or body."
            }
        };
        return;
    }

    const nth = Number(rawNth);
    if (!Number.isInteger(nth) || nth < 0) {
        context.res = {
            status: 400,
            body: {
                error: "Parameter 'nth' must be a non-negative integer."
            }
        };
        return;
    }

    try {
        const hadCachedValue = pairMemo.has(nth);
        const [value] = fibPairRecursiveMemo(nth);

        context.res = {
            status: 200,
            body: {
                algorithm: "recursive-fast-doubling-with-memoization",
                nth,
                value: value.toString(),
                cachedBefore: hadCachedValue,
                cacheSize: pairMemo.size
            }
        };
    } catch (error) {
        context.log.error("Error calculating Fibonacci with recursive memoization", error);
        context.res = {
            status: 500,
            body: {
                error: "Unexpected error while calculating Fibonacci."
            }
        };
    }
};
