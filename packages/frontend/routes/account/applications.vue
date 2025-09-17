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
                <i-input v-model="query.search" :icon="IconLgSearch" :placeholder="t('SEARCH_PLACEHOLDER')" />
                <i-select v-model="query.status" :list="statuses" />
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

    import { useRouter } from 'vue-router'
    import { usePreload, useText, useTable, useMeta, useStatuses, useIoReload, useQuery, useAPI, toastAPIError } from '#root/global/composables.js'
    import { LHeading, LList, LTable, IInput, ISelect, UiTabs } from '#root/global/components.js'
    import { IconLgSearch } from '#root/global/icons.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'route-account-applications'
        ],

        preload ({ api, qs }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const status = qs.oneof(to.query.status, ['PENDING', 'APPROVED', 'REJECTED']);
            const search = qs.string(to.query.search);
            const archived = qs.boolean(to.query.archived);

            return {
                limit,
                query: { status, search, page, archived },
                list: api('account-applications-list').fetch({ limit, page, search, status, archived }),
                count: api('account-applications-count').fetch({ search, status, archived }),
            }

        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-applications');
    const data = usePreload();
    const table = useTable('applications', { t });
    const router = useRouter();
    const query = useQuery(data, ['status', 'search', 'archived'])
    const patch = useAPI('account-applications-update');

    const tabs = [
        { text: t('TAB_INBOX'), value: undefined },
        { text: t('TAB_ARCHIVED'), value: true },
    ]

    const statuses = [
        { text: t('STATUS_CLEAR'), value: undefined },
        ...useStatuses({ t })
    ]

    function view ({ room }) {
        router.push({ name: 'account-application', params: { id: room } });
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