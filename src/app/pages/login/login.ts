import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jta-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  get f() { return this.form.controls; }
  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    console.log('Login payload', this.form.value);
  }
}
