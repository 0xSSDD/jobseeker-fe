export default function Footer() {
  return (
    <footer className="bg-white mt-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <a href="#" className="text-[#86888A] hover:text-[#333333]">
              About
            </a>
            <a href="#" className="text-[#86888A] hover:text-[#333333]">
              Accessibility
            </a>
            <a href="#" className="text-[#86888A] hover:text-[#333333]">
              Help Center
            </a>
            <a href="#" className="text-[#86888A] hover:text-[#333333]">
              Privacy & Terms
            </a>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-[#86888A] text-center md:text-right text-sm">
              &copy; {new Date().getFullYear()} LinkedIn MCP. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
