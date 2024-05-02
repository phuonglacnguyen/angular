import { Pipe } from '@angular/core';

@Pipe({ name: 'filter' })
export class FetchJsonPipe {
    transform(value, args) {
        //console.log(value + '_' + args)
        if (!args || args == undefined) {
            return value;
        } else if (value) {
            return value.filter(item => {
                for (let key in item) {
                    //console.log(args);
                    //return value.filter(it => {
                    return item.title.toLowerCase().includes(args);
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


