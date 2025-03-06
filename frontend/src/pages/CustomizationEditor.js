import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fabric } from 'fabric';
import { FaSave, FaImage, FaFont, FaSmile } from 'react-icons/fa';

const CustomizationEditor = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Initialize Fabric.js canvas
  const initializeCanvas = () => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 500,
      backgroundColor: '#ffffff',
    });
    setCanvas(canvas);

    // Load initial product image as background
    fabric.Image.fromURL('https://via.placeholder.com/500', (img) => {
      img.scaleToWidth(500);
      img.scaleToHeight(500);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      setIsCanvasReady(true); // Mark canvas as ready
    });
  };

  // Add text to canvas
  const addText = () => {
    const text = new fabric.Textbox('Your Text', {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: '#000000',
      fontFamily: 'Arial',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  // Add sticker to canvas
  const addSticker = (stickerURL) => {
    fabric.Image.fromURL(stickerURL, (img) => {
      img.scaleToWidth(50);
      img.scaleToHeight(50);
      canvas.add(img);
    });
  };

  // Change background color
  const changeBackgroundColor = (color) => {
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
  };

  // Upload custom image as background
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.scaleToWidth(500);
        img.scaleToHeight(500);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    };
    reader.readAsDataURL(file);
  };

  // Save customized image
  const saveCustomization = () => {
    if (!canvas) {
      console.error('Canvas is not initialized.');
      return;
    }

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });

    if (!dataURL) {
      console.error('Failed to generate data URL.');
      return;
    }

    localStorage.setItem(`customizedImage_${productId}`, dataURL);
    alert('Customization saved!');
    navigate(`/product/${productId}`);
  };

  // Initialize canvas on component mount
  useEffect(() => {
    initializeCanvas();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Customize Your Product</h1>
      <div className='flex gap-4'>
        <div>
          <canvas ref={canvasRef} className='border-2 border-gray-300'></canvas>
        </div>
        <div className='flex flex-col gap-2'>
          <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded' onClick={addText}>
            <FaFont /> Add Text
          </button>
          <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded' onClick={() => addSticker('https://via.placeholder.com/50')}>
            <FaSmile /> Add Sticker
          </button>
          <input type='color' onChange={(e) => changeBackgroundColor(e.target.value)} className='w-full' />
          <label className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded cursor-pointer'>
            <FaImage /> Upload Background
            <input type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
          </label>
          <button
            className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50'
            onClick={saveCustomization}
            disabled={!isCanvasReady}
          >
            <FaSave /> Save Customization
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationEditor;