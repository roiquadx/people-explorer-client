<template>
    <div class="app-loader" :class="{ 'app-loader--inline': inline }">
        <span class="app-loader__spinner" aria-hidden="true"></span>
        <span v-if="label" class="app-loader__label">{{ label }}</span>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'AppLayout'
});

withDefaults(
    defineProps<{
        label?: string;
        inline?: boolean;
    }>(),
    {
        label: 'Loading…',
        inline: false
    }
);
</script>

<style scoped lang="scss">
.app-loader {
    display: grid;
    justify-items: center;
    gap: 10px;
    padding: 16px;
    text-align: center;

    &--inline {
        display: inline-grid;
        padding: 0;
        gap: 8px;
    }

    &__spinner {
        width: 28px;
        height: 28px;
        border-radius: 999px;
        border: 3px solid rgba(0, 0, 0, 0.12);
        border-top-color: rgba(0, 0, 0, 0.55);
        animation: spin 0.9s linear infinite;
    }

    &__label {
        font-size: 14px;
        color: var(--color-muted);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
