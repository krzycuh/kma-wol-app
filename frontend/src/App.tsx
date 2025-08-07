import './App.css'
import Button from '@mui/material/Button';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-3xl font-bold mb-8 text-purple-800">Vite + React + MUI + Tailwind</h1>
      <Button variant="contained" color="primary" className="shadow-lg">
        Przycisk MUI z Tailwind
      </Button>
      <p className="mt-8 text-gray-600">To jest przykładowy komponent korzystający z obu bibliotek.</p>
    </div>
  );
}

export default App;
