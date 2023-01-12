import fs from 'node:fs';
import { get } from 'node:https';
import bl from 'bl';
import { parse } from 'node-html-parser';

const website = 'https://memegen-link-examples-upleveled.netlify.app/';
const numberOfPics = 10;

if (fs.existsSync('./memes')) {
  // Do nothing. Any files in the folder will be overwritten.
} else {
  fs.mkdirSync('./memes');
}

get(website, (response) => {
  response.pipe(
    bl(function (err, data) {
      // if (err) {
      //   return console.log(err);
      // }
      const htmlContent = parse(data.toString()).querySelectorAll('img');
      for (let i = 0; i < numberOfPics; i++) {
        const imgUrl = htmlContent[i].rawAttrs.match(/(src=")(.*)(")/)[2];
        get(imgUrl, (res) => {
          res.pipe(
            bl((error, imageData) => {
              // if (error) {
              //   return console.log(error);
              // }
              fs.writeFile(
                `./memes/${(i + 1).toString().padStart(2, 0)}.jpg`,
                imageData,
                () => {},
              );
            }),
          );
        });
      }
    }),
  );
});
