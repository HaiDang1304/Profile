/**
 * Factory generator for external image sprites.
 * Loads an image from a URL and draws it onto the cached canvas.
 */
export function createExternalImageSpriteFactory(url, srcWidth, srcHeight) {
  return function (createBuffer) {
    const canvas = createBuffer(srcWidth, srcHeight);
    const ctx = canvas.getContext('2d');
    
    // Transparent placeholder while loading
    ctx.clearRect(0, 0, srcWidth, srcHeight);
    
    if (typeof Image !== 'undefined') {
      const img = new Image();
      // Required if loading from external domains like pixilart.com
      img.crossOrigin = 'anonymous'; 
      img.onload = () => {
        ctx.clearRect(0, 0, srcWidth, srcHeight);
        ctx.drawImage(img, 0, 0, srcWidth, srcHeight);
      };
      img.src = url;
    }
    
    return canvas;
  };
}
