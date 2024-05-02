import { Pipe, PipeTransform } from '@angular/core';
//import { FilterService } from './../services/filter.service';

@Pipe({ name: 'QuestionableBoolean' })
export class QuestionableBooleanPipe implements PipeTransform {

    transform(myobjects: Array<Object>, args?: Array<Object>): any {
        //console.log(args);

        if (args.length > 0 && Array.isArray(myobjects)) { // 
            // copy all objects of original array into new array of objects
            var returnobjects = myobjects;
            // args are the compare oprators provided in the *ngFor directive
            if (args.length > 0) {
                args.forEach(function (filterobj) {
                    if (filterobj != undefined) {
                        let filterkey = Object.keys(filterobj)[0];
                        let filtervalue = filterobj[filterkey];
                        //console.log(filterkey + ' | ' + filtervalue);
                        if (filterkey != undefined) {
                            myobjects.forEach(function (objectToFilter) {
                                if (objectToFilter[filterkey] != filtervalue) { // && filtervalue != false
                                    // object didn't match a filter value so remove it from array via filter
                                    //console.log(filterkey + ' | ' + filtervalue);
                                    returnobjects = returnobjects.filter(obj => obj !== objectToFilter);

                                }
                            })
                        }
                    }
                });
            }
            // return new object to *ngFor directive
            return returnobjects;
        }
    }

}
    /*
    transform(value: any, args: any): any {
        
        if (!args) {
            return value;
        } else if (value) {
            var output = '';
            var nindex = '';
            var nvalue = false;
            var nvvalue = false;

            

            return value.filter(item => {
                //var nvalue: string = "false";

                //var newt = args.split(':');
                //nindex = newt[0];
                //nvalue = newt[1];
                //var isTrueSet = (newt[1] === 'true');

                console.log(args);
                //console.log(item);

                var returnobjects = value;
                args.forEach(function (filterobj) {
                    let filterkey = Object.keys(filterobj)[0];
                    let filtervalue = filterobj[filterkey];
                    value.forEach(function (objectToFilter) {
                        if (objectToFilter[filterkey] != filtervalue && filtervalue != "") {
                            // object didn't match a filter value so remove it from array via filter
                            returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
                        }
                    })
                });
                return returnobjects;

                //return allHeroes.filter(hero => hero.canFly);

                //for (var z = 0; z < args.length; z++) {
                //    console.log(args[z]);
                //}

                //console.log(item);
                //for (let key in item) {
                //    nvvalue = item[key];
                    //console.log(nvvalue + ' ' + key);
                    //if (nvvalue == isTrueSet) {
                        //console.log('2 ' + ' ' + nvvalue + ' : ' + (nvalue) );
                        //console.log(item[nindex] + ' ' + nvalue);
                        //return value;
                    //}
                //}
                //return value;
            });
            
            
        }
    }
}
    */
  /*
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'questionableBoolean' })
export class QuestionableBooleanPipe implements PipeTransform {
    transform(value: boolean): string {
        return value == true ? 'Yes' : 'No'
    };
    
    transform(value, args) {
        return value == true ? 'true' : 'false';
        //console.log(value);
      
        return value.filter(item => {
            for (let key in item) {
                console.log(item);
                if ((value == true)) {
                    return true;
                }
            }
        });

//        return value == true ? 'true' : 'false'
        
        return value.(item => {
            for (let key in item) {
                console.log(item);
                if ((value == true)) {
                    return true;
                } else if ((typeof item[key] === 'boolean' || item[key] instanceof Boolean)) {
                    return true;
                }
            }
        });
        
   // };
} */