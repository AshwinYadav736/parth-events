import { images } from "../assets/resource";
import "./MainLayout.css";

export default function MainLayout({ children }) {
  return (
    <div
      className="main-bg"
      style={{
        backgroundImage: `url(${images.partyBackground})`,
      }}
    >
      {children}
    </div>
  );
}
