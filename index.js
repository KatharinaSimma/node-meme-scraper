import fs from 'node:fs';
import { get } from 'node:https';
import bl from 'bl';
import { parse } from 'node-html-parser';

const website = 'https://memegen-link-examples-upleveled.netlify.app/';
const numberOfPics = 10;

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
              //   return console.log(err);
              // }
              fs.writeFileSync(
                `./memes/${(i + 1).toString().padStart(2, 0)}.jpg`,
                imageData,
              );
            }),
          );
        });
      }
    }),
  );
});
