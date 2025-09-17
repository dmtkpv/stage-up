import { IInput } from '#root/global/components.js'

export default ({ t }) => [

    {
        label: t('PASSWORD_LABEL'),
        inputs: {
            password: {
                component: IInput,
                options: {
                    placeholder: t('PASSWORD_PLACEHOLDER'),
                    type: 'password'
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
                    placeholder: t('RE_PASSWORD_PLACEHOLDER'),
                    type: 'password'
                }
            }
        }
    },

]