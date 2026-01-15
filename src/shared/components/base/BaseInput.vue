<template>
    <label class="base-input">
        <span v-if="label" class="base-input__label">{{ label }}</span>

        <input :type="type" :value="modelValue" :placeholder="placeholder" :disabled="disabled" @input="onInput" />

        <span v-if="error" class="base-input__error">{{ error }}</span>
    </label>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string;
    label?: string;
    placeholder?: string;
    type?: string;
    error?: string;
    disabled?: boolean;
}>();

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

function onInput(e: Event) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
}
</script>

<style scoped lang="scss">
.base-input {
    display: grid;
    gap: 6px;

    input {
        padding: 10px;
        border-radius: 8px;
        border: 1px solid var(--color-border);
    }

    &__label {
        font-size: 13px;
        font-weight: 600;
    }

    &__error {
        font-size: 12px;
        color: #c4273a;
    }
}
</style>
