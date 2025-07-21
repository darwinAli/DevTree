import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { social } from "../data/social"
import DevTreeInput from "../components/DevTreeInput"
import { isValidUrl } from "../utils"
import { toast } from "sonner"
import { updateProfile } from "../api/DevTreeAPI"
import { SocialNetwork, User } from "../types"

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social)
  const [isSaving, setIsSaving] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const queryClient = useQueryClient()
  const user: User = queryClient.getQueryData(['user'])!

  // Efecto para animación de fondo
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

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error('Error al guardar', {
        description: error.message,
        action: {
          label: 'Reintentar',
          onClick: () => mutate(queryClient.getQueryData(['user'])!)
        }
      })
    },
    onSuccess: () => {
      toast.success('Enlaces actualizados', {
        description: 'Tus enlaces se han guardado correctamente',
        action: {
          label: 'Ver perfil',
          onClick: () => {}
        }
      })
    },
    onSettled: () => {
      setIsSaving(false)
    }
  })

  useEffect(() => {
    const updatedData = devTreeLinks.map(item => {
      const userlink = JSON.parse(user.links).find((link: SocialNetwork) => link.name === item.name)
      if (userlink) {
        return { ...item, url: userlink.url, enabled: userlink.enabled }
      }
      return item
    })
    setDevTreeLinks(updatedData)
  }, [])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedLinks = devTreeLinks.map(link => 
      link.name === e.target.name ? { ...link, url: e.target.value } : link
    )
    setDevTreeLinks(updatedLinks)
  }

  const links: SocialNetwork[] = JSON.parse(user.links)

  const handleEnableLink = (socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map(link => {
      if (link.name === socialNetwork) {
        if (isValidUrl(link.url)) {
          return { ...link, enabled: !link.enabled }
        } else {
          toast.error('URL no válida', {
            description: 'Por favor ingresa una URL válida para este enlace',
            action: {
              label: 'Entendido',
              onClick: () => {}
            }
          })
          return link
        }
      }
      return link
    })

    setDevTreeLinks(updatedLinks)

    let updatedItems: SocialNetwork[] = []
    const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetwork)
    
    if (selectedSocialNetwork?.enabled) {
      const id = links.filter(link => link.id).length + 1
      if (links.some(link => link.name === socialNetwork)) {
        updatedItems = links.map(link => {
          if (link.name === socialNetwork) {
            return {
              ...link,
              enabled: true,
              id
            }
          } else {
            return link
          }
        })
      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id
        }
        updatedItems = [...links, newItem]
      }
    } else {
      const indexToUpdate = links.findIndex(link => link.name === socialNetwork)
      updatedItems = links.map(link => {
        if (link.name === socialNetwork) {
          return {
            ...link,
            id: 0,
            enabled: false
          }
        } else if (link.id > indexToUpdate && (indexToUpdate !== 0 && link.id === 1)) {
          return {
            ...link,
            id: link.id - 1
          }
        } else {
          return link
        }
      })
    }

    // Actualizar en la cache
    queryClient.setQueryData(['user'], (prevData: User) => ({
      ...prevData,
      links: JSON.stringify(updatedItems)
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    mutate(queryClient.getQueryData(['user'])!)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 overflow-hidden relative p-4">
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
        className="max-w-2xl mx-auto z-10"
      >
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Administrar Enlaces
          </motion.h1>
          <motion.p 
            className="text-blue-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Personaliza los enlaces que aparecerán en tu perfil
          </motion.p>
        </div>

        <motion.div 
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 space-y-4"
          whileHover={{ scale: 1.005 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <AnimatePresence>
            {devTreeLinks.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <DevTreeInput 
                  item={item}
                  handleUrlChange={handleUrlChange}
                  handleEnableLink={handleEnableLink}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div
            className="pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </motion.button>
          </motion.div>
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