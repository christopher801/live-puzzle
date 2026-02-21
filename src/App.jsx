import { useState, useCallback, useRef, useEffect } from 'react'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import CameraFeed from './components/CameraFeed'
import PuzzleBoard from './components/PuzzleBoard'
import Controls from './components/Controls'
import { splitImage } from './utils/splitImage'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [capturedImage, setCapturedImage] = useState(null)
  const [pieces, setPieces] = useState([])
  const [gridSize, setGridSize] = useState(3)
  const [isSolved, setIsSolved] = useState(false)
  const [timer, setTimer] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [showWinMessage, setShowWinMessage] = useState(false)
  const timerRef = useRef(null)

  // Timer logic
  useEffect(() => {
    if (gameStarted && !isSolved) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [gameStarted, isSolved])

  // Handle win condition
  useEffect(() => {
    if (isSolved && gameStarted) {
      setShowWinMessage(true)
      setTimeout(() => setShowWinMessage(false), 3000)
    }
  }, [isSolved, gameStarted])

  const handleCapture = useCallback(async (imageSrc) => {
    setCapturedImage(imageSrc)
    
    // Split image into pieces
    const puzzlePieces = await splitImage(imageSrc, gridSize)
    
    // Shuffle pieces
    const shuffledPieces = shuffleArray([...puzzlePieces])
    
    setPieces(shuffledPieces)
    setGameStarted(true)
    setIsSolved(false)
    setTimer(0)
  }, [gridSize])

  const shuffleArray = (array) => {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handlePiecesChange = useCallback((newPieces) => {
    setPieces(newPieces)
  }, [])

  const handleWin = useCallback(() => {
    setIsSolved(true)
  }, [])

  const handleShuffle = useCallback(() => {
    const shuffled = shuffleArray([...pieces])
    setPieces(shuffled)
    setIsSolved(false)
    setTimer(0)
    setGameStarted(true)
  }, [pieces])

  const handleReset = useCallback(() => {
    setCapturedImage(null)
    setPieces([])
    setGameStarted(false)
    setIsSolved(false)
    setTimer(0)
  }, [])

  const handleGridSizeChange = useCallback((newSize) => {
    setGridSize(newSize)
    if (capturedImage) {
      // Regenerate puzzle with new grid size
      splitImage(capturedImage, newSize).then(newPieces => {
        setPieces(shuffleArray([...newPieces]))
        setIsSolved(false)
        setTimer(0)
      })
    }
  }, [capturedImage])

  return (
    <Container fluid className="min-vh-100 d-flex flex-column bg-dark text-light py-4">
      <Row className="mb-4">
        <Col className="text-center">
          <h1 className="display-4 fw-bold">📸 Live Camera Puzzle</h1>
          <p className="lead">Capture your photo and solve the puzzle!</p>
        </Col>
      </Row>

      <AnimatePresence>
        {showWinMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="position-fixed top-0 start-50 translate-middle-x mt-4 z-index-3"
            style={{ zIndex: 1050 }}
          >
            <Alert variant="success" className="text-center py-3 px-5 shadow-lg">
              <h3 className="mb-0">🎉 Congratulations! You solved the puzzle! 🎉</h3>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Row className="flex-grow-1 align-items-center justify-content-center">
        <Col xs={12} lg={10} xl={8}>
          {!pieces.length ? (
            <CameraFeed onCapture={handleCapture} />
          ) : (
            <>
              <Controls
                timer={timer}
                onShuffle={handleShuffle}
                onReset={handleReset}
                onGridSizeChange={handleGridSizeChange}
                currentGridSize={gridSize}
                isSolved={isSolved}
              />
              
              <PuzzleBoard
                pieces={pieces}
                gridSize={gridSize}
                onPiecesChange={handlePiecesChange}
                onWin={handleWin}
                isSolved={isSolved}
              />
            </>
          )}
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className="text-center text-muted">
          <small>Drag and drop pieces to solve the puzzle • {gridSize}x{gridSize} grid</small>
        </Col>
      </Row>
    </Container>
  )
}

export default App