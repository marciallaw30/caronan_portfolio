/**
 * ARDUINO: SOIL MOISTURE SENSOR FOR PLANTS MODIFIED W/ SPEAKER
 * Lead: Marcial Lawrence Jr V. Caronan | Datamex College of Saint Adeline
 * Virtual Hardware Simulator, Web Audio Synthesizer, & Telemetry Engine
 */

// Web Audio API Synthesizer Context
let audioCtx = null;
let isAudioMuted = false;
let audioInitialized = false;

// Hardware Constants matching C++ Firmware
const GREEN_LED_PIN = 1;
const RED_LED_PIN = 3;
const SPEAKER_PIN = 5;
const MAX_ANALOG_READ = 1023;

// State Variables
let currentMoisturePercent = 65;
let lastToneTime = 0;
let toneCooldownTimer = null;

// Initialize Audio Context on first user interaction
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  audioInitialized = true;
}

// Generate square wave tone matching Arduino tone() function
function playArduinoTone(freq, durationMs) {
  if (isAudioMuted) return;
  initAudio();
  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Arduino tone() generates a 50% duty cycle square wave
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Smooth envelope to prevent harsh DC pop
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.01);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime + (durationMs / 1000) - 0.02);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + (durationMs / 1000));
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

// Emulate setup() startup sound (5000Hz -> delay(200) -> 6000Hz)
function playStartupSound() {
  if (isAudioMuted) return;
  initAudio();
  playArduinoTone(5000, 500);
  setTimeout(() => {
    playArduinoTone(6000, 500);
  }, 700);
}

// Append line to virtual Serial Monitor
function logSerial(message, type = 'normal') {
  const serialBody = document.getElementById('serialBody');
  if (!serialBody) return;

  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  
  const line = document.createElement('div');
  line.className = 'serial-line ' + (type === 'alert' ? 'alert-line' : '');
  line.innerHTML = `<span class="ts">[${timeStr}]</span> ${message}`;

  serialBody.appendChild(line);

  // Keep last 60 lines max
  while (serialBody.childNodes.length > 60) {
    serialBody.removeChild(serialBody.firstChild);
  }

  serialBody.scrollTop = serialBody.scrollHeight;
}

// Main logic emulation matching C++ moistureDetection()
function updateHardwareState(percent, triggerAudio = true) {
  currentMoisturePercent = Math.max(0, Math.min(100, percent));
  const moistureRatio = currentMoisturePercent / 100;
  const rawAnalog = Math.round(moistureRatio * MAX_ANALOG_READ);

  // Update UI Elements
  const slider = document.getElementById('moistureSlider');
  const readout = document.getElementById('moistureReadout');
  const redLed = document.getElementById('redLedBulb');
  const greenLed = document.getElementById('greenLedBulb');
  const speakerCone = document.getElementById('speakerCone');
  const speakerStatus = document.getElementById('speakerStatus');
  const plantStatus = document.getElementById('plantStatus');
  const plantSubtext = document.getElementById('plantSubtext');
  const plantSvg = document.getElementById('plantSvg');

  if (slider && slider.value != currentMoisturePercent) {
    slider.value = currentMoisturePercent;
  }
  if (readout) {
    readout.textContent = `${currentMoisturePercent}% (ADC: ${rawAnalog})`;
  }

  // Logic 1: <= 10% -> Critical Dryness, Red LED ON, 1000Hz Tone ("I'm Thirsty")
  if (moistureRatio <= 0.1) {
    if (greenLed) greenLed.classList.remove('active');
    if (redLed) redLed.classList.add('active');

    if (speakerCone) {
      speakerCone.className = 'speaker-cone active';
      speakerCone.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
    }
    if (speakerStatus) {
      speakerStatus.innerHTML = '<span class="text-red fw-bold">ALERT: 1000Hz ("I\'m thirsty!")</span>';
    }

    if (plantStatus) {
      plantStatus.textContent = 'Wilting & Severely Dehydrated';
      plantStatus.className = 'plant-status-text text-red';
    }
    if (plantSubtext) {
      plantSubtext.textContent = 'Soil moisture ≤ 10%. Immediate irrigation required!';
    }
    if (plantSvg) {
      plantSvg.innerHTML = getPlantSvg('dry');
    }

    if (triggerAudio) {
      const now = Date.now();
      if (now - lastToneTime > 1800) {
        lastToneTime = now;
        playArduinoTone(1000, 500);
      }
    }

    logSerial(`[A0: ${rawAnalog}] moistureRatio: ${(moistureRatio).toFixed(2)} &lt;= 0.10 -> RED LED ON | TONE: 1000Hz (I'm thirsty!)`, 'alert');
  } 
  // Logic 2: 10% < moistureRatio <= 30% -> Red LED ON, Speaker Silent (noTone)
  else if (moistureRatio <= 0.3 && moistureRatio > 0.1) {
    if (greenLed) greenLed.classList.remove('active');
    if (redLed) redLed.classList.add('active');

    if (speakerCone) {
      speakerCone.className = 'speaker-cone';
      speakerCone.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
    }
    if (speakerStatus) {
      speakerStatus.innerHTML = '<span class="text-amber">Silent (noTone) • Approaching dry threshold</span>';
    }

    if (plantStatus) {
      plantStatus.textContent = 'Soil Moisture Depleting';
      plantStatus.className = 'plant-status-text text-amber';
    }
    if (plantSubtext) {
      plantSubtext.textContent = 'Moisture 10% - 30%. Red LED active; watering recommended soon.';
    }
    if (plantSvg) {
      plantSvg.innerHTML = getPlantSvg('moderate');
    }

    logSerial(`[A0: ${rawAnalog}] moistureRatio: ${(moistureRatio).toFixed(2)} (10%-30%) -> RED LED ON | noTone()`);
  } 
  // Logic 3: > 30% -> Adequate Moisture, Green LED ON, 1500Hz Confirmation Tone ("I'm Full")
  else {
    if (greenLed) greenLed.classList.add('active');
    if (redLed) redLed.classList.remove('active');

    if (speakerCone) {
      speakerCone.className = 'speaker-cone chime';
      speakerCone.innerHTML = '<i class="bi bi-bell-fill"></i>';
    }
    if (speakerStatus) {
      speakerStatus.innerHTML = '<span class="text-green fw-bold">1500Hz Chime ("I\'m full!")</span>';
    }

    if (plantStatus) {
      plantStatus.textContent = 'Optimal Plant Hydration';
      plantStatus.className = 'plant-status-text text-green';
    }
    if (plantSubtext) {
      plantSubtext.textContent = 'Moisture > 30%. Soil is adequately damp and healthy.';
    }
    if (plantSvg) {
      plantSvg.innerHTML = getPlantSvg('healthy');
    }

    if (triggerAudio) {
      const now = Date.now();
      if (now - lastToneTime > 2500) {
        lastToneTime = now;
        playArduinoTone(1500, 350);
      }
    }

    logSerial(`[A0: ${rawAnalog}] moistureRatio: ${(moistureRatio).toFixed(2)} &gt; 0.30 -> GREEN LED ON | TONE: 1500Hz (I'm full!)`);
  }
}

// Dynamic SVG Plant Generator based on moisture state
function getPlantSvg(state) {
  if (state === 'dry') {
    return `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- Dry cracked soil pot -->
        <path d="M25 80 L75 80 L70 95 L30 95 Z" fill="#78350f" stroke="#b45309" stroke-width="1.5"/>
        <line x1="38" y1="84" x2="44" y2="92" stroke="#451a03" stroke-width="1.5"/>
        <line x1="58" y1="82" x2="63" y2="90" stroke="#451a03" stroke-width="1.5"/>
        <!-- Dry wilted stem -->
        <path d="M50 80 Q52 65 65 52 Q72 45 78 48" fill="none" stroke="#a16207" stroke-width="3" stroke-linecap="round"/>
        <!-- Drooping curled wilted leaves -->
        <path d="M65 52 C72 58 75 68 70 72 C65 68 62 58 65 52 Z" fill="#ca8a04" opacity="0.85"/>
        <path d="M78 48 C85 52 86 60 82 64 C78 60 76 54 78 48 Z" fill="#a16207" opacity="0.85"/>
        <!-- Thirst alert drops (dry smoke/warning) -->
        <circle cx="50" cy="30" r="3" fill="#ef4444"/>
        <circle cx="50" cy="22" r="2" fill="#ef4444" opacity="0.6"/>
      </svg>
    `;
  } else if (state === 'moderate') {
    return `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- Normal soil pot -->
        <path d="M25 80 L75 80 L70 95 L30 95 Z" fill="#92400e" stroke="#d97706" stroke-width="1.5"/>
        <!-- Semi-erect stem -->
        <path d="M50 80 Q48 55 52 38" fill="none" stroke="#65a30d" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Leaves -->
        <path d="M50 60 C38 52 35 42 42 38 C48 42 50 52 50 60 Z" fill="#84cc16"/>
        <path d="M51 48 C62 40 66 32 60 28 C54 32 52 40 51 48 Z" fill="#65a30d"/>
      </svg>
    `;
  } else {
    return `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <!-- Hydrated dark rich soil pot -->
        <path d="M25 80 L75 80 L70 95 L30 95 Z" fill="#1e3a5f" stroke="#0284c7" stroke-width="2"/>
        <ellipse cx="50" cy="80" rx="25" ry="4" fill="#0f172a"/>
        <!-- Vibrant flourishing stem -->
        <path d="M50 80 Q50 50 50 30" fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round"/>
        <!-- Lush glowing leaves -->
        <path d="M50 58 C32 48 28 32 38 25 C46 32 48 48 50 58 Z" fill="#10b981" filter="drop-shadow(0 0 4px #10b981)"/>
        <path d="M50 48 C68 38 72 22 62 16 C54 22 52 38 50 48 Z" fill="#34d399" filter="drop-shadow(0 0 4px #34d399)"/>
        <!-- Top budding leaf -->
        <path d="M50 30 C45 20 50 10 50 8 C50 10 55 20 50 30 Z" fill="#4ade80"/>
        <!-- Water droplets -->
        <circle cx="34" cy="20" r="2.5" fill="#38bdf8"/>
        <circle cx="65" cy="14" r="2.5" fill="#38bdf8"/>
      </svg>
    `;
  }
}

// Preset button handlers
function setupPresets() {
  const buttons = document.querySelectorAll('.btn-preset');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = parseInt(btn.getAttribute('data-value'), 10);
      updateHardwareState(val, true);
    });
  });
}

// Reset / Reboot Arduino board sequence
function rebootArduino() {
  initAudio();
  logSerial('========================================');
  logSerial('RESET TRIGGERED: Arduino Uno R3 ATmega328P');
  logSerial('Executing setup(): pinMode(D1, OUTPUT), pinMode(D3, OUTPUT), pinMode(D5, OUTPUT)');
  logSerial('Calibrating A0: analogRead(A0) baseline maximumMoistureLevel = 1023');
  logSerial('Playing startup chirp: 5000Hz (500ms) -> 200ms delay -> 6000Hz (500ms)...');

  playStartupSound();

  setTimeout(() => {
    logSerial('Entering void loop() continuous sampling mode.');
    updateHardwareState(currentMoisturePercent, false);
  }, 1400);
}

// Setup Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('moistureSlider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      // Remove preset button highlights if manual slider dragged
      document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
      updateHardwareState(parseInt(e.target.value, 10), true);
    });
  }

  setupPresets();

  // Reboot button
  const rebootBtn = document.getElementById('btnRebootArduino');
  if (rebootBtn) {
    rebootBtn.addEventListener('click', rebootArduino);
  }

  // Clear serial button
  const clearBtn = document.getElementById('btnClearSerial');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const serialBody = document.getElementById('serialBody');
      if (serialBody) serialBody.innerHTML = '';
      logSerial('Serial Monitor buffer cleared (9600 Baud).');
    });
  }

  // Audio Mute toggle button
  const audioToggleBtn = document.getElementById('btnAudioToggle');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      isAudioMuted = !isAudioMuted;
      if (isAudioMuted) {
        audioToggleBtn.innerHTML = '<i class="bi bi-volume-mute-fill"></i> Sound: Muted';
        audioToggleBtn.classList.add('btn-outline-secondary');
        audioToggleBtn.classList.remove('btn-outline-info');
      } else {
        audioToggleBtn.innerHTML = '<i class="bi bi-volume-up-fill"></i> Sound: Enabled';
        audioToggleBtn.classList.add('btn-outline-info');
        audioToggleBtn.classList.remove('btn-outline-secondary');
        playArduinoTone(1500, 200);
      }
    });
  }

  // Copy C++ code button
  const copyBtn = document.getElementById('btnCopyCode');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeText = document.getElementById('arduinoCodeBlock').innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        copyBtn.innerHTML = '<i class="bi bi-check2"></i> Copied to Clipboard!';
        copyBtn.classList.add('btn-success');
        setTimeout(() => {
          copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Copy C++ Sketch';
          copyBtn.classList.remove('btn-success');
        }, 2500);
      });
    });
  }

  // Image Lightbox handler
  const imageCards = document.querySelectorAll('.media-thumbnail-card');
  const modalImg = document.getElementById('lightboxImage');
  const modalTitle = document.getElementById('lightboxTitle');

  imageCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || 'Hardware Schematic';
      if (modalImg && img) {
        modalImg.src = img.src;
      }
      if (modalTitle) {
        modalTitle.textContent = title;
      }
    });
  });

  // Initial State
  updateHardwareState(65, false);
  logSerial('System Initialized: Arduino Uno R3 Ready at 9600 Baud.');
  logSerial('Analog pin A0 connected to Soil Moisture Sensor.');
  logSerial('Digital pin D1 -> Green LED | D3 -> Red LED | D5 -> Speaker (PWM).');
});
