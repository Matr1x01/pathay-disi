export interface IUser {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'admin' | 'raider'; // Add a type property to differentiate user types
  roles?: { id: string; name: string }[];
  permissions?: { id: string; name: string }[];
}
