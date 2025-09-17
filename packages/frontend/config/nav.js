import { IconLgHome, IconLgUser, IconLgCv, IconLgJobs, IconLgPlans, IconLgProfile, IconLgTeam, IconLgLocation, IconLgUsers, IconLgBookmark, IconLgBell, IconLgMessage } from '#root/global/icons.js'

export default [

    // common

    {
        icon: IconLgHome,
        text: 'DASHBOARD',
        to: 'account-dashboard',
        roles: ['company', 'member', 'candidate']
    },

    {
        icon: IconLgUser,
        text: 'PROFILE',
        to: 'account-profile',
        roles: ['company', 'member', 'candidate']
    },

    {
        icon: IconLgCv,
        text: 'CV',
        to: 'account-cv',
        roles: ['candidate']
    },

    {
        icon: IconLgJobs,
        text: 'APPLICATIONS',
        to: 'account-applications',
        roles: ['candidate']
    },

    {
        icon: IconLgPlans,
        text: 'PLANS',
        to: 'account-subscription',
        roles: ['company']
    },

    {
        icon: IconLgProfile,
        text: 'COMPANY',
        to: 'account-company',
        roles: ['company']
    },

    {
        icon: IconLgTeam,
        text: 'MEMBERS',
        to: 'account-members',
        roles: ['company']
    },

    {
        icon: IconLgLocation,
        text: 'LOCATIONS',
        to: 'account-locations',
        roles: ['company']
    },

    {
        icon: IconLgJobs,
        text: 'JOBS',
        to: 'account-jobs',
        roles: ['company', 'member']
    },

    {
        icon: IconLgUsers,
        text: 'APPLICANTS',
        to: 'account-applicants',
        roles: ['company', 'member']
    },

    {
        icon: IconLgBookmark,
        text: 'FAVORITE_CANDIDATES',
        to: 'account-favorite-candidates',
        roles: ['company', 'member']
    },

    {
        icon: IconLgBookmark,
        text: 'FAVORITE_JOBS',
        to: 'account-favorite-jobs',
        roles: ['candidate']
    },

    {
        icon: IconLgBell,
        text: 'NOTIFICATIONS',
        to: 'account-notifications',
        roles: ['company', 'member', 'candidate']
    },

    {
        icon: IconLgMessage,
        text: 'MESSAGES',
        to: 'account-rooms',
        roles: ['company', 'member', 'candidate']
    },


]