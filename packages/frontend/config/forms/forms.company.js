import { IImage, IInput, ITags, IWysiwyg, ICheckbox } from '#root/global/components.js'

export default ({ t, lists }) => [

    {
        inputs: {
            image: {
                component: IImage,
                options: {
                    endpoint: 'account-company-image',
                    default: 'company',
                    button: t('IMAGE_BUTTON')
                }
            }
        }
    },

    {
        half: true,
        required: true,
        label: t('NAME_LABEL'),
        inputs: {
            name: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('NAME_PLACEHOLDER')
                }
            },
        }
    },

    {
        half: true,
        required: true,
        label: t('EMAIL_LABEL'),
        inputs: {
            email: {
                component: IInput,
                options: {
                    type: 'email',
                    placeholder: t('EMAIL_PLACEHOLDER'),
                }
            },
        }
    },

    {
        half: true,
        label: t('PHONE_LABEL'),
        inputs: {
            phone: {
                component: IInput,
                options: {
                    type: 'number',
                    placeholder: t('PHONE_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('WEBSITE_LABEL'),
        inputs: {
            website: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('WEBSITE_PLACEHOLDER')
                }
            },
        }
    },

    {
        half: true,
        label: t('FACEBOOK_LABEL'),
        inputs: {
            facebook: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('FACEBOOK_PLACEHOLDER')
                }
            },
        }
    },

    {
        half: true,
        label: t('BRANCHES_LABEL'),
        inputs: {
            branches: {
                component: ITags,
                options: {
                    list: lists.branches,
                    placeholder: t('BRANCHES_PLACEHOLDER')
                }
            }
        }
    },

    {
        label: t('ABOUT_LABEL'),
        inputs: {
            about: {
                component: IWysiwyg
            }
        }
    },

    {
        label: t('RECOGNIZED_LABEL'),
        inputs: {
            recognized: {
                component: ICheckbox,
                options: {
                    label: t('RECOGNIZED_PLACEHOLDER'),
                }
            }
        },
        note: {
            title: t('RECOGNIZED_NOTE')
        }
    },

]
