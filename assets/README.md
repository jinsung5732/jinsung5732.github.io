
# 3D Model and Asset Instructions

To add your own 3D model (e.g., a `.glb` or `.gltf` file) to this simulator:

1.  **Place the file**
    Copy your 3D model file into the `assets` folder.
    Example: `assets/my-plane.glb`

2.  **Update `airplane.js`**
    Open `airplane.js` and uncomment the loading code in the `loadModel()` function.
    
    Change:
    ```javascript
    loader.load('./assets/plane.glb', ...
    ```
    To:
    ```javascript
    loader.load('./assets/my-plane.glb', ...
    ```

3.  **Correct Orientation**
    You may need to adjust `model.scale` or `model.rotation` inside the callback to make your plane face the correct direction (usually negative Z is forward in WebGL/Game engines, but check the model).

4.  **Deployment**
    Since we use relative paths (`./assets/...`), this will work automatically on GitHub Pages.
