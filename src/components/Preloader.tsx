import { motion } from 'framer-motion';

const Preloader = () => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated Background Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gray-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }}
        />
      ))}

      <div className="flex flex-col items-center relative z-10">
        {/* Main Logo Container */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          {/* Outer Rotating Ring */}
          <motion.div
            className="absolute -inset-8 border-2 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, #000, #52525b, #000)'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle Ring */}
          <motion.div
            className="absolute -inset-4 border border-gray-400/40 rounded-full"
            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
            transition={{ 
              rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Logo with Glow Effect */}
          <motion.div
            className="relative w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center shadow-card"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(0, 0, 0, 0.1)',
                '0 0 40px rgba(82, 82, 91, 0.2)',
                '0 0 20px rgba(0, 0, 0, 0.1)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.img
              src="/images/logo2.png"
              alt="New SB Engineering Logo"
              className="w-20 h-20 object-contain filter drop-shadow-md"
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </motion.div>
        </motion.div>

        {/* Company Name - Animated Words */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="text-3xl font-bold text-black flex flex-wrap justify-center gap-2 uppercase">
            <motion.span
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
            >
              New
            </motion.span>
            <motion.span
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2.4, duration: 0.8, ease: "easeOut" }}
            >
              SB
            </motion.span>
            <motion.span
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
            >
              Engineering
            </motion.span>
          </div>
          <motion.p
            className="text-gray-600 text-sm mt-2 tracking-widest font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.8 }}
          >
            CRAFTING EXCELLENCE
          </motion.p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          className="flex items-center space-x-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-black"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preloader;