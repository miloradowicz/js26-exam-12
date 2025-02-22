export interface Image {
  _id: string;
  author: string;
  title: string;
  image: string;
}

export type ImageMutation = Omit<Image, '_id' | 'author' | 'image'> & {
  image: File | null;
};

export interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  role: 'user' | 'admin';
  token: string;
}

export type StrippedUser = Omit<User, 'role' | 'token'>;

export type SignUpMutation = Omit<User, '_id' | 'avatar' | 'role' | 'token'> & {
  password: string;
  avatar: File | null;
};

export type SignInMutation = Omit<
  User,
  '_id' | 'displayName' | 'avatar' | 'role' | 'token'
>;

export interface Session {
  user: User | null;
}

export interface AuthenticationError {
  type: 'AuthenticationError';
  error: {
    name: string;
    message: string;
  };
}

export interface ValidationError {
  type: 'ValidationError';
  errors: {
    [key: string]: {
      name: string;
      messages: string[];
    };
  };
}

export interface GenericError {
  type: string;
  error: string;
}
