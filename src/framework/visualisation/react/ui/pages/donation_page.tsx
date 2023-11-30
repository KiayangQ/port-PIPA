import React from 'react'
import { Weak } from '../../../../helpers'
import TextBundle from '../../../../text_bundle'
import { Translator } from '../../../../translator'
import { Translatable } from '../../../../types/elements'
import { PropsUIPageDonation } from '../../../../types/pages'
import { isPropsUIPromptConfirm, isPropsUIPromptConsentForm, isPropsUIPromptFileInput, isPropsUIPromptRadioInput } from '../../../../types/prompts'
import { ReactFactoryContext } from '../../factory'
import { ForwardButton } from '../elements/button'
import { Title1 } from '../elements/text'
import { Confirm } from '../prompts/confirm'
import { ConsentForm } from '../prompts/consent_form'
import { FileInput } from '../prompts/file_input'
import { RadioInput } from '../prompts/radio_input'
import { Footer } from './templates/footer'
import { Sidebar } from './templates/sidebar'
import LogoSvg from '../../../../../assets/images/logo.svg'
import { Page } from './templates/page'
import { Progress } from '../elements/progress'
import { Instructions } from '../elements/instructions'

type Props = Weak<PropsUIPageDonation> & ReactFactoryContext

export const DonationPage = (props: Props): JSX.Element => {
  const { title, forwardButton } = prepareCopy(props)
  const { platform, locale, resolve } = props

  function renderBody (props: Props): JSX.Element {
    const context = { locale: locale, resolve: props.resolve }
    const body = props.body
    if (isPropsUIPromptFileInput(body)) {
      return <FileInput {...body} {...context} />
    }
    if (isPropsUIPromptConfirm(body)) {
      return <Confirm {...body} {...context} />
    }
    if (isPropsUIPromptConsentForm(body)) {
      return <ConsentForm {...body} {...context} />
    }
    if (isPropsUIPromptRadioInput(body)) {
      return <RadioInput {...body} {...context} />
    }
    throw new TypeError('Unknown body type')
  }

  function handleSkip (): void {
    resolve?.({ __type__: 'PayloadFalse', value: false })
  }

  const footer: JSX.Element = (
    <Footer
      middle={<Progress percentage={props.footer.progressPercentage} />}
      right={
        <div className='flex flex-row'>
          <div className='flex-grow' />
          <ForwardButton label={forwardButton} onClick={handleSkip} />
        </div>
      }
    />
  )

  const sidebar: JSX.Element = (
    <Sidebar
      logo={LogoSvg}
      content={
        <Instructions platform={platform} locale={locale} />
      }
    />
  )

  const body: JSX.Element = (
    <>
      <Title1 text={title} />
      <div className='mb-4 text-bodylarge font-body text-grey1'>
        <p>Please follow the following steps to donate your data (we recommend using Chrome browser and please make sure the language shown on the browser is English):</p>
        <br />
        <p>Step 1: Log in to your Facebook (click<a href='https://www.facebook.com/' target='_blank' rel='noopener noreferrer'> <strong>here</strong> </a>to log in)</p>
        <br />
        <p>Step 2: Click on your profile picture in the upper right corner of the webpage, then click <strong>settings & privacy</strong>, and finally click <strong>settings</strong></p>
        <img src='https://i.ibb.co/5cWrFjx/step2.jpg' alt='image_description' />
        <br />
        <p>Step 3: Scroll down until you find the row named <strong>Download your information</strong> on the left side, and click it. You will then see a new pop-up window</p>
        <img src='https://i.ibb.co/tK9wXSc/Capture.jpg' alt='image_description' />
        <br />
        <p>Step 4: Click <strong>Request a download</strong>, select your Facebook account, and click <strong>Select types of information</strong></p>
        <img src='https://i.ibb.co/PCVdwB7/step4.jpg' alt='image_description' />
        <br />
        <p>Step 5: You will see a list of the data that you can download(see the image below),click <strong>See all</strong></p>
        <img src='https://i.ibb.co/h16hYXT/step5.jpg' alt='image_description' />
        <br />
        <p>Step 6: Scroll down and tick <strong>Groups</strong>, then click the blue button <strong>Next</strong> at the bottom</p>
        <img src='https://i.ibb.co/4gVDgX3/step6.jpg' alt='image_description' />
        <br />
        <p>Step 7: Click <strong>Date range</strong>, tick <strong>All time</strong>, click the blue button <strong>Save</strong>, and click <strong>Submit request</strong></p>
        <img src='https://i.ibb.co/gSPLFx6/step7.jpg' alt='image_description' />
        <br />
        <p>Step 8: Wait for 5-10 mins. Then return to step 3 and click <strong>view</strong> again to check whether the data is prepared</p>
        <br />
        <p>Step 9: Download your data, and upload it to this website</p>
      </div>
      {renderBody(props)}
    </>
  )

  return (
    <Page
      body={body}
      sidebar={sidebar}
      footer={footer}
    />
  )
}

interface Copy {
  title: string
  forwardButton: string
}

function prepareCopy ({ header: { title }, locale }: Props): Copy {
  return {
    title: Translator.translate(title, locale),
    forwardButton: Translator.translate(forwardButtonLabel(), locale)
  }
}

const forwardButtonLabel = (): Translatable => {
  return new TextBundle()
    .add('en', '')
    .add('nl', '')
}
