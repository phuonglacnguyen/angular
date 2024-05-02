export class CmsProperty {
    constructor(
        public _id: string = "",
        public title: string = "",
        public pname: string = "",
        public access: string = "",
        public type: string = "",
        public inputtype: string = "",
        public minlength: number = 0,
        public maxlength: number = 0,
        public required: boolean = false,
        public object: string = "",
        public list: string = "",
        public values: string = "",
        public labels: string = "",
        public labelsarr = [],
        public valuesarr = []
    ) { }
}