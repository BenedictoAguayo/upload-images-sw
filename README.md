# README

To access the server folder and execute the command or install nodemon, follow these steps:

1. Open a terminal and navigate to the server folder:
```bash
cd server
```

2. If you have Node.js v22.0.0 or higher installed, you can use the following command to run the index.js file and have it automatically update when you make changes:
```bash
node --watch index.js
```

If you don't have Node.js v22.0.0 or higher, you can install nodemon globally by running the following command:
```bash
npm install -g nodemon
```

Then, you can use nodemon to run the index.js file:
```bash
nodemon index.js
```

To install the dependencies for both the server and client folders, which are built with Node.js and React with Vite respectively, follow these steps:

1. Open a terminal and navigate to the server folder:
```bash
cd server
```

2. Install the dependencies using pnpm:
```bash
pnpm install
```

3. Open another terminal and navigate to the client folder:
```bash
cd client
```

4. Install the dependencies using pnpm:
```bash
pnpm install
```

Remember to replace `pnpm` with `npm` if you are using npm instead of pnpm.
-+-+-+-+-