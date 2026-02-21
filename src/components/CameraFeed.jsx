import { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Card, Button, Spinner, Alert } from 'react-bootstrap'
import { motion } from 'framer-motion'

const CameraFeed = ({ onCapture }) => {
  const webcamRef = useRef(null)
  const [facingMode, setFacingMode] = useState('user')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: facingMode
  }

  const handleCapture = useCallback(() => {
    if (!webcamRef.current) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const imageSrc = webcamRef.current.getScreenshot({
        width: 720,
        height: 720
      })
      
      if (imageSrc) {
        onCapture(imageSrc)
      } else {
        setError('Failed to capture image. Please try again.')
      }
    } catch (err) {
      setError('Camera error: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }, [webcamRef, onCapture])

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const handleUserMediaError = (err) => {
    setError('Camera access denied. Please enable camera permissions.')
    console.error('Camera error:', err)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-dark text-light border-secondary shadow-lg">
        <Card.Header className="border-secondary text-center py-3">
          <h3 className="mb-0">📷 Camera Feed</h3>
        </Card.Header>
        
        <Card.Body className="d-flex flex-column align-items-center p-4">
          {error && (
            <Alert variant="danger" className="w-100 mb-3" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          <div className="position-relative mb-4" style={{ maxWidth: '500px', width: '100%' }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
              className="rounded-3 w-100 shadow"
              style={{ 
                objectFit: 'cover',
                aspectRatio: '1/1'
              }}
            />
            
            <div className="position-absolute bottom-0 start-0 end-0 text-center p-2 bg-dark bg-opacity-50 rounded-bottom">
              <small className="text-white-50">Live Preview</small>
            </div>
          </div>

          <div className="d-flex gap-3 flex-wrap justify-content-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleCapture}
              disabled={isLoading}
              className="px-4"
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Processing...
                </>
              ) : (
                '📸 Capture Photo'
              )}
            </Button>

            <Button
              variant="outline-secondary"
              size="lg"
              onClick={toggleCamera}
              disabled={isLoading}
            >
              🔄 Switch Camera
            </Button>
          </div>

          <p className="text-muted mt-3 mb-0 small">
            Make sure you're well-lit and centered in the frame
          </p>
        </Card.Body>
      </Card>
    </motion.div>
  )
}

export default CameraFeed