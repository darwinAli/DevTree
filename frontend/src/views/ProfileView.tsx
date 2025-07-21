import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ErrorMessage from '../components/ErrorMessage'
import { ProfileForm, User } from '../types'
import { updateProfile, uploadImage } from '../api/DevTreeAPI'

export default function ProfileView() {
    const queryClient = useQueryClient()
    const data: User = queryClient.getQueryData(['user'])!
    const [isHovered, setIsHovered] = useState(false)
    const [imagePreview, setImagePreview] = useState(data.image || '')

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
        defaultValues: {
            handle: data.handle,
            description: data.description
        }
    })

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

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            toast.error('Error al actualizar', {
                description: error.message,
                action: {
                    label: 'Reintentar',
                    onClick: () => {}
                }
            })
        },
        onSuccess: (data) => {
            toast.success('Perfil actualizado', {
                description: data,
                action: {
                    label: 'Ver perfil',
                    onClick: () => {}
                }
            })
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })

    const uploadImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error) => {
            toast.error('Error al subir imagen', {
                description: error.message,
                action: {
                    label: 'Reintentar',
                    onClick: () => {}
                }
            })
        },
    onSuccess: (data) => {
    const safeData = data || '' // Asegurar valor por defecto
    queryClient.setQueryData(['user'], (prevData: User) => {
        return {
            ...prevData,
            image: safeData
        }
    })
    setImagePreview(safeData)
    toast.success('Imagen actualizada', {
        description: 'Tu foto de perfil se ha actualizado correctamente'
    })
}
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            
            // Mostrar preview de la imagen
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
            
            uploadImageMutation.mutate(file)
        }
    }

    const handleUserProfileForm = (formData: ProfileForm) => {
        const user: User = queryClient.getQueryData(['user'])!
        user.description = formData.description
        user.handle = formData.handle
        updateProfileMutation.mutate(user)
    }

    // Generación de partículas
    const particles = Array.from({ length: 15 }).map((_, i) => {
        const size = Math.random() * 8 + 2
        const animationDuration = Math.random() * 15 + 10
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
                className="w-full max-w-2xl z-10"
            >
                <motion.form
                    onSubmit={handleSubmit(handleUserProfileForm)}
                    className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 space-y-6"
                    noValidate
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <div className="text-center mb-6">
                        <motion.h1 
                            className="text-3xl font-bold text-white mb-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Editar Perfil
                        </motion.h1>
                        <motion.p 
                            className="text-blue-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Personaliza tu información y haz que tu perfil destaque
                        </motion.p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sección de imagen */}
                        <motion.div 
                            className="flex flex-col items-center md:w-1/3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <motion.div
                                className="relative mb-4"
                                whileHover={{ scale: 1.05 }}
                                onHoverStart={() => setIsHovered(true)}
                                onHoverEnd={() => setIsHovered(false)}
                            >
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg relative">
                                    {imagePreview ? (
                                        <img 
                                            src={imagePreview} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0"
                                    animate={{ opacity: isHovered ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="w-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label 
                                    htmlFor="image"
                                    className="block text-center text-sm font-medium text-blue-100 mb-2"
                                >
                                    Cambiar foto
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    name="image"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                                <motion.label
                                    htmlFor="image"
                                    className="block w-full bg-white/20 text-white py-2 px-4 rounded-lg text-sm cursor-pointer text-center border border-white/30 hover:bg-white/30 transition-colors"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Seleccionar imagen
                                </motion.label>
                            </motion.div>

                            <motion.div
                                className="mt-6 text-center w-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <p className="text-sm text-blue-200">
                                    Visitas al perfil: <span className="font-bold text-white">{data.views}</span>
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Sección de formulario */}
                        <motion.div 
                            className="md:w-2/3 space-y-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div>
                                <label htmlFor="handle" className="block text-sm font-medium text-blue-100 mb-1">Nombre de usuario</label>
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                    <input
                                        id="handle"
                                        type="text"
                                        className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        {...register('handle', {
                                            required: "El Nombre de Usuario es obligatorio",
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
                                <label htmlFor="description" className="block text-sm font-medium text-blue-100 mb-1">Descripción</label>
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        className="w-full bg-white/20 text-white placeholder-blue-200/50 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        {...register('description', {
                                            required: "La Descripción es obligatoria",
                                            maxLength: {
                                                value: 200,
                                                message: "La descripción no puede exceder los 200 caracteres"
                                            }
                                        })}
                                    />
                                </motion.div>
                                {errors.description && (
                                    <div className="mt-1">
                                        <ErrorMessage>{errors.description.message}</ErrorMessage>
                                    </div>
                                )}
                            </div>

                            <motion.div
                                className="pt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <motion.button
                                    type="submit"
                                    disabled={updateProfileMutation.isPending || uploadImageMutation.isPending}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                                    whileTap={{ scale: 0.98 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    {updateProfileMutation.isPending || uploadImageMutation.isPending ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando cambios...
                                        </>
                                    ) : (
                                        'Guardar cambios'
                                    )}
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.form>
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