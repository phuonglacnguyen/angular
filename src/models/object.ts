import { CmsProperty } from './property';

export class CmsObject {
    constructor(
        _id: { type: String },
        properties: Array<CmsProperty> = new Array<CmsProperty>()
    ) { }
}