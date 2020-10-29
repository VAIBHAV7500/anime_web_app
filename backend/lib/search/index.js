const Fuse = require('fuse.js')
var db = require('../../db');
const { bulkFindCategory } = require('../../db/tables/genre');

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

const FilterOptions = {
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
        "original_name",
        "genres",
        "episode_number",
        "type",
        "age_category"
    ]
};

let list = [];
let fuse = new Fuse(list, options);
let filterList = new Fuse(list, FilterOptions);

const updateList = async () => {
    const shows = await db.shows.getShowsData();
    if(shows){
        list = await db.genre.attachGenres(shows);
    }
    fuse = new Fuse(list, options);
    filterList = new Fuse(list, FilterOptions);
}

const generatePattern = (data) => {
    const andArr = [];
    
    if (data["genre_arr"] && data["genre_arr"].length) {
        andArr.push({
            $or: data["genre_arr"].map((x) => {
                return {
                    genres: x
                };
            })
        });
    }

    if(data["episode_arr"] && data["episode_arr"].length){
        andArr.push({
            $or: data["episode_arr"].map((x) => {
                return {
                    episode_number: x
                };
            })
        });
    }

    if (data["score_arr"] && data["score_arr"].length) {
        andArr.push({
            $or: data["score_arr"].map((x) => {
                return {
                    rating: `=${x}` // Equals to Sign means exact match
                };
            })
        });
    }

    if (data["type_arr"] && data["type_arr"].length) {
        andArr.push({
            $or: data["type_arr"].map((x) => {
                return {
                    type: `=${x}` // Equals to Sign means exact match
                };
            })
        });
    }

    if (data["age_category_arr"] && data["age_category_arr"].length) {
        andArr.push({
            $or: data["age_category_arr"].map((x) => {
                return {
                    age_category: `=${x}`
                }
            })
        });
    }

    if (data["key"]) {
        andArr.push({
            $or: [{
                    name: data["key"]
                },
                {
                    original_name: data["key"]
                }

            ]
        });
    }

    const pattern = {
        $and: andArr
    };
    return pattern;
}

const search = (data, filter) => {
    if(filter){
        const pattern = generatePattern(data);
        return filterList.search(pattern);
    }else{
        const pattern = data["key"] || [];
        return fuse.search(pattern);
    }
}

module.exports = {
    updateList,
    search,
}