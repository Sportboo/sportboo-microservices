import { bottom, top } from './template-parts';

export class UserRegistrationEmailTemplate {
  constructor(
    private readonly name: string,
    private readonly otp: string,
    public readonly subject: string,
  ) {}

  public get htmlBody(): string {
    return `
      ${top} 
      <h1 style="font-size: 2rem; margin: 0; font-weight: 700; color: #0a0a0b">
        Welcome to Sportboo! Verify your Account
      </h1>
      <p
        style="font-size: 1.25rem; margin: 1.5rem 0; font-weight: 700; color: #1d1e20"
      >
        Hi ${this.name}
      </p>
      <p style="font-size: 1rem; margin: 0; font-weight: 400; color: #36373a">
        Thank you for signing up on Sportboo! To complete your registration, please use the OTP below:
      </p>
      <p
        style="font-size: 1.25rem; margin: 1.5rem 0; font-weight: 700; color: #1d1e20"
      >
        Your OTP: ${this.otp}
      </p>
      <p style="font-size: 1rem; margin: 0; font-weight: 400; color: #36373a">
        This code will expire in a few minutes. If you didn't sign up for Sportboo, please ignore this email.
      </p>
      ${bottom}
      `;
  }

  public get textBody(): string {
    return `WELCOME TO SPORTBOO! CONFIRM YOUR REGISTRATION

        Hi ${this.name}

        Thank you for signing up on Sportboo! To complete your registration, please use the OTP below:

        Your OTP: ${this.otp}

        This code will expire in a few minutes. If you didn't sign up for Sportboo, please ignore this email.`;
  }
}
