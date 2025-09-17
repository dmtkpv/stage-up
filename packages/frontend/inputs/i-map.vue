<!--
    Styles
-->

<style lang="scss">

    .i-map {

        overflow: hidden;
        background: $bg;

        .gm-style iframe + div {
            border:none !important;
        }

        &_cluster {
            background: $blue;
            color: $white;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }

        &_marker {

            path:nth-child(1) {
                stroke: $blue;
                fill: $blue;
            }

            path:nth-child(2) {
                fill: $white;
            }

            &._active {
                path:nth-child(1) { fill: $white }
                path:nth-child(2) { fill: $blue }
            }

        }

        @include sm {
            .gm-bundled-control {
                display: none;
            }
        }

        @at-root .l-form & {
            height: 400px;
            border-radius: $radius;
        }

    }

</style>



<!--
    Template
-->

<template>
    <div class="i-map" ref="$el" />
</template>



<!--
    Scripts
-->

<script setup>

    import { MAP_MIN_ZOOM, MAP_MAX_ZOOM } from '@this/shared/constants.js'
    import { ref, onMounted, watch, computed } from 'vue'
    import SVG from '#root/icons/il-marker.svg?raw'



    // -------------------
    // Config
    // -------------------

    const emit = defineEmits([
        'idle',
        'update:modelValue'
    ])

    const props = defineProps({
        modelValue: Object,
        center: Object,
        clickable: Boolean,
        centerable: Boolean,
        zoom: Number,
        locations: {
            type: Array,
            default: []
        }
    })



    // -------------------
    // Data
    // -------------------

    let map = null;
    let markers = [];
    const $el = ref(null);
    const scale = { max: 1, min: 0.85 }

    const active = computed(() => {
        if (!props.modelValue) return false;
        const { lat, lng } = props.modelValue;
        const exists = props.locations.find(location => !isCluster(location) && location.lat === lat && location.lng === lng);
        return exists || props.modelValue;
    })

    const locations = computed(() => {
        const locations = [...props.locations];
        if (active.value && !locations.includes(active.value)) locations.push(active.value);
        return locations.map(location => ({ ...location, key: getKey(location) }));
    })

    const limits = computed(() => {
        const counts = props.locations.filter(isCluster).map(location => location.count);
        const max = Math.max(...counts);
        const min = Math.min(...counts);
        return { max, min }
    })



    // -------------------
    // Helpers
    // -------------------

    function isCluster (location) {
        return location.count && location.count > 1;
    }

    function getKey (location) {
        return location && JSON.stringify(location);
    }

    function getZoom () {
        return props.zoom && props.zoom >= MAP_MIN_ZOOM && props.zoom<= MAP_MAX_ZOOM ? props.zoom : 12;
    }

    function getScale (count) {
        const s = (count - limits.value.min) / (limits.value.max - limits.value.min);
        return scale.min + (scale.max - scale.min) * s;
    }

    function createCluster (count) {
        const content = document.createElement('div');
        content.className = 'i-map_cluster h5';
        content.textContent = count;
        content.style.scale = getScale(count);
        const marker = new google.maps.marker.AdvancedMarkerElement({ content, map });
        marker.addListener('click', () => {
            map.setZoom(Math.min(map.getZoom() + 2, 21));
            map.setCenter(marker.position);
        });
        return marker;
    }

    function createMarker () {
        const content = new DOMParser().parseFromString(SVG, 'image/svg+xml').documentElement;
        content.classList.add('i-map_marker');
        const marker = new google.maps.marker.AdvancedMarkerElement({ content, map });
        marker.addListener('click', () => {
            const { lat, lng } = marker.position;
            emit('update:modelValue', { lat, lng });
        });
        return marker;
    }



    // -------------------
    // Update markers
    // -------------------

    function updateMarkers () {

        markers = markers.filter(marker => {
            const exists = locations.value.find(location => location.key === marker.location.key);
            if (!exists) return marker.setMap(null);
            if (isCluster(marker.location)) {
                marker.content.style.scale = getScale(marker.location.count);
            }
            else {
                marker.content.classList.remove('_active');
                marker.zIndex = null;
            }
            return true;
        })

        locations.value.forEach(location => {
            const exists = markers.find(marker => marker.location.key === location.key);
            if (exists) return;
            const { count, lat, lng } = location;
            const marker = isCluster(location) ? createCluster(count) : createMarker();
            marker.position = { lat, lng };
            marker.location = location;
            markers.push(marker);
        })

        if (active.value) {
            const key = getKey(active.value);
            const marker = markers.find(marker => marker.location.key === key);
            marker.content.classList.add('_active');
            marker.zIndex = 1;
        }

    }



    // -------------------
    // Loader
    // -------------------

    function load () {
        return new Promise(resolve => {

            const src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&callback=initMap&loading=async&libraries=marker`
            let script = document.head.querySelector(`script[src='${src}']`);

            if (script) {
                if (window.google) resolve();
                else window.initMap = resolve;
            }

            else {
                script = document.createElement('script');
                script.src = src;
                document.head.appendChild(script);
                window.initMap = resolve;
            }
        })

    }



    // -------------------
    // Mount
    // -------------------

    onMounted(async () => {

        await load();

        map = new google.maps.Map($el.value, {
            mapId: MAP_ID,
            mapTypeControl: false,
            minZoom: MAP_MIN_ZOOM,
            zoom: getZoom(),
            center: props.center || props.modelValue || { lat: 52.3676, lng: 4.9041 }
        });

        map.addListener('idle', () => {
            const bounds = map.getBounds();
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            const center = map.getCenter();
            let neLng = ne.lng();
            let neLat = ne.lat();
            let swLng = sw.lng();
            let swLat = sw.lat();
            if (swLng > neLng) {
                swLng = -180;
                neLng = 180;
            }
            emit('idle', {
                zoom: map.getZoom(),
                center: { lat: center.lat(), lng: center.lng() },
                bounds: [swLng, swLat, neLng, neLat]
            });
        });

        map.addListener('click', event => {
            event.stop();
            props.clickable && emit('update:modelValue');
        });

        watch(locations, updateMarkers, {
            immediate: true
        })

        watch(() => props.modelValue, value => {
            value && props.centerable && map.setCenter(value);
        })

    })



</script>