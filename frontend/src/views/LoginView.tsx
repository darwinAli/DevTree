import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import { LoginForm } from '../types'
import api from '../config/axios'

export default function LoginView() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const initialValues: LoginForm = {
    email: '',
    password: ''
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const handleLogin = async (formData: LoginForm) => {
    try {
      setIsLoading(true)
      const { data } = await api.post(`/auth/login`, formData)
      localStorage.setItem('AUTH_TOKEN', data)
      
      toast.success('¡Bienvenido!', {
        description: 'Inicio de sesión exitoso',
        duration: 1500,
        onAutoClose: () => navigate('/admin')
      })
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error('Error de autenticación', {
          description: error.response?.data?.error || 'Error desconocido',
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </motion.div>
          <h1 className='text-4xl text-white font-bold mb-2'>Iniciar Sesión</h1>
          <p className="text-blue-200">Accede a tu cuenta para administrar tu perfil</p>
        </div>

        <motion.form
          onSubmit={handleSubmit(handleLogin)}
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 space-y-6"
          noValidate
          whileHover={{ scale: 1.005 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-1">Correo electrónico</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  {...register("email", {
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
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-1">Contraseña</label>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-100">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link to="/auth/forgot-password" className="font-medium text-blue-300 hover:text-blue-200">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
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
                  Procesando...
                </>
              ) : (
                'Iniciar Sesión'
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
            ¿No tienes una cuenta?{' '}
            <Link 
              to="/auth/register" 
              className="font-medium text-white hover:text-blue-300 underline underline-offset-4"
            >
              Regístrate aquí
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