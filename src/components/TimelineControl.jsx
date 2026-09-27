import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Clock } from "lucide-react";
import { TIME_STEPS } from "../data/oceanData";

export default function TimelineControl({
  timeStepIndex,
  onSelectTimeStep
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-playback simulation loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        onSelectTimeStep((prev) => (prev + 1) % TIME_STEPS.length);
      }, 2400);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, onSelectTimeStep]);

  const currentStep = TIME_STEPS[timeStepIndex] || TIME_STEPS[0];

  const handlePrev = () => {
    onSelectTimeStep((prev) => (prev === 0 ? TIME_STEPS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    onSelectTimeStep((prev) => (prev + 1) % TIME_STEPS.length);
  };

  return (
    <div className="timeline-control-bar">
      <div className="timeline-inner">
        {/* Left: Playback Controls */}
        <div className="timeline-playback">
          <button
            className="time-ctrl-btn"
            onClick={handlePrev}
            title="Previous Prototype Time Step"
          >
            <SkipBack size={14} />
          </button>

          <button
            className={`time-ctrl-btn play-btn ${isPlaying ? "playing" : ""}`}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pause Playback" : "Play Playback Loop"}
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          </button>

          <button
            className="time-ctrl-btn"
            onClick={handleNext}
            title="Next Prototype Time Step"
          >
            <SkipForward size={14} />
          </button>
        </div>

        {/* Center: Interactive Scrubber Track & Steps */}
        <div className="timeline-track-container">
          <div className="timeline-header-row">
            <div className="timeline-title">
              <Clock size={12} className="text-cyan" />
              <span>24-HOUR PROTOTYPE TIMELINE</span>
            </div>
            <div className="timeline-active-readout">
              <span className="lead-tag">{currentStep.stepLabel}</span>
              <strong className="time-val">{currentStep.fullLabel}</strong>
            </div>
          </div>

          <div className="timeline-ticks-bar">
            {TIME_STEPS.map((step, idx) => {
              const isActive = idx === timeStepIndex;
              const isPast = idx < timeStepIndex;
              return (
                <button
                  key={step.id}
                  className={`timeline-step-btn ${isActive ? "active" : ""} ${isPast ? "passed" : ""}`}
                  onClick={() => onSelectTimeStep(idx)}
                >
                  <span className="step-pip" />
                  <span className="step-time-label">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Data Provenance Badge */}
        <div className="timeline-provenance">
          <span className="prov-tag">PROTOTYPE</span>
          <span className="prov-sub">Sample Data</span>
        </div>
      </div>
    </div>
  );
}
