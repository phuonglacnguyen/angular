export class Page {
  constructor(
    public _id: string = '',
    public parent: string = '',
    public title: string = '',
    public objectType: string = '',
    public visible: boolean = false,
    public secure: boolean = false,
    public dateCreated: any = '',
    public dateLast: any = '',
    public createdBy: string = '',
    public editable: boolean = false,
    public media = new Array<any>(),
    public kids: number = 0,
    public listItem: boolean = false,
    public pickorder: number = 0,
    public treelevel: number = 0,
    public properties = new Array<any>(),
    public schemaextend = new Array<any>(),
    public filter = new Array<any>(),
    public cmsSubPages = [],
    public hits: number = 0
  ) {}
}
