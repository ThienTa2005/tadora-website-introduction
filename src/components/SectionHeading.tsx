import { motion, useReducedMotion } from 'framer-motion'
import { RevealText } from './RevealText'

type Props = { eyebrow: string; title: string; description?: string; light?: boolean }

export function SectionHeading({ eyebrow, title, description, light = false }: Props) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={`section-heading ${light ? 'section-heading--light' : ''}`}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.65 }}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2><RevealText text={title} /></h2>
      {description && <p>{description}</p>}
    </motion.div>
  )
}
