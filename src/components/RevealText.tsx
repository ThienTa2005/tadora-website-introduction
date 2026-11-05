import { motion, useReducedMotion } from 'framer-motion'

type Props = { text: string; className?: string }

export function RevealText({ text, className = '' }: Props) {
  const reduceMotion = useReducedMotion()
  return (
    <span className={`reveal-text ${className}`}>
      {text.split('\n').map((line, index) => (
        <span className="reveal-text__line" key={`${line}-${index}`}>
          <motion.span
            variants={reduceMotion ? undefined : {
              hidden: { y: '105%', opacity: 0 },
              visible: { y: '0%', opacity: 1 },
            }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
