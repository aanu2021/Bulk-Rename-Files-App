const express = require("express");
const hbs = require("hbs");
const app = express();
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
require('dotenv').config();
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname,"public");
const templatePath = path.join(__dirname,"templates");
const partialsPath = path.join(__dirname,"templates/partials");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine","hbs");
app.set("views",templatePath);
hbs.registerPartials(partialsPath);
app.use(express.static(staticPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/rename", (req, res) => {
  // Read all the files inside the data directory.

  const folder = req.body.folderName;
  const replaceThis = req.body.replaceThis;
  const replaceWith = req.body.replaceWith;
  const optionChosen = req.body.option;
  let preview = true;

//   console.log(folder);
//   console.log(replaceThis);
//   console.log(replaceWith);
//   console.log(optionChosen);

  if (optionChosen === "option1") {
    preview = true;
  } else {
    preview = false;
  }

  let previewArr = [];

//   console.log(preview);

  try {
    fs.readdir(folder, (err, data) => {

      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        const oldFile = path.join(folder, item);
        const currChange = item.replaceAll(replaceThis, replaceWith);
        const newFile = path.join(folder, currChange);

        // Rename all the files inside the data directory.

        if (!preview) {
          fs.rename(oldFile, newFile, () => {
            console.log("Rename Successful...");
          });
        } else {
          const oldName = path.parse(item).name;
          if (oldName.substring(0,replaceThis.length) === replaceThis) {
            console.log(oldFile + " will be renamed to " + newFile);
            previewArr.push(`${oldFile} will be renamed to ${newFile}`);
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
  }

  if (preview) {
    res.render(path.join(__dirname, "templates/views/preview.hbs"),{array : previewArr});
  } else {
    res.render(path.join(__dirname, "templates/views/rename.hbs"));
  }

});

app.listen(port, () => {
  console.log("Server is listening at port no 3000");
});
