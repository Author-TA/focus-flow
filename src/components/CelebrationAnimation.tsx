import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CONFETTI_COLORS = [
  'hsl(215, 90%, 55%)',
  'hsl(45, 95%, 55%)',
  'hsl(150, 60%, 45%)',
  'hsl(340, 80%, 55%)',
  'hsl(280, 70%, 60%)',
  'hsl(15, 85%, 55%)',
];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
  rotation: number;
}

export function CelebrationAnimation({ onComplete }: { onComplete: () => void }) {
  const [pieces] = useState<ConfettiPiece[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 0.5,
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
    }))
  );

  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size * 1.5,
            backgroundColor: piece.color,
            rotate: piece.rotation,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: '100vh', opacity: 0, rotate: piece.rotation + 720 }}
          transition={{
            duration: 2,
            delay: piece.delay,
            ease: 'easeIn',
          }}
        />
      ))}

      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.2 }}
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-foreground">Congratulations!</h2>
        <p className="text-muted-foreground mt-2">Task completed</p>
      </motion.div>
    </motion.div>
  );
}
