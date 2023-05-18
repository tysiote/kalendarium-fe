import { useEffect, useState } from 'react'

export const useImage = (fileName) => {
  const [image, setImage] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      const response = await import(`../../../assets/${fileName}.png`)
      setImage(response.default)
    }

    fetchImage()
  }, [fileName])

  return [image]
}
