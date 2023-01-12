import fs from 'node:fs';
import { get } from 'node:https';
import bl from 'bl';
import { parse } from 'node-html-parser';

const website = 'https://memegen-link-examples-upleveled.netlify.app/';
const numberOfPics = 10;

// try {
//   if (fs.existsSync('./memes')) {
//     // Do nothing. Any files in the folder will be overwritten
//     console.log('The memes folder already exists ...');
//   } else {
//     await fs.mkdir('./memes', () => {});
//     console.log('mkdir');
//   }
//   console.log('Here we go!');
// } catch (error) {
//   console.error(
//     'Something went wrong with preparing the memes folder: ',
//     error.message,
//   );
// }

if (fs.existsSync('./memes')) {
  // Do nothing. Any files in the folder will be overwritten
  console.log('The memes folder already exists ...');
} else {
  fs.mkdirSync('./memes');
  console.log('mkdir');
}

get(website, (response) => {
  response.pipe(
    bl(function (err, data) {
      // if (err) {
      //   return console.log(err);
      // }
      console.log('111) data: ', data); // buffer object
      console.log('222) data to string: ', data.toString().length); // html string ready for parsing, .length for readability
      const htmlContent = parse(data.toString()).querySelectorAll('img');
      console.log('333) htmlContent: ', htmlContent.length); // parsed list of all 'img' objects
      for (let i = 0; i < numberOfPics; i++) {
        const imgUrl = htmlContent[i].rawAttrs.match(/(src=")(.*)(")/)[2];
        console.log('444) imgUrl', imgUrl); // logs 10 times, before anything else in the loop
        get(imgUrl, (res) => {
          res.pipe(
            bl((blError, imageData) => {
              // if (blError) {
              //   return console.log(blError);
              // }
              console.log(
                `555) ${i + 1} imageData = returned buffer: `,
                imageData.length,
              );
              fs.writeFile(
                `./memes/${(i + 1).toString().padStart(2, 0)}.jpg`,
                imageData,
                () => {
                  fs.readdir('./memes', (readdirError, files) => {
                    console.log('files', files.length);
                  });
                },
              );
            }),
          );
        });
      }
      console.log('xxxxxxxxxxxxxxxx The end');
    }),
  );
});
