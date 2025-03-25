import { FlightTracker } from "./components/FlightTracker";
import { AnimationProvider } from "./contexts/AnimationContext";
export function App() {
  return (
    <AnimationProvider>
      <div className="min-h-screen bg-white dark:bg-gray-800">
        <FlightTracker />
      </div>
    </AnimationProvider>
  );
}
