export interface Image {
  _id: string;
  author: string;
  title: string;
  image: string;
}

export type PopulatedImage = Omit<Image, 'author'> & { author: StrippedUser };

export type ImageMutation = Omit<Image, '_id' | 'author' | 'image'> & {
  image: File | '';
};

export interface ImageSet {
  title?: string;
  images: PopulatedImage[];
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  role: 'user' | 'admin';
  token: string;
}

export type StrippedUser = Omit<User, 'username' | 'avatar' | 'role' | 'token'>;

export type SignUpMutation = Omit<User, '_id' | 'avatar' | 'role' | 'token'> & {
  password: string;
  avatar: File | '';
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
