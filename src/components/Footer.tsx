// components/Footer.tsx

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 text-center text-sm text-gray-600 py-4 mt-10 border-t">
      <p>&copy; {new Date().getFullYear()} SA Vehicles. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
