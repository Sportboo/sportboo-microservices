export {};

declare global {
  namespace PrismaJson {
    // User profile types
    type ResidentialAddress = {
      userId: number;
      address: string;
      city?: string;
      state?: string;
      country: string;
      postCode?: string;
      raw?: any;
    };
  }
}
