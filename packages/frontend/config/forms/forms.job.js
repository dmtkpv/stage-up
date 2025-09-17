import { computed, reactive } from 'vue'
import { MBO } from '@this/shared/constants.js'
import { IInput, ICheckbox, ISelect, IPlace, IMap, IWysiwyg, ITags, IFiles } from '#root/global/components.js'

export default ({ t, data, edits, user, lists }) => [

    {
        half: true,
        required: true,
        label: t('TITLE_LABEL'),
        inputs: {
            title: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('TITLE_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('STATUS_LABEL'),
        inputs: {
            publish: {
                component: ICheckbox,
                options: {
                    label: t('STATUS_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('PREMIUM_LABEL'),
        inputs: {
            premium: {
                component: ICheckbox,
                options: {
                    disabled: user.plan === 3,
                    label: t('PREMIUM_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('URGENT_LABEL'),
        inputs: {
            urgent: {
                component: ICheckbox,
                options: {
                    label: t('URGENT_PLACEHOLDER'),
                }
            }
        }
    },

    {
        required: true,
        label: t('LOCATION_LABEL'),
        hidden: computed(() => {
            return !data.locations.length
        }),
        inputs: {
            location: {
                component: ISelect,
                options: reactive({
                    placeholder: t('LOCATION_PLACEHOLDER'),
                    list: computed(() => {
                        return data.locations.map(item => ({
                            value: item.id,
                            text: item.address
                        }))
                    })
                })
            }
        }
    },

    {
        required: true,
        label: t('LOCATION_LABEL'),
        hidden: computed(() => {
            return data.locations.length
        }),
        inputs: {
            address: {
                component: IPlace,
                options: {
                    placeholder: t('ADDRESS_PLACEHOLDER')
                },
                events: {
                    change ({ place_id, geometry }) {
                        edits.place_id = place_id;
                        data.job.geometry = geometry;
                    }
                }
            }
        }
    },

    {
        hidden: computed(() => {
            return data.locations.length
        }),
        inputs: {
            geometry: {
                component: IMap,
                options: {
                    centerable: true
                }
            }
        }
    },

    {
        required: true,
        label: t('CONTENT_LABEL'),
        inputs: {
            content: {
                component: IWysiwyg
            }
        }
    },

    // {
    //     half: true,
    //     label: t('TYPE_LABEL'),
    //     inputs: {
    //         type: {
    //             component: 'i-select',
    //             options: {
    //                 list: 'job_types',
    //                 placeholder: t('TYPE_PLACEHOLDER')
    //             }
    //         }
    //     }
    // },

    {
        half: true,
        label: t('CATEGORIES_LABEL'),
        inputs: {
            categories: {
                component: ITags,
                options: {
                    list: lists.categories,
                    placeholder: t('CATEGORIES_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('EDUCATION_FIELDS_LABEL'),
        inputs: {
            education_fields: {
                component: ITags,
                options: {
                    list: lists.education_fields,
                    placeholder: t('EDUCATION_FIELDS_PLACEHOLDER')
                }
            }
        }
    },

    //{
    //    half: true,
    //    label: t('EXPERIENCE_LABEL'),
    //    inputs: {
    //        experience: {
    //            component: IInput,
    //            options: {
    //                type: 'number',
    //                placeholder: t('EXPERIENCE_PLACEHOLDER')
    //            }
    //        }
    //    }
    //},

    {
        half: true,
        label: t('EDUCATION_LEVELS_LABEL'),
        inputs: {
            education_levels: {
                component: ITags,
                options: {
                    list: lists.education_levels,
                    placeholder: t('EDUCATION_LEVELS_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('EDUCATION_PATHS_LABEL'),
        hidden: computed(() => {
            const levels = edits.education_levels || data.job.education_levels || [];
            return !levels.some(value => MBO.includes(value))
        }),
        inputs: {
            education_paths: {
                component: ITags,
                options: {
                    list: lists.education_paths,
                    placeholder: t('EDUCATION_PATHS_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('RECRUITMENTS_LABEL'),
        inputs: {
            recruitments: {
                component: IInput,
                options: {
                    type: 'number',
                    placeholder: t('RECRUITMENTS_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('HOURS_LABEL'),
        inputs: {
            hours: {
                component: IInput,
                options: {
                    type: 'number',
                    placeholder: t('HOURS_PLACEHOLDER')
                }
            },
            hours_frequency: {
                component: ISelect,
                options: {
                    list: lists.hours_frequencies,
                    placeholder: t('HOURS_FREQUENCY_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('SALARY_LABEL'),
        inputs: {
            salary_min: {
                component: IInput,
                options: {
                    type: 'number',
                    placeholder: t('SALARY_MIN_PLACEHOLDER')
                }
            },
            salary_max: {
                component: IInput,
                options: {
                    type: 'number',
                    placeholder: t('SALARY_MAX_PLACEHOLDER')
                }
            },
            salary_frequency: {
                component: ISelect,
                options: {
                    list: lists.salary_frequencies,
                    placeholder: t('SALARY_FREQUENCY_PLACEHOLDER')
                }
            }
        }
    },

    {
        label: t('LANGUAGES_LABEL'),
        inputs: {
            languages: {
                component: ITags,
                options: {
                    list: lists.languages,
                    placeholder: t('LANGUAGES_PLACEHOLDER'),
                }
            }
        }
    },
    
    {
        half: true,
        label: t('EXTERNAL_LABEL'),
        inputs: {
            external: {
                component: ICheckbox,
                options: {
                    label: t('EXTERNAL_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('URL_LABEL'),
        hidden: computed(() => !(data.job.external || edits.external)),
        inputs: {
            url: {
                component: IInput,
                options: {
                    placeholder: t('URL_PLACEHOLDER'),
                    type: 'text'
                }
            }
        }
    },

    {
        label: t('IMAGES_LABEL'),
        inputs: {
            images: {
                component: IFiles,
                options: reactive({
                    list: computed(() => data.images),
                    type: 'jobs',
                    button: t('IMAGES_BUTTON'),
                    note: t('IMAGES_NOTE'),
                    unit: {
                        apiUpload: 'account-job-images-create',
                        apiParams: computed(() => data.id)
                    }
                })
            }
        }
    },


]