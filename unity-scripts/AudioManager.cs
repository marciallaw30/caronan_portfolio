using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

namespace MythicGambit.Audio
{
    public enum MatchTensionState
    {
        Contemplative,    // Early game / opening strategy
        Escalating,       // Mid game / frequent piece trades & threats
        Climax,           // Late game / Check, high value pieces cornered, Queen ultimate ready
        Victory,          // Player wins match
        Defeat            // Player loses match
    }

    /// <summary>
    /// Lead Audio Architecture for Mythic Gambit (BSIT Capstone 2026).
    /// Manages 15 bespoke kingdom soundscapes, 3-tier dynamic tension music cross-fading,
    /// 3D spatial board acoustics, tactile piece movement, and cinematic Manifestation execution audio.
    /// </summary>
    public class AudioManager : MonoBehaviour
    {
        public static AudioManager Instance { get; private set; }

        [Header("Audio Mixer Routing")]
        [SerializeField] private AudioMixer masterMixer;
        [SerializeField] private AudioMixerGroup masterGroup;
        [SerializeField] private AudioMixerGroup musicGroup;
        [SerializeField] private AudioMixerGroup sfxGroup;
        [SerializeField] private AudioMixerGroup ambienceGroup;
        [SerializeField] private AudioMixerGroup manifestationGroup;

        [Header("Audio Sources")]
        [SerializeField] private AudioSource musicSourceA;
        [SerializeField] private AudioSource musicSourceB;
        [SerializeField] private AudioSource ambienceSource;
        [SerializeField] private AudioSource uiSource;
        [SerializeField] private AudioSource boardSpatialSource;

        [Header("Dynamic Music Tracks")]
        [SerializeField] private AudioClip contemplativeTrack;
        [SerializeField] private AudioClip escalatingTrack;
        [SerializeField] private AudioClip climaxTrack;
        [SerializeField] private AudioClip victoryFanfare;
        [SerializeField] private AudioClip defeatTheme;

        [Header("Core Tactical SFX Clips")]
        [SerializeField] private AudioClip pieceSelectClip;
        [SerializeField] private AudioClip stoneMoveClip;
        [SerializeField] private AudioClip heavyClashCaptureClip;
        [SerializeField] private AudioClip checkAlertClip;
        [SerializeField] private AudioClip checkmateImpactClip;
        [SerializeField] private AudioClip terrainConversionClip;

        [Header("15 Kingdom Audio Profiles Repository")]
        [SerializeField] private List<FactionAudioProfile> factionProfiles = new List<FactionAudioProfile>();
        private Dictionary<string, FactionAudioProfile> profileLookup = new Dictionary<string, FactionAudioProfile>(StringComparer.OrdinalIgnoreCase);

        // State variables
        private MatchTensionState currentTension = MatchTensionState.Contemplative;
        private bool isSourceAActive = true;
        private Coroutine musicCrossfadeCoroutine;
        private Coroutine ambienceFadeCoroutine;

        private float masterVolume = 1.0f;
        private float musicVolume = 0.8f;
        private float sfxVolume = 1.0f;
        private float ambienceVolume = 0.7f;
        private bool isMuted = false;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);

            InitializeLookup();
            LoadAudioPreferences();
        }

        private void Start()
        {
            // Begin match in contemplative tactical state
            PlayDynamicMusic(contemplativeTrack, 1.5f);
        }

        private void InitializeLookup()
        {
            profileLookup.Clear();
            foreach (var profile in factionProfiles)
            {
                if (profile != null && !string.IsNullOrEmpty(profile.kingdomId))
                {
                    profileLookup[profile.kingdomId] = profile;
                }
            }
        }

        #region Dynamic Tension Music Cross-Fading
        /// <summary>
        /// Transitions the dynamic score based on the current match state.
        /// Scales organically from contemplative planning to roaring apocalyptic climax.
        /// </summary>
        public void SetMatchTension(MatchTensionState newTension)
        {
            if (currentTension == newTension) return;
            currentTension = newTension;

            AudioClip targetClip = newTension switch
            {
                MatchTensionState.Contemplative => contemplativeTrack,
                MatchTensionState.Escalating => escalatingTrack,
                MatchTensionState.Climax => climaxTrack,
                MatchTensionState.Victory => victoryFanfare,
                MatchTensionState.Defeat => defeatTheme,
                _ => contemplativeTrack
            };

            if (targetClip != null)
            {
                PlayDynamicMusic(targetClip, 2.0f);
            }
        }

        private void PlayDynamicMusic(AudioClip newClip, float fadeDuration)
        {
            if (musicCrossfadeCoroutine != null)
            {
                StopCoroutine(musicCrossfadeCoroutine);
            }
            musicCrossfadeCoroutine = StartCoroutine(CrossfadeMusicRoutine(newClip, fadeDuration));
        }

        private IEnumerator CrossfadeMusicRoutine(AudioClip nextClip, float duration)
        {
            AudioSource activeSource = isSourceAActive ? musicSourceA : musicSourceB;
            AudioSource incomingSource = isSourceAActive ? musicSourceB : musicSourceA;

            incomingSource.clip = nextClip;
            incomingSource.volume = 0f;
            incomingSource.Play();

            float elapsed = 0f;
            float startVol = activeSource.volume;
            float targetVol = isMuted ? 0f : musicVolume;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = Mathf.Clamp01(elapsed / duration);

                activeSource.volume = Mathf.Lerp(startVol, 0f, t);
                incomingSource.volume = Mathf.Lerp(0f, targetVol, t);
                yield return null;
            }

            activeSource.Stop();
            activeSource.volume = 0f;
            incomingSource.volume = targetVol;
            isSourceAActive = !isSourceAActive;
        }
        #endregion

        #region 15 Faction Bespoke Soundscapes
        /// <summary>
        /// Transitions the atmospheric ambient layer to reflect the active kingdom's soundscape.
        /// E.g. Volcanic rumbles for Obsidian Roost, Celtic wind chimes for Verdant Court, etc.
        /// </summary>
        public void SwitchKingdomAmbience(string kingdomId)
        {
            if (!profileLookup.TryGetValue(kingdomId, out FactionAudioProfile profile) || profile == null)
            {
                Debug.LogWarning($"[AudioManager] Kingdom audio profile for '{kingdomId}' not found!");
                return;
            }

            if (ambienceFadeCoroutine != null)
            {
                StopCoroutine(ambienceFadeCoroutine);
            }
            ambienceFadeCoroutine = StartCoroutine(FadeAmbienceRoutine(profile.ambientSoundscapeLoop, 2.5f));
        }

        private IEnumerator FadeAmbienceRoutine(AudioClip newAmbience, float fadeDuration)
        {
            if (ambienceSource.isPlaying)
            {
                float initialVol = ambienceSource.volume;
                float timer = 0f;
                while (timer < fadeDuration * 0.5f)
                {
                    timer += Time.deltaTime;
                    ambienceSource.volume = Mathf.Lerp(initialVol, 0f, timer / (fadeDuration * 0.5f));
                    yield return null;
                }
                ambienceSource.Stop();
            }

            if (newAmbience != null)
            {
                ambienceSource.clip = newAmbience;
                ambienceSource.volume = 0f;
                ambienceSource.Play();

                float timer = 0f;
                float targetVol = isMuted ? 0f : ambienceVolume;
                while (timer < fadeDuration * 0.5f)
                {
                    timer += Time.deltaTime;
                    ambienceSource.volume = Mathf.Lerp(0f, targetVol, timer / (fadeDuration * 0.5f));
                    yield return null;
                }
                ambienceSource.volume = targetVol;
            }
        }
        #endregion

        #region Tactical SFX & Manifestation Combat Audio
        public void PlayPieceSelect(Vector3? worldPos = null)
        {
            PlaySfx(pieceSelectClip, worldPos, 0.75f, UnityEngine.Random.Range(0.96f, 1.04f));
        }

        public void PlayPieceMove(Vector3 worldPos)
        {
            PlaySfx(stoneMoveClip, worldPos, 0.9f, UnityEngine.Random.Range(0.92f, 1.08f));
        }

        public void PlayCaptureClash(Vector3 worldPos)
        {
            PlaySfx(heavyClashCaptureClip, worldPos, 1.0f, UnityEngine.Random.Range(0.95f, 1.05f));
        }

        public void PlayCheckAlert()
        {
            uiSource.pitch = 1.0f;
            uiSource.PlayOneShot(checkAlertClip, isMuted ? 0f : sfxVolume * 1.1f);
        }

        public void PlayCheckmateImpact()
        {
            uiSource.pitch = 1.0f;
            uiSource.PlayOneShot(checkmateImpactClip, isMuted ? 0f : sfxVolume * 1.25f);
            SetMatchTension(MatchTensionState.Climax);
        }

        public void PlayTerrainMutated(Vector3 worldPos)
        {
            PlaySfx(terrainConversionClip, worldPos, 0.85f, UnityEngine.Random.Range(0.95f, 1.05f));
        }

        /// <summary>
        /// Initiates the signature 'Manifestation' cinematic audio suite.
        /// Combines the attacker's elemental roar, orchestral riser, and vanquished unit shatter.
        /// </summary>
        public void TriggerManifestationAudio(string attackerKingdomId, Vector3 executionWorldPos)
        {
            if (profileLookup.TryGetValue(attackerKingdomId, out FactionAudioProfile profile) && profile != null)
            {
                if (profile.manifestationRiserClip != null)
                {
                    PlaySfx(profile.manifestationRiserClip, executionWorldPos, 1.15f, 1.0f);
                }
                if (profile.elementalRoarClip != null)
                {
                    StartCoroutine(PlayDelayedAudio(profile.elementalRoarClip, executionWorldPos, 0.25f, 1.2f));
                }
            }
            else
            {
                PlaySfx(heavyClashCaptureClip, executionWorldPos, 1.2f, 0.85f);
            }
        }

        /// <summary>
        /// Plays the apocalyptic Queen's Ultimate audio sequence for the given kingdom.
        /// </summary>
        public void TriggerQueenUltimateAudio(string kingdomId)
        {
            if (profileLookup.TryGetValue(kingdomId, out FactionAudioProfile profile) && profile != null)
            {
                if (profile.queenUltimateAudioClip != null)
                {
                    uiSource.PlayOneShot(profile.queenUltimateAudioClip, isMuted ? 0f : 1.3f);
                }
            }
            SetMatchTension(MatchTensionState.Climax);
        }

        private IEnumerator PlayDelayedAudio(AudioClip clip, Vector3 pos, float delay, float volumeMultiplier)
        {
            yield return new WaitForSeconds(delay);
            PlaySfx(clip, pos, volumeMultiplier, 1.0f);
        }

        private void PlaySfx(AudioClip clip, Vector3? worldPos, float volumeMod = 1.0f, float pitch = 1.0f)
        {
            if (clip == null || isMuted) return;

            if (worldPos.HasValue && boardSpatialSource != null)
            {
                boardSpatialSource.transform.position = worldPos.Value;
                boardSpatialSource.pitch = pitch;
                boardSpatialSource.PlayOneShot(clip, sfxVolume * volumeMod);
            }
            else if (uiSource != null)
            {
                uiSource.pitch = pitch;
                uiSource.PlayOneShot(clip, sfxVolume * volumeMod);
            }
        }
        #endregion

        #region Mixer & Volume Management
        public void SetMasterVolume(float volume)
        {
            masterVolume = Mathf.Clamp01(volume);
            ApplyMixerVolume("MasterVolume", masterVolume);
            PlayerPrefs.SetFloat("MasterVolume", masterVolume);
        }

        public void SetMusicVolume(float volume)
        {
            musicVolume = Mathf.Clamp01(volume);
            ApplyMixerVolume("MusicVolume", musicVolume);
            PlayerPrefs.SetFloat("MusicVolume", musicVolume);
        }

        public void SetSfxVolume(float volume)
        {
            sfxVolume = Mathf.Clamp01(volume);
            ApplyMixerVolume("SfxVolume", sfxVolume);
            PlayerPrefs.SetFloat("SfxVolume", sfxVolume);
        }

        public void SetMute(bool muted)
        {
            isMuted = muted;
            if (masterMixer != null)
            {
                masterMixer.SetFloat("MasterVolume", isMuted ? -80f : ConvertToDecibels(masterVolume));
            }
            PlayerPrefs.SetInt("IsMuted", isMuted ? 1 : 0);
        }

        public void ToggleMute()
        {
            SetMute(!isMuted);
        }

        private void ApplyMixerVolume(string exposedParam, float normalizedVal)
        {
            if (masterMixer != null)
            {
                float dB = normalizedVal > 0.0001f ? Mathf.Log10(normalizedVal) * 20f : -80f;
                masterMixer.SetFloat(exposedParam, dB);
            }
        }

        private float ConvertToDecibels(float normalizedVal)
        {
            return normalizedVal > 0.0001f ? Mathf.Log10(normalizedVal) * 20f : -80f;
        }

        private void LoadAudioPreferences()
        {
            masterVolume = PlayerPrefs.GetFloat("MasterVolume", 1.0f);
            musicVolume = PlayerPrefs.GetFloat("MusicVolume", 0.8f);
            sfxVolume = PlayerPrefs.GetFloat("SfxVolume", 1.0f);
            isMuted = PlayerPrefs.GetInt("IsMuted", 0) == 1;

            SetMasterVolume(masterVolume);
            SetMusicVolume(musicVolume);
            SetSfxVolume(sfxVolume);
            SetMute(isMuted);
        }
        #endregion
    }
}
