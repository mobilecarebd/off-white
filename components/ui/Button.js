export default function Button({ children, onClick, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
  }

  return (
    <button
      className={`px-4 py-2 rounded-md transition-colors ${variants[variant]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
