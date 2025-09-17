<!--
    Styles
-->

<style lang="scss">

    .hX7J6k {

        display: flex;
        align-items: center;
        gap: 16px;
        max-width: 560px;
        margin: 0 auto $padding-y auto;

        &_step {
            display: flex;
            align-items: center;
        }

        &_line {
            height: 1px;
            flex-grow: 1;
            background: $grey-light;
        }

        &_icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 8px;
            flex-shrink: 0;
            @extend %grey;
        }

        &_step._active {
            font-weight: $w6;
        }

        &_step._active &_icon {
            @extend %blue;
        }

        @include sm {
            justify-content: center;
            &_line { display: none }
            &_step:not(._active) { display: none }
        }

    }

</style>



<!--
    Template
-->

<template>
    <section class="container-sm">


        <!-- steps -->

        <div class="hX7J6k" v-if="route.name !== 'account-job-upsert'">

            <div class="hX7J6k_step">
                <div class="hX7J6k_icon">
                    <ui-icon type="md" :value="IconSmCheck" />
                </div>
                <span>{{ t('STEP_CREATE') }}</span>
            </div>

            <template v-for="step in steps">
                <div class="hX7J6k_line" />
                <div class="hX7J6k_step" :class="{ _active: route.name === step.name }">
                    <div class="hX7J6k_icon">{{ step.index }}</div>
                    <span>{{ step.text }}</span>
                </div>
            </template>

        </div>


        <!-- nested routes -->

        <router-view />


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { useRoute } from 'vue-router'
    import { useText } from '#root/global/composables.js'
    import { UiIcon } from '#root/global/components.js'
    import { IconSmCheck } from '#root/global/icons.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'route-account-job'
        ]

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-job');
    const route = useRoute();

    const steps = [
        {
            name: 'account-job-publish',
            index: 2,
            text: t('STEP_PUBLISH')
        },
        {
            name: 'account-job-upgrade',
            index: 3,
            text: t('STEP_UPGRADE')
        }
    ]

</script>