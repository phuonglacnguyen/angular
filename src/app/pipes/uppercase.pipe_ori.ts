import { Pipe, PipeTransform } from '@angular/core';
//import { invalidPipeArgumentError } from './../error/invalid_pipe_argument_error';

@Pipe({ name: 'uppercase' })
export class UpperCasePipe implements PipeTransform {
    transform(value: any): any {
        if (!value) return value;
        if (typeof value !== 'string') {
            //throw invalidPipeArgumentError(UpperCasePipe, value);
        }
        return value.toUpperCase();
    }
}