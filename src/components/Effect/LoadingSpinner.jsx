// src/components/Effect/LoadingSpinner.jsx
import { ClipLoader } from "react-spinners";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <ClipLoader
        color="#4CAF50"
        size={200} 
        speedMultiplier={0.8} 
        cssOverride={{
          borderWidth: "8px",
        }}
      />
    </div>
  );
}
