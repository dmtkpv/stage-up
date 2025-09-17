import { IText } from '#root/global/components.js'

export default ({ t }) => [

    {
        label: t('MESSAGE_LABEL'),
        inputs: {
            message: {
                component: IText,
                options: {
                    placeholder: t('MESSAGE_PLACEHOLDER')
                }
            }
        }
    }

]