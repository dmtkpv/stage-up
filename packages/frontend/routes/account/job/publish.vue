<!--
    Styles
-->

<style lang="scss">



    // -------------------
    // Tile
    // -------------------

    .cMGJCj {

        &_header {
            padding: $gap-lg $gap-lg 0 $gap-lg;
        }

        &_content {
            padding: $gap $gap-lg;
            display: flex;
            gap: $gap;

            @include sm {
                flex-direction: column;
            }
        }

        &_footer {
            border-top: $border;
            justify-content: space-between;
            padding: $gap $gap-lg;
        }

    }



    // -------------------
    // Type
    // -------------------

    .qGtXID {

        border: $border;
        border-width: 2px;
        border-radius: $radius;
        flex: 1 0 0;
        padding: $gap;

        &_header {
            display: flex;
            align-items: center;
            gap: 12px;
            & > svg {
                margin-left: auto;
                color: $blue;
            }
        }

        &_note {
            display: flex;
            align-items: center;
            margin: $gap 0;
            svg {
                flex-shrink: 0;
                margin-right: 14px;
                color: $blue;
            }
        }

        .list {
            b {
                display: block;
            }
            &_icon._unavailable {
                opacity: .5;
            }
        }

        &:not(._premium) &_header > svg {
            display: none;
        }

        &:not(._premium) &_note svg {
            display: none;
        }

        &:not(._premium) .list_icon {
            color: $grey-dark;
        }

        &._premium &_note {
            background: $blue-light;
            border-radius: $radius;
            padding: 8px 12px;
        }

        &:not(._active):hover {
            cursor: pointer;
        }

        &._active {
            border-color: $blue;
        }

        &:not(._active) &_header .ui-tag {
            display: none;
        }

    }
    

</style>



<!--
    Template
-->

<template>


    <!-- heading -->

    <l-heading>
        <h1 class="h3">{{ t('HEADING') }}</h1>
    </l-heading>


    <!-- tile -->

    <div class="tile cMGJCj">

        <h2 class="cMGJCj_header h5">{{ t('TILE_HEADING') }}</h2>

        <div class="cMGJCj_content">

            <div
                v-for="type in types"
                class="qGtXID"
                :class="{ _premium: type.id === 2,  _active: active === type.id }"
                :key="type.id"
                @click="active = type.id">

                <div class="qGtXID_header">
                    <h3 class="h4">{{ type.title }}</h3>
                    <ui-tag type="blue" :icon="IconSmCheck" :text="t('TYPE_SELECTED')" />
                    <ui-icon type="lg" :value="IconSmCrown" />
                </div>

                <div class="qGtXID_note">
                    <ui-icon type="md" :value="IconSmBoost" />
                    <p v-html="type.note" />
                </div>

                <ul class="list">
                    <li v-for="item in type.items">
                        <div class="list_icon" :class="{ _unavailable: !item.available }">
                            <ui-icon v-if="type.id === 1 && item.available" :value="IconSmCircleCheck" />
                            <ui-icon v-else-if="type.id === 1 && !item.available" :value="IconSmCircleClose" />
                            <ui-icon v-else-if="type.id === 2 && item.available" :value="IconSmCheck" />
                        </div>
                        <p v-html="item.text" />
                    </li>
                </ul>

            </div>
        </div>

        <div class="cMGJCj_footer row">
            <ui-button
                type="default"
                :to="state.back"
                :icon="IconLgLeft"
                :text="t('BUTTON_BACK')"
            />
            <ui-button
                :loading="save.pending"
                :text="active === 1 ? t('BUTTON_PUBLISH_FREE') : t('BUTTON_PUBLISH_PREMIUM')"
                @click="submit"
            />
        </div>

    </div>

</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { LHeading, UiIcon, UiButton, UiTag } from '#root/global/components.js'
    import { IconSmCheck, IconSmCircleCheck, IconSmCircleClose, IconSmBoost, IconLgLeft, IconSmCrown } from '#root/global/icons.js'
    import { useText, usePreload, useState, usePlan, useAPI, toastAPIError, useMeta, useFeatures } from '#root/global/composables.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'route-account-job-publish'
        ],

        features: [
            'publish-free',
            'publish-premium'
        ],

        preload ({ api, qs }, to) {
            const id = qs.integer(to.params.id);
            return {
                id,
                job: api('account-jobs-item').fetch(id),
                premium: api('account-jobs-premium-count').fetch()
            }
        },

        redirect (to) {
            const { job } = to.meta.preload;
            if (job.premium) return { name: 'account-job-upsert', params: { id: job.id }};
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-job-publish');
    const state = useState();
    const data = usePreload();
    const router = useRouter();
    const plan = usePlan();
    const save = useAPI('account-jobs-upsert');
    const active = ref(1);

    const types = [
        {
            id: 1,
            title: t('FREE_TITLE'),
            note: t('FREE_NOTE'),
            items: useFeatures('publish-free')
        },
        {
            id: 2,
            title: t('PREMIUM_TITLE'),
            note: t('PREMIUM_NOTE'),
            items: useFeatures('publish-premium')
        }
    ]

    function onSuccess () {
        router.push({ name: 'account-jobs' })
    }

    function submit () {
        if (active.value === 1) return onSuccess()
        if (plan.hasJobs(data.premium)) save.quiet(data.id, { premium: true })
        else router.push({ name: 'account-job-upgrade', params: { id: data.id } })
    }

    save.onSuccess(onSuccess);
    toastAPIError(save);
    useMeta();

</script>