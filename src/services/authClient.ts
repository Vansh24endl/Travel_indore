import type { LoginInput, RegisterUserInput } from '@/Data/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

type AuthResponse = {
    ok: boolean
    user?: {
        id: string
        name: string
        email: string
        phone: string
        location?: string
        isActive?: boolean
    }
    message?: string
}

async function request(path: string, body: unknown): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = (await response.json()) as AuthResponse

    if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Authentication request failed')
    }

    return data
}

export async function registerRequest(payload: RegisterUserInput) {
    return request('/api/auth/register', payload)
}

export async function loginRequest(payload: LoginInput) {
    return request('/api/auth/login', payload)
}
