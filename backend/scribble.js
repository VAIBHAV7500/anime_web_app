const db = require('./db/index');

const body = {
    name: "Vinland Saga",
    genre_id: "[{id: 1}]",
    trailer_url: "https://www.youtube.com/watch?v=BRubJuMCUkI",
    poster_portrait_url: "https://ih1.redbubble.net/image.913285284.4836/flat,750x1000,075,f.jpg",
    poster_landscape_url: "https://img.reelgood.com/content/show/65779d57-f0f3-4cbd-b2f9-8c1f063fad68/backdrop-1920.jpg",
    season: 1,
    total_view: 0,
    release_date: "2020-08-10",
    age_category: 16,
    plan_id: 0,
    type: "Dummy"
}
db.shows.create(body).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
});