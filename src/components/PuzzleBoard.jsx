import { useState, useEffect, useCallback } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import PuzzlePiece from './PuzzlePiece'

const PuzzleBoard = ({ pieces, gridSize, onPiecesChange, onWin, isSolved }) => {
  const [items, setItems] = useState(pieces)
  const [activeId, setActiveId] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Sensors konfigire pou touch ak sourit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150, // Reta anvan aktive pou pa konfli ak scroll
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
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

  // Calculate grid column class based on gridSize
  const getGridColClass = () => {
    const colMap = {
      3: 'col-4',
      4: 'col-3',
      5: 'col-2'
    }
    return colMap[gridSize] || 'col-3'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
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
        
        <Card.Body className="p-4">
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
              <Row className={`g-2 ${isDragging ? 'dragging-active' : ''}`}>
                {items.map((piece) => (
                  <Col key={piece.id} className={getGridColClass()}>
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