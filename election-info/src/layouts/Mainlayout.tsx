import { Outlet } from "react-router-dom"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"

const Mainlayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <div className="container mx-auto mt-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Mainlayout