import { Pipe } from '@angular/core';

@Pipe({ name: 'imagePerson' })
export class ImagePersonPipe {
  transform(value, args) {
    //console.log(value + '_' + args)
    if (!args || args == undefined) {
      return value;
    } else if (value) {
      return value.filter(item => {
        for (let key in item) {
          //console.log(item.schemaextend[0].photopersons);
          //return value.filter(it => {
            //console.log(item.schemaextend[0].photopersons.find(x => x._id === args)._id);
            if(item.schemaextend[0].photopersons)
            var a = item.schemaextend[0].photopersons.find(x => x._id === args);
            //console.log(a);
            if (a !== undefined) {
                return item;
            }
          //return item.schemaextend[0].photopersons.includes(args);
          //});


          //f ((item[key] instanceof String) && (item[key].indexOf(args) !== -1)) {
          //    return item.includes(args);
          //}

          // else if ((typeof item[key] === 'boolean' || item[key] instanceof Boolean)   ) {
          //    return true;
          //}
        }
      });
    }
  }





}


