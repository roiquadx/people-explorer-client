<template>
    <button :type="type" class="base-button" :class="`base-button--${variant}`" :disabled="disabled || loading">
        <span v-if="loading">Loading…</span>
        <slot v-else />
    </button>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        type?: 'button' | 'submit';
        variant?: 'primary' | 'secondary' | 'danger';
        loading?: boolean;
        disabled?: boolean;
    }>(),
    {
        type: 'button',
        variant: 'primary',
        loading: false,
        disabled: false
    }
);
</script>

<style scoped lang="scss">
.base-button {
    padding: 10px 14px;
    border-radius: 50px;
    border: 1px solid var(--color-border);
    cursor: pointer;
    font-weight: 600;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    &--primary {
        background: var(--color-text);
        color: #fff;
    }

    &--secondary {
        background: var(--color-surface);
        color: var(--color-text);
    }

    &--danger {
        background: #c4273a;
        color: #fff;
    }
}
</style>
