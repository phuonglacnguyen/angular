import { Pipe, PipeTransform } from '@angular/core';
import { UpperCasePipe } from './uppercase.pipe_ori';

@Pipe({ name: 'filterparent' })
export class ParentPipe implements PipeTransform {
    transform(value, selectedvalue) {
        //console.log(value['parent'] + ' ' + args[0]);
        if (!selectedvalue || selectedvalue == undefined) {
            return value;
        } else if (value) {
           // return value.filter(item => {
           //     for (let key in item) {
                    //console.log(item['parent'] + ' ' + selectedvalue);
           //         if (item['parent'] == null || item['parent'] == selectedvalue) {
           //             return true;
           //         }

           //     }
           // });
        }
    }





}