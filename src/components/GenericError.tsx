import { BiErrorCircle } from "react-icons/bi";

interface ErrorProps {
  /** The error object */
  error: Error;
}

export const GenericError = ({ error }: ErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200 min-h-[600px]">
      <div className="text-red-400 mb-6">
        <BiErrorCircle className="h-24 w-24" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
        Error Loading Characters
      </h3>
      <p className="text-gray-600 text-center max-w-md text-lg mb-6">
        {error.message}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};
