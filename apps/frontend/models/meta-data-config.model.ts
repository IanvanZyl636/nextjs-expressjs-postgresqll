export interface MetaDataConfigModel{
    title: string;
    description: string;
    email: string;
    phoneNumber: string;
    websiteDomain:string;
    socialMediaLinks:string[];
    address:MetaAddressModel;
    ldJsonConfig:LdJsonConfigModel;
}

export interface MetaAddressModel{
    street:string,
    suburb:string,
    city:string,
    province:string,
    code:string,
    countryCode:string
}

export interface LdJsonConfigModel {
    organization:OrganizationConfigModel
}

export interface OrganizationConfigModel {
    name:string,
    url:string,
    logoPath:string,
    description:string,
    address:MetaAddressModel,
    contact:{
        phoneNumber:string,
        email:string,
        contactType:string
    }
    sameAs:string[]
}