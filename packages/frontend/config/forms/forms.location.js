import { IMap, IPlace } from '#root/global/components.js'

export default ({ t, data, edits }) => [

    {
        inputs: {
            address: {
                component: IPlace,
                options: {
                    placeholder: t('LOCATION_PLACEHOLDER')
                },
                events: {
                    change ({ place_id, geometry }) {
                        edits.place_id = place_id;
                        data.location.geometry = geometry;
                    }
                }
            }
        }
    },

    {
        inputs: {
            geometry: {
                component: IMap,
                options: {
                    centerable: true
                }
            }
        }
    }

]