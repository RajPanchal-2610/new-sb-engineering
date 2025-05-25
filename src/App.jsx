import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

// function App() {
//   return (
//     <div>
//       <h1>Welcome to New SB Engineering Fabrication Workshop</h1>
//       <p>We make house grills, gates, and swings with quality and precision.</p>
//     </div>
//   );
// }

// export default App;

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">
        Welcome to New SB Engineering Fabrication Workshop
      </h1>
      <p className="text-lg text-red-500 max-w-xl text-center">
        We make house grills, gates, and swings with quality and precision.
      </p>
    </div>
  );
}

export default App;



