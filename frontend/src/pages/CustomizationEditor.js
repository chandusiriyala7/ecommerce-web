import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { fabric } from 'fabric';
import { 
  FaSave, 
  FaImage, 
  FaFont, 
  FaSmile, 
  FaUndo, 
  FaRedo, 
  FaPalette, 
  FaLayerGroup, 
  FaDownload, 
  FaEye 
} from 'react-icons/fa';
 
import { SketchPicker } from 'react-color';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SummaryApi from '../common';
import { useSelector } from 'react-redux';


const CustomizationEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [textOpacity, setTextOpacity] = useState(1);
  const [neonEffect, setNeonEffect] = useState(false);
  const [metalEffect, setMetalEffect] = useState(false);
  const [threeDEffect, setThreeDEffect] = useState(false);
  const [textShadow, setTextShadow] = useState({ color: '#000000', blur: 0, offsetX: 0, offsetY: 0 });
  const [textStroke, setTextStroke] = useState({ color: '#000000', width: 0 });
  const [gradientText, setGradientText] = useState(false);
  const [productBackgrounds, setProductBackgrounds] = useState([]);
  const [productPresets, setProductPresets] = useState([]);
  const [activeBackground, setActiveBackground] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [productName, setProductName] = useState('');
  const user = useSelector(state => state?.user?.user);
  const location = useLocation();

  // List of fonts for selection
  const fontOptions = [
    'Passionate', 'Dreamy', 'Flowy', 'Original', 'Classic', 'Boujee', 'Funky', 'Chic', 
    'Delight', 'Classy', 'Romantic', 'Robo', 'Charming', 'Quirky', 'Stylish', 'Sassy', 
    'Glam', 'DOPE', 'Chemistry', 'Acoustic', 'Sparky', 'Vibey', 'LoFi', 'Bossy', 
    'ICONIC', 'Jolly', 'MODERN'
  ];

  // Map font display names to actual font families
  const fontFamilyMap = {
    'Passionate': 'Brush Script MT, cursive',
    'Dreamy': 'Papyrus, fantasy',
    'Flowy': 'Segoe Script, cursive',
    'Original': 'Comic Sans MS, cursive',
    'Classic': 'Times New Roman, serif',
    'Boujee': 'Copperplate, fantasy',
    'Funky': 'Impact, fantasy',
    'Chic': 'Didot, serif',
    'Delight': 'Lucida Handwriting, cursive',
    'Classy': 'Baskerville, serif',
    'Romantic': 'Snell Roundhand, cursive',
    'Robo': 'Courier New, monospace',
    'Charming': 'Bradley Hand, cursive',
    'Quirky': 'Chalkduster, fantasy',
    'Stylish': 'Optima, sans-serif',
    'Sassy': 'Brush Script MT, cursive',
    'Glam': 'Zapfino, cursive',
    'DOPE': 'Impact, fantasy',
    'Chemistry': 'Menlo, monospace',
    'Acoustic': 'American Typewriter, serif',
    'Sparky': 'Marker Felt, fantasy',
    'Vibey': 'Trattatello, fantasy',
    'LoFi': 'Courier, monospace',
    'Bossy': 'Verdana Bold, sans-serif',
    'ICONIC': 'Futura, sans-serif',
    'Jolly': 'Luminari, fantasy',
    'MODERN': 'Helvetica Neue, sans-serif',
    'Arial': 'Arial, sans-serif'
  };

  // Predefined acrylic font colors
  const acrylicFontColors = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Green', value: '#008000' },
  ];

  // Initialize Fabric.js canvas
  const initializeCanvas = () => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 600,
      backgroundColor: '#ffffff',
    });
    setCanvas(canvas);
    if (activeBackground) {
      fabric.Image.fromURL(activeBackground, (img) => {
      img.scaleToWidth(600);
      img.scaleToHeight(600);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        setIsCanvasReady(true);
    });
    } else {
      setIsCanvasReady(true);
    }
    saveState();
  };

  // Save canvas state to history
  const saveState = () => {
    if (canvas) {
      const json = canvas.toJSON();
      setHistory((prevHistory) => [...prevHistory, json]);
      setFuture([]); // Clear future states when a new state is saved
    }
  };

  // Undo last action
  const undo = () => {
    if (history.length > 1) {
      const previousState = history[history.length - 2];
      setFuture((prevFuture) => [...prevFuture, history[history.length - 1]]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
        canvas.off('object:modified'); // Prevent saving state during undo
        canvas.off('object:added');
        canvas.off('object:removed');
      });
    }
  };

  // Redo last undone action
  const redo = () => {
    if (future.length > 0) {
      const nextState = future[future.length - 1];
      setHistory((prevHistory) => [...prevHistory, nextState]);
      setFuture((prevFuture) => prevFuture.slice(0, -1));
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
        canvas.off('object:modified'); // Prevent saving state during redo
        canvas.off('object:added');
        canvas.off('object:removed');
      });
    }
  };

  // Add text to canvas
  const addText = () => {
    const text = new fabric.Textbox('Your Text', {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: textColor,
      fontFamily: fontFamilyMap[selectedFont] || 'Arial',
      opacity: textOpacity,
      shadow: neonEffect ? new fabric.Shadow({
        color: textColor,
        blur: 10,
        offsetX: 0,
        offsetY: 0,
      }) : null,
      stroke: textStroke.color,
      strokeWidth: textStroke.width,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    saveState(); // Save state after adding text
  };

  // Change background image
  const changeBackgroundImage = (imageURL) => {
    fabric.Image.fromURL(imageURL, (img) => {
      img.scaleToWidth(600);
      img.scaleToHeight(600);
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      saveState(); // Save state after changing background image
    });
  };

  // Change background color
  const changeBackgroundColor = (color) => {
    canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
    setBackgroundColor(color);
    saveState(); // Save state after changing background color
  };

  // Upload custom image as background
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        img.scaleToWidth(600);
        img.scaleToHeight(600);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        saveState(); // Save state after uploading background image
      });
    };
    reader.readAsDataURL(file);
  };

  // Change font for active text object
  const changeTextFont = (fontName) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('fontFamily', fontFamilyMap[fontName] || 'Arial');
      canvas.renderAll();
      saveState();
    }
    setSelectedFont(fontName);
  };

  // Change text color for active text object
  const changeTextColor = (color) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('fill', color);
      if (neonEffect) {
        activeObject.set('shadow', new fabric.Shadow({
          color: color,
          blur: 10,
          offsetX: 0,
          offsetY: 0,
        }));
      }
      canvas.renderAll();
      saveState();
    }
    setTextColor(color);
  };

  // Change text opacity for active text object
  const changeTextOpacity = (opacity) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('opacity', opacity);
      canvas.renderAll();
      saveState();
    }
    setTextOpacity(opacity);
  };

  // Toggle neon effect for active text object
  const toggleNeonEffect = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      if (neonEffect) {
        activeObject.set('shadow', null);
      } else {
        activeObject.set('shadow', new fabric.Shadow({
          color: textColor,
          blur: 10,
          offsetX: 0,
          offsetY: 0,
        }));
      }
      canvas.renderAll();
      saveState();
    }
    setNeonEffect(!neonEffect);
  };

  // Toggle metal effect for active text object
  const toggleMetalEffect = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      if (metalEffect) {
        activeObject.set('fill', textColor);
      } else {
        activeObject.set('fill', new fabric.Pattern({
          source: 'https://i.imgur.com/7Qc7y9y.png', // Metal texture image
          repeat: 'repeat',
        }));
      }
      canvas.renderAll();
      saveState();
    }
    setMetalEffect(!metalEffect);
  };

  // Toggle 3D effect for active text object
  const toggleThreeDEffect = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      if (threeDEffect) {
        activeObject.set('shadow', null);
      } else {
        activeObject.set('shadow', new fabric.Shadow({
          color: '#000000',
          blur: 10,
          offsetX: 5,
          offsetY: 5,
        }));
      }
      canvas.renderAll();
      saveState();
    }
    setThreeDEffect(!threeDEffect);
  };

  // Change text shadow for active text object
  const changeTextShadow = (shadow) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('shadow', new fabric.Shadow({
        color: shadow.color,
        blur: shadow.blur,
        offsetX: shadow.offsetX,
        offsetY: shadow.offsetY,
      }));
      canvas.renderAll();
      saveState();
    }
    setTextShadow(shadow);
  };

  // Change text stroke for active text object
  const changeTextStroke = (stroke) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      activeObject.set('stroke', stroke.color);
      activeObject.set('strokeWidth', stroke.width);
      canvas.renderAll();
      saveState();
    }
    setTextStroke(stroke);
  };

  // Toggle gradient text for active text object
  const toggleGradientText = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      if (gradientText) {
        activeObject.set('fill', textColor);
      } else {
        activeObject.set('fill', new fabric.Gradient({
          type: 'linear',
          coords: { x1: 0, y1: 0, x2: activeObject.width, y2: 0 },
          colorStops: [
            { offset: 0, color: textColor },
            { offset: 1, color: '#ffffff' },
          ],
        }));
      }
      canvas.renderAll();
      saveState();
    }
    setGradientText(!gradientText);
  };

  // Save customized image
  const saveCustomization = async () => {
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
    // Save to backend
    const token = localStorage.getItem('authToken');
    if (!token || !user?._id) {
      toast.error('User not logged in');
      return;
    }
    const response = await fetch(SummaryApi.saveCustomizedProduct.url, {
      method: SummaryApi.saveCustomizedProduct.method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: params.id,
        userId: user._id,
        image: dataURL,
      }),
    });
    const result = await response.json();
    if (result.success) {
    toast.success('Customization saved!');
      navigate(`/product/${params.id}`);
    } else {
      toast.error(result.message || 'Failed to save customization');
    }
  };

  // Initialize canvas on component mount
  useEffect(() => {
    initializeCanvas();
  }, []);

  // Listen for canvas changes to save state
  useEffect(() => {
    if (canvas) {
      canvas.on('object:modified', saveState);
      canvas.on('object:added', saveState);
      canvas.on('object:removed', saveState);
    }
  }, [canvas]);

  // Apply category-specific effects
  useEffect(() => {
    if (params.category === 'neon-lights') {
      setNeonEffect(true);
    } else if (params.category === 'metal-letters') {
      setMetalEffect(true);
    } else if (params.category === 'nameplates') {
      setThreeDEffect(true);
    }
  }, [params.category]);

  // Fetch product backgrounds and presets on mount
  useEffect(() => {
    // If product details are passed via location.state, use them
    if (location.state && location.state.product) {
      const prod = location.state.product;
      setProductName(prod.productName || '');
      setProductImages(prod.productImage || []);
      setProductBackgrounds(prod.backgrounds || prod.productImage || []);
      setProductPresets(prod.presets || prod.productImage || []);
      if ((prod.backgrounds && prod.backgrounds[0]) || (prod.productImage && prod.productImage[0])) {
        setActiveBackground((prod.backgrounds && prod.backgrounds[0]) || prod.productImage[0]);
      }
      // Optionally, skip API fetch if all details are present
      return;
    }
    async function fetchProductData() {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: params.id }),
      });
      const data = await response.json();
      setProductName(data?.data?.productName || '');
      let bgs = data?.data?.backgrounds;
      let presets = data?.data?.presets;
      let imgs = data?.data?.productImage || [];
      setProductImages(imgs);
      if ((!bgs || bgs.length === 0) && imgs.length > 0) {
        bgs = imgs;
      }
      if ((!presets || presets.length === 0) && imgs.length > 0) {
        presets = imgs;
      }
      setProductBackgrounds(bgs || []);
      setProductPresets(presets || []);
      if (bgs && bgs[0]) setActiveBackground(bgs[0]);
      // Debug logs
      console.log('DEBUG backgrounds:', bgs);
      console.log('DEBUG presets:', presets);
      console.log('DEBUG productImages:', imgs);
    }
    fetchProductData();
  }, [params.id, location.state]);

  // Add handler to change background
  const handleSelectBackground = (bgUrl) => {
    setActiveBackground(bgUrl);
    if (canvas) {
      fabric.Image.fromURL(bgUrl, (img) => {
        img.scaleToWidth(600);
        img.scaleToHeight(600);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
        saveState();
      });
    }
  };

  // Add handler to add preset/logo to canvas
  const handleAddPreset = (presetUrl) => {
    if (canvas) {
      fabric.Image.fromURL(presetUrl, (img) => {
        img.scaleToWidth(100);
        img.scaleToHeight(100);
        img.set({ left: 250, top: 250 });
        canvas.add(img);
        saveState();
      });
    }
  };

  // Replace color picker with dropdown for acrylic font colors
  const changeTextColorDropdown = (color) => {
    changeTextColor(color);
  };

  const downloadCustomization = () => {
    if (!canvas) {
      console.error('Canvas is not initialized.');
      return;
    }

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `customized-image-${params.id}.png`;
    link.click();
  };

  // Preview customization in a new tab
  const previewCustomization = () => {
    if (!canvas) {
      console.error('Canvas is not initialized.');
      return;
    }

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });

    const newTab = window.open();
    newTab.document.write(`<img src="${dataURL}" alt="Customized Image" style="max-width: 100%; height: auto;" />`);
  };

  // Download small-resolution customization
  const downloadSmallCustomization = () => {
    if (!canvas) {
      console.error('Canvas is not initialized.');
      return;
    }

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 0.5, // Lower quality for smaller file size
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `customized-image-small-${params.id}.png`;
    link.click();
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white'>
      <ToastContainer />
      <div className='container mx-auto p-8'>
      <div className='flex items-center justify-between w-full mb-8'>
        {/* Product Name (Top Left, highlighted) */}
        <div className='flex items-center gap-4'>
          <h1 className='text-2xl font-bold text-pink-600 bg-yellow-100 px-4 py-1 rounded shadow'>{productName || 'Product'}</h1>
        </div>
        {/* Save Button (Right Aligned) */}
      <button
        className='px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
        onClick={saveCustomization}
        disabled={!isCanvasReady}
      >
        <FaSave size={18} /> Save
      </button>
    </div>
        <div className='flex flex-col lg:flex-row gap-8 justify-center'>
          {/* Left Panel - Tools */}
          <div className='w-full lg:w-64 flex flex-col gap-4'>
            <div className='bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700'>
              <h2 className='text-xl font-semibold mb-4 text-purple-300'>Design Tools</h2>
              <div className='flex flex-col gap-3'>
                <button
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    activeTool === 'text' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    addText();
                    setActiveTool('text');
                  }}
                >
                  <FaFont /> Add Text
                </button>
                <div>
                  <h3 className='text-sm font-medium mb-2 text-gray-300'>Pick Your Font</h3>
                  <select 
                    className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={selectedFont}
                    onChange={(e) => changeTextFont(e.target.value)}
                  >
                    {fontOptions.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <h3 className='text-sm font-medium mb-2 text-gray-300'>Font Color</h3>
                  <select
                    className='w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    value={textColor}
                    onChange={(e) => changeTextColorDropdown(e.target.value)}
                  >
                    {acrylicFontColors.map((color) => (
                      <option key={color.value} value={color.value}>{color.name}</option>
                    ))}
                  </select>
                </div>
                {/* Pick and Place Presets/Logos */}
                <div>
                  <h3 className='text-sm font-medium mb-2 text-gray-300'>Pick & Place Logos/Decoratives</h3>
                  <div className='flex flex-wrap gap-2'>
                    {productPresets.length === 0 && productImages.length > 0 && productImages.map((img) => (
                      <img
                        key={img}
                        src={img}
                        alt='preset-fallback'
                        className='w-12 h-12 rounded border cursor-pointer hover:scale-110 transition-transform'
                        onClick={() => handleAddPreset(img)}
                      />
                    ))}
                    {productPresets.length === 0 && productImages.length === 0 && (
                      <span className='text-xs text-gray-400'>No logos or decoratives uploaded for this product.</span>
                    )}
                    {productPresets.map((preset) => (
                      <img
                        key={preset}
                        src={preset}
                        alt='preset'
                        className='w-12 h-12 rounded border cursor-pointer hover:scale-110 transition-transform'
                        onClick={() => handleAddPreset(preset)}
                      />
                    ))}
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Canvas */}
          <div className='flex-1 flex justify-center'>
            <div className='relative'>
              <div className='bg-white p-2 rounded-xl shadow-2xl'>
                <canvas ref={canvasRef}></canvas>
              </div>
              <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full px-6 py-2 flex gap-4 shadow-lg border border-gray-700'>
                <button
                  className='text-gray-300 hover:text-white transition-colors'
                  onClick={undo}
                  disabled={history.length <= 1}
                  title="Undo"
                >
                  <FaUndo size={18} className={history.length <= 1 ? 'opacity-50' : ''} />
                </button>
                <button
                  className='text-gray-300 hover:text-white transition-colors'
                  onClick={redo}
                  disabled={future.length === 0}
                  title="Redo"
                >
                  <FaRedo size={18} className={future.length === 0 ? 'opacity-50' : ''} /> 
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Backgrounds */}
          <div className='w-full lg:w-64 flex flex-col gap-4'>
            <div className='bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700'>
              <h2 className='text-xl font-semibold mb-4 text-purple-300'>Backgrounds</h2>
              <div className='flex flex-wrap gap-2 mb-4'>
                {productBackgrounds.length === 0 && productImages.length > 0 && productImages.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt='background-fallback'
                    className={`w-16 h-16 rounded border cursor-pointer ${activeBackground === img ? 'ring-4 ring-accent' : ''}`}
                    onClick={() => handleSelectBackground(img)}
                  />
                ))}
                {productBackgrounds.length === 0 && productImages.length === 0 && (
                  <span className='text-xs text-gray-400'>No backgrounds uploaded for this product.</span>
                )}
                {productBackgrounds.map((bg) => (
                  <img
                    key={bg}
                    src={bg}
                    alt='background'
                    className={`w-16 h-16 rounded border cursor-pointer ${activeBackground === bg ? 'ring-4 ring-accent' : ''}`}
                    onClick={() => handleSelectBackground(bg)}
                  />
                ))}
              </div>
            </div>
            <div>
                  <h3 className='text-sm font-medium mb-2 text-gray-300'>Text Opacity</h3>
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.1'
                    value={textOpacity}
                    onChange={(e) => changeTextOpacity(parseFloat(e.target.value))}
                    className='w-full'
                  />
                </div>

                <button
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    neonEffect 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={toggleNeonEffect}
                >
                  <FaSmile /> Neon Effect
                </button>

                <button
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    metalEffect 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={toggleMetalEffect}
                >
                  <FaSmile /> Metal Effect
                </button>

                <button
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    threeDEffect 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={toggleThreeDEffect}
                >
                  <FaSmile /> 3D Effect
                </button>

                <button
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    gradientText 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={toggleGradientText}
                >
                  <FaSmile /> Gradient Text
                </button>

                <button
              className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={previewCustomization}
              disabled={!isCanvasReady}
            >
              <FaEye size={18} /> Preview
            </button>

            <button
              className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold shadow-lg hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={downloadCustomization}
              disabled={!isCanvasReady}
            >
              <FaDownload size={18} /> Download 
            </button>

            {/*<button
              className='flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold shadow-lg hover:from-yellow-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              onClick={downloadSmallCustomization}
              disabled={!isCanvasReady}
            >
              <FaDownload size={18} /> Download Small
            </button> */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationEditor;