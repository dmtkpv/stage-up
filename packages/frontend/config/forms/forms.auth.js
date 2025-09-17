import { computed } from 'vue'
import { IInput } from '#root/global/components.js'



// -----------------
// Login
// -----------------

export const useFormLogin = ({ t, restore }) => [

    {
        label: t('EMAIL_LABEL'),
        inputs: {
            email: {
                component: IInput,
                options: {
                    type: 'email',
                    placeholder: t('EMAIL_PLACEHOLDER')
                }
            }
        }
    },

    {
        label: t('PASSWORD_LABEL'),
        inputs: {
            password: {
                component: IInput,
                options: {
                    type: 'password',
                    placeholder: t('PASSWORD_PLACEHOLDER')
                }
            }
        },
        note: {
            title: t('RESET_PASSWORD'),
            onClick: restore
        }
    }

]



// -----------------
// Register
// -----------------

export const useFormRegister = ({ t, user }) => [

    {
        label: t('COMPANY_LABEL'),
        hidden: computed(() => user.role === 'candidate'),
        inputs: {
            company: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('COMPANY_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('FIRST_NAME_LABEL'),
        inputs: {
            first_name: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('FIRST_NAME_PLACEHOLDER')
                }
            }
        }
    },

    {
        half: true,
        label: t('LAST_NAME_LABEL'),
        inputs: {
            last_name: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('LAST_NAME_PLACEHOLDER')
                }
            }
        }
    },

    {
        label: t('EMAIL_LABEL'),
        inputs: {
            email: {
                component: IInput,
                options: {
                    type: 'email',
                    placeholder: t('EMAIL_PLACEHOLDER')
                }
            }
        }
    },

    {
        label: t('PASSWORD_LABEL'),
        inputs: {
            password: {
                component: IInput,
                options: {
                    type: 'password',
                    placeholder: t('PASSWORD_PLACEHOLDER')
                }
            }
        }
    },

    {
        label: t('RE_PASSWORD_LABEL'),
        inputs: {
            re_password: {
                component: IInput,
                options: {
                    type: 'password',
                    placeholder: t('RE_PASSWORD_PLACEHOLDER')
                }
            }
        }
    }

]



// -----------------
// Restore
// -----------------

export const useFormRestore = ({ t }) => [

    {
        label: t('EMAIL_LABEL'),
        inputs: {
            email: {
                component: IInput,
                options: {
                    type: 'email',
                    placeholder: t('EMAIL_PLACEHOLDER')
                }
            }
        }
    }

]



// -----------------
// Verify
// -----------------

export const useFormVerify = ({ t }) => [

    {
        label: t('CODE_LABEL'),
        inputs: {
            code: {
                component: IInput,
                options: {
                    type: 'number',
                    placeholder: t('CODE_PLACEHOLDER')
                }
            }
        }
    }

]
