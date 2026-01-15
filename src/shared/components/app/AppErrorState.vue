<template>
    <div class="app-error-state app-error-state--error" role="alert" aria-live="assertive">
        <h3 class="app-error-state__title">{{ title }}</h3>

        <p v-if="message" class="app-error-state__desc">{{ message }}</p>

        <div v-if="$slots.action || onRetry" class="app-error-state__action">
            <slot name="action">
                <BaseButton v-if="onRetry" type="button" @click="onRetry">{{ btnLabel }}</BaseButton>
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/shared/components/base/BaseButton.vue';

withDefaults(
    defineProps<{
        title?: string;
        message?: string;
        btnLabel?: string;
        onRetry?: (() => void) | null;
    }>(),
    {
        title: 'Something went wrong',
        message: '',
        btnLabel: 'Try again',
        onRetry: null
    }
);
</script>

<style scoped lang="scss">
.app-error-state {
    text-align: center;
    padding: 20px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.85);

    &--error {
        border-color: rgba(196, 39, 58, 0.35);
        background: rgba(196, 39, 58, 0.05);
    }

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
