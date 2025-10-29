import AddCity from "./components/AddCity"
import CityList from "./components/CityList"

function App() {

  return (
    <>
    <div className="min-h-screen w-full bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        ☀️ Weather Insight Dashboard
      </h1>
      <AddCity onAdded={() => window.location.reload()} />
      <CityList />
    </div>
     
    </>
  )
}



export default App
