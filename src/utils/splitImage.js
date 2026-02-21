export const splitImage = (imageSrc, gridSize = 3) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Calculate piece dimensions
      const pieceWidth = img.width / gridSize
      const pieceHeight = img.height / gridSize
      
      const pieces = []
      
      // Create each puzzle piece
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const pieceCanvas = document.createElement('canvas')
          pieceCanvas.width = pieceWidth
          pieceCanvas.height = pieceHeight
          const pieceCtx = pieceCanvas.getContext('2d')
          
          // Draw the specific portion of the image
          pieceCtx.drawImage(
            img,
            col * pieceWidth,
            row * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          )
          
          pieces.push({
            id: row * gridSize + col,
            correctIndex: row * gridSize + col,
            currentIndex: row * gridSize + col,
            image: pieceCanvas.toDataURL('image/jpeg', 0.9),
            row,
            col
          })
        }
      }
      
      resolve(pieces)
    }
    
    img.src = imageSrc
  })
}