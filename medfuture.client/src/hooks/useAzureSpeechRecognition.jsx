import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { useState, useEffect, useRef } from 'react';

const useSpeechRecognition = (language = 'en-US') => {
    const [transcript, setTranscript] = useState('');
    const [totalTranscript, setTotalTranscript] = useState('');
    const [listening, setListening] = useState(false);
    const [error, setError] = useState(null);
    const [microphoneAllowed, setMicrophoneAllowed] = useState(false);
    const [browserSupported, setBrowserSupported] = useState(false);
    const speechRecognizer = useRef(null);
    const recognitionInProgress = useRef(false); // To track if recognition is in progress
    const partialTranscription = useRef(''); // To accumulate partial transcriptions

    useEffect(() => {
        // Check browser support for speech recognition
        const supported = !!SpeechSDK;
        setBrowserSupported(supported);

        // Check microphone permission
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => setMicrophoneAllowed(true))
            .catch(() => setMicrophoneAllowed(false));

        // Initialize speech recognizer when supported and microphone allowed
        if (supported && microphoneAllowed) {

            const speechConfig = SpeechSDK.SpeechConfig.fromSubscription('3619b7e997c346e1b82ed74af2839588', 'eastus');

            speechConfig.speechRecognitionLanguage = language;

            // Create the speech translation config.
            //const speechTranslationConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
            //     '3619b7e997c346e1b82ed74af2839588',
            //        'eastus'
            //);
            //speechTranslationConfig.speechRecognitionLanguage = 'en-US'; // Recognition language
            //speechTranslationConfig.addTargetLanguage('si-LK'); // Translation language

            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            speechRecognizer.current = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
            //speechRecognizer.current = new SpeechSDK.TranslationRecognizer(speechTranslationConfig, audioConfig);

            // Event handlers
            speechRecognizer.current.recognizing = (_, event) => {
                partialTranscription.current = event.result.text;
                console.log(event.result)
            };

            speechRecognizer.current.recognized = (_, event) => {
                partialTranscription.current += ` ${event.result.text}`;
                setTranscript(partialTranscription.current); // Update transcript with accumulated text

                if (event.result.text) {
                    //const translation = event.result.translations.get('si-LK');
                    
                    setTotalTranscript((prev) => prev + event.result.text)
                }
            };

            speechRecognizer.current.canceled = (_, event) => {
                if (!recognitionInProgress.current) return; // Avoid error if recognition is stopped intentionally
                setError(`Speech recognition canceled. Reason: ${event.reason}`);
                setListening(false);
            };

            speechRecognizer.current.sessionStopped = () => {
                recognitionInProgress.current = false;
                setListening(false);
            };
        }

        return () => {
            // Cleanup
            if (speechRecognizer.current) {
                speechRecognizer.current.stopContinuousRecognitionAsync();
                speechRecognizer.current.close();
            }
        };
    }, [microphoneAllowed, language]);

    const startListening = async () => {
        try {
            if (speechRecognizer.current) {
                await speechRecognizer.current.startContinuousRecognitionAsync();
                setListening(true);
                recognitionInProgress.current = true;
                setError(null);
            } else {
                setError('Speech recognition not available');
            }
        } catch (err) {
            setError(`Error starting speech recognition: ${err}`);
        }
    };

    const stopListening = async () => {
        try {
            if (speechRecognizer.current) {
                await speechRecognizer.current.stopContinuousRecognitionAsync();
                recognitionInProgress.current = false;
                setListening(false);
            }
        } catch (err) {
            setError(`Error stopping speech recognition: ${err}`);
        }
    };

    const resetTranscript = () => {
        setTranscript('');
        partialTranscription.current = '';
        setTotalTranscript('');
    };

    return {
        transcript,
        listening,
        error,
        microphoneAllowed,
        browserSupported,
        startListening,
        stopListening,
        resetTranscript,
        totalTranscript,
        setTotalTranscript
    };
};

export default useSpeechRecognition;
