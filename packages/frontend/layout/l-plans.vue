<!--
    Styles
-->

<style lang="scss">

    .l-plans {



        // -------------------
        // Switch
        // -------------------

        &_switch {

            position: relative;
            width: max-content;
            margin: 0 auto 32px auto;

            .ui-icon {
                width: 48px;
                position: absolute;
                bottom: 100%;
                right: 24px;
                margin-bottom: 8px;
                stroke: currentColor;
                @include sm {
                    transform: scale(-1, 1);
                }
            }

            .ui-tag {
                position: absolute;
                bottom: 100%;
                margin-bottom: 4px;
                white-space: nowrap;
                @include lg-md {
                    left: calc(100% - 48px);
                }
                @include sm {
                    right: 48px;
                }
            }

        }



        // -------------------
        // Tabs
        // -------------------

        &_tabs {

            display: flex;
            padding: 8px;
            height: 56px;
            border-radius: 28px;

            button {
                padding: 0 24px;
                border-radius: 20px;
                &._active { @extend %blue }
            }

        }



        // -------------------
        // List
        // -------------------

        &_list {

            display: grid;

            @include lg-md {
                gap: 24px;
                grid-template-columns: repeat(3, 1fr);
            }

            @include md-sm {
                gap: 24px;
            }

        }


    }

</style>



<!--
    Template
-->

<template>
    <div class="l-plans">


        <!-- switch -->

        <div class="l-plans_switch">

            <ui-icon :value="IconIlArrow" />
            <ui-tag class="w6" :text="t('TAG')" type="green-dark" />

            <div class="l-plans_tabs tile">
                <button
                    v-for="tab in tabs"
                    v-text="tab.text"
                    :key="tab.value"
                    :class="{ _active: tab.value === modelValue }"
                    @click="emit('update:modelValue', tab.value)"
                />
            </div>

        </div>


        <!-- list -->

        <div class="l-plans_list">
            <item-plan
                v-for="plan in value"
                :key="plan.id"
                :value="plan"
                :upgrade="upgrade"
                :annual="modelValue"
                :subscription="subscription"
            />
        </div>

    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText } from '#root/global/composables.js'
    import { UiIcon, UiTag, ItemPlan } from '#root/global/components.js'
    import { IconIlArrow } from '#root/global/icons.js'

    const emit = defineEmits([
        'update:modelValue'
    ])

    const props = defineProps([
        'modelValue',
        'upgrade',
        'value',
        'subscription'
    ])

    const t = useText('l-plans');

    const tabs = [
        { text: t('MONTHLY'), value: false },
        { text: t('ANNUALLY'), value: true },
    ]

</script>