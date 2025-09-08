import {LdJsonConfigModel, MetaAddressModel, MetaDataConfigModel} from "@/models/meta-data-config.model";

export class MetaDataConfigService implements MetaDataConfigModel{
    title: string;
    description: string;
    email: string;
    phoneNumber: string;
    displayPhoneNumber: string;
    whatsAppPhoneNumber: string;
    websiteDomain:string;
    address:MetaAddressModel;
    socialMediaLinks:string[];

    ldJsonConfig:LdJsonConfigModel;

    constructor(title: string,
                description: string,
                email: string,
                phoneNumber: string,
                websiteDomain:string,
                socialMediaLinks:string[],
                address:MetaAddressModel) {
        this.title = title;
        this.description = description;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.websiteDomain = websiteDomain;
        this.address = address;
        this.socialMediaLinks = socialMediaLinks;

        const {ldJsonPhoneNumber, displayPhoneNumber, whatsAppPhoneNumber} = this.formatPhoneNumber(this.phoneNumber);

        this.displayPhoneNumber = displayPhoneNumber;
        this.whatsAppPhoneNumber = whatsAppPhoneNumber;

        this.ldJsonConfig = this.buildLdJsonConfig(ldJsonPhoneNumber);
    }

    private buildLdJsonConfig(ldJsonPhoneNumber:string):LdJsonConfigModel{
        return {
            organization:{
                name: this.title,
                url:`${this.websiteDomain}/`,
                logoPath: `${this.websiteDomain}/logo.png`,
                description: this.description,
                address:this.address,
                contact:{
                    phoneNumber:ldJsonPhoneNumber,
                    email:this.email,
                    contactType:'Sales Representative',
                },
                sameAs:this.socialMediaLinks
            }
        }
    }

    private formatPhoneNumber(phone: string): {
        ldJsonPhoneNumber: string;
        displayPhoneNumber: string;
        whatsAppPhoneNumber: string;
    } {
        // Remove any non-digit characters
        const digits = phone.replace(/\D/g, "");

        // Ensure it's a valid South African number starting with 0
        if (!/^0\d{9}$/.test(digits)) {
            throw new Error("Invalid South African phone number");
        }

        // Extract parts
        const countryCode = "+27";
        const areaCode = digits.substring(1, 3);
        const part1 = digits.substring(3, 6);
        const part2 = digits.substring(6, 10);

        return {
            ldJsonPhoneNumber: `${countryCode}-${areaCode}-${part1}-${part2}`,
            displayPhoneNumber: `(0${areaCode}) ${part1} ${part2}`,
            whatsAppPhoneNumber: `${countryCode}${areaCode}${part1}${part2}`,
        };
    }
}