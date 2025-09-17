<!--
    Styles
-->

<style lang="scss">

    .unit-candidate {

        &.tile {
            padding: 16px;
            margin-bottom: 16px;
        }



        // -------------------
        // Layout
        // -------------------

        display: flex;
        align-items: flex-start;

        .ui-image {
            width: 56px;
            margin-right: 12px;
        }

        &_content {
            position: relative;
            flex-grow: 1;
            padding-top: 4px;
        }



        // -------------------
        // Heading
        // -------------------

        &_heading {

            padding-right: 36px;

            .h5 {
                line-height: 24px;
            }

        }



        // -------------------
        // Bookmark
        // -------------------

        &_bookmark {
            position: absolute;
            top: 0;
            right: 0;
        }



        // -------------------
        // Note
        // -------------------

        &_note {

            color: $grey-dark;

            svg {
                display: inline-block;
                margin-right: 6px;
                vertical-align: baseline;
            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <ui-dynamic class="unit-candidate">
        <ui-image :uuid="value.avatar" default="user" type="circle" />
        <div class="unit-candidate_content">


            <!-- heading -->

            <div class="unit-candidate_heading">
                <component class="h5 break" :is="heading">{{ value.first_name }} {{ value.last_name }}</component>
            </div>


            <!-- bookmark -->

            <ui-bookmark
                class="unit-candidate_bookmark"
                type="candidate"
                :value="value"
                @delete="emit('bookmark', false)"
                @create="emit('bookmark', true)"
            />


            <!-- note -->

            <p class="unit-candidate_note">

                <template v-if="education_field">
                    <ui-icon :value="IconSmEducation" />
                    <span>{{ education_field }}</span>
                    <span v-if="education_level"> ({{ education_level }})</span>
                </template>

                <template v-else>
                    {{ value.email }}
                </template>

            </p>


        </div>
    </ui-dynamic>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useLists } from '#root/global/composables.js'
    import { getListText } from '#root/global/utils.js'
    import { UiDynamic, UiImage, UiBookmark, UiIcon } from '#root/global/components.js'
    import { IconSmEducation } from '#root/global/icons.js'

    const emit = defineEmits([
        'bookmark'
    ])

    const props = defineProps({
        value: {
            type: Object,
            required: true
        },
        heading: {
            type: String,
            required: true
        }
    })

    const lists = useLists();

    const education_field = computed(() => {
        return getListText(lists.education_fields, props.value.education_field)
    })

    const education_level = computed(() => {
        return getListText(lists.education_levels, props.value.education_level)
    })

</script>