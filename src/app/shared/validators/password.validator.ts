import { FormControl } from "@angular/forms";

export function PasswordValidator(control: FormControl): {[key: string]: Boolean} | null {
	const password = control.get('password');
	const confirmPassword = control.get('confirmPassword');
	return password && confirmPassword && password.value !== confirmPassword.value ? { 'misMatch': true } : null;
}
