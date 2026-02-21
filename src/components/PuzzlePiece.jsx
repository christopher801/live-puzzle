import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from 'react-bootstrap'
import { motion } from 'framer-motion'

const PuzzlePiece = ({ piece, isActive, isDragging, isSolved }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging
  } = useSortable({ id: piece.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isSolved ? 'default' : 'grab',
    opacity: isSortableDragging ? 0.5 : 1,
    zIndex: isSortableDragging ? 1000 : 1,
    boxShadow: isActive ? '0 0 20px rgba(255,255,255,0.3)' : 'none',
    scale: isActive ? 1.05 : 1
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isSolved ? {} : listeners)}
      animate={{
        scale: isActive ? 1.05 : 1,
        boxShadow: isActive ? '0 0 20px rgba(255,255,255,0.3)' : '0 0 0 rgba(255,255,255,0)'
      }}
      transition={{ duration: 0.2 }}
      whileHover={!isSolved && !isDragging ? { scale: 1.02 } : {}}
      className="puzzle-piece"
    >
      <Card 
        className={`bg-dark border-secondary overflow-hidden ${
          isSolved ? 'border-success' : 'border-secondary'
        }`}
        style={{ aspectRatio: '1/1' }}
      >
        <div
          className="w-100 h-100"
          style={{
            backgroundImage: `url(${piece.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isSolved ? 'brightness(1.1)' : 'brightness(1)'
          }}
        />
        {isSolved && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-success bg-opacity-25">
            <span className="text-white fw-bold">✓</span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default PuzzlePiece