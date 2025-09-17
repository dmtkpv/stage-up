<!--
    Styles
-->

<style>

</style>



<!--
    Template
-->

<template>
    <section>

        <l-heading>
            <h1 class="h3">{{ t('HEADING') }}</h1>
            <template #controls>
                <i-select v-model="query.job" :list="jobs" />
            </template>
        </l-heading>

        <ui-tabs :tabs="tabs" v-model="query.archived" />

        <l-list v-bind="data" :t="t" v-slot="{ list }">
            <l-table v-bind="table" :data="list" @click="view" @view="view" @archive="archive" />
        </l-list>
        
    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { defineOptions, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useTable, useText, useMeta, useIoReload, useQuery, toastAPIError } from '#root/global/composables.js'
    import { LHeading, LList, LTable, ISelect, UiTabs } from '#root/global/components.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'm-confirm',
            'route-account-applicants'
        ],

        preload ({ api, qs }, to) {

            const limit = 10;
            const job = qs.integer(to.query.job);
            const page = qs.integer(to.query.page);
            const archived = qs.boolean(to.query.archived);

            return {
                limit,
                query: { job, page, archived },
                jobs: api('account-applications-jobs').fetch(),
                list: api('account-applications-list').fetch({ limit, page, job, archived }),
                count: api('account-applications-count').fetch({ job, archived }),
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-applicants')
    const data = usePreload();
    const table = useTable('applicants', { t });
    const router = useRouter();
    const patch = useAPI('account-applications-update');
    const query = useQuery(data, ['job', 'archived']);

    const tabs = [
        { text: t('TAB_INBOX'), value: undefined },
        { text: t('TAB_ARCHIVED'), value: true },
    ]

    const jobs = computed(() => [
        { text: t('JOBS_CLEAR'), value: undefined },
        ...data.jobs
    ])



    // -------------------
    // Actions
    // -------------------

    function view ({ room }) {
        router.push({ name: 'account-applicant', params: { id: room } });
    }

    async function archive (row) {
        row._disabled = true;
        await patch.quiet(row.id, { archived: !row.archived });
        await router.push({ query: { ...data.query, t: Date.now() } })
    }

    useMeta();
    useIoReload();
    toastAPIError(patch);



</script>