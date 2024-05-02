export class Cms {
    constructor(
        public parent: string = "",
        public title: string = "",
        public visible: boolean = false,
        public dateIn: Date = new Date(),
        public dateLast: Date = new Date()
    ) { }
}