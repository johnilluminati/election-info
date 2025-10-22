import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Mainlayout from "./layouts/Mainlayout"
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import NotFoundPage from "./pages/NotFoundPage"
import CandidateSearchPage from "./pages/CandidateSearchPage"
import ElectionsSearchPage from "./pages/ElectionsSearchPage"
import PartyStancesPage from "./pages/PartyStancesPage"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Mainlayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/candidates" element={<CandidateSearchPage />} />
        <Route path="/elections" element={<ElectionsSearchPage />} />
        <Route path="/party-stances" element={<PartyStancesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  )
  return <RouterProvider router={router} />
}

export default App
