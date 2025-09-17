<!--
    Styles
-->

<style lang="scss">

    .landing-partners {

        background: $white;

        section {

            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 32px 96px;

            img {
                width: 96px;
            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <article class="landing-partners">
        <div class="container-md">

            <landing-heading :title="t('HEADING')"/>

            <section>
                <img src="/landing/partner-1.webp">
                <img src="/landing/partner-2.webp">
                <img src="/landing/partner-3.webp">
                <img src="/landing/partner-4.webp">
                <img src="/landing/partner-5.webp">
                <img src="/landing/partner-6.webp">
                <img src="/landing/partner-7.webp">
                <img src="/landing/partner-8.webp">
            </section>

        </div>
    </article>
</template>



<!--
    Scripts
-->

<script setup>

    import { useText } from '#root/global/composables.js'
    import { LandingHeading } from '#root/global/components.js'
    const t = useText('landing-partners');

</script>