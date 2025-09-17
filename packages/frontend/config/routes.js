import Error from '#root/routes/error.vue'
const route = loading => () => loading().catch(() => Error);

const Home = route(() => import('#root/routes/home.vue'))
const Premium = route(() => import('#root/routes/premium.vue'))
const Terms = route(() => import('#root/routes/terms.vue'))
const Privacy = route(() => import('#root/routes/privacy.vue'))
const Company = route(() => import('#root/routes/company.vue'))
const StripeSuccess = route(() => import('#root/routes/stripe-success.vue'))

const Auth = route(() => import('#root/routes/auth.vue'))
const AuthLogin = route(() => import('#root/routes/auth/login.vue'))
const AuthRegister = route(() => import('#root/routes/auth/register.vue'))
const AuthVerify = route(() => import('#root/routes/auth/verify.vue'))
const AuthReset = route(() => import('#root/routes/auth/reset.vue'))
const AuthRecovery = route(() => import('#root/routes/auth/recovery.vue'))

const Jobs = route(() => import('#root/routes/jobs.vue'))
const JobsMap = route(() => import('#root/routes/jobs-map.vue'))
const Job = route(() => import('#root/routes/job.vue'))
const JobApply = route(() => import('#root/routes/job-apply.vue'))

const Candidates = route(() => import('#root/routes/candidates.vue'))
const Candidate = route(() => import('#root/routes/candidate.vue'))

const Account = route(() => import('#root/routes/account.vue'))
const AccountDashboard = route(() => import('#root/routes/account/dashboard.vue'))
const AccountProfile = route(() => import('#root/routes/account/profile.vue'))
const AccountNotifications = route(() => import('#root/routes/account/notifications.vue'))
const AccountRooms = route(() => import('#root/routes/account/rooms.vue'))
const AccountRoom = route(() => import('#root/routes/account/room.vue'))

const AccountApplicants = route(() => import('#root/routes/account/applicants.vue'))
const AccountFavoriteCandidates = route(() => import('#root/routes/account/favorite-candidates.vue'))
const AccountJobs = route(() => import('#root/routes/account/jobs.vue'))
const AccountJob = route(() => import('#root/routes/account/job.vue'))
const AccountJobUpsert = route(() => import('#root/routes/account/job/upsert.vue'))
const AccountJobPublish = route(() => import('#root/routes/account/job/publish.vue'))
const AccountJobUpgrade = route(() => import('#root/routes/account/job/upgrade.vue'))

const AccountLocation = route(() => import('#root/routes/account/location.vue'))
const AccountLocations = route(() => import('#root/routes/account/locations.vue'))
const AccountMember = route(() => import('#root/routes/account/member.vue'))
const AccountMembers = route(() => import('#root/routes/account/members.vue'))
const AccountSubscription = route(() => import('#root/routes/account/subscription.vue'))
const AccountUpgrade = route(() => import('#root/routes/account/upgrade.vue'))
const AccountCompany = route(() => import('#root/routes/account/company.vue'))

const AccountApplications = route(() => import('#root/routes/account/applications.vue'))
const AccountCV = route(() => import('#root/routes/account/cv.vue'))
const AccountFavoriteJobs = route(() => import('#root/routes/account/favorite-jobs.vue'))

export default [



    // ----------------
    // Landings
    // ----------------

    {
        name: 'home',
        component: Home
    },
    {
        name: 'premium',
        component: Premium
    },
    {
        name: 'terms',
        component: Terms
    },
    {
        name: 'privacy',
        component: Privacy
    },
    {
        name: 'stripe-success',
        component: StripeSuccess,
        meta: {
            roles: ['company']
        }
    },



    // ----------------
    // Jobs
    // ----------------

    {
        name: 'jobs',
        component: Jobs
    },
    {
        name: 'jobs-map',
        component: JobsMap,
        meta: {
            back: ({ query: { location, ...query } }) => ({ name: 'jobs', query }),
        }
    },
    {
        name: 'job',
        component: Job,
        meta: {
            back: ['jobs', 'jobs-map', 'account-room', 'account-notification', 'account-application', 'account-applicant', 'account-favorite-jobs']
        }
    },
    {
        name: 'job-apply',
        component: JobApply,
        meta: {
            roles: ['candidate'],
            back: ({ params }) => ({ name: 'job', params }),

        }
    },



    // ----------------
    // Candidates
    // ----------------

    {
        name: 'candidates',
        component: Candidates,
        meta: {
            plan: 3,
            roles: ['company', 'member']
        }
    },
    {
        name: 'candidate',
        component: Candidate,
        meta: {
            roles: ['company', 'member'],
            back: ['candidates', 'account-room', 'account-notification', 'account-application', 'account-applicant', 'account-favorite-candidates']
        }
    },



    // ----------------
    // Companies
    // ----------------

    {
        name: 'company',
        component: Company,
        meta: {
            back: (to, from) => from
        }
    },



    // ----------------
    // Auth
    // ----------------

    {
        name: 'auth',
        component: Auth,
        children: [
            {
                name: 'auth-login',
                component: AuthLogin
            },
            {
                name: 'auth-register',
                component: AuthRegister
            },
            {
                name: 'auth-verify',
                component: AuthVerify
            },
            {
                name: 'auth-reset',
                component: AuthReset
            },
            {
                name: 'auth-recovery',
                component: AuthRecovery
            }
        ]
    },



    // ----------------
    // Account
    // ----------------

    {
        name: 'account',
        component: Account,
        children: [

            // common

            {
                name: 'account-dashboard',
                component: AccountDashboard,
                meta: {
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-profile',
                component: AccountProfile,
                meta: {
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-notifications',
                component: AccountNotifications,
                meta: {
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-notification',
                component: AccountRoom,
                meta: {
                    back: ['account-notifications'],
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-rooms',
                component: AccountRooms,
                meta: {
                    roles: ['candidate', 'company', 'member']
                }
            },
            {
                name: 'account-room',
                component: AccountRoom,
                meta: {
                    back: ['account-rooms'],
                    roles: ['candidate', 'company', 'member']
                }
            },


            // company & member

            {
                name: 'account-applicants',
                component: AccountApplicants,
                meta: {
                    roles: ['company', 'member']
                }
            },
            {
                name: 'account-applicant',
                component: AccountRoom,
                meta: {
                    back: ['account-applicants'],
                    roles: ['company', 'member']
                }
            },
            {
                name: 'account-favorite-candidates',
                component: AccountFavoriteCandidates,
                meta: {
                    roles: ['company', 'member']
                }
            },
            {
                name: 'account-jobs',
                component: AccountJobs,
                meta: {
                    roles: ['company', 'member']
                }
            },
            {
                name: 'account-job',
                component: AccountJob,
                children: [
                    {
                        name: 'account-job-upsert',
                        component: AccountJobUpsert,
                        meta: {
                            back: ['account-jobs'],
                            roles: ['company', 'member']
                        }
                    },
                    {
                        name: 'account-job-publish',
                        component: AccountJobPublish,
                        meta: {
                            back: ({ params }) => ({ name: 'account-job-upsert', params }),
                            roles: ['company', 'member']
                        }
                    },
                    {
                        name: 'account-job-upgrade',
                        component: AccountJobUpgrade,
                        meta: {
                            back: ({ params }) => ({ name: 'account-job-publish', params }),
                            roles: ['company']
                        }
                    },
                ]
            },


            // company

            {
                name: 'account-locations',
                component: AccountLocations,
                meta: {
                    roles: ['company']
                }
            },
            {
                name: 'account-location',
                component: AccountLocation,
                meta: {
                    back: ['account-locations'],
                    roles: ['company']
                }
            },
            {
                name: 'account-members',
                component: AccountMembers,
                meta: {
                    roles: ['company']
                }
            },
            {
                name: 'account-member',
                component: AccountMember,
                meta: {
                    back: ['account-members'],
                    roles: ['company']
                }
            },
            {
                name: 'account-company',
                component: AccountCompany,
                meta: {
                    roles: ['company']
                }
            },
            {
                name: 'account-subscription',
                component: AccountSubscription,
                meta: {
                    roles: ['company']
                }
            },
            {
                name: 'account-upgrade',
                component: AccountUpgrade,
                meta: {
                    roles: ['company']
                }
            },


            // candidate

            {
                name: 'account-applications',
                component: AccountApplications,
                meta: {
                    roles: ['candidate']
                }
            },
            {
                name: 'account-application',
                component: AccountRoom,
                meta: {
                    roles: ['candidate'],
                    back: ['account-applications']
                }
            },
            {
                name: 'account-cv',
                component: AccountCV,
                meta: {
                    roles: ['candidate']
                }
            },
            {
                name: 'account-favorite-jobs',
                component: AccountFavoriteJobs,
                meta: {
                    roles: ['candidate']
                }
            }

        ]
    }



]