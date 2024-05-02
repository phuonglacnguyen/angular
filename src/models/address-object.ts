export class AddressObject {
    constructor(
         public street: string = "",
         public city: string = "",
         public state: string = "",
         public zip: string = "",
         public country: string = ""
    ) { }
}

/*
var addressObject = {
    street: {
        key: "street",
        label: "street",
        value: "De Knobbe 1",
        type: "text",
        validation: { required: true }
    },
    city: {
        key: "city",
        label: "city",
        value: "Heino",
        type: "text",
        validation: { required: true }
    },
    state: {
        key: "state",
        label: 'state',
        value: 'Gelderland',
        type: 'text'
    },
    zip: {
        key: "zip",
        label: 'zip',
        value: '8141WJ',
        type: 'text'
    },
    country: {
        key: "country",
        label: 'country',
        value: 'NL',
        type: 'select',
        options: [
            { label: "NL", value: 'Netherlands' },
            { label: "UK", value: 'United Kingdom' }
        ]
    }
}
*/