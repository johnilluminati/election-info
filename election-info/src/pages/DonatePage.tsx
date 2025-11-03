import { FaTools } from "react-icons/fa"

const DonatePage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center px-4 max-w-md">
        <div className="mb-6 flex justify-center">
          <FaTools className="text-6xl text-yellow-500 dark:text-yellow-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page Under Construction
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          We're working hard to build this page for you!
        </p>
      </div>
    </div>
  )
}

export default DonatePage