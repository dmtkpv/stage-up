<!--
    Styles
-->

<style lang="scss">

    .unit-room {

        &.tile {
            padding: 16px;
            margin-bottom: 16px;
        }



        // -------------------
        // Layout
        // -------------------

        display: flex;

        .unit-application,
        .unit-company,
        .unit-candidate {
            flex-grow: 1;
            margin-right: 12px;
        }

        .unit-candidate_bookmark {
            display: none;
        }



        // -------------------
        // Info
        // -------------------

        &_info {

            display: flex;
            flex-flow: column;
            justify-content: space-between;
            align-items: flex-end;
            flex-shrink: 0;

            .row {
                align-items: center;
                flex-wrap: nowrap;
            }

            .unread {
                display: inline-block;
            }

        }


    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="unit-room" :class="{ _disabled: disabled }">

        <unit-application
            v-if="value.job.id"
            heading="h2"
            :value="value"
        />

        <unit-company
            v-else-if="user.role === 'candidate'"
            heading="h2"
            :value="value.company"
        />

        <unit-candidate
            v-else
            heading="h2"
            :value="value.candidate"
        />

        <div class="unit-room_info">
            <div class="row">
                <ui-date class="t7" :value="value.messaged_at" :format="today ? 'time' : 'date'" />
                <ui-actions :value="actions" @view="view()" @archive="archive()" />
            </div>
            <span v-if="value.unread" class="unread">{{ value.unread }}</span>
        </div>

    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useUser, useAPI, useText, toastAPIError } from '#root/global/composables.js'
    import { UiDynamic, UnitApplication, UnitCompany, UnitCandidate, UiDate, UiActions } from '#root/global/components.js'

    const props = defineProps({
        value: {
            type: Object,
            required: true
        },
        heading: {
            type: String,
            required: true
        },
    })

    const t = useText('unit-room');
    const user = useUser();
    const patch = useAPI('account-rooms-update');
    const router = useRouter();
    const route = useRoute();
    const disabled = ref(false);

    const actions = [
        { text: t('ACTION_VIEW'), value: 'view' },
        { text: props.value.archived ? t('ACTION_UNARCHIVE') : t('ACTION_ARCHIVE'), value: 'archive' },
    ]

    const today = computed(() => {
        return new Date().toDateString() === new Date(props.value.messaged_at).toDateString()
    })

    function view () {
        router.push({ name: 'account-room', params: { id: props.value.id }})
    }

    async function archive () {
        disabled.value = true;
        await patch.quiet(props.value.id, { archived: !props.value.archived });
        await router.push({ query: { ...route.query, t: Date.now() } })
    }

    toastAPIError(patch);

</script>