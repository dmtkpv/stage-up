import { computed } from 'vue'
import { IconLgCategory, IconLgEducation, IconLgLanguage } from '#root/global/icons.js'
import { IPlace, ISlider, ISelect, ICheckboxes, IRadios } from '#root/global/components.js'

export default ({ HOURS, t, data, filters, update }) => [

    {
        label: t('LOCATION_LABEL'),
        inputs: {
            place: {
                component: IPlace,
                options: {
                    placeholder: t('LOCATION_PLACEHOLDER'),
                    types: ['(cities)']
                },
                events: {
                    change ({ text, geometry }) {
                        update({ ...data.query, place: text, origin: geometry });
                    }
                }
            }
        }
    },

    {
        label: t('DISTANCE_LABEL'),
        hidden: computed(() => !data.query.origin),
        inputs: {
            distance: {
                component: ISlider,
                options: {
                    min: 5,
                    max: 50
                }
            }
        }
    },

    {
        label: t('BRANCH_LABEL'),
        inputs: {
            branch: {
                component: ISelect,
                options: {
                    list: filters.branches,
                    searchable: true,
                    icon: IconLgCategory,
                    placeholder: t('BRANCH_PLACEHOLDER'),
                    clear: t('BRANCH_CLEAR')
                }
            }
        }
    },

    {
        label: t('EDUCATION_FIELD_LABEL'),
        inputs: {
            education_field: {
                component: ISelect,
                options: {
                    list: filters.education_fields,
                    searchable: true,
                    icon: IconLgEducation,
                    placeholder: t('EDUCATION_FIELD_PLACEHOLDER'),
                    clear: t('EDUCATION_FIELD_CLEAR')
                }
            }
        }
    },

    // {
    //     label: t('TYPE_LABEL'),
    //     inputs: {
    //         type: {
    //             component: ICheckboxes,
    //             options: {
    //                 list: 'job_types'
    //             }
    //         }
    //     }
    // },

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
        label: t('EDUCATION_PATH_LABEL'),
        inputs: {
            education_path: {
                component: IRadios,
                options: {
                    list: filters.education_paths
                }
            }
        }
    },

    {
        label: t('LANGUAGE_LABEL'),
        inputs: {
            language: {
                component: ISelect,
                options: {
                    list: filters.languages,
                    searchable: true,
                    icon: IconLgLanguage,
                    placeholder: t('LANGUAGE_PLACEHOLDER'),
                    clear: t('LANGUAGE_CLEAR')
                }
            }
        }
    },

    {
        label: t('DATE_LABEL'),
        inputs: {
            hour: {
                component: IRadios,
                options: {
                    list: HOURS.map(value => ({ value, text: t(`HOURS_${value}`) }))
                }
            }
        }
    }

]