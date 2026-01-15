<template>
    <div class="app-empty-state">
        <h3 class="app-empty-state__title">{{ title }}</h3>

        <p v-if="description" class="app-empty-state__desc">{{ description }}</p>

        <div v-if="$slots.action" class="app-empty-state__action">
            <slot name="action" />
        </div>
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string;
        description?: string;
    }>(),
    {
        title: 'Nothing here yet',
        description: ''
    }
);
</script>

<style scoped lang="scss">
.app-empty-state {
    text-align: center;
    padding: 20px;
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.65);

    &__title {
        margin: 0;
        font-size: 16px;
        font-weight: 650;
    }

    &__desc {
        margin: 8px 0 0;
        font-size: 14px;
        color: var(--color-muted);
    }

    &__action {
        margin-top: 14px;
        display: flex;
        justify-content: center;
    }
}
</style>
