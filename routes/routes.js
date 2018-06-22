//Scraping tools
var cheerio = require("cheerio");
var request = require("request");

//Models
var db = require("../models");

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get("/scrape", function (req, res) {

    request("https://www.mountainproject.com/area/classics/105720591/barker-dam-area?type=all", function (error, response, html) {

      var $ = cheerio.load(html);

      $("tr.route-row").each(function (i, element) {

        var result = {};

        result.title = $(this).children("td").children("a").children("strong").text();
        result.link = $(this).children("td").children("a").attr("href");
        // result.area = $(this).children("td").children("span.text-warm").children("a").text();

        db.Route.find({ title: result.title }) // Prevents duplicates of Routes. (Thanks, Jesse L.)
          .then(function (dbTitle) {
            console.log(dbTitle);
            if (dbTitle.length === 0) {
              if (result.title) {
                db.Route.create(result)
                  .then(function (dbRoute) {
                    console.log(dbRoute);
                  })
                  .catch(function (err) {
                    return res.json(err);
                  });
              }
            };
          })
          .catch(function (err) {
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Route, send a message to the client. Call it via function after success accounts for asynchroncity between modal and results loading.
      res.send("Scrape Complete");

    });
  });

  // Route for getting all Routes from the db
  app.get("/Routes", function (req, res) {
    db.Route.find({})
      .populate("note")
      .then(function (dbRoute) {
        res.json(dbRoute);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for grabbing a specific Route by id, populate it with it's note
  app.get("/Routes/:id", function (req, res) {
    db.Route.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (dbRoute) {
        res.json(dbRoute);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Route for saving/updating an Route's associated Note
  app.post("/Routes/:id", function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Route.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function (dbRoute) {
        res.json(dbRoute);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

}