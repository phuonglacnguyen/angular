import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortByTitle'
})
// export class TitleSortPipe implements PipeTransform {
// //console.log('He?');
//   transform(values: any[]): any[] {
//     return values.sort((a, b) => a.title.localeCompare(b.title));
//   }

// }

export class TitleSortPipe implements PipeTransform {
  transform(array: any[], args?: any): any[] {
    if (array) {
      // Sort the array based on the 'title' property
      //console.log(args);
      if(args == true) {
        array.sort((a: any, b: any) => {
          if (a.title < b.title) {
            return -1;
          } else if (a.title > b.title) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        array.reverse();
      }
      
      return array;
    } else {
      return [];
    }
  }
}