import { Component } from '@angular/core';

import { OtpForm } from '../otp-form/otp-form';
import { ResetForm } from '../reset-form/reset-form';
import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'app-account',
  imports: [LoginForm, OtpForm, ResetForm],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {}
