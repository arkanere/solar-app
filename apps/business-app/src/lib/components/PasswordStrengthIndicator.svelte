<script lang="ts">
	interface Props {
		password: string;
	}

	let { password }: Props = $props();

	// Validation rules matching TokenSecurity.validatePasswordStrength
	let hasMinLength = $derived(password.length >= 8);
	let hasUppercase = $derived(/[A-Z]/.test(password));
	let hasLowercase = $derived(/[a-z]/.test(password));
	let hasNumber = $derived(/[0-9]/.test(password));
	let hasSpecialChar = $derived(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password));
	let isValidLength = $derived(password.length <= 128);

	let allRequirementsMet = $derived(
		hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && isValidLength
	);

	export { allRequirementsMet };
</script>

<div class="password-requirements">
	<p class="requirements-title">Password Requirements:</p>
	<ul class="requirements-list">
		<li class:met={hasMinLength} class:unmet={!hasMinLength}>
			<span class="indicator">{hasMinLength ? '✓' : '✗'}</span>
			At least 8 characters
		</li>
		<li class:met={hasUppercase} class:unmet={!hasUppercase}>
			<span class="indicator">{hasUppercase ? '✓' : '✗'}</span>
			One uppercase letter (A-Z)
		</li>
		<li class:met={hasLowercase} class:unmet={!hasLowercase}>
			<span class="indicator">{hasLowercase ? '✓' : '✗'}</span>
			One lowercase letter (a-z)
		</li>
		<li class:met={hasNumber} class:unmet={!hasNumber}>
			<span class="indicator">{hasNumber ? '✓' : '✗'}</span>
			One number (0-9)
		</li>
		<li class:met={hasSpecialChar} class:unmet={!hasSpecialChar}>
			<span class="indicator">{hasSpecialChar ? '✓' : '✗'}</span>
			One special character (!@#$%^&*...)
		</li>
	</ul>
</div>

<style>
	.password-requirements {
		margin-top: 0.75rem;
		padding: 0.75rem;
		background-color: rgba(0, 0, 0, 0.02);
		border-radius: 6px;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .password-requirements {
		background-color: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.requirements-title {
		font-size: 0.875rem;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		color: inherit;
	}

	.requirements-list {
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 0.813rem;
	}

	.requirements-list li {
		padding: 0.25rem 0;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.2s ease;
	}

	.indicator {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.125rem;
		height: 1.125rem;
		font-weight: bold;
		font-size: 0.75rem;
		flex-shrink: 0;
	}

	.met {
		color: #16a34a;
	}

	.met .indicator {
		color: #16a34a;
	}

	.unmet {
		color: #6b7280;
	}

	.unmet .indicator {
		color: #dc2626;
	}

	:global(.dark) .unmet {
		color: #9ca3af;
	}
</style>
