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
        </l-heading>

        <div class="tile _padded">
            <i-files
                type="cvs"
                :note="t('NOTE')"
                :button="t('BUTTON')"
                :list="data.list"
                :unit="{ apiUpload: 'account-cvs-create', apiDelete: 'account-cvs-delete' }"
            />
        </div>

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { usePreload, useText, useMeta } from '#root/global/composables.js'
    import { LHeading, IFiles } from '#root/global/components.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'item-file',
            'm-confirm',
            'route-account-cv'
        ],

        preload ({ api }) {
            return {
                list: api('account-cvs-list').fetch()
            }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-cv' );
    const data = usePreload();

    useMeta();



</script>