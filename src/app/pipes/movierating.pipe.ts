import { Pipe } from '@angular/core';

@Pipe({ name: 'movieRating' })
export class MovieRatingPipe {
  transform(value, args) {
    if (!args || args == undefined) {
      return value;
    } else if (value) {
      //console.log(args);

      return value.filter((items) => {
        for (let key in items) {
          if (
            items &&
            items.objectType == '5c0114dc962a560534e3e576' &&
            args &&
            items.schemaextend[0].imdbrating != undefined &&
            parseInt(args) == parseInt(items.schemaextend[0].imdbrating)
          ) {
            return value;
          } else if (args == '0') {
            return value;
          }
        }
      });
    }
  }
}
