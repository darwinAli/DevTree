import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import type { RegisterForm } from '../types'
import api from '../config/axios'

export default function RegisterView() {
    const location = useLocation()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const initialValues: RegisterForm = {
        name: '',
        email: '',
        handle: location?.state?.handle || '',
        password: '',
        password_confirmation: ''
    }

    const { register, watch, reset, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
    const password = watch('password')

    // Efecto para animación de fondo
    const [position, setPosition] = useState({ x: 0, y: 0 })
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: e.clientX / window.innerWidth - 0.5,
                y: e.clientY / window.innerHeight - 0.5
            })
        }
        
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const handleRegister = async (formData: RegisterForm) => {
        try {
            setIsLoading(true)
            const { data } = await api.post(`/auth/register`, formData)
            toast.success('¡Registro exitoso!', {
                description: data,
                action: {
                    label: 'Iniciar sesión',
                    onClick: () => navigate('/auth/login')
                },
            })
            reset()
        } catch (error) {
            if(isAxiosError(error)) {
                toast.error('Error en el registro', {
                    description: error.response?.data?.error || 'Ocurrió un error al registrar',
                    action: {
                        label: 'Intentar de nuevo',
                        onClick: () => {}
                    },
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Generación de partículas
    const particles = Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 10 + 2
        const animationDuration = Math.random() * 10 + 10
        const animationDelay = Math.random() * 5
        
        return (
            <div 
                key={i}
                className="absolute rounded-full bg-white opacity-10"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `float ${animationDuration}s linear infinite`,
                    animationDelay: `${animationDelay}s`
                }}
            />
        )
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 overflow-hidden relative p-4">
            {/* Efecto de fondo dinámico */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    transform: `translate(${position.x * 30}px, ${position.y * 30}px)`,
                    transition: 'transform 0.3s ease-out'
                }}
            />
            
            {/* Partículas decorativas */}
            {particles}

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <div className="text-center mb-8">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="inline-block mb-4"
                    >
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </motion.div>
                    <h1 className='text-4xl text-white font-bold mb-2'>Crear Cuenta</h1>
                    <p className="text-blue-200">Completa el formulario para unirte a nuestra comunidad</p>
                </div>

                <motion.form
                    onSubmit={handleSubmit(handleRegister)}
                    className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 space-y-6"
                    noValidate
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-1">Nombre completo</label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    {...register('name', {
                                        required: "El nombre es obligatorio",
                                        minLength: {
                                            value: 3,
                                            message: "El nombre debe tener al menos 3 caracteres"
                                        }
                                    })}
                                />
                            </motion.div>
                            {errors.name && (
                                <div className="mt-1">
                                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">Correo electrónico</label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="tucorreo@ejemplo.com"
                                    className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    {...register('email', {
                                        required: "El Email es obligatorio", 
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: "E-mail no válido",
                                        },
                                    })}
                                />
                            </motion.div>
                            {errors.email && (
                                <div className="mt-1">
                                    <ErrorMessage>{errors.email.message}</ErrorMessage>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="handle" className="block text-sm font-medium text-blue-100 mb-1">Nombre de usuario</label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="handle"
                                    type="text"
                                    placeholder="nombredeusuario"
                                    className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    {...register('handle', {
                                        required: "El nombre de usuario es obligatorio",
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message: "Solo letras, números y guiones bajos"
                                        }
                                    })}
                                />
                            </motion.div>
                            {errors.handle && (
                                <div className="mt-1">
                                    <ErrorMessage>{errors.handle.message}</ErrorMessage>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">Contraseña</label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    {...register('password', {
                                        required: "La contraseña es obligatoria",
                                        minLength: {
                                            value: 8,
                                            message: "La contraseña debe tener al menos 8 caracteres"
                                        }
                                    })}
                                />
                            </motion.div>
                            {errors.password && (
                                <div className="mt-1">
                                    <ErrorMessage>{errors.password.message}</ErrorMessage>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-blue-100 mb-1">Confirmar contraseña</label>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    {...register('password_confirmation', {
                                        required: "Confirmar contraseña es obligatorio",
                                        validate: (value) => value === password || 'Las contraseñas no coinciden'
                                    })}
                                />
                            </motion.div>
                            {errors.password_confirmation && (
                                <div className="mt-1">
                                    <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                                </div>
                            )}
                        </div>
                    </div>

                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creando cuenta...
                                </>
                            ) : (
                                'Registrarse'
                            )}
                        </button>
                    </motion.div>
                </motion.form>

                <motion.div 
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-sm text-blue-200">
                        ¿Ya tienes una cuenta?{' '}
                        <Link 
                            to="/auth/login" 
                            className="font-medium text-white hover:text-blue-300 underline underline-offset-4"
                        >
                            Inicia sesión
                        </Link>
                    </p>
                </motion.div>
            </motion.div>

            {/* Definimos la animación float en un style tag normal */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                }
            `}</style>
        </div>
    )
}