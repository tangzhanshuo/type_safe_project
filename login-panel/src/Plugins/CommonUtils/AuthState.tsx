import create from 'zustand'

interface AuthState {
    usertype: string
    username: string
    token: string
    setUsertype: (usertype: string) => void
    setUsername: (username: string) => void
    setToken: (token: string) => void
}

const Auth = create<AuthState>((set) => ({
    usertype: '',
    username: '',
    token: '',
    setUsertype: (usertype) => set({ usertype }),
    setUsername: (username) => set({ username }),
    setToken: (token) => set({ token: token }),
}))

export default Auth