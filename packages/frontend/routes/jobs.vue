<!--
    Styles
-->

<style lang="scss">

    .LsWhLW {
        width: 160px;
    }

</style>



<!--
    Template
-->

<template>
    <l-filter :form="form" :tags="tags" :units="t('UNITS')" @update="update">


        <!-- search -->

        <template #search>
            <i-search :suggestions="filters.suggestions" :placeholder="t('SEARCH_PLACEHOLDER')" />
        </template>


        <!-- header -->

        <template #header>
            <ui-button type="light" :icon="IconLgMap" class="tile" :text="t('MAP_VIEW')" :to="{ name: 'jobs-map', query: data.query }" />
            <i-select class="LsWhLW" :list="sorts" :model-value="data.query.sort" @update:model-value="sort" />
        </template>

        <!-- list -->

        <l-list v-bind="data" :count="data.count.total" :t="t" v-slot="{ list }">
            <unit-job
                v-for="job in list"
                class="tile"
                heading="h2"
                :key="job.id"
                :value="job"
                :to="{ name: 'job', params: { id: job.id, slug: job.slug }}"
            />
        </l-list>


    </l-filter>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { FILTERS_JOBS } from '@this/shared/constants.js'
    import { usePreload, useText, useMeta, useFilters, useQuery, useModal } from '#root/global/composables.js'
    import { getListText } from '#root/global/utils.js'
    import { LFilter, ISearch, UiButton, ISelect, LList, UnitJob } from '#root/global/components.js'
    import { useFormJobs } from '#root/global/forms.js'
    import { IconLgMap } from '#root/global/icons.js'



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
            'l-filter',
            'm-location'
        ],

        async preload ({ api, qs, content }, to, from) {

            await content.loadLists([
                'education_fields',
                'education_levels',
                'education_paths',
                'job_types',
                'branches',
                'languages'
            ])

            const limit = 10;
            const page = qs.integer(to.query.page);
            const search = qs.string(to.query.search);
            const data = qs.string(to.query.data);
            const distance = qs.integer(to.query.distance);
            const hour = qs.oneof(qs.integer(to.query.hour), HOURS);
            const branch = qs.item(to.query.branch, 'branches');
            const education_field = qs.item(to.query.education_field, 'education_fields');
            const education_level = qs.item(to.query.education_level, 'education_levels');
            const education_path = qs.item(to.query.education_path, 'education_paths');
            const language = qs.item(to.query.language, 'languages');

            let place = qs.string(to.query.place);
            let origin = qs.geometry(to.query.origin);

            if (!place) origin = undefined;
            if (!origin) place = undefined;

            let sort = qs.oneof(qs.integer(to.query.sort), [1, 2, 3, 4]) || 1;
            if (!origin && sort > 2) sort = 1;
            if (origin && !from.query.place) sort = 3;
            to.query.sort = sort;

            const filter = { data, distance, branch, education_field, education_level, education_path, language, search, origin }
            const query = { page, sort, hour, place, ...filter }

            if (hour) {
                filter.date = new Date();
                filter.date.setTime(filter.date.getTime() - hour * 60 * 60 * 1000);
            }

            return {
                limit,
                query,
                list: api('jobs-list').fetch({ limit, page, sort, ...filter }),
                count: api('jobs-count').fetch(filter)
            }

        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-jobs');
    const data = usePreload();
    const filters = useFilters(data, FILTERS_JOBS);
    const form = useFormJobs({ HOURS, t, data, filters, update })
    const query = useQuery(data, ['sort'])
    const router = useRouter();
    const modal = useModal();

    const sorts = [
        { value: 1, text: t('SORT_NEWEST') },
        { value: 2, text: t('SORT_OLDEST') },
        { value: 3, text: t('SORT_NEAREST') }
    ]

    const tags = {
        place: value => value,
        distance: value => `${value}km`,
        branch: value => getListText(filters.branches, value),
        education_field: value => getListText(filters.education_fields, value),
        education_level: value => getListText(filters.education_levels, value),
        education_path: value => getListText(filters.education_paths, value),
        language: value => getListText(filters.languages, value),
        hour: value => t(`HOURS_${value}`),
        search: value => value
    }

    function setPlace ({ text, geometry }) {
        update({ ...data.query, place: text, origin: geometry, sort: 3 });
    }

    function sort (value) {
        if (value === 3 && !data.query.origin) modal.show('location', { onChange: setPlace });
        else update({ ...data.query, sort: value })
    }

    function update (query) {
        router.push({ query: { ...query, page: 1 } })
    }

    useMeta();

</script>



<!--
    Options
-->

<script>

    const HOURS = [24, 168, 336, 720];


</script>