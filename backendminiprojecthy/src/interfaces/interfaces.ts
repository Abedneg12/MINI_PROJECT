export interface IRegisterInput {
  full_name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referral_code?: string;
  is_verified: boolean;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface AuthRequest extends Request {
  user?: IUserPayload;
}

export interface IUserPayload {
  id: number;
  email: string;
  role: 'CUSTOMER' | 'ORGANIZER';
}

// extend Express.Request agar `req.user` dikenali oleh TypeScript
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}


