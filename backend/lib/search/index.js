const Fuse = require('fuse.js')
var db = require('../../db');

const options = {
    // isCaseSensitive: false,
     includeScore: true,
     shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
     distance: 10,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    keys: [
        "name",
        "original_name"
    ]
};
let list = [];
let fuse = new Fuse(list, options);

const updateList = async () => {
    list = await db.shows.getShowsTitle();
    fuse = new Fuse(list, options);
}

const search = (pattern) => {
    console.log(list);
    return fuse.search(pattern,{limit: 10});
}

module.exports = {
    updateList,
    search,
}