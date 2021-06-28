const isAllowedCollection = (collection = '', collections = []) => {
    const included = collections.includes(collection);

    if (!included) {
        throw new Error(`The collection \'${collection}\' is not allowed`);
    }

    return true;
}

module.exports = {
    isAllowedCollection,
}