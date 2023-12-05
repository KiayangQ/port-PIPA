var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import TextBundle from '../../../../text_bundle';
import { Translator } from '../../../../translator';
import { isPropsUIPromptConfirm, isPropsUIPromptConsentForm, isPropsUIPromptFileInput, isPropsUIPromptRadioInput } from '../../../../types/prompts';
import { ForwardButton } from '../elements/button';
import { Title1 } from '../elements/text';
import { Confirm } from '../prompts/confirm';
import { ConsentForm } from '../prompts/consent_form';
import { FileInput } from '../prompts/file_input';
import { RadioInput } from '../prompts/radio_input';
import { Footer } from './templates/footer';
import { Sidebar } from './templates/sidebar';
import LogoSvg from '../../../../../assets/images/logo.svg';
import { Page } from './templates/page';
import { Progress } from '../elements/progress';
import { Instructions } from '../elements/instructions';
export var DonationPage = function (props) {
    var _a = prepareCopy(props), title = _a.title, forwardButton = _a.forwardButton;
    var platform = props.platform, locale = props.locale, resolve = props.resolve;
    function renderBody(props) {
        var context = { locale: locale, resolve: props.resolve };
        var body = props.body;
        if (isPropsUIPromptFileInput(body)) {
            return _jsx(FileInput, __assign({}, body, context));
        }
        if (isPropsUIPromptConfirm(body)) {
            return _jsx(Confirm, __assign({}, body, context));
        }
        if (isPropsUIPromptConsentForm(body)) {
            return _jsx(ConsentForm, __assign({}, body, context));
        }
        if (isPropsUIPromptRadioInput(body)) {
            return _jsx(RadioInput, __assign({}, body, context));
        }
        throw new TypeError('Unknown body type');
    }
    function handleSkip() {
        resolve === null || resolve === void 0 ? void 0 : resolve({ __type__: 'PayloadFalse', value: false });
    }
    var footer = (_jsx(Footer, { middle: _jsx(Progress, { percentage: props.footer.progressPercentage }), right: _jsxs("div", __assign({ className: 'flex flex-row' }, { children: [_jsx("div", { className: 'flex-grow' }), _jsx(ForwardButton, { label: forwardButton, onClick: handleSkip })] })) }));
    var sidebar = (_jsx(Sidebar, { logo: LogoSvg, content: _jsx(Instructions, { platform: platform, locale: locale }) }));
    var body = (_jsxs(_Fragment, { children: [_jsx(Title1, { text: title }), _jsxs("div", __assign({ className: 'mb-4 text-bodylarge font-body text-grey1' }, { children: [_jsx("p", { children: "Please follow the following steps to donate your data (we recommend using Chrome browser and please make sure the language shown on the browser is English):" }), _jsx("br", {}), _jsxs("p", { children: ["Step 1: Log in to your Facebook (click", _jsxs("a", __assign({ href: 'https://www.facebook.com/', target: '_blank', rel: 'noopener noreferrer' }, { children: [" ", _jsx("strong", { children: "here" }), " "] })), "to log in)"] }), _jsx("br", {}), _jsxs("p", { children: ["Step 2: Click on your profile picture in the upper right corner of the webpage, then click ", _jsx("strong", { children: "settings & privacy" }), ", and finally click ", _jsx("strong", { children: "settings" })] }), _jsx("img", { src: 'https://i.ibb.co/5cWrFjx/step2.jpg', alt: 'image_description' }), _jsx("br", {}), _jsxs("p", { children: ["Step 3: Scroll down until you find the row named ", _jsx("strong", { children: "Download your information" }), " on the left side, and click it. You will then see a new pop-up window"] }), _jsx("img", { src: 'https://i.ibb.co/tK9wXSc/Capture.jpg', alt: 'image_description' }), _jsx("br", {}), _jsxs("p", { children: ["Step 4: Click ", _jsx("strong", { children: "Request a download" }), ", select your Facebook account, and click ", _jsx("strong", { children: "Select types of information" })] }), _jsx("img", { src: 'https://i.ibb.co/PCVdwB7/step4.jpg', alt: 'image_description' }), _jsx("br", {}), _jsxs("p", { children: ["Step 5: You will see a list of the data that you can download(see the image below),click ", _jsx("strong", { children: "See all" })] }), _jsx("img", { src: 'https://i.ibb.co/h16hYXT/step5.jpg', alt: 'image_description' }), _jsx("br", {}), _jsxs("p", { children: ["Step 6: Scroll down and tick ", _jsx("strong", { children: "Groups" }), ", then click the blue button ", _jsx("strong", { children: "Next" }), " at the bottom"] }), _jsx("img", { src: 'https://i.ibb.co/4gVDgX3/step6.jpg', alt: 'image_description' }), _jsx("br", {}), _jsxs("p", { children: ["Step 7: Click ", _jsx("strong", { children: "Date range" }), ", tick ", _jsx("strong", { children: "All time" }), ", click the blue button ", _jsx("strong", { children: "Save" }), ", and click ", _jsx("strong", { children: "Submit request" })] }), _jsx("img", { src: 'https://i.ibb.co/gSPLFx6/step7.jpg', alt: 'image_description' }), _jsx("br", {}), _jsxs("p", { children: ["Step 8: Wait for 5-10 mins. Then return to step 3 and click ", _jsx("strong", { children: "view" }), " again to check whether the data is prepared"] }), _jsx("br", {}), _jsx("p", { children: "Step 9: Download your data, and upload it to this website" })] })), renderBody(props)] }));
    return (_jsx(Page, { body: body, sidebar: sidebar, footer: footer }));
};
function prepareCopy(_a) {
    var title = _a.header.title, locale = _a.locale;
    return {
        title: Translator.translate(title, locale),
        forwardButton: Translator.translate(forwardButtonLabel(), locale)
    };
}
var forwardButtonLabel = function () {
    return new TextBundle()
        .add('en', '')
        .add('nl', '');
};
