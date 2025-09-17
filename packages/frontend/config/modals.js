const AuthLogin = () => import('#root/routes/auth/login.vue')
const AuthRegister = () => import('#root/routes/auth/register.vue')
const AuthReset = () => import('#root/routes/auth/reset.vue')
const AuthVerify = () => import('#root/routes/auth/verify.vue')
const Alert = () => import('#root/modals/m-alert.vue')
const Confirm = () => import('#root/modals/m-confirm.vue')
const Premium = () => import('#root/modals/m-premium.vue')
const Images = () => import('#root/modals/m-images.vue')
const Location = () => import('#root/modals/m-location.vue')
const Message = () => import('#root/modals/m-message.vue')
const Share = () => import('#root/modals/m-share.vue')

export default [
    {
        name: 'auth-login',
        component: AuthLogin
    },
    {
        name: 'auth-register',
        component: AuthRegister
    },
    {
        name: 'auth-reset',
        component: AuthReset
    },
    {
        name: 'auth-verify',
        component: AuthVerify,
        noOutsideClick: true
    },
    {
        name: 'alert',
        component: Alert
    },
    {
        name: 'confirm',
        component: Confirm
    },
    {
        name: 'premium',
        component: Premium
    },
    {
        name: 'images',
        component: Images,
        noOutsideClick: true
    },
    {
        name: 'share',
        component: Share
    },
    {
        name: 'message',
        component: Message
    },
    {
        name: 'location',
        component: Location
    }
]