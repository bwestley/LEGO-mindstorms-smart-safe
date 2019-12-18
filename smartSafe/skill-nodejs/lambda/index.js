const Alexa = require('ask-sdk-core');
const Util = require('./util');
const Common = require('./common');

// The namespace of the custom directive to be sent by this skill
const NAMESPACE = 'Custom.Smartsafe.Gadget';

// The name of the custom directive to be sent this skill
const NAME_CONTROL = 'control';

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle: async function(handlerInput) {
        console.log("TEST");
        // Connect to gadget
        const endpointId = await Util.connect(handlerInput);
        if (endpointId === 0) {
            return handlerInput.responseBuilder
                .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
                .getResponse();
        }
        
        return handlerInput.responseBuilder
            .speak("Connection successful. Please issue a command.")
            .reprompt("awaiting command")
            .getResponse();
    }
};

// Construct and send a custom directive to the connected gadget with
// data from the OpenIntent request.
const OpenIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'OpenIntent';
    },
    handle: async function (handlerInput) {
        const request = handlerInput.requestEnvelope;
        const pass = Alexa.getSlotValue(request, 'pass') || "0000";

        // Get data from session attribute
        const attributesManager = handlerInput.attributesManager;
        const endpointId = await Util.connect(handlerInput);
        if (endpointId === 0) {
            return handlerInput.responseBuilder
                .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
                .getResponse();
        }

        // Construct the directive with the payload containing the move parameters
        const directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'open',
                pass: pass
            });

        const speechOutput = `Opening`;

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .addDirective(directive)
            .getResponse();
    }
};

// Construct and send a custom directive to the connected gadget with
// data from the CloseIntent request.
const CloseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CloseIntent';
    },
    handle: async function (handlerInput) {
        const request = handlerInput.requestEnvelope;

        // Get data from session attribute
        const attributesManager = handlerInput.attributesManager;
        const endpointId = await Util.connect(handlerInput);
        if (endpointId === 0) {
            return handlerInput.responseBuilder
                .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
                .getResponse();
        }

        // Construct the directive with the payload containing the move parameters
        const directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'close'
            });

        const speechOutput = `Closing`;

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .addDirective(directive)
            .getResponse();
    }
};

// Construct and send a custom directive to the connected gadget with
// data from the ChangePasswordIntent request.
const ChangePasswordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangePasswordIntent';
    },
    handle: async function (handlerInput) {
        const request = handlerInput.requestEnvelope;
        const oldpass = Alexa.getSlotValue(request, 'oldpass') || "0000";
        const newpass = Alexa.getSlotValue(request, 'newpass') || "0000";

        // Get data from session attribute
        const attributesManager = handlerInput.attributesManager;
        const endpointId = await Util.connect(handlerInput);
        if (endpointId === 0) {
            return handlerInput.responseBuilder
                .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
                .getResponse();
        }

        // Construct the directive with the payload containing the move parameters
        const directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'change_password',
                oldpass: oldpass,
                newpass: newpass
            });

        const speechOutput = `Change password.`;

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .addDirective(directive)
            .getResponse();
    }
};

// Construct and send a custom directive to the connected gadget with
// data from the HistoryIntent request.
const HistoryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HistoryIntent';
    },
    handle: async function (handlerInput) {
        const request = handlerInput.requestEnvelope;
        const count = Alexa.getSlotValue(request, 'count') || "1";

        // Get data from session attribute
        const attributesManager = handlerInput.attributesManager;
        const endpointId = await Util.connect(handlerInput);
        if (endpointId === 0) {
            return handlerInput.responseBuilder
                .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
                .getResponse();
        }

        // Construct the directive with the payload containing the move parameters
        const directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'history',
                count: count
            });

        const speechOutput = `History ${count}.`;

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .addDirective(directive)
            .getResponse();
    }
};

// Construct and send a custom directive to the connected gadget with
// data from the SpeechIntent request.
const SpeechIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SpeechIntent';
    },
    handle: async function (handlerInput) {
        const request = handlerInput.requestEnvelope;
        const text = Alexa.getSlotValue(request, 'text') || "Sample text";

        // Get data from session attribute
        const attributesManager = handlerInput.attributesManager;
        const endpointId = await Util.connect(handlerInput);
        if (endpointId === 0) {
            return handlerInput.responseBuilder
                .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
                .getResponse();
        }

        // Construct the directive with the payload containing the move parameters
        const directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'say',
                text: text
            });

        const speechOutput = ``;

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .addDirective(directive)
            .getResponse();
    }
};

// Construct and send a custom directive to the connected gadget with
// data from the ControlIntent request.
const ControlIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ControlIntent';
    },
    handle: async function (handlerInput) {
        const request = handlerInput.requestEnvelope;
        const verb = Alexa.getSlotValue(request, 'type') || "0";
        const pass = Alexa.getSlotValue(request, 'pass') || "0000";

        // Get data from session attribute
        const attributesManager = handlerInput.attributesManager;
        const endpointId = await Util.connect(handlerInput);
        if (endpointId === 0) {
            return handlerInput.responseBuilder
                .speak(`I couldn't find an EV3 Brick connected to this Echo device. Please check to make sure your EV3 Brick is connected, and try again.`)
                .getResponse();
        }

        // Construct the directive with the payload containing the move parameters
        const directive = Util.build(endpointId, NAMESPACE, NAME_CONTROL,
            {
                type: 'control',
                verb: verb,
                pass: pass
            });

        const speechOutput = ``;

        return handlerInput.responseBuilder
            .speak(speechOutput)
            .addDirective(directive)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        OpenIntentHandler,
        CloseIntentHandler,
        ChangePasswordIntentHandler,
        HistoryIntentHandler,
        SpeechIntentHandler,
        ControlIntentHandler,
        Common.HelpIntentHandler,
        Common.CancelAndStopIntentHandler,
        Common.SessionEndedRequestHandler,
        Common.IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addRequestInterceptors(Common.RequestInterceptor)
    .addErrorHandlers(
        Common.ErrorHandler,
    )
    .lambda();