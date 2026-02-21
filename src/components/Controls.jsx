import { Card, Button, ButtonGroup, Badge } from 'react-bootstrap'
import { motion } from 'framer-motion'

const Controls = ({ 
  timer, 
  onShuffle, 
  onReset, 
  onGridSizeChange, 
  currentGridSize, 
  isSolved 
}) => {
  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4"
    >
      <Card className="bg-dark text-light border-secondary shadow">
        <Card.Body className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <Badge bg="info" className="p-3">
              <span className="h5 mb-0">⏱️ {formatTime(timer)}</span>
            </Badge>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted">Grid:</span>
              <ButtonGroup size="sm">
                {[3, 4, 5].map(size => (
                  <Button
                    key={size}
                    variant={currentGridSize === size ? 'primary' : 'outline-secondary'}
                    onClick={() => onGridSizeChange(size)}
                    disabled={isSolved}
                  >
                    {size}x{size}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="warning"
              onClick={onShuffle}
              disabled={isSolved}
              className="px-4"
            >
              🔀 Shuffle
            </Button>

            <Button
              variant="danger"
              onClick={onReset}
              className="px-4"
            >
              📸 New Photo
            </Button>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  )
}

export default Controls