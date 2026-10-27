import { motion } from 'framer-motion'

type Props = { eyebrow: string; title: string; description?: string; light?: boolean }

export function SectionHeading({ eyebrow, title, description, light = false }: Props) {
  return (
    <motion.div
      className={`section-heading ${light ? 'section-heading--light' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.65 }}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </motion.div>
  )
}
