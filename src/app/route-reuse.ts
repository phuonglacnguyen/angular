import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private routeStore = new Map<string, DetachedRouteHandle>();
  private acceptedRoutes: string[] = [
    'Videos/:parent',
    'homepage',
    'Music/:albumName/:id',
    'Personal/:parent',
    'Personal/65fe13f38015e06e0cd20048',
    'Music/6553fed32704c658555d3324',
    'Videos/65fce36c8015e06e0cd1b02a',
    'Kids/:parentName/:id',
    'Media/:id',
    'Apps/:id',
    'Food/:id',
    //'cms/:id',
  ];

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig.path;
    //console.log(route.url[0].path);
    //return path && path == path;
    return path && this.acceptedRoutes.includes(path);
  }
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.routeStore.set(route.routeConfig.path, handle);
  }
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    //console.log(route.url[0].path);
    const path = route.routeConfig.path;
    //console.log(path);
    return (
      //path && path == path && !!this.routeStore.get(path)
      path && this.acceptedRoutes.includes(path) && !!this.routeStore.get(path)
    );
  }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const path = route.routeConfig.path;
    return this.routeStore.get(path);
  }
  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}
