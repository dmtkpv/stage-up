import { IImage, IInput, ISelect, ITags, IFile, IPlace } from '#root/global/components.js'

export default ({ t, user, data, lists, profile }) => [

    {
        inputs: {
            avatar: {
                component: IImage,
                options: {
                    endpoint: 'account-profile-image',
                    default: 'user',
                    button: t('IMAGE_BUTTON'),
                    onSuccess: id => user.avatar = id
                }
            }
        }
    },

    {
        half: true,
        required: true,
        label: t('FIRST_NAME_LABEL'),
        inputs: {
            first_name: {
                component: IInput,
                options: {
                    placeholder: t('FIRST_NAME_PLACEHOLDER'),
                    type: 'text'
                }
            }
        }
    },

    {
        half: true,
        required: true,
        label: t('LAST_NAME_LABEL'),
        inputs: {
            last_name: {
                component: IInput,
                options: {
                    placeholder: t('LAST_NAME_PLACEHOLDER'),
                    type: 'text'
                }
            }
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
                    placeholder: t('EMAIL_PLACEHOLDER'),
                    type: 'email'
                }
            }
        }
    },

    {
        half: true,
        label: t('PHONE_LABEL'),
        inputs: {
            phone: {
                component: IInput,
                options: {
                    placeholder: t('PHONE_PLACEHOLDER'),
                    type: 'number'
                }
            }
        }
    },

    {
        half: true,
        label: t('GENDER_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            gender: {
                component: ISelect,
                options: {
                    list: lists.genders,
                    placeholder: t('GENDER_PLACEHOLDER'),
                }
            }
        },
    },

    {
        half: true,
        label: t('RESIDENCE_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            residence: {
                component: IPlace,
                options: {
                    placeholder: t('RESIDENCE_PLACEHOLDER'),
                },
                events: {
                    change ({ place_id }) {
                        profile.place_id = place_id || null;
                    }
                }
            }
        },
    },

    {
        half: true,
        label: t('EDUCATION_FIELD_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            education_field: {
                component: ISelect,
                options: {
                    searchable: true,
                    list: lists.education_fields,
                    placeholder: t('EDUCATION_FIELD_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('EDUCATION_LEVEL_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            education_level: {
                component: ISelect,
                options: {
                    list: lists.education_levels,
                    placeholder: t('EDUCATION_LEVEL_PLACEHOLDER'),
                }
            }
        }
    },

    {
        label: t('LANGUAGES_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            languages: {
                component: ITags,
                options: {
                    placeholder: t('LANGUAGES_PLACEHOLDER'),
                    list: lists.languages,
                }
            }
        },
    },

    {
        label: t('CV_LABEL'),
        hidden: user.role !== 'candidate',
        inputs: {
            cv: {
                component: IFile,
                options: {
                    placeholder:  t('CV_PLACEHOLDER'),
                    note: t('CV_NOTE'),
                    button: t('CV_BUTTON'),
                    type: 'cvs',
                    uploadApi: 'account-cvs-create',
                    list: data.cvs
                }
            }
        },
    }


]