async function parseQuery(queryString) {
    const queryParams = new URLSearchParams(queryString);
    const query = {};
    for (const [key, value] of queryParams) {
        query[key] = value;
    }
    return query;
}

module.exports = { parseQuery };