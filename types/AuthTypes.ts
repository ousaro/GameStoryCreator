
export type AuthDataType = (
  email: string,
  password: string,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  username?: string // Include username for signup
) => Promise<any>;
