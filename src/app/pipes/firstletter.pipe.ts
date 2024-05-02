import { Pipe, PipeTransform } from '@angular/core';
import { UpperCasePipe } from './uppercase.pipe_ori';


@Pipe({ name: 'firstletter' })
export class FirstletterPipe implements PipeTransform {
    //transform(value, args) {
    transform(value: any, args: any): any {
        if (!args) {
            //console.log(value);
            return value;
        } else if (value) {
            return value.filter(item => {
                for (let key in item) {
                    var letter = item['title'].substring(0, 1);
                    if (args.toUpperCase() == letter.toUpperCase()) {
                        return value;
                    }
                }
            });
        }
    }
 }