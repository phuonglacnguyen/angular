import { Pipe } from '@angular/core';
import { UserService } from './../services/user.service';

@Pipe({ name: 'Favorites' })
export class FavoritesPipe {
  constructor(public _userService: UserService,) { }
  transform(value, args) {
    //console.log(value + '_' );
    if (!args || args == undefined) {
      //console.log(args + " ? ");
      return value;
    } else if (value) {
      return value.filter(item => {
        for (let key in item) {
          var e : any = (<HTMLInputElement>document.getElementById("filterfavorites")).value;
          //return value.filter(it => {
            if(e === "true") {
              return args.includes(item._id);
            } else {
              //var b = this._userService.user_current.movies.indexOf(item._id);
              let b = this._userService.user_current.movies.find(x => x._id === item._id);
              
              if(!b) {
                return args.includes(item._id);
              } else {
                
                
              }
            }
          
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


