import * as pulumi from "@pulumi/pulumi";


const myProvider: pulumi.dynamic.ResourceProvider = {
    async create(inputs) {
        return { id: "foo", outs: {}};
    }
}

export class MyResource extends pulumi.dynamic.Resource {
    constructor(name: string, props: {}, opts?: pulumi.CustomResourceOptions) {
        super(myProvider, name, props, opts);
    }
}