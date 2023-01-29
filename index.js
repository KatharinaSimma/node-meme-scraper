import fs from 'node:fs';
import { get } from 'node:https';
import colors from 'ansi-colors';
import bl from 'bl';
import cliProgress from 'cli-progress';
import { parse } from 'node-html-parser';

const website = 'https://memegen-link-examples-upleveled.netlify.app/';
const numberOfPics = 10;

const bar1 = new cliProgress.SingleBar({
  format:
    'Memes downloaded ' +
    colors.bold.magentaBright('{bar}') +
    ' {percentage}% | {value}/{total} files',
  barCompleteChar: '#',
  barIncompleteChar: '-',
  hideCursor: true,
});
bar1.start(numberOfPics, 0);

// set up the memes folder
if (fs.existsSync('./memes')) {
  // Do nothing. Any files in the folder will be overwritten.
} else {
  fs.mkdirSync('./memes');
}

// fetch the memes
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
              //              if (error) {
              return console.log(error);
              //            }
              fs.writeFile(
                `./memes/${(i + 1).toString().padStart(2, 0)}.jpg`,
                imageData,
                () => {
                  bar1.update(i + 1);
                  if (i + 1 === numberOfPics) {
                    bar1.stop();
                  }
                },
              );
            }),
          );
        });
      }
    }),
  );
});
