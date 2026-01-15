# How to Deploy to GitHub Pages

Since your project is a simple static site (HTML, CSS, JS) without a build step (no Vite/Webpack bundle), deploying it to GitHub Pages is straightforward.

## Prerequisites
- A GitHub account.
- Git installed on your computer.

## Steps

1.  **Initialize Git Repository**
    Open your terminal in the project folder (`c:\Users\교육매체관-332\Desktop\260112`) and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit: Flight Simulator"
    ```

2.  **Create a Repository on GitHub**
    - Go to [GitHub.com](https://github.com/new).
    - Create a new repository (e.g., `flight-simulator`).
    - **Do not** add a README, .gitignore, or license yet (to avoid conflicts).

3.  **Push to GitHub**
    Copy the commands provided by GitHub after creating the repo. They will look like this:
    ```bash
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/flight-simulator.git
    git push -u origin main
    ```
    *(Replace `YOUR_USERNAME` and the URL with your actual repository URL)*

4.  **Configure GitHub Pages**
    - Go to your repository **Settings** on GitHub.
    - Click **Pages** in the left sidebar.
    - Under **Source**, select **Deploy from a branch**.
    - under **Branch**, select `main` and folder `/(root)`.
    - Click **Save**.

5.  **Access Your Site**
    - Wait a minute or two.
    - Refresh the Pages settings page. You will see your live URL (usually `https://YOUR_USERNAME.github.io/flight-simulator/`).

## Note on 3D Models & Assets
If you add external 3D models or large assets later, ensure the paths are relative (e.g., `./assets/model.glb`) so they load correctly on the live site.
