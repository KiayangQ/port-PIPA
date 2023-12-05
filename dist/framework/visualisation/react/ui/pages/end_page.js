import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Footer } from './templates/footer';
import { Sidebar } from './templates/sidebar';
import LogoSvg from '../../../../../assets/images/logo.svg';
import { Page } from './templates/page';
import TextBundle from '../../../../text_bundle';
import { Translator } from '../../../../translator';
import { BodyLarge, Title1 } from '../elements/text';
export var EndPage = function (props) {
    var _a = prepareCopy(props), title = _a.title, text = _a.text, text1 = _a.text1;
    var footer = _jsx(Footer, {});
    var sidebar = _jsx(Sidebar, { logo: LogoSvg });
    var body = (_jsxs(_Fragment, { children: [_jsx(Title1, { text: title }), _jsx(BodyLarge, { text: text }), _jsx(BodyLarge, { text: text1 })] }));
    return (_jsx(Page, { body: body, sidebar: sidebar, footer: footer }));
};
function prepareCopy(_a) {
    var locale = _a.locale;
    return {
        title: Translator.translate(title, locale),
        text: Translator.translate(text, locale),
        text1: Translator.translate(text1, locale)
    };
}
function generateRandomString(length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
function getCurrentTimeAsString() {
    var now = new Date();
    var year = now.getFullYear().toString();
    var month = (now.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based, so add 1.
    var day = now.getDate().toString().padStart(2, '0');
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    return "".concat(year).concat(month).concat(day).concat(hours).concat(minutes).concat(seconds);
}
var letters = generateRandomString(5);
var date = getCurrentTimeAsString();
// Combine the 'abcde' prefix with the random numbers and letters
var randomStringen = "Your return code is don0923".concat(letters).concat(date);
var randomStringnl = "Uw retourcode is don0923".concat(letters).concat(date, " ");
var title = new TextBundle()
    .add('en', 'Thank you')
    .add('nl', 'Bedankt');
var text = new TextBundle()
    .add('en', randomStringen)
    .add('nl', randomStringnl);
var text1 = new TextBundle()
    .add('en', '\nPlease copy and paste your return code into the survey page. Once you have done this, the data donation process is complete and you can close this page.')
    .add('nl', '\nGelieve uw terugkeercode te kopiëren en te plakken op de enquêtepagina. Nadat je hiermee klaar bent, is de gegevensdonatie voltooid en kun je deze pagina sluiten.');
