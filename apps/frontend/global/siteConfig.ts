import { MetaDataConfigService } from "@/services/meta-data-config.service"

export const siteConfig = new MetaDataConfigService(
    'Regency development group',
    'Construction company building your dream home. We are property developers focussed on estate townhouse building. Upgrade your lifestyle with spacious, modern units designed for you and your family.',
    'info@regency-group.co.za',
    '0657178316',
    'https://regency-group.co.za',
    [],
    {
        street:'32 Totius street',
        suburb: 'Kookrus',
        city: 'Meyerton',
        province: 'Gauteng',
        code:'1961',
        countryCode:'ZA'
    }
)
