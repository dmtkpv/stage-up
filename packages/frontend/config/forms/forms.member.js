import { reactive, computed } from 'vue'
import { IInput, ICheckboxes, IPlace, IMap } from '#root/global/components.js'

export default ({ edits, data, t }) => [

    {
        half: true,
        label: t('FIRST_NAME_LABEL'),
        hidden: data.member.id,
        inputs: {
            first_name: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('FIRST_NAME_PLACEHOLDER'),
                }
            }
        }
    },

    {
        half: true,
        label: t('LAST_NAME_LABEL'),
        hidden: data.member.id,
        inputs: {
            last_name: {
                component: IInput,
                options: {
                    type: 'text',
                    placeholder: t('LAST_NAME_PLACEHOLDER'),
                }
            }
        }
    },

    {
        label: t('EMAIL_LABEL'),
        hidden: data.member.id,
        inputs: {
            email: {
                component: IInput,
                options: {
                    type: 'email',
                    placeholder: t('EMAIL_PLACEHOLDER'),
                }
            }
        }
    },

    {
        label: t('LOCATIONS_LABEL'),
        hidden: computed(() => {
            return !data.locations.length
        }),
        inputs: {
            locations: {
                component: ICheckboxes,
                options: reactive({
                    field: 'location',
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
        label: t('LOCATION_LABEL'),
        hidden: computed(() => {
            return data.locations.length
        }),
        inputs: {
            address: {
                component: IPlace,
                options: {
                    placeholder: t('LOCATION_PLACEHOLDER')
                },
                events: {
                    change ({ place_id, geometry }) {
                        edits.place_id = place_id;
                        data.member.geometry = geometry;
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

]