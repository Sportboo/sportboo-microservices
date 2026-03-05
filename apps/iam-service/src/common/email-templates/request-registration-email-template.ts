import { bottom, top } from './template-parts';

export class RequestRegistrationEmailTemplate {
  constructor(
    private readonly name: string,
    private readonly otp: string,
    public readonly subject: string,
  ) {}

  public get htmlBody(): string {
    return `
      ${top} 
      <h1 style="font-size: 2rem; margin: 0; font-weight: 700; color: #0a0a0b">
        OTP Request
      </h1>
      <p
        style="font-size: 1.25rem; margin: 1.5rem 0; font-weight: 700; color: #1d1e20"
      >
        Hi ${this.name}
      </p>
      <p style="font-size: 1rem; margin: 0; font-weight: 400; color: #36373a">
        Your requested OTP is as shown below:
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
    return `OTP REQUEST

        Hi ${this.name}

       Your requested OTP is as shown below:

        Your OTP: ${this.otp}

        This code will expire in a few minutes. If you didn't sign up for Sportboo, please ignore this email.`;
  }
}
