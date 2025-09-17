<!--
    Styles
-->

<style lang="scss">

    .l-filter {

        display: flex;
        align-items: flex-start;
        gap: 24px;




        // --------------------
        // Layout
        // --------------------

        aside {
            flex: 0 0 320px;
        }

        section {

            flex-grow: 1;
            min-width: 0;

            .i-search {
                max-width: 400px;
                margin-bottom: 24px;
            }

            .l-heading_primary {
                @include lg { display: none }
            }

        }

        @at-root .l-sidebar .nFvGbk {
            width: 320px;
        }

        @at-root .KizCEs {
            margin-bottom: $gap-lg;
            align-items: center;
            justify-content: space-between;
        }



        // --------------------
        // Tags
        // --------------------

        &_tags {

            display: flex;
            flex-wrap: wrap;
            gap: 12px;

            &:not(:empty) {
                margin-bottom: $gap;
            }

            button {

                display: flex;
                align-items: center;
                @extend %blue;
                height: 32px;
                border-radius: 16px;
                padding: 0 12px;
                overflow: hidden;

                &:hover {
                    @extend %blue-dark;
                }

                span {
                    margin-right: 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                svg {
                    flex-shrink: 0;
                }

            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <main class="l-filter container-md">


        <!-- filters -->

        <ui-responsive v-model="sidebar" v-bind="responsive" class="nFvGbk">

            <div class="KizCEs row">
                <p class="h4">{{ t('FILTER') }}</p>
                <a @click="reset" class="link" v-if="filtered">{{ t('RESET') }}</a>
            </div>

            <l-form :form="form" :value="data.query" @input="emit('update', data.query)" />

        </ui-responsive>


        <!-- content -->

        <section>

            <slot name="search" />

            <l-heading>
                <p>
                    <span v-if="data.list.length" v-html="render(t('COUNT'), counts)" />
                    <b>&nbsp;{{ data.count.total }}&nbsp;</b>
                    <span>{{ units }}</span>
                </p>
                <template #controls>
                    <slot name="header" />
                    <ui-button class="l-heading_primary" :text="t('FILTER')" @click="sidebar = !sidebar" />
                </template>
            </l-heading>

            <div class="l-filter_tags">
                <template v-for="(text, key) in tags" :key="key">
                    <button v-if="data.query[key]" @click="clear(key)">
                        <span class="t6">{{ text(data.query[key]) }}</span>
                        <ui-icon :value="IconSmClose" />
                    </button>
                </template>
            </div>

            <slot />

        </section>


    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref, computed } from 'vue'
    import { usePreload, useText, useReset } from '#root/global/composables.js'
    import { render } from '#root/global/utils.js'
    import { UiResponsive, UiSidebar, LForm, LHeading, UiButton, UiIcon } from '#root/global/components.js'
    import { IconSmClose } from '#root/global/icons.js'

    const emit = defineEmits([
        'update'
    ])

    const props = defineProps([
        'form',
        'tags',
        'units'
    ])

    const t = useText('l-filter');
    const sidebar = ref(false);
    const data = usePreload();
    const reset = useReset();

    const responsive = {
        default: {
            component: UiSidebar,
            options: {
                hideOn: 'path'
            }
        },
        lg: {
            component: 'aside',
            options: {
                class: 'tile _padded'
            }
        }
    }

    const counts = computed(() => {
        const page = data.query.page ?? 1;
        const from = (page - 1) *  data.limit;
        const to = from + data.list.length;
        return { from, to };
    })

    const filtered = computed(() => {
        const { page, sort, ...filters } = data.query;
        return Object.values(filters).some(filter => !!filter);
    })

    function clear (key) {
        const { [key]: omit, ...query } = data.query;
        emit('update', query);
    }



</script>