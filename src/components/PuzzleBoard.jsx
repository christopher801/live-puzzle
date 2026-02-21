import { useState, useEffect, useCallback } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import PuzzlePiece from './PuzzlePiece'

const PuzzleBoard = ({ pieces, gridSize, onPiecesChange, onWin, isSolved }) => {
  const [items, setItems] = useState(pieces)
  const [activeId, setActiveId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [containerWidth, setContainerWidth] = useState('100%')

  // Sensors konfigire espesyalman pou touch
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
        touchActivation: 'onTouchStart',
      },
    })
  )

  useEffect(() => {
    setItems(pieces)
  }, [pieces])

  // Tcheke si puzzle a rezoud
  useEffect(() => {
    if (items.length > 0 && !isSolved) {
      const isPuzzleSolved = items.every(
        (piece, index) => piece.correctIndex === index
      )
      
      if (isPuzzleSolved) {
        onWin()
      }
    }
  }, [items, onWin, isSolved])

  // Calculate grid column class based on gridSize
  const getGridColClass = () => {
    // Nou itilize sistèm 12 kolòn Bootstrap
    switch(gridSize) {
      case 3:
        return 'col-4' // 12/3 = 4, 3 kolòn
      case 4:
        return 'col-3' // 12/4 = 3, 4 kolòn
      case 5:
        return 'col-2 col-5th' // 12/5 = 2.4, bezwen CSS espesyal
      default:
        return 'col-3'
    }
  }

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id)
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    setActiveId(null)
    setIsDragging(false)

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id)
        const newIndex = currentItems.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(currentItems, oldIndex, newIndex)
        onPiecesChange(newItems)
        return newItems
      })
    }
  }, [onPiecesChange])

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
    setIsDragging(false)
  }, [])

  // Jwenn moso aktif la pou overlay
  const activePiece = items.find(item => item.id === activeId)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <Card className={`bg-dark text-light border-secondary shadow-lg ${isSolved ? 'border-success' : ''}`}>
        <Card.Header className={`border-secondary text-center py-3 ${isSolved ? 'bg-success bg-opacity-25' : ''}`}>
          <h3 className="mb-0">
            {isSolved ? '🎉 Puzzle Solved! 🎉' : '🧩 Puzzle Board'}
          </h3>
          {isSolved && (
            <small className="text-success mt-2 d-block">
              Congratulations! You completed the puzzle!
            </small>
          )}
        </Card.Header>
        
        <Card.Body className="p-3 p-md-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={items.map(item => item.id)}
              strategy={rectSortingStrategy}
            >
              <Row className="g-2 puzzle-grid">
                {items.map((piece) => (
                  <Col 
                    key={piece.id} 
                    className={`${getGridColClass()} d-flex`}
                    style={{ minHeight: '80px' }}
                  >
                    <PuzzlePiece
                      piece={piece}
                      isActive={activeId === piece.id}
                      isDragging={isDragging}
                      isSolved={isSolved}
                    />
                  </Col>
                ))}
              </Row>
            </SortableContext>
            
            {/* DragOverlay pou montre moso pandan w ap trennen */}
            <DragOverlay>
              {activeId && activePiece ? (
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  opacity: 0.8,
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}>
                  <PuzzlePiece
                    piece={activePiece}
                    isActive={true}
                    isDragging={true}
                    isSolved={false}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </Card.Body>

        <Card.Footer className="border-secondary text-center py-2">
          <small className="text-muted">
            Drag and drop pieces to rearrange • {gridSize}x{gridSize} grid
          </small>
        </Card.Footer>
      </Card>
    </motion.div>
  )
}

export default PuzzleBoard