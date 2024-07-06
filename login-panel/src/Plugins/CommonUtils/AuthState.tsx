import create from 'zustand'

interface AuthState {
    usertype: string
    username: string
    password: string
    setUsertype: (usertype: string) => void
    setUsername: (username: string) => void
    setPassword: (password: string) => void
}

const Auth = create<AuthState>((set) => ({
    usertype: '',
    username: '',
    password: '',
    setUsertype: (usertype) => set({ usertype }),
    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),
}))

export default Auth