import { motion, useReducedMotion } from 'framer-motion'

type Props = { text: string; className?: string }

export function RevealText({ text, className = '' }: Props) {
  const reduceMotion = useReducedMotion()
  return (
    <span className={`reveal-text ${className}`}>
      {text.split('\n').map((line, index) => (
        <span className="reveal-text__line" key={`${line}-${index}`}>
          <motion.span
            initial={reduceMotion ? false : { y: '105%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
