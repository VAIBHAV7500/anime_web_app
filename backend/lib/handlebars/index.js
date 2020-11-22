const handlebars = require('handlebars');

// var source = "<p>Hello, my name is {{name}}. I am from {{hometown}}. I have " +
//              "{{kids.length}} kids:</p>" +
//              "<ul>{{#kids}}<li>{{name}} is {{age}}</li>{{/kids}}</ul>";
// var template = handlebars.compile(source);
 
// var data = { "name": "Alan", "hometown": "Somewhere, TX",
//              "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
// var result = template(data);

const generateTemplate = (source) => {
    return handlebars.compile(source);
}


module.exports = {
    generateTemplate
}