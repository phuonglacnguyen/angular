import { Pipe } from '@angular/core';

@Pipe({ name: 'musicGenre' })
export class MusicGenrePipe {
  transform(value, args) {
    if (!args || args == undefined) {
      return value;
    } else if (value) {
      return value.filter(item => {
        for (let key in item) {
          //return item.schemaextend[0].musicgenre.includes(args);
          var nargs = args.toLowerCase();
          var gener =  "";
          if(item.schemaextend[0]) {
            gener = item.schemaextend[0].musicgenre ? item.schemaextend[0].musicgenre.toLowerCase() : '';
          } else {
            gener = "";
          }
          //console.log(item.title + '|' + gener + '|' + nargs);
          if (gener.match(nargs)) {
              return value;
          } else if (args == '0') {
            return value;
          }

        }
      });
    }
  }
}