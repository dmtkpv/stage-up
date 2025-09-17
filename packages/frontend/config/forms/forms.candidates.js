import { ISelect, IRadios } from '#root/global/components.js'

export default ({ t, filters }) => [

    {
        label: t('EDUCATION_FIELD_LABEL'),
        inputs: {
            education_field: {
                component: ISelect,
                options: {
                    searchable: true,
                    list: filters.education_fields,
                    placeholder: t('EDUCATION_FIELD_PLACEHOLDER'),
                    clear: t('EDUCATION_FIELD_CLEAR')
                }
            }
        }
    },

    {
        label: t('EDUCATION_LEVEL_LABEL'),
        inputs: {
            education_level: {
                component: IRadios,
                options: {
                    list: filters.education_levels
                }
            }
        }
    },

    {
        label: t('GENDER_LABEL'),
        inputs: {
            gender: {
                component: IRadios,
                options: {
                    list: filters.genders
                }
            }
        }
    }

]