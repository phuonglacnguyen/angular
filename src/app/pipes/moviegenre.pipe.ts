import { Pipe } from '@angular/core';

@Pipe({ name: 'movieGenre' })
export class MovieGenrePipe {
  transform(value, args) {
    if (!args || args == undefined) {
      return value;
    } else if (value) {
      return value.filter(item => {
        for (let key in item) {
          if(item.schemaextend[0].genres) {
            return item.schemaextend[0].genres.includes(args);
          }
        }
      });
    }
  }
}