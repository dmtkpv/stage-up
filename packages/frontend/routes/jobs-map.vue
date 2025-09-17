<!--
    Styles
-->

<style lang="scss">

    .AkLABb {

        position: fixed;
        top: $header;
        left: 0;
        right: 0;
        bottom: 0;
        margin-top: 0;

        .i-map {
            height: 100%;
        }

        &_list {

            position: absolute;
            overflow: auto;

            @include lg-md {

                padding: $gap 0 $gap $gap;
                left: 0;
                top: 0;
                max-height: 100%;
                width: 100%;
                max-width: 400px;

                .unit-job:last-child {
                    margin-bottom: 0;
                }

            }

            @include sm {

                bottom: 0;
                left: 0;
                width: 100%;
                padding: 0 $gap $gap $gap;
                display: flex;
                align-items: flex-end;
                gap: 16px;

                .unit-job {
                    flex: 0 0 100%;
                    margin-bottom: 0;
                }

            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <main class="AkLABb">

        <i-map
            v-model="query.location"
            clickable
            :center="center"
            :zoom="zoom"
            :locations="locations"
            @idle="update"
        />

        <div class="AkLABb_list" v-if="data.list.length">
            <unit-job
                v-for="job in data.list"
                class="tile"
                heading="h2"
                :key="job.id"
                :value="job"
                :to="{ name: 'job', params: { id: job.id, slug: job.slug }}"
            />
        </div>

    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { usePreload, useAPI, useQuery, useState } from '#root/global/composables.js'
    import { IMap, UnitJob } from '#root/global/components.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        lists: [
            // loaded inside "preload" for use in "qs"
        ],

        texts: [
            'route-jobs',
            'unit-job',
            'i-slider',
            'l-filter'
        ],

        async preload ({ api, qs, content, ssr }, to, from) {

            const HOURS = [24, 168, 336, 720];

            await content.loadLists([
                'education_fields',
                'education_levels',
                'education_paths',
                'job_types',
                'branches'
            ])

            const search = qs.string(to.query.search);
            const data = qs.string(to.query.data);
            const hour = qs.oneof(qs.integer(to.query.hour), HOURS);
            const branch = qs.item(to.query.branch, 'branches');
            const education_field = qs.item(to.query.education_field, 'education_fields');
            const education_level = qs.item(to.query.education_level, 'education_levels');
            const education_path = qs.item(to.query.education_path, 'education_paths');
            const location = qs.geometry(to.query.location);

            const getSaved = key => from?.name === 'job' && !ssr && localStorage.getItem(key);
            const zoom = qs.integer(getSaved('map-zoom'), 22) || 8;
            const center = qs.geometry(getSaved('map-center'));

            let place = qs.string(to.query.place);
            let origin = qs.geometry(to.query.origin);

            if (!place) origin = undefined;
            if (!origin) place = undefined;

            const filter = { data, branch, education_field, education_level, education_path, search }

            if (hour) {
                filter.date = new Date();
                filter.date.setTime(filter.date.getTime() - hour * 60 * 60 * 1000);
            }

            return {
                place,
                filter,
                query: { location, origin, zoom, center },
                list: location ? api('jobs-list').fetch({ ...filter, location }) : []
            }

        }

    })



    // -------------------
    // Data
    // -------------------

    const data = usePreload();
    const list = useAPI('jobs-map');
    const locations = ref([])
    const query = useQuery(data, ['location']);
    const state = useState();
    const center = data.query.center || data.query.location || data.query.origin || { lat: 52.2058927, lng: 5.0598826 };
    const zoom = data.query.zoom;

    list.onSuccess(data => {
        locations.value = data;
    })

    list.onError(error => {
        state.error = error;
    })

    async function update ({ bounds, zoom, center }) {
        localStorage.setItem('map-zoom', zoom);
        localStorage.setItem('map-center', `${center.lat},${center.lng}`);
        list.cancel();
        list.quiet({ ...data.filter, bounds, zoom });
    }
    

</script>